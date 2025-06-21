#!/usr/bin/env python3
"""
Apple TV persistent connection service
Maintains an open connection and accepts commands via stdin
"""

import asyncio
import json
import sys
import os
import warnings
from typing import Optional, Dict, Any

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

# Redirect stderr to devnull to suppress all protobuf warnings
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')

import pyatv

class AppleTVService:
    def __init__(self):
        self.atv = None
        self.remote = None
        self.device_id = None
        self.loop = None
        self.heartbeat_task = None
        self.last_command_time = 0
    
    async def connect(self, device_id: str) -> bool:
        """Connect to Apple TV and keep connection alive"""
        try:
            # Disconnect if already connected
            if self.atv:
                self.atv.close()
                self.atv = None
                self.remote = None
            
            # Scan for device
            devices = await pyatv.scan(self.loop, timeout=3)
            device = None
            
            for d in devices:
                if str(d.identifier) == device_id:
                    device = d
                    break
            
            if not device:
                return False
            
            # Load and apply credentials
            credentials_file = os.path.expanduser("~/.config/ags/appletv-credentials.json")
            if os.path.exists(credentials_file):
                with open(credentials_file, "r") as f:
                    stored_credentials = json.load(f)
                    if device_id in stored_credentials:
                        for protocol_name, creds in stored_credentials[device_id].items():
                            if protocol_name.lower() == 'companion':
                                device.set_credentials(pyatv.Protocol.Companion, creds)
                            elif protocol_name.lower() == 'airplay':
                                device.set_credentials(pyatv.Protocol.AirPlay, creds)
            
            # Connect
            self.atv = await pyatv.connect(device, self.loop)
            if self.atv:
                self.remote = self.atv.remote_control
                self.device_id = device_id
                
                # Start heartbeat to keep connection alive
                if self.heartbeat_task:
                    self.heartbeat_task.cancel()
                self.heartbeat_task = asyncio.create_task(self.heartbeat())
                
                return True
            
            return False
        except Exception as e:
            print(json.dumps({"error": f"Connection failed: {str(e)}"}))
            return False
    
    async def heartbeat(self):
        """Periodic heartbeat to keep connection alive"""
        while self.atv:
            try:
                await asyncio.sleep(30)  # Check every 30 seconds
                
                # Only send heartbeat if no recent commands
                import time
                if time.time() - self.last_command_time > 25:
                    # Send a lightweight command as heartbeat
                    # We'll use the features API which should be safe
                    if hasattr(self.atv, 'features'):
                        # Just check if features exist, don't access them
                        _ = bool(self.atv.features)
                    print(json.dumps({"debug": "Heartbeat sent"}), file=sys.stderr)
            except Exception as e:
                print(json.dumps({"debug": f"Heartbeat failed: {e}, reconnecting..."}), file=sys.stderr)
                # Try to reconnect
                if self.device_id:
                    await self.connect(self.device_id)
                break
    
    async def handle_command(self, cmd_data: Dict[str, Any]):
        """Handle a command from stdin"""
        command = cmd_data.get("command")
        
        if command == "connect":
            device_id = cmd_data.get("device_id")
            if not device_id:
                print(json.dumps({"error": "No device_id provided"}))
                return
            
            success = await self.connect(device_id)
            print(json.dumps({"connected": success, "device_id": device_id}))
        
        elif command == "disconnect":
            if self.heartbeat_task:
                self.heartbeat_task.cancel()
                self.heartbeat_task = None
            if self.atv:
                self.atv.close()
                self.atv = None
                self.remote = None
            print(json.dumps({"disconnected": True}))
        
        elif command == "status":
            print(json.dumps({
                "connected": self.atv is not None,
                "device_id": self.device_id,
                "has_remote": self.remote is not None
            }))
        
        elif command in ["up", "down", "left", "right", "select", "menu", "home",
                        "play", "pause", "play_pause", "skip_forward", "skip_backward",
                        "volume_up", "volume_down"]:
            # Always check connection health before sending command
            if not self.remote or not self.atv:
                # Try to reconnect
                if self.device_id:
                    print(json.dumps({"debug": "Connection lost, reconnecting..."}), file=sys.stderr)
                    await self.connect(self.device_id)
                
                if not self.remote:
                    print(json.dumps({"error": "Not connected"}))
                    return
            
            try:
                # Skip connection health check - just try the command
                # The error handling below will catch any connection issues
                
                method = getattr(self.remote, command)
                await method()
                
                # Update last command time
                import time
                self.last_command_time = time.time()
                
                print(json.dumps({"success": True, "command": command}))
            except Exception as e:
                # Try one reconnect attempt
                if "Connection lost" in str(e) or "not connected" in str(e).lower():
                    print(json.dumps({"debug": f"Error {e}, attempting reconnect..."}), file=sys.stderr)
                    await self.connect(self.device_id)
                    if self.remote:
                        try:
                            method = getattr(self.remote, command)
                            await method()
                            print(json.dumps({"success": True, "command": command}))
                        except Exception as e2:
                            print(json.dumps({"error": str(e2)}))
                    else:
                        print(json.dumps({"error": "Reconnection failed"}))
                else:
                    print(json.dumps({"error": str(e)}))
        
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
    
    async def run(self):
        """Main service loop - read commands from stdin"""
        self.loop = asyncio.get_running_loop()
        
        # Load default device
        config_file = os.path.expanduser("~/.config/ags/appletv-config.json")
        if os.path.exists(config_file):
            with open(config_file, "r") as f:
                config = json.load(f)
                default_device = config.get("default_device")
                if default_device:
                    await self.connect(default_device)
        
        # Send ready signal
        print(json.dumps({"ready": True, "connected": self.atv is not None}))
        sys.stdout.flush()
        
        # Read commands from stdin
        reader = asyncio.StreamReader()
        protocol = asyncio.StreamReaderProtocol(reader)
        await self.loop.connect_read_pipe(lambda: protocol, sys.stdin)
        
        while True:
            try:
                line = await reader.readline()
                if not line:
                    break
                
                # Parse command
                try:
                    cmd_data = json.loads(line.decode().strip())
                    await self.handle_command(cmd_data)
                    sys.stdout.flush()
                except json.JSONDecodeError:
                    print(json.dumps({"error": "Invalid JSON"}))
                    sys.stdout.flush()
                    
            except Exception as e:
                print(json.dumps({"error": str(e)}))
                sys.stdout.flush()

if __name__ == "__main__":
    service = AppleTVService()
    asyncio.run(service.run())