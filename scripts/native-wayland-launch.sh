#!/bin/bash

# Script to correctly launch AGS with Layer Shell on Hyprland

# Kill any running AGS instances
ags quit &>/dev/null || true

# Force explicit environment variables for Layer Shell
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1
export XDG_SESSION_TYPE=wayland

# Use the correct library path - lib64 on ARM systems
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"
# The issue is that LD_PRELOAD is being set to a path without directory
# We need to use the full absolute path without any colon
export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so"

echo "=== Environment Setup ==="
echo "LD_PRELOAD: $LD_PRELOAD"
echo "GDK_BACKEND: $GDK_BACKEND"
echo "LAYER_SHELL_ENABLE: $LAYER_SHELL_ENABLE"
echo "XDG_SESSION_TYPE: $XDG_SESSION_TYPE"

# Execute AGS
exec ags run --gtk4 ./src/app.ts "$@"