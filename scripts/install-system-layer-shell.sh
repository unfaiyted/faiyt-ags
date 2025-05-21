#!/bin/bash

# Script to build and install GTK4 Layer Shell system-wide
# This requires sudo privileges

# Exit on error
set -e

# Create temporary build directory
BUILD_DIR="/tmp/gtk4-layer-shell-build"
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

echo "=== Building GTK4 Layer Shell for system installation ==="
# Configure build with Meson for system installation
meson setup --prefix=/usr --libdir=lib64 -Dexamples=true -Ddocs=false -Dtests=false -Dbuildtype=release build

# Build
ninja -C build

echo "=== Installing GTK4 Layer Shell system-wide ==="
echo "This will require your sudo password:"
sudo ninja -C build install

echo "=== Running ldconfig to update library cache ==="
sudo ldconfig

echo "=== Creating system launcher script ==="
cat > "$HOME/.config/ags/run-system-layer.sh" << 'EOF'
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

# Use the system-installed GTK4 Layer Shell library
export LD_PRELOAD="/usr/lib64/libgtk4-layer-shell.so"

echo "=== Environment Setup ==="
echo "LD_PRELOAD: $LD_PRELOAD"

# Launch AGS
exec ags run --gtk4 ./src/app.ts "$@"
EOF

chmod +x "$HOME/.config/ags/run-system-layer.sh"

echo "=== Done ==="
echo "System-wide GTK4 Layer Shell has been installed."
echo "You can now run your app with: ~/.config/ags/run-system-layer.sh"
echo "Make sure to run this from a native Wayland terminal, not an XWayland terminal."