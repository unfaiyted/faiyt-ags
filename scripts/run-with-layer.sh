#!/bin/bash

# Ensure we're using native Wayland
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export QT_QPA_PLATFORM=wayland

# Debug output for GTK Layer Shell
export GTK_LAYER_SHELL_LOG=1

# Preload the GTK4 Layer Shell library
export LD_PRELOAD=/usr/lib64/libgtk4-layer-shell.so

cd ./src
# Run AGS with full debug info
exec ags run "$@"
