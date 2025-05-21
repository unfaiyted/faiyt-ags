#!/bin/bash

# Add the custom library path to LD_LIBRARY_PATH
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"

# Preload the layer shell library
export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so:$LD_PRELOAD"

# Debug output for GTK Layer Shell
export GTK_LAYER_SHELL_LOG=1

# Run the provided command with these settings
exec "$@"
