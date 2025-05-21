#!/bin/bash

# Test script to run AGS with layer shell preload
# Based on the GTK4 Layer Shell preload approach

# Check if preload library exists
PRELOAD_LIB="/usr/lib64/liblayer-shell-preload.so"
if [ ! -f "$PRELOAD_LIB" ]; then
  echo "ERROR: Layer shell preload library not found at $PRELOAD_LIB"
  echo "You may need to install the latest gtk4-layer-shell package or build it from source."
  exit 1
fi

# Set environment variables
export LD_PRELOAD="$PRELOAD_LIB"
export GTK_LAYER_SHELL_LOG=1
export LAYER_SHELL_ENABLE=1
export LAYER_SHELL_LAYER=top  # Use 'overlay', 'top', 'bottom' or 'background'
export LAYER_SHELL_ANCHOR=1   # 1=top, 2=bottom, 4=left, 8=right (can be added: 5=top-left)

# Ensure wayland
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland

# Run AGS with these environment variables
exec ags run "$@"