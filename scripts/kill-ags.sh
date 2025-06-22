#!/bin/bash
# Kill all AGS and related processes

echo "Killing all AGS and related processes..."

# Kill AGS processes
echo "- Killing AGS processes..."
killall -9 ags 2>/dev/null || true

# Kill GJS processes
echo "- Killing GJS processes..."
killall -9 gjs 2>/dev/null || true

# Kill any python processes related to Apple TV scripts
echo "- Killing Apple TV Python scripts..."
pkill -f "apple-tv.*\.py" 2>/dev/null || true

# Kill any node/bun processes that might be related
echo "- Killing any related node processes..."
pkill -f "ags.*dev" 2>/dev/null || true

# Kill swaync if present
echo "- Killing swaync..."
killall swaync 2>/dev/null || true

# Wait for processes to die
sleep 0.5

# More aggressive cleanup - find and kill by command line patterns
echo "- Performing aggressive cleanup..."

# Find AGS-related processes by command line
for pid in $(ps aux | grep -E "(ags|gjs).*app\.ts" | grep -v grep | awk '{print $2}'); do
    echo "  Killing PID $pid"
    kill -9 $pid 2>/dev/null || true
done

# Find any lingering python service processes
for pid in $(ps aux | grep -E "python.*apple-tv" | grep -v grep | awk '{print $2}'); do
    echo "  Killing Python PID $pid"
    kill -9 $pid 2>/dev/null || true
done

# Final check
remaining=$(pgrep -c "ags|gjs" 2>/dev/null || echo 0)
if [ "$remaining" -gt 0 ]; then
    echo "Warning: $remaining AGS/GJS processes may still be running"
    echo "Running processes:"
    ps aux | grep -E "(ags|gjs)" | grep -v grep
else
    echo "All AGS processes successfully terminated"
fi

echo "Cleanup complete!"