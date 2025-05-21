#!/bin/bash

# Kill any existing AGS instances
ags quit &>/dev/null || true

# Set essential environment variables for GTK4 Layer Shell
export GSK_RENDERER=gl
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export QT_QPA_PLATFORM=wayland
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1

# Run the demo app first to test if layer shell is working
echo "Testing GTK4 Layer Shell with the demo app..."
if [ -f "$HOME/.local/bin/gtk4-layer-demo" ]; then
  $HOME/.local/bin/gtk4-layer-demo &
  sleep 3
  killall gtk4-layer-demo &>/dev/null || true
  echo "If the demo appeared with a transparent window with red border, layer shell is working!"
fi

# Run AGS with correct environment
echo "Running AGS with layer shell..."
exec ags run --gtk4 ./src