#!/bin/bash

notify-send "Starting AGS Dev server"

# Log output for debugging
exec &> >(tee -a /tmp/ags-dev.log)
echo "=== AGS Dev Script Started at $(date) ==="
echo "PWD: $(pwd)"
echo "PATH: $PATH"
echo "USER: $USER"
echo "HOME: $HOME"

# go to ags directory
cd "$(dirname "$0")" || exit 1
echo "Changed to directory: $(pwd)"

# Source user's bash profile to get full environment
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

# This script is used to run the development server.
export GSK_RENDERER=ngl
export GDK_BACKEND=wayland
export LAYER_SHELL_ENABLE=1
export PATH="$HOME/.bun/bin:$HOME/go/bin:$PATH"



# Check if commands exist
if ! command -v bunx &> /dev/null; then
    echo "bunx not found in PATH"
    notify-send "AGS Error" "bunx not found in PATH"
    exit 1
fi

if ! command -v ags &> /dev/null; then
    echo "ags not found in PATH"
    notify-send "AGS Error" "ags not found in PATH"
    exit 1
fi

# Run the commands
echo "Running tailwindcss..."
~/.bun/bin/bunx tailwindcss -i ./input.css -o ./src/output.css || {
    echo "tailwindcss failed"
    notify-send "AGS Error" "tailwindcss compilation failed"
    exit 1
}

echo "Running tailwind-patch..."
./scripts/tailwind-patch.js ./src/output.css || {
    echo "tailwind-patch failed"
    notify-send "AGS Error" "tailwind-patch failed"
    exit 1
}

killall swaync 2>/dev/null || true
nwg-look -a


echo "Starting AGS..."
~/go/bin/ags run --gtk4 ./src/app.ts || {
    echo "AGS failed to start"
    swaync 
    notify-send "AGS Error" "AGS failed to start"
    exit 1
}

