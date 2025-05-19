#!/bin/bash

echo "================================================================="
echo "Watching for changes... (Press Ctrl+C to stop)"
echo "================================================================="

# Attempt to quit any running AGS instances
ags quit &>/dev/null || true

# Check if debug mode is requested
if [ "$1" == "debug" ]; then
    echo "Starting AGS in debug mode..."
    GTK_DEBUG=interactive ags run src/app.ts
else
    # Start AGS with the app in normal mode
    echo "Starting AGS in normal mode..."
    ags run src/app.ts
fi