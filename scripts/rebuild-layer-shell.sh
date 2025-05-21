#!/bin/bash

# Improved script to build and install GTK4 Layer Shell correctly for ARM systems
set -e

echo "=== Cleaning up previous installations ==="
# Remove any existing symlinks that might be pointing to wrong locations
find "$HOME/.local/lib" -name "*layer*shell*" -type l -delete
find "$HOME/.local/lib64" -name "*layer*shell*" -type l -delete
find "$HOME/.local/lib/ags" -name "*layer*shell*" -type l -delete

# Create build directory
BUILD_DIR="$HOME/gtk4-layer-shell-build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

echo "=== Downloading the latest GTK4 Layer Shell ==="
if [ -d "gtk4-layer-shell" ]; then
  echo "Directory exists, updating..."
  cd gtk4-layer-shell
  git pull
  cd ..
else
  echo "Cloning repository..."
  git clone https://github.com/wmww/gtk4-layer-shell.git
  cd gtk4-layer-shell
fi

echo "=== Building GTK4 Layer Shell ==="
# Configure build with Meson
meson setup --prefix="$HOME/.local" --libdir="lib64" -Dexamples=true -Ddocs=false -Dtests=false -Dbuildtype=release build

# Build
ninja -C build

echo "=== Installing GTK4 Layer Shell to $HOME/.local/lib64 ==="
# Install to user directory with lib64 path for ARM systems
ninja -C build install

echo "=== Setting up LD_PRELOAD script ==="
cat > "$HOME/.config/ags/run-layer-shell.sh" << 'EOF'
#!/bin/bash

# Kill any running instances
ags quit &>/dev/null || true

# Clear any previous environment variables
unset LD_PRELOAD

# Set Wayland environment
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1
export GTK_LAYER_SHELL_LOG=1

# Add lib64 to library path
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"

# Use the rebuilt libgtk4-layer-shell.so directly - no colon at the end
export LD_PRELOAD="$HOME/.local/lib64/libgtk4-layer-shell.so"

echo "=== Environment Setup ==="
echo "LD_PRELOAD: $LD_PRELOAD"
echo "LD_LIBRARY_PATH: $LD_LIBRARY_PATH"

# Launch AGS
exec ags run --gtk4 ./src/app.ts "$@"
EOF

chmod +x "$HOME/.config/ags/run-layer-shell.sh"

echo "=== Done ==="
echo "You can now run your app with: ~/.config/ags/run-layer-shell.sh"
echo "Make sure to run this from a native Wayland terminal, not an XWayland terminal."