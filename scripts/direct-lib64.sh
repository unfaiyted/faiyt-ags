#!/bin/bash

# Kill any running AGS instances
ags quit &>/dev/null || true

# Set the correct environment variables for Wayland
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1

# Use the liblayer-shell-preload.so from lib64
export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so"

echo "Using LD_PRELOAD: $LD_PRELOAD"

# Add local library path
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"

# Run AGS
exec ags run --gtk4 ./src/app.ts