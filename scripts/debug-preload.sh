#!/bin/bash

# Fully debug the preload issue
set -e  # Exit on errors

# Kill any running AGS instances
ags quit &>/dev/null || true

# Completely unset LD_PRELOAD to start fresh
unset LD_PRELOAD

# Set environment variables for native Wayland
export GDK_BACKEND=wayland
export GSK_RENDERER=gl
export LAYER_SHELL_ENABLE=1

# Show environment
echo "=== Before setting LD_PRELOAD ==="
echo "Current LD_PRELOAD: $LD_PRELOAD"

# Now set the correct LD_PRELOAD with careful quoting
export LD_PRELOAD="/home/faiyt/.local/lib64/liblayer-shell-preload.so"

# Verify it's set correctly
echo "=== After setting LD_PRELOAD ==="
echo "LD_PRELOAD now: $LD_PRELOAD"

# Use strace to trace the dynamic linker and see what's happening
# Capture only LD_PRELOAD related events
echo "=== Tracing LD_PRELOAD with strace ==="
strace -f -e trace=openat,open -o strace_output.log ags --version >/dev/null 2>&1 || true

# Extract LD_PRELOAD related lines
grep -A2 "LD_PRELOAD" strace_output.log || echo "No LD_PRELOAD mentions found in strace"

# Now let's use env to directly pass the environment variable to the command
# This bypasses any other scripts that might be modifying LD_PRELOAD
echo "=== Running with env command ==="
exec env LD_PRELOAD="/home/faiyt/.local/lib64/liblayer-shell-preload.so" GDK_BACKEND=wayland GSK_RENDERER=gl LAYER_SHELL_ENABLE=1 ags run --gtk4 ./src/app.ts