#!/bin/bash

notify-send "Starting AGS Dev server"

# Function to find go binary
find_go() {
    # Check if go is already in PATH
    if command -v go &> /dev/null; then
        echo "$(command -v go)"
        return 0
    fi
    
    # Common go installation locations
    local go_paths=(
        "$HOME/go/bin/go"
        "$HOME/.local/bin/go"
        "/usr/local/go/bin/go"
        "/usr/bin/go"
        "/opt/go/bin/go"
        "/snap/bin/go"
        "$HOME/.go/bin/go"
    )
    
    for path in "${go_paths[@]}"; do
        if [ -x "$path" ]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Function to find bun binary
find_bun() {
    # Check if bun is already in PATH
    if command -v bun &> /dev/null; then
        echo "$(command -v bun)"
        return 0
    fi
    
    # Common bun installation locations
    local bun_paths=(
        "$HOME/.bun/bin/bun"
        "$HOME/.local/bin/bun"
        "/usr/local/bin/bun"
        "/usr/bin/bun"
        "/opt/bun/bin/bun"
        "$HOME/bin/bun"
    )
    
    for path in "${bun_paths[@]}"; do
        if [ -x "$path" ]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Function to find bunx binary
find_bunx() {
    # Check if bunx is already in PATH
    if command -v bunx &> /dev/null; then
        echo "$(command -v bunx)"
        return 0
    fi
    
    # Common bunx installation locations
    local bunx_paths=(
        "$HOME/.bun/bin/bunx"
        "$HOME/.local/bin/bunx"
        "/usr/local/bin/bunx"
        "/usr/bin/bunx"
        "/opt/bun/bin/bunx"
        "$HOME/bin/bunx"
    )
    
    for path in "${bunx_paths[@]}"; do
        if [ -x "$path" ]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Function to find ags binary
find_ags() {
    # Check if ags is already in PATH
    if command -v ags &> /dev/null; then
        echo "$(command -v ags)"
        return 0
    fi
    
    # Common ags installation locations
    local ags_paths=(
        "$HOME/go/bin/ags"
        "$HOME/.local/bin/ags"
        "/usr/local/bin/ags"
        "/usr/bin/ags"
        "/opt/ags/bin/ags"
        "$HOME/bin/ags"
    )
    
    for path in "${ags_paths[@]}"; do
        if [ -x "$path" ]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Find required binaries
GO_BIN=$(find_go)
BUN_BIN=$(find_bun)
BUNX_BIN=$(find_bunx)
AGS_BIN=$(find_ags)

# Log output for debugging
exec &> >(tee -a /tmp/ags-dev.log)
echo "=== AGS Dev Script Started at $(date) ==="
echo "PWD: $(pwd)"
echo "PATH: $PATH"
echo "USER: $USER"
echo "HOME: $HOME"

# go to ags directory
cd "$(dirname "$0")" || exit 1
echo "Changed to directory: $(pwd)"

# Source user's bash profile to get full environment
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

# This script is used to run the development server.
export GSK_RENDERER=ngl
export GDK_BACKEND=wayland
export LAYER_SHELL_ENABLE=1

# Add binary directories to PATH if they exist
if [ -n "$GO_BIN" ]; then
    export PATH="$(dirname "$GO_BIN"):$PATH"
fi
if [ -n "$BUN_BIN" ]; then
    export PATH="$(dirname "$BUN_BIN"):$PATH"
fi

# Check if required commands were found
if [ -z "$BUNX_BIN" ]; then
    echo "bunx not found in common locations"
    echo "Searched locations: ~/.bun/bin, ~/.local/bin, /usr/local/bin, /usr/bin, /opt/bun/bin, ~/bin"
    notify-send "AGS Error" "bunx not found in common locations"
    exit 1
fi

if [ -z "$AGS_BIN" ]; then
    echo "ags not found in common locations"
    echo "Searched locations: ~/go/bin, ~/.local/bin, /usr/local/bin, /usr/bin, /opt/ags/bin, ~/bin"
    notify-send "AGS Error" "ags not found in common locations"
    exit 1
fi

echo "Found binaries:"
echo "  go: ${GO_BIN:-not found}"
echo "  bun: ${BUN_BIN:-not found}"
echo "  bunx: $BUNX_BIN"
echo "  ags: $AGS_BIN"

# Run the commands
echo "Running tailwindcss..."
"$BUNX_BIN" tailwindcss -i ./input.css -o ./src/output.css || {
    echo "tailwindcss failed"
    notify-send "AGS Error" "tailwindcss compilation failed"
    exit 1
}

echo "Running tailwind-patch..."
./scripts/tailwind-patch.js ./src/output.css || {
    echo "tailwind-patch failed"
    notify-send "AGS Error" "tailwind-patch failed"
    exit 1
}

./scripts/fix-gtk4-css.js ./src/output.css || {
    echo "fix-gtk4-css failed"
    notify-send "AGS Error" "fix-gtk4-css failed"
    exit 1
}

# Kill all existing AGS/GJS processes to ensure clean start
echo "Killing existing AGS/GJS processes..."

# Kill AGS processes
killall -9 ags 2>/dev/null || true

# Kill GJS processes
killall -9 gjs 2>/dev/null || true

# Kill any python processes related to Apple TV scripts
pkill -f "apple-tv.*\.py" 2>/dev/null || true

# Kill swaync which prevents ags from starting
killall swaync 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 1

# Double-check and force kill any remaining AGS-related processes
for pid in $(pgrep -f "ags.*app\.ts"); do
    kill -9 $pid 2>/dev/null || true
done

# Kill any remaining gjs processes that might be AGS-related
for pid in $(pgrep -f "gjs.*ags"); do
    kill -9 $pid 2>/dev/null || true
done

echo "Cleanup complete"

# Applys the mouse and other cursor themes
nwg-look -a 

echo "Starting AGS..."

# Trap to cleanup on script exit
trap 'echo "Dev script interrupted, cleaning up..."; killall -9 ags 2>/dev/null; killall -9 gjs 2>/dev/null; pkill -f "apple-tv.*\.py" 2>/dev/null' EXIT INT TERM

"$AGS_BIN" run --gtk4 ./src/app.ts || {
    echo "AGS failed to start"
    # Clean up any processes that might have been started
    killall -9 ags 2>/dev/null || true
    killall -9 gjs 2>/dev/null || true
    pkill -f "apple-tv.*\.py" 2>/dev/null || true
    swaync 
    notify-send "AGS Error" "AGS failed to start"
    exit 1
}

