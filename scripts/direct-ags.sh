#!/bin/bash

# Quit any running AGS instances first
ags quit &>/dev/null || true

# Set the correct environment variables for Wayland
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1

# Use the liblayer-shell-preload.so instead
if [ -f "$HOME/.local/lib/liblayer-shell-preload.so" ]; then
  export LD_PRELOAD="$HOME/.local/lib/liblayer-shell-preload.so"
elif [ -f "$HOME/.local/lib/ags/liblayer-shell-preload.so" ]; then
  export LD_PRELOAD="$HOME/.local/lib/ags/liblayer-shell-preload.so"
fi

echo "Using LD_PRELOAD: $LD_PRELOAD"

# Add local library path
export LD_LIBRARY_PATH="$HOME/.local/lib:$HOME/.local/lib64:$LD_LIBRARY_PATH"

# Run AGS
exec ags run --gtk4 ./src/app.ts