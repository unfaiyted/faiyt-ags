#!/bin/bash

# Script to correctly launch AGS with Layer Shell on Hyprland
set -e  # Exit on any error

# Kill any running AGS instances
ags quit &>/dev/null || true

# Clear previous environment variables that might be causing issues
unset LD_PRELOAD

# Force explicit environment variables for Layer Shell
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1
export XDG_SESSION_TYPE=wayland

# Use the correct library path - lib64 on ARM systems
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"

# Set the LD_PRELOAD with the absolute path - this is critical
if [ -f "$HOME/.local/lib64/liblayer-shell-preload.so" ]; then
  # Use the preload library if available (preferred)
  export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so"
elif [ -f "$HOME/.local/lib64/libgtk4-layer-shell.so" ]; then
  # Fall back to direct GTK4 layer shell if needed
  export LD_PRELOAD="$HOME/.local/lib64/libgtk4-layer-shell.so"
elif [ -f "/usr/lib64/libgtk4-layer-shell.so" ]; then
  # Try system libraries as last resort
  export LD_PRELOAD="/usr/lib64/libgtk4-layer-shell.so"
else
  echo "ERROR: Could not find layer shell libraries. Please install gtk4-layer-shell."
  exit 1
fi

# Verify LD_PRELOAD is correctly set with an absolute path
if [[ ! "$LD_PRELOAD" == /* ]]; then
  echo "ERROR: LD_PRELOAD is not set to an absolute path: $LD_PRELOAD"
  exit 1
fi

echo "=== Environment Setup ==="
echo "LD_PRELOAD: $LD_PRELOAD"
echo "GDK_BACKEND: $GDK_BACKEND"
echo "LAYER_SHELL_ENABLE: $LAYER_SHELL_ENABLE"
echo "XDG_SESSION_TYPE: $XDG_SESSION_TYPE"

# Verify the preloaded library exists before running
if [ ! -f "$LD_PRELOAD" ]; then
  echo "ERROR: The library specified in LD_PRELOAD does not exist: $LD_PRELOAD"
  exit 1
fi

echo "Library exists: $(file "$LD_PRELOAD")"

# Check if running under XWayland
if [ -z "$WAYLAND_DISPLAY" ]; then
  echo "WARNING: WAYLAND_DISPLAY is not set. You might be running under XWayland."
  echo "Layer shell may not work correctly unless run from a native Wayland terminal."
fi

# Execute AGS with correct arguments
exec ags run --gtk4 ./src/app.ts "$@"