#!/bin/bash

# Script to fix GTK4 Layer Shell integration with AGS
# This script will create symlinks and configuration to ensure AGS works with layer shell

# Exit on error
set -e

echo "=== GTK4 Layer Shell Fixer for AGS ==="
echo "This script will configure your environment for AGS with GTK4 Layer Shell"

# Check if running under Wayland
if [ "$XDG_SESSION_TYPE" != "wayland" ]; then
  echo "ERROR: You must run this script under a Wayland session."
  exit 1
fi

# Check for GTK4 Layer Shell library
GTK4_LAYER_LIB=""
if [ -f "/usr/lib64/libgtk4-layer-shell.so" ]; then
  GTK4_LAYER_LIB="/usr/lib64/libgtk4-layer-shell.so"
  echo "Found system GTK4 Layer Shell at $GTK4_LAYER_LIB"
elif [ -f "$HOME/.local/lib64/libgtk4-layer-shell.so" ]; then
  GTK4_LAYER_LIB="$HOME/.local/lib64/libgtk4-layer-shell.so"
  echo "Found custom GTK4 Layer Shell at $GTK4_LAYER_LIB"
else
  echo "ERROR: GTK4 Layer Shell library not found."
  echo "Please run the build-gtk4-layer-shell.sh script first."
  exit 1
fi

# Create desktop file for AGS
echo "Creating AGS desktop file with correct environment variables..."
mkdir -p ~/.local/share/applications/
cat > ~/.local/share/applications/ags-custom.desktop << EOF
[Desktop Entry]
Name=AGS Custom
Comment=Advanced GTK+ Shell
Exec=env GSK_RENDERER=gl GDK_BACKEND=wayland LAYER_SHELL_ENABLE=1 ags run --gtk4 $HOME/.config/ags/src/app.ts
Terminal=false
Type=Application
Categories=Utility;
EOF

# Create shell config for AGS
echo "Creating AGS shell configuration file..."
mkdir -p ~/.config/ags
cat > ~/.config/ags/ags-layer-env << EOF
# AGS Layer Shell Environment Configuration
export GSK_RENDERER=gl
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export QT_QPA_PLATFORM=wayland
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1
EOF

# Add to shell config if not already there
if ! grep -q "source ~/.config/ags/ags-layer-env" ~/.bashrc; then
  echo "Adding environment setup to ~/.bashrc..."
  echo "# AGS Layer Shell environment" >> ~/.bashrc
  echo "if [ -f ~/.config/ags/ags-layer-env ]; then" >> ~/.bashrc
  echo "  source ~/.config/ags/ags-layer-env" >> ~/.bashrc
  echo "fi" >> ~/.bashrc
fi

if [ -f ~/.zshrc ] && ! grep -q "source ~/.config/ags/ags-layer-env" ~/.zshrc; then
  echo "Adding environment setup to ~/.zshrc..."
  echo "# AGS Layer Shell environment" >> ~/.zshrc
  echo "if [ -f ~/.config/ags/ags-layer-env ]; then" >> ~/.zshrc
  echo "  source ~/.config/ags/ags-layer-env" >> ~/.zshrc
  echo "fi" >> ~/.zshrc
fi

# Create launcher script
echo "Creating enhanced AGS launcher script..."
cat > ~/.config/ags/ags-layer << EOF
#!/bin/bash

# Source environment variables
source ~/.config/ags/ags-layer-env

# Terminate any existing AGS instances
ags quit &>/dev/null || true

# Run AGS with layer shell properly enabled
exec ags run --gtk4 "\$@"
EOF

chmod +x ~/.config/ags/ags-layer

echo "=== Configuration Complete ==="
echo "To run AGS with layer shell properly enabled:"
echo "1. Start a new terminal session (to load the new environment variables)"
echo "2. Run: ~/.config/ags/ags-layer ~/.config/ags/src/app.ts"
echo "3. Or run the desktop entry: ags-custom"
echo ""
echo "You can also run AGS directly with the required environment variables:"
echo "GSK_RENDERER=gl GDK_BACKEND=wayland LAYER_SHELL_ENABLE=1 ags run --gtk4 ~/.config/ags/src/app.ts"