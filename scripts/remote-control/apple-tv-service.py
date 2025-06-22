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
        self.min_command_interval = 0.1  # Minimum 100ms between commands
    
    async def connect(self, device_id: str) -> bool:
        """Connect to Apple TV and keep connection alive"""
        try:
            # Cancel existing heartbeat if any
            if self.heartbeat_task:
                self.heartbeat_task.cancel()
                self.heartbeat_task = None
            
            # Disconnect if already connected
            if self.atv:
                try:
                    self.atv.close()
                except:
                    pass
                self.atv = None
                self.remote = None
            
            # Quick scan first
            devices = await pyatv.scan(self.loop, identifier=device_id, timeout=2)
            device = None
            
            if devices:
                device = devices[0]
            else:
                # Fallback to full scan
                devices = await pyatv.scan(self.loop, timeout=3)
                for d in devices:
                    if str(d.identifier) == device_id:
                        device = d
                        break
            
            if not device:
                print(json.dumps({"debug": f"Device {device_id} not found in scan"}), file=sys.stderr)
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
        consecutive_failures = 0
        while self.atv:
            try:
                await asyncio.sleep(45)  # Less frequent heartbeat
                
                # Only send heartbeat if no recent commands
                import time
                if time.time() - self.last_command_time > 40:
                    # Try a very simple check first
                    if self.atv and self.remote:
                        # Just verify the connection objects exist
                        consecutive_failures = 0
                        print(json.dumps({"debug": "Connection healthy"}), file=sys.stderr)
                    else:
                        raise Exception("Connection objects missing")
            except Exception as e:
                consecutive_failures += 1
                print(json.dumps({"debug": f"Heartbeat check #{consecutive_failures}: {e}"}), file=sys.stderr)
                
                # Only reconnect after multiple failures
                if consecutive_failures >= 2:
                    print(json.dumps({"debug": "Multiple heartbeat failures, reconnecting..."}), file=sys.stderr)
                    if self.device_id:
                        await self.connect(self.device_id)
                    break
                else:
                    # Wait a bit before next check
                    await asyncio.sleep(5)
    
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
            status = {
                "connected": self.atv is not None,
                "device_id": self.device_id,
                "has_remote": self.remote is not None
            }
            
            # Try to get power state if connected
            if self.atv and hasattr(self.atv, 'power'):
                try:
                    power_state = await self.atv.power.power_state
                    status["power_state"] = str(power_state)
                except:
                    status["power_state"] = "unknown"
            
            print(json.dumps(status))
        
        elif command in ["up", "down", "left", "right", "select", "menu", "home",
                        "play", "pause", "play_pause", "skip_forward", "skip_backward",
                        "volume_up", "volume_down", "tv", "suspend"]:
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
                # Rate limiting to prevent command spam
                import time
                current_time = time.time()
                time_since_last = current_time - self.last_command_time
                if time_since_last < self.min_command_interval:
                    await asyncio.sleep(self.min_command_interval - time_since_last)
                
                # Handle special commands
                if command == "tv":
                    # Try to use top_menu or home command as fallback
                    if hasattr(self.remote, 'top_menu'):
                        await self.remote.top_menu()
                    else:
                        await self.remote.home()
                elif command == "suspend":
                    # Try to use power commands
                    if self.atv and hasattr(self.atv, 'power'):
                        await self.atv.power.turn_off()
                    elif hasattr(self.remote, 'suspend'):
                        await self.remote.suspend()
                    else:
                        print(json.dumps({"error": "Suspend not available"}))
                        return
                else:
                    method = getattr(self.remote, command)
                    await method()
                
                # Update last command time
                self.last_command_time = time.time()
                
                print(json.dumps({"success": True, "command": command}))
            except Exception as e:
                error_str = str(e).lower()
                # Check for connection-related errors
                if any(phrase in error_str for phrase in ["connection lost", "not connected", "broken pipe", "connection reset", "timed out"]):
                    print(json.dumps({"debug": f"Connection error detected: {e}"}), file=sys.stderr)
                    
                    # Try to reconnect once
                    if self.device_id:
                        print(json.dumps({"debug": "Attempting reconnection..."}), file=sys.stderr)
                        success = await self.connect(self.device_id)
                        
                        if success and self.remote:
                            try:
                                # Retry the command
                                if command == "tv":
                                    if hasattr(self.remote, 'top_menu'):
                                        await self.remote.top_menu()
                                    else:
                                        await self.remote.home()
                                elif command == "suspend":
                                    if self.atv and hasattr(self.atv, 'power'):
                                        await self.atv.power.turn_off()
                                    elif hasattr(self.remote, 'suspend'):
                                        await self.remote.suspend()
                                    else:
                                        print(json.dumps({"error": "Suspend not available after reconnect"}))
                                        return
                                else:
                                    method = getattr(self.remote, command)
                                    await method()
                                import time
                                self.last_command_time = time.time()
                                print(json.dumps({"success": True, "command": command, "reconnected": True}))
                                return
                            except Exception as e2:
                                print(json.dumps({"error": f"Command failed after reconnect: {str(e2)}"}))
                                return
                    
                    print(json.dumps({"error": "Connection lost and reconnection failed"}))
                elif "blocked" in error_str:
                    # Command is blocked - Apple TV might be in a state where it can't accept commands
                    print(json.dumps({"error": f"{command} is blocked", "blocked": True}))
                elif "not supported" in error_str:
                    # Command is not supported in current context
                    print(json.dumps({"error": f"{command} is not supported", "not_supported": True}))
                else:
                    # Other non-connection error
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