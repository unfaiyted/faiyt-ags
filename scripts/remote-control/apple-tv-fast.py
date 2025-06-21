#!/usr/bin/env python3
"""
Optimized Apple TV control script
Creates connection pool and reuses connections when possible
"""

import asyncio
import json
import sys
import os
import warnings
import time
from typing import Optional, Dict, Any
from functools import lru_cache

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.stderr = open(os.devnull, 'w')

import pyatv

# Global connection cache
_connection_cache = {}
_cache_timeout = 60  # seconds

class FastAppleTVController:
    @staticmethod
    @lru_cache(maxsize=1)
    def load_config() -> Optional[str]:
        """Load default device configuration"""
        config_file = os.path.expanduser("~/.config/ags/appletv-config.json")
        if os.path.exists(config_file):
            with open(config_file, "r") as f:
                config = json.load(f)
                return config.get("default_device")
        return None
    
    @staticmethod
    @lru_cache(maxsize=1)
    def load_credentials() -> Dict[str, Any]:
        """Load stored credentials"""
        credentials_file = os.path.expanduser("~/.config/ags/appletv-credentials.json")
        if os.path.exists(credentials_file):
            with open(credentials_file, "r") as f:
                return json.load(f)
        return {}
    
    @staticmethod
    async def get_connection(device_id: str):
        """Get cached connection or create new one"""
        global _connection_cache
        
        # Check if we have a cached connection
        if device_id in _connection_cache:
            conn, timestamp = _connection_cache[device_id]
            # Check if connection is still fresh
            if time.time() - timestamp < _cache_timeout:
                try:
                    # Quick check if connection is alive
                    if conn and hasattr(conn, 'close'):
                        return conn
                except:
                    pass
            else:
                # Connection is stale, close it
                try:
                    conn.close()
                except:
                    pass
                del _connection_cache[device_id]
        
        # Create new connection
        loop = asyncio.get_running_loop()
        devices = await pyatv.scan(loop, identifier=device_id, timeout=2)
        
        if not devices:
            return None
        
        device = devices[0]
        
        # Apply credentials
        credentials = FastAppleTVController.load_credentials()
        if device_id in credentials:
            for protocol_name, creds in credentials[device_id].items():
                try:
                    if protocol_name.lower() == 'companion':
                        device.set_credentials(pyatv.Protocol.Companion, creds)
                    elif protocol_name.lower() == 'airplay':
                        device.set_credentials(pyatv.Protocol.AirPlay, creds)
                except:
                    pass
        
        # Connect
        atv = await pyatv.connect(device, loop)
        if atv:
            _connection_cache[device_id] = (atv, time.time())
            return atv
        
        return None
    
    @staticmethod
    async def send_command(device_id: str, command: str) -> Dict[str, Any]:
        """Send command using cached connection"""
        try:
            atv = await FastAppleTVController.get_connection(device_id)
            if not atv:
                return {"error": "Failed to connect"}
            
            if not atv.remote_control:
                return {"error": "Remote control not available"}
            
            # Get and execute command
            if hasattr(atv.remote_control, command):
                method = getattr(atv.remote_control, command)
                await method()
                return {"success": True, "command": command}
            else:
                return {"error": f"Command '{command}' not available"}
                
        except Exception as e:
            # On error, remove from cache
            if device_id in _connection_cache:
                try:
                    _connection_cache[device_id][0].close()
                except:
                    pass
                del _connection_cache[device_id]
            
            return {"error": str(e)}

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: apple-tv-fast.py <command>"}))
        return
    
    command = sys.argv[1]
    device_id = FastAppleTVController.load_config()
    
    if not device_id:
        print(json.dumps({"error": "No device configured"}))
        return
    
    # Handle different commands
    if command in ["up", "down", "left", "right", "select", "menu", "home",
                   "play", "pause", "play_pause", "skip_forward", "skip_backward",
                   "volume_up", "volume_down"]:
        result = await FastAppleTVController.send_command(device_id, command)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))

if __name__ == "__main__":
    asyncio.run(main())