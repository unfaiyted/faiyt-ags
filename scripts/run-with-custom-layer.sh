#!/bin/bash

# Ensure we're using native Wayland
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export QT_QPA_PLATFORM=wayland

# Set the GSK renderer to GL - this is critical for layer shell to work
export GSK_RENDERER=gl

# Add the custom library path to LD_LIBRARY_PATH
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"

# Preload the layer shell library
export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so:$LD_PRELOAD"

# Debug output for GTK Layer Shell
export GTK_LAYER_SHELL_LOG=1
export LAYER_SHELL_ENABLE=1
export LAYER_SHELL_LAYER=top  # Use 'overlay', 'top', 'bottom' or 'background'
export LAYER_SHELL_ANCHOR=1   # 1=top, 2=bottom, 4=left, 8=right (can be added: 5=top-left)

# Run AGS with the custom layer shell
exec ags run "$@"
