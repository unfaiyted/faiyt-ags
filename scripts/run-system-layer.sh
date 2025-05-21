#!/bin/bash

# Kill any running instances
ags quit &>/dev/null || true

# Clear any previous environment variables
unset LD_PRELOAD

# Set Wayland environment
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1

# Use the system-installed GTK4 Layer Shell library
export LD_PRELOAD="/usr/lib64/libgtk4-layer-shell.so"

echo "=== Environment Setup ==="
echo "LD_PRELOAD: $LD_PRELOAD"

# Launch AGS
exec ags run --gtk4 ./src/app.ts "$@"
