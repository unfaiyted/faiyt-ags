#!/bin/bash

# Script to run AGS with a clean layer shell setup
# Updated to fix the LD_PRELOAD path issue

# Kill any running AGS instances
ags quit &>/dev/null || true

# Clear any environment variables that might be causing conflicts
unset LD_PRELOAD

# Set Wayland environment
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1

# Find library location
if [ -f "/usr/lib64/libgtk4-layer-shell.so" ]; then
  LIB_PATH="/usr/lib64/libgtk4-layer-shell.so"
elif [ -f "$HOME/.local/lib64/libgtk4-layer-shell.so" ]; then
  LIB_PATH="$HOME/.local/lib64/libgtk4-layer-shell.so"
else
  echo "ERROR: Could not find libgtk4-layer-shell.so"
  exit 1
fi

# Set LD_PRELOAD with explicit quoting and value
export LD_PRELOAD="${LIB_PATH}"

# Debug output
echo "=== Environment Setup ==="
echo "Using layer shell library: ${LIB_PATH}"
echo "LD_PRELOAD: ${LD_PRELOAD}"
echo "GDK_BACKEND: ${GDK_BACKEND}"
echo "LAYER_SHELL_ENABLE: ${LAYER_SHELL_ENABLE}"

# Run AGS with the correct preload
exec /usr/bin/env LD_PRELOAD="${LIB_PATH}" GDK_BACKEND=wayland GSK_RENDERER=gl LAYER_SHELL_ENABLE=1 ags run --gtk4 ./src/app.ts