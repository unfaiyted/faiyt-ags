#!/bin/bash

# Kill any running AGS instances
ags quit &>/dev/null || true

# Create the script that will be executed in the native Wayland terminal
cat > /tmp/ags-wayland-run.sh << 'EOL'
#!/bin/bash
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1

# Clear any previous preload
unset LD_PRELOAD
# Set the full, correct path
export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so"

echo "Running AGS with Layer Shell..."
echo "LD_PRELOAD: $LD_PRELOAD"

cd ~/.config/ags
ags run --gtk4 ./src/app.ts

# Keep the terminal open to see any errors
echo
echo "Press Enter to close this terminal"
read
EOL

chmod +x /tmp/ags-wayland-run.sh

# Launch kitty with a unique title so we can find/kill it later
kitty --title "AGS Layer Shell" /tmp/ags-wayland-run.sh