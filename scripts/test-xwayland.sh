#!/bin/bash

# Script to check if the current terminal is running under XWayland or native Wayland

# Check the window class of the current terminal
WINDOW_ID=$(xdotool getwindowfocus)
WINDOW_CLASS=$(xdotool getwindowclassname $WINDOW_ID)

echo "Current window class: $WINDOW_CLASS"

# Check Hyprland client information
echo "Hyprland client information for current window:"
hyprctl clients | grep -A 20 "$WINDOW_CLASS"

# Check if running under XWayland
echo "XWayland status:"
hyprctl clients | grep -B 5 -A 5 "xwayland: 1"

# Print Wayland environment variables
echo "Wayland environment variables:"
echo "WAYLAND_DISPLAY=$WAYLAND_DISPLAY"
echo "XDG_SESSION_TYPE=$XDG_SESSION_TYPE"
echo "GDK_BACKEND=$GDK_BACKEND"

# Try to run a small GTK4 app with layer shell
echo "Testing GTK4 Layer Shell with a small app..."
cat > /tmp/test-gtk4-layer.js << 'EOF'
// Test script for GTK4 Layer Shell
const { GLib, Gtk, Gdk } = imports.gi;
Gtk.init();

// Check if we have a Wayland display
const display = Gdk.Display.get_default();
print(`Display type: ${display.constructor.name}`);
print(`Is Wayland: ${display instanceof Gdk.WaylandDisplay}`);

// Create a window
const win = new Gtk.Window({
    title: 'GTK4 Test',
});

// Add a label
const label = new Gtk.Label({
    label: 'Testing GTK4',
});
win.set_child(label);

// Show the window
win.show();

// Keep the app running for a bit
const loop = GLib.MainLoop.new(null, false);
GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3, () => {
    print("Closing test window");
    loop.quit();
    return GLib.SOURCE_REMOVE;
});

try {
    loop.run();
} catch(e) {
    print(`Error: ${e.message}`);
}
EOF

# Run with preload
export LD_LIBRARY_PATH="$HOME/.local/lib64:$LD_LIBRARY_PATH"
export LD_PRELOAD="$HOME/.local/lib64/liblayer-shell-preload.so:$LD_PRELOAD"
export GTK_LAYER_SHELL_LOG=1
export LAYER_SHELL_ENABLE=1

# Ensure Wayland backend
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export QT_QPA_PLATFORM=wayland

# Run the test script
gjs /tmp/test-gtk4-layer.js