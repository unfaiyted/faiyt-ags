#!/bin/bash

echo "================================================================="
echo "Watching for changes... (Press Ctrl+C to stop)"
echo "================================================================="

# Attempt to quit any running AGS instances
ags quit &>/dev/null || true

# Set critical environment variable for GTK4 Layer Shell to work
# export GSK_RENDERER=gl

# Check if debug mode is requested
if [ "$1" == "debug" ]; then
    echo "Starting AGS in debug mode..."
    # Ensure we're using native Wayland
    GJS_DEBUG_OUTPUT=stderr GTK_DEBUG=interactive ags run --gtk4 src/app.ts
elif [ "$1" == "smart" ]; then
    echo "Starting AGS with smart error tracing..."
    # First update the source map
    node ./scripts/source-mapper.js > /dev/null
    # Then run with error tracing and force Wayland
    # Ensure we're using native Wayland
    ags run --gtk4 src/app.ts 2>&1 | node ./scripts/error-tracer.js
else
    # Start AGS with the app in normal mode
    echo "Starting AGS in normal mode..."
    # Ensure we're using native Wayland
    GJS_DEBUG_OUTPUT=stderr GJS_ENABLE_TRACING=1 ags run  src/app.ts
fi
