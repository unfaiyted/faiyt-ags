#!/usr/bin/env python3
"""
Optimized Apple TV control service with persistent connection and instant response
Combines the best of service and fast approaches
"""

import asyncio
import json
import sys
import os
import warnings
import time
from typing import Optional, Dict, Any
from asyncio import Queue
import threading

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

# Redirect stderr to devnull to suppress all protobuf warnings
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')

import pyatv

class OptimizedAppleTVService:
    def __init__(self):
        self.atv = None
        self.remote = None
        self.device_id = None
        self.loop = None
        self.heartbeat_task = None
        self.last_command_time = 0
        self.command_queue = Queue()
        self.reconnect_lock = asyncio.Lock()
        self.is_reconnecting = False
        
    async def ensure_connected(self) -> bool:
        """Ensure we have a valid connection, reconnect if needed"""
        if self.atv and self.remote:
            # Quick connection check
            try:
                # Just verify objects exist, don't call methods
                if self.atv and self.remote:
                    return True
            except:
                pass
        
        # Need to connect/reconnect
        if self.device_id:
            async with self.reconnect_lock:
                if not self.is_reconnecting:
                    self.is_reconnecting = True
                    try:
                        success = await self.connect(self.device_id)
                        return success
                    finally:
                        self.is_reconnecting = False
        
        return False
    
    async def connect(self, device_id: str) -> bool:
        """Connect to Apple TV with optimized scanning"""
        try:
            # Cancel existing heartbeat
            if self.heartbeat_task:
                self.heartbeat_task.cancel()
                self.heartbeat_task = None
            
            # Clean disconnect if connected
            if self.atv:
                try:
                    self.atv.close()
                except:
                    pass
                self.atv = None
                self.remote = None
            
            # Optimized device discovery
            device = None
            
            # Try direct scan first (fastest)
            try:
                devices = await pyatv.scan(self.loop, identifier=device_id, timeout=1.5)
                if devices:
                    device = devices[0]
            except:
                pass
            
            # Fallback to full scan if needed
            if not device:
                devices = await pyatv.scan(self.loop, timeout=2.5)
                for d in devices:
                    if str(d.identifier) == device_id:
                        device = d
                        break
            
            if not device:
                print(json.dumps({"error": f"Device {device_id} not found"}))
                return False
            
            # Load and apply credentials
            credentials_file = os.path.expanduser("~/.config/ags/appletv-credentials.json")
            if os.path.exists(credentials_file):
                try:
                    with open(credentials_file, "r") as f:
                        stored_credentials = json.load(f)
                        if device_id in stored_credentials:
                            for protocol_name, creds in stored_credentials[device_id].items():
                                try:
                                    if protocol_name.lower() == 'companion':
                                        device.set_credentials(pyatv.Protocol.Companion, creds)
                                    elif protocol_name.lower() == 'airplay':
                                        device.set_credentials(pyatv.Protocol.AirPlay, creds)
                                except:
                                    pass
                except:
                    pass
            
            # Connect with minimal timeout
            self.atv = await pyatv.connect(device, self.loop)
            
            if self.atv and hasattr(self.atv, 'remote_control'):
                self.remote = self.atv.remote_control
                self.device_id = device_id
                
                # Start optimized heartbeat
                self.heartbeat_task = asyncio.create_task(self.heartbeat())
                
                return True
            
            return False
            
        except Exception as e:
            print(json.dumps({"error": f"Connection failed: {str(e)}"}))
            return False
    
    async def heartbeat(self):
        """Lightweight heartbeat to detect connection issues early"""
        while True:
            try:
                await asyncio.sleep(60)  # Check every minute
                
                # Only check if idle
                if time.time() - self.last_command_time > 50:
                    # Just verify connection objects exist
                    if not (self.atv and self.remote):
                        print(json.dumps({"debug": "Connection lost, will reconnect on next command"}), file=sys.stderr)
                        break
                        
            except asyncio.CancelledError:
                break
            except:
                break
    
    async def execute_command(self, command: str) -> Dict[str, Any]:
        """Execute command with automatic reconnection"""
        # Quick pre-check
        if not await self.ensure_connected():
            return {"error": "Failed to connect"}
        
        try:
            # Execute command
            method = getattr(self.remote, command)
            await method()
            
            # Update activity time
            self.last_command_time = time.time()
            
            return {"success": True, "command": command}
            
        except Exception as e:
            error_str = str(e).lower()
            
            # Connection error - try once more
            if any(phrase in error_str for phrase in ["connection", "not connected", "broken pipe", "timeout"]):
                print(json.dumps({"debug": f"Connection error, reconnecting: {e}"}), file=sys.stderr)
                
                # Force reconnect
                self.atv = None
                self.remote = None
                
                if await self.ensure_connected():
                    try:
                        method = getattr(self.remote, command)
                        await method()
                        self.last_command_time = time.time()
                        return {"success": True, "command": command, "reconnected": True}
                    except Exception as e2:
                        return {"error": f"Command failed after reconnect: {str(e2)}"}
                
                return {"error": "Reconnection failed"}
            
            return {"error": str(e)}
    
    async def handle_command(self, cmd_data: Dict[str, Any]):
        """Handle incoming commands"""
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
            if self.atv:
                self.atv.close()
                self.atv = None
                self.remote = None
            print(json.dumps({"disconnected": True}))
        
        elif command == "status":
            connected = self.atv is not None and self.remote is not None
            print(json.dumps({
                "connected": connected,
                "device_id": self.device_id,
                "ready": True
            }))
        
        elif command in ["up", "down", "left", "right", "select", "menu", "home",
                        "play", "pause", "play_pause", "skip_forward", "skip_backward",
                        "volume_up", "volume_down"]:
            result = await self.execute_command(command)
            print(json.dumps(result))
        
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
    
    async def process_commands(self):
        """Process commands from queue"""
        while True:
            try:
                cmd_data = await self.command_queue.get()
                await self.handle_command(cmd_data)
                sys.stdout.flush()
            except Exception as e:
                print(json.dumps({"error": str(e)}))
                sys.stdout.flush()
    
    async def run(self):
        """Main service loop"""
        self.loop = asyncio.get_running_loop()
        
        # Load default device and pre-connect
        config_file = os.path.expanduser("~/.config/ags/appletv-config.json")
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    config = json.load(f)
                    default_device = config.get("default_device")
                    if default_device:
                        # Pre-connect in background
                        asyncio.create_task(self.connect(default_device))
            except:
                pass
        
        # Start command processor
        processor = asyncio.create_task(self.process_commands())
        
        # Send ready signal
        print(json.dumps({"ready": True}))
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
                
                # Parse and queue command
                try:
                    cmd_data = json.loads(line.decode().strip())
                    await self.command_queue.put(cmd_data)
                except json.JSONDecodeError:
                    print(json.dumps({"error": "Invalid JSON"}))
                    sys.stdout.flush()
                    
            except Exception as e:
                print(json.dumps({"error": str(e)}))
                sys.stdout.flush()
        
        # Cleanup
        processor.cancel()
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
        if self.atv:
            self.atv.close()

if __name__ == "__main__":
    service = OptimizedAppleTVService()
    asyncio.run(service.run())