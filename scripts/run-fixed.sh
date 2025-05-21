#!/bin/bash

# Quit any running AGS instances
ags quit &>/dev/null || true

# Set critical environment variable for GTK4 Layer Shell to work
export GSK_RENDERER=gl
export GDK_BACKEND=wayland
export LAYER_SHELL_ENABLE=1

# Fix LD_PRELOAD path - notice the absolute path with no colon at the end
if [ -f "/usr/lib64/libgtk4-layer-shell.so" ]; then
  export LD_PRELOAD="/usr/lib64/libgtk4-layer-shell.so"
elif [ -f "$HOME/.local/lib64/libgtk4-layer-shell.so" ]; then
  export LD_PRELOAD="$HOME/.local/lib64/libgtk4-layer-shell.so"
elif [ -f "$HOME/.local/lib/ags/libgtk4-layer-shell.so" ]; then
  export LD_PRELOAD="$HOME/.local/lib/ags/libgtk4-layer-shell.so"
fi

echo "Using LD_PRELOAD: $LD_PRELOAD"

# Run AGS
exec ags run --gtk4 ./src/app.ts