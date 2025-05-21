#!/bin/bash

# Script to run AGS with all the necessary environment variables for GTK4 Layer Shell

# Quit any running AGS instances
ags quit &>/dev/null || true

# Set critical environment variable for GTK4 Layer Shell to work
export GSK_RENDERER=gl

# Set Wayland backend
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export QT_QPA_PLATFORM=wayland

# Add the custom library path if available
if [ -d "$HOME/.local/lib64" ]; then
  export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"
fi

# Use GTK4 layer shell if available
if [ -f "/usr/lib64/libgtk4-layer-shell.so" ]; then
  # Use full path for LD_PRELOAD
  export LD_PRELOAD="/usr/lib64/libgtk4-layer-shell.so:$LD_PRELOAD"
elif [ -f "$HOME/.local/lib64/libgtk4-layer-shell.so" ]; then
  export LD_PRELOAD="$HOME/.local/lib64/libgtk4-layer-shell.so:$LD_PRELOAD"
elif [ -f "$HOME/.local/lib/ags/libgtk4-layer-shell.so" ]; then
  export LD_PRELOAD="$HOME/.local/lib/ags/libgtk4-layer-shell.so:$LD_PRELOAD"
fi

# Print LD_PRELOAD for debugging
echo "Using LD_PRELOAD: $LD_PRELOAD"

# Enable layer shell for GTK4 applications
export LAYER_SHELL_ENABLE=1

# Debug output for GTK Layer Shell
export GTK_LAYER_SHELL_LOG=1

# Parse command line arguments
MODE="run"
APP_PATH="./src/app.ts"

# Process arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --watch)
      MODE="watch"
      shift
      ;;
    --debug)
      MODE="debug"
      shift
      ;;
    *)
      APP_PATH="$1"
      shift
      ;;
  esac
done

# Run AGS in the appropriate mode
case $MODE in
  "run")
    echo "Running AGS with GTK4 Layer Shell..."
    exec ags run --gtk4 "$APP_PATH"
    ;;
  "watch")
    echo "Running AGS in watch mode with GTK4 Layer Shell..."
    exec ags run --gtk4 "$APP_PATH" --watch
    ;;
  "debug")
    echo "Running AGS in debug mode with GTK4 Layer Shell..."
    exec ags run --gtk4 "$APP_PATH" --debug
    ;;
esac