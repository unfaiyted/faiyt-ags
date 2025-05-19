#!/bin/bash

echo "================================================================="
echo "Watching for changes... (Press Ctrl+C to stop)"
echo "================================================================="

# Attempt to quit any running AGS instances
ags quit &>/dev/null || true

# Check if debug mode is requested
if [ "$1" == "debug" ]; then
    echo "Starting AGS in debug mode..."
    GJS_DEBUG_OUTPUT=stderr GTK_DEBUG=interactive ags run src/app.ts
elif [ "$1" == "smart" ]; then
    echo "Starting AGS with smart error tracing..."
    # First update the source map
    node ./scripts/source-mapper.js > /dev/null
    # Then run with error tracing
    ags run src/app.ts 2>&1 | node ./scripts/error-tracer.js
else
    # Start AGS with the app in normal mode
    echo "Starting AGS in normal mode..."
    GJS_DEBUG_OUTPUT=stderr GJS_ENABLE_TRACING=1 ags run src/app.ts
fi
