#!/usr/bin/env python3
"""
Mock Apple TV control script for testing without pyatv
"""

import json
import sys
import time
import random

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command specified"}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    # Simulate some delay
    time.sleep(0.2)
    
    if command == "discover":
        # Return mock devices
        devices = [
            {
                "name": "Living Room Apple TV",
                "address": "192.168.1.100",
                "identifier": "mock-device-1",
                "services": ["companion", "airplay"]
            },
            {
                "name": "Bedroom Apple TV",
                "address": "192.168.1.101", 
                "identifier": "mock-device-2",
                "services": ["companion", "airplay"]
            }
        ]
        print(json.dumps({"devices": devices}))
    
    elif command == "connect":
        identifier = sys.argv[2] if len(sys.argv) > 2 else "mock-device-1"
        print(json.dumps({"connected": True, "identifier": identifier}))
    
    elif command == "status":
        # Return mock playing info
        info = {
            "title": "Mock Movie Title",
            "artist": "Mock Artist",
            "album": "Mock Album",
            "genre": "Action",
            "total_time": 7200,
            "position": 3600,
            "repeat": "Off",
            "shuffle": "Off",
            "device_state": "Playing",
            "power_state": "On"
        }
        print(json.dumps(info))
    
    elif command in ["up", "down", "left", "right", "select", "menu", "home",
                    "play", "pause", "play_pause", "skip_forward", "skip_backward",
                    "volume_up", "volume_down", "suspend", "wakeup"]:
        print(json.dumps({"success": True, "command": command}))
    
    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))

if __name__ == "__main__":
    main()