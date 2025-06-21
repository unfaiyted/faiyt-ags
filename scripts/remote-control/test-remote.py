#!/usr/bin/env python3
import asyncio
import pyatv
import json
import sys

async def test_remote():
    # Redirect stderr
    sys.stderr = open('/dev/null', 'w')
    
    loop = asyncio.get_running_loop()
    devices = await pyatv.scan(loop, timeout=5)
    
    # Find Living Room device
    device = None
    for d in devices:
        if str(d.identifier) == 'DE:61:21:57:F6:AB':
            device = d
            break
    
    if not device:
        print(json.dumps({"error": "Device not found"}))
        return
    
    # Load credentials
    with open('/home/faiyt/.config/ags/appletv-credentials.json', 'r') as f:
        creds = json.load(f)
    
    # Apply companion credentials
    if 'DE:61:21:57:F6:AB' in creds and 'companion' in creds['DE:61:21:57:F6:AB']:
        device.set_credentials(pyatv.Protocol.Companion, creds['DE:61:21:57:F6:AB']['companion'])
    
    # Connect
    atv = await pyatv.connect(device, loop)
    if not atv:
        print(json.dumps({"error": "Failed to connect"}))
        return
    
    # Test remote control
    if atv.remote_control:
        try:
            # Try play_pause
            await atv.remote_control.play_pause()
            print(json.dumps({"success": True, "message": "play_pause command sent successfully!"}))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        print(json.dumps({"error": "Remote control not available"}))
    
    atv.close()

asyncio.run(test_remote())