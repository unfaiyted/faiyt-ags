#!/bin/bash

# Check if cliphist store is running
if ! pgrep -f "cliphist store" > /dev/null; then
    # Start cliphist store in the background
    wl-paste --watch cliphist store &
    echo "Started cliphist store daemon"
else
    echo "cliphist store daemon is already running"
fi