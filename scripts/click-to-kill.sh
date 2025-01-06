#!/usr/bin/env bash

# This script allows clicking on a window to kill its process
# It uses hyprpicker-like selection for Hyprland

# Check if we're running under Wayland (Hyprland)
if [[ "$XDG_SESSION_TYPE" == "wayland" ]] || [[ -n "$WAYLAND_DISPLAY" ]]; then
    # Show notification
    notify-send "Kill Window" "Select a window to kill..." -t 2000
    
    # Use hyprctl to create a special mode for window selection
    # First, let's create a temporary keybind for window killing
    TEMP_SUBMAP="kill_window_mode"
    
    # Enter kill mode
    hyprctl dispatch submap "$TEMP_SUBMAP"
    
    # Create a script to handle the actual kill
    KILL_SCRIPT="/tmp/ags-kill-window-handler.sh"
    cat > "$KILL_SCRIPT" << 'EOF'
#!/bin/bash
# Get the window under cursor
WINDOW_INFO=$(hyprctl cursorpos -j | jq -r '"\(.x),\(.y)"')
X=$(echo $WINDOW_INFO | cut -d',' -f1)
Y=$(echo $WINDOW_INFO | cut -d',' -f2)

# Get window at position
WINDOW_AT_POS=$(hyprctl clients -j | jq -r --arg x "$X" --arg y "$Y" '.[] | select(.at[0] <= ($x|tonumber) and .at[0] + .size[0] >= ($x|tonumber) and .at[1] <= ($y|tonumber) and .at[1] + .size[1] >= ($y|tonumber)) | .pid' | head -1)

if [ -n "$WINDOW_AT_POS" ] && [ "$WINDOW_AT_POS" != "null" ]; then
    # Get window details for confirmation
    WINDOW_DETAILS=$(hyprctl clients -j | jq -r --arg pid "$WINDOW_AT_POS" '.[] | select(.pid == ($pid|tonumber)) | "\(.class) - \(.title)"' | head -1)
    
    # Kill the process
    kill -9 "$WINDOW_AT_POS"
    notify-send "Process Killed" "Killed: $WINDOW_DETAILS (PID: $WINDOW_AT_POS)"
else
    notify-send "Error" "No window found at cursor position" -u critical
fi

# Exit kill mode
hyprctl dispatch submap reset
EOF
    
    chmod +x "$KILL_SCRIPT"
    
    # Bind mouse click to kill action
    hyprctl keyword bind "$TEMP_SUBMAP,mouse:272,exec,$KILL_SCRIPT"
    hyprctl keyword bind "$TEMP_SUBMAP,mouse:273,exec,hyprctl dispatch submap reset && notify-send 'Cancelled' 'Window kill cancelled'"
    hyprctl keyword bind "$TEMP_SUBMAP,ESCAPE,submap,reset"
    
    # Clean up after a timeout
    (sleep 10 && hyprctl dispatch submap reset && rm -f "$KILL_SCRIPT") &
    
else
    # X11 fallback using xprop
    if ! command -v xprop &> /dev/null; then
        notify-send "Error" "xprop not found. Please install x11-utils" -u critical
        exit 1
    fi
    
    notify-send "Kill Window" "Click on any window to kill it..." -t 3000
    
    # Use xprop to select window and get its PID
    WINDOW_INFO=$(xprop -root | grep "^_NET_ACTIVE_WINDOW" | cut -d' ' -f5)
    
    # Let user select a window
    SELECTED_INFO=$(xprop -id $(xwininfo | grep "Window id:" | cut -d' ' -f4) _NET_WM_PID WM_CLASS WM_NAME 2>/dev/null)
    
    if [ -z "$SELECTED_INFO" ]; then
        notify-send "Error" "No window selected" -u critical
        exit 1
    fi
    
    # Extract PID
    PID=$(echo "$SELECTED_INFO" | grep "_NET_WM_PID" | cut -d'=' -f2 | tr -d ' ')
    CLASS=$(echo "$SELECTED_INFO" | grep "WM_CLASS" | cut -d'"' -f2)
    TITLE=$(echo "$SELECTED_INFO" | grep "WM_NAME" | cut -d'"' -f2)
    
    if [ -n "$PID" ] && [ "$PID" -gt 0 ]; then
        # Confirm before killing
        if command -v zenity &> /dev/null; then
            zenity --question --text="Kill process '$CLASS' (PID: $PID)?\n\nWindow: $TITLE" --title="Confirm Kill"
            if [ $? -eq 0 ]; then
                kill -9 "$PID"
                notify-send "Process Killed" "Successfully killed $CLASS (PID: $PID)"
            else
                notify-send "Cancelled" "Process kill cancelled"
            fi
        else
            # No zenity, kill directly but notify
            kill -9 "$PID"
            notify-send "Process Killed" "Successfully killed $CLASS (PID: $PID)"
        fi
    else
        notify-send "Error" "Could not get PID for window" -u critical
        exit 1
    fi
fi