#!/bin/bash
# AGS launcher with GTK4 layer shell workaround and environment variables
# This script ensures AGS runs with the correct environment without affecting other GTK apps

# Check if --check-requirements flag is passed
if [ "$1" == "--check-requirements" ] || [ "$1" == "-c" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # Try to find the requirements checker script
    if [ -f "$SCRIPT_DIR/scripts/check-requirements.sh" ]; then
        exec "$SCRIPT_DIR/scripts/check-requirements.sh"
    elif [ -f "$HOME/.config/ags/scripts/check-requirements.sh" ]; then
        exec "$HOME/.config/ags/scripts/check-requirements.sh"
    else
        echo "Error: Requirements checker script not found"
        exit 1
    fi
fi

# Check if --help flag is passed
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "AGS Launcher - Launch AGS with proper environment setup"
    echo ""
    echo "Usage: ags-launcher [OPTIONS] [AGS_ARGS...]"
    echo ""
    echo "Options:"
    echo "  -c, --check-requirements  Check if all requirements are satisfied"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "All other arguments are passed directly to AGS"
    exit 0
fi

# Set AGS-specific GTK environment variables
export GSK_RENDERER=ngl
export GDK_BACKEND=wayland
export LAYER_SHELL_ENABLE=1

# GTK4 Layer Shell workaround
# See: https://github.com/wmww/gtk4-layer-shell/issues/3#issuecomment-1502339477
# This preloads the layer shell library to ensure it's available before GTK initializes
if [ -f /usr/lib/libgtk4-layer-shell.so ]; then
    export LD_PRELOAD="/usr/lib/libgtk4-layer-shell.so:$LD_PRELOAD"
elif [ -f /usr/lib64/libgtk4-layer-shell.so ]; then
    export LD_PRELOAD="/usr/lib64/libgtk4-layer-shell.so:$LD_PRELOAD"
elif [ -f /usr/local/lib/libgtk4-layer-shell.so ]; then
    export LD_PRELOAD="/usr/local/lib/libgtk4-layer-shell.so:$LD_PRELOAD"
elif [ -f /usr/local/lib64/libgtk4-layer-shell.so ]; then
    export LD_PRELOAD="/usr/local/lib64/libgtk4-layer-shell.so:$LD_PRELOAD"
else
    echo "Warning: gtk4-layer-shell library not found in standard locations"
    echo "Layer shell functionality may not work correctly"
fi

# Pass through any AGS-specific environment variables
export AGS_LOG_LEVEL="${AGS_LOG_LEVEL:-info}"
export AGS_LOG_FORMAT="${AGS_LOG_FORMAT:-pretty}"
export AGS_LOG_CONSOLE="${AGS_LOG_CONSOLE:-true}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Determine the app.js path
APP_JS=""

# Check if we're in the AGS config directory
if [ -f "$SCRIPT_DIR/dist/app.js" ]; then
    # Prefer dist/app.js if it exists (production build)
    cd "$SCRIPT_DIR"
    APP_JS="dist/app.js"
elif [ -f "$SCRIPT_DIR/src/app.js" ]; then
    # Fallback to src/app.js (development)
    cd "$SCRIPT_DIR"
    APP_JS="src/app.js"
elif [ -d "$HOME/.config/ags" ]; then
    # Fallback to user's AGS config directory
    cd "$HOME/.config/ags"
    if [ -f "dist/app.js" ]; then
        APP_JS="dist/app.js"
    elif [ -f "src/app.js" ]; then
        APP_JS="src/app.js"
    fi
fi

# Launch AGS with the appropriate arguments
if [ -n "$APP_JS" ]; then
    # If we found an app.js file, run it with --gtk4
    exec ags run --gtk4 "$APP_JS" "$@"
else
    # Otherwise, just pass through to ags with --gtk4
    exec ags --gtk4 "$@"
fi