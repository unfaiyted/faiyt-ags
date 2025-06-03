#!/bin/bash
# Window Manager Service Launcher
# This script runs the window manager service as a separate process

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGS_DIR="$(dirname "$SCRIPT_DIR")"

# Check if already running
if pgrep -f "window-manager-service" > /dev/null; then
    echo "Window Manager service is already running"
    exit 1
fi

# Ensure required dependencies are available
if ! command -v socat &> /dev/null; then
    echo "Error: socat is required but not installed"
    exit 1
fi

if ! command -v grim &> /dev/null; then
    echo "Error: grim is required but not installed"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed"
    exit 1
fi

# Run the window manager service using node/bun
cd "$AGS_DIR"

# Use bun if available, otherwise fall back to node
if command -v bun &> /dev/null; then
    exec bun run "$AGS_DIR/dist/services/window-manager.js" --name="window-manager-service"
elif command -v node &> /dev/null; then
    exec node "$AGS_DIR/dist/services/window-manager.js" --name="window-manager-service"
else
    echo "Error: Neither bun nor node is installed"
    exit 1
fi