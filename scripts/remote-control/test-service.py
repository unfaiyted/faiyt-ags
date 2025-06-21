#!/usr/bin/env python3
import subprocess
import json
import time

# Start the service
proc = subprocess.Popen(
    ["python3", "apple-tv-service.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    bufsize=1
)

# Wait for ready
ready_line = proc.stdout.readline()
print("Service:", ready_line.strip())

# Connect
cmd = json.dumps({"command": "connect", "device_id": "DE:61:21:57:F6:AB"}) + "\n"
proc.stdin.write(cmd)
proc.stdin.flush()
response = proc.stdout.readline()
print("Connect:", response.strip())

# Send a few commands with delays
for i in range(5):
    time.sleep(2)
    cmd = json.dumps({"command": "play_pause"}) + "\n"
    proc.stdin.write(cmd)
    proc.stdin.flush()
    response = proc.stdout.readline()
    print(f"Command {i+1}:", response.strip())

# Disconnect
cmd = json.dumps({"command": "disconnect"}) + "\n"
proc.stdin.write(cmd)
proc.stdin.flush()
response = proc.stdout.readline()
print("Disconnect:", response.strip())

proc.terminate()