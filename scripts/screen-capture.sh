#!/bin/env bash

# Script name
SCRIPT_NAME=$(basename "$0")

# Function to display usage
usage() {
  cat << EOF
Usage: $SCRIPT_NAME <command> [options]

Commands:
  screenshot <target>     Take a screenshot
    Targets:
      selection            - Screenshot selected area
      eDP-1               - Screenshot eDP-1 display
      HDMI-A-1            - Screenshot HDMI-A-1 display
      both                - Screenshot both displays

  record <target>        Start/stop recording
    Targets:
      selection           - Record selected area
      eDP-1              - Record eDP-1 display
      HDMI-A-1           - Record HDMI-A-1 display
      stop               - Stop current recording

  status                 Check if recording is active (exit 0 if recording, 1 if not)

  convert <format>       Convert recordings
    Formats:
      webm               - Convert MKV files to WebM
      iphone             - Convert MKV files for iPhone

Examples:
  $SCRIPT_NAME screenshot selection
  $SCRIPT_NAME record eDP-1
  $SCRIPT_NAME record stop
  $SCRIPT_NAME convert webm

EOF
  exit 1
}

# Check if no arguments provided
if [ $# -eq 0 ]; then
  usage
fi

wf-recorder_check() {
  if pgrep -x "wf-recorder" >/dev/null; then
    pkill -INT -x wf-recorder
    notify-send "Stopping all instances of wf-recorder" "$(cat /tmp/recording.txt)"
    wl-copy <"$(cat /tmp/recording.txt)"
    exit 0
  fi
}

# Function to record with standard settings
record_video() {
  local output_file="$1"
  shift
  
  wf-recorder "$@" -f "$output_file" -c libvpx-vp9 --pixel-format yuv420p -F "eq=brightness=0.12:contrast=1.1"
}

# Parse command
COMMAND="$1"
TARGET="$2"

# Set up file paths
IMG="${HOME}/Pictures/Screenshots/$(date +%Y-%m-%d_%H-%m-%s).png"
VID="${HOME}/Videos/Recordings/$(date +%Y-%m-%d_%H-%m-%s).mkv"

case "$COMMAND" in
  "screenshot")
    case "$TARGET" in
      "selection")
        grim -g "$(slurp)" "$IMG"
        wl-copy <"$IMG"
        notify-send "Screenshot Taken" -i "${IMG}"
        ;;
      "eDP-1")
        grim -c -o eDP-1 "$IMG"
        wl-copy <"$IMG"
        notify-send "Screenshot Taken" -i "${IMG}"
        ;;
      "HDMI-A-1")
        grim -c -o HDMI-A-1 "$IMG"
        wl-copy <"$IMG"
        notify-send "Screenshot Taken" -i "${IMG}"
        ;;
      "both")
        grim -c -o eDP-1 "${IMG//.png/-eDP-1.png}"
        grim -c -o HDMI-A-1 "${IMG//.png/-HDMI-A-1.png}"
        montage "${IMG//.png/-eDP-1.png}" "${IMG//.png/-HDMI-A-1.png}" -tile 2x1 -geometry +0+0 "$IMG"
        wl-copy <"$IMG"
        rm "${IMG//.png/-eDP-1.png}" "${IMG//.png/-HDMI-A-1.png}"
        notify-send "Screenshot Taken" -i "${IMG}"
        ;;
      *)
        echo "Error: Invalid screenshot target '$TARGET'"
        usage
        ;;
    esac
    ;;
  
  "record")
    case "$TARGET" in
      "stop")
        wf-recorder_check
        ;;
      "selection")
        wf-recorder_check
        echo "$VID" >/tmp/recording.txt
        record_video "$VID" -g "$(slurp)"
        ;;
      "eDP-1")
        wf-recorder_check
        echo "$VID" >/tmp/recording.txt
        record_video "$VID" -a -o eDP-1
        ;;
      "HDMI-A-1")
        wf-recorder_check
        echo "$VID" >/tmp/recording.txt
        record_video "$VID" -a -o HDMI-A-1
        ;;
      *)
        echo "Error: Invalid record target '$TARGET'"
        usage
        ;;
    esac
    ;;
  
  "status")
    # Check if wf-recorder is running
    if pgrep -x "wf-recorder" >/dev/null; then
     echo "true" 
      exit 0  
    else
      echo "false"
      exit 0  
    fi
    ;;
  
  "convert")
    case "$TARGET" in
      "webm")
        # Check if ffmpeg is installed
        if ! command -v ffmpeg >/dev/null 2>&1; then
          notify-send "Error" "ffmpeg is not installed. Please install it to use this feature."
          exit 1
        fi

        RECORDING_DIR="${HOME}/Videos/Recordings"
        CONVERTED=0
        TOTAL=0
        
        for mkv_file in "${RECORDING_DIR}"/*.mkv; do
          if [ -f "$mkv_file" ]; then
            TOTAL=$((TOTAL+1))
            webm_file="${mkv_file%.mkv}.webm"
            
            # Check if webm version doesn't already exist
            if [ ! -f "$webm_file" ]; then
              # Simpler ffmpeg command with basic settings
              ffmpeg -y -i "$mkv_file" -c:v libvpx -b:v 1M -c:a libvorbis "$webm_file" 2>/tmp/ffmpeg_error.log
              
              if [ $? -eq 0 ]; then
                CONVERTED=$((CONVERTED+1))
                notify-send "Converted to WebM" "$(basename "$mkv_file")"
              else
                error=$(cat /tmp/ffmpeg_error.log | tail -n 5)
                notify-send "Conversion Failed" "Error: $error"
              fi
            fi
          fi
        done
        
        if [ $TOTAL -eq 0 ]; then
          notify-send "WebM Conversion" "No MKV files found in Recordings folder"
        else
          notify-send "WebM Conversion Complete" "Converted $CONVERTED out of $TOTAL MKV files"
        fi
        ;;

      "iphone")
        # Check if ffmpeg is installed
        if ! command -v ffmpeg >/dev/null 2>&1; then
          notify-send "Error" "ffmpeg is not installed. Please install it to use this feature."
          exit 1
        fi

        RECORDING_DIR="${HOME}/Videos/Recordings"
        CONVERTED=0
        SKIPPED_IPHONE=0
        SKIPPED_EXISTING=0
        TOTAL_FILES=0
        
        for mkv_file in "${RECORDING_DIR}"/*.mkv; do
          if [ -f "$mkv_file" ]; then
            TOTAL_FILES=$((TOTAL_FILES+1))
            base_filename=$(basename "$mkv_file")
            
            # Skip files with "iphone" in the filename
            if [[ $base_filename == *"iphone"* ]]; then
              SKIPPED_IPHONE=$((SKIPPED_IPHONE+1))
              continue
            fi
            
            iphone_file="${mkv_file%.mkv}-iphone.mp4"
            
            # Check if iPhone version doesn't already exist
            if [ ! -f "$iphone_file" ]; then
              # Simpler ffmpeg command for iPhone compatibility
              ffmpeg -y -i "$mkv_file" -vcodec h264 -acodec aac "$iphone_file" 2>/tmp/ffmpeg_error.log
              
              if [ $? -eq 0 ]; then
                CONVERTED=$((CONVERTED+1))
                notify-send "Converted for iPhone" "$(basename "$mkv_file")"
              else
                error=$(cat /tmp/ffmpeg_error.log | tail -n 5)
                notify-send "Conversion Failed" "Error: $error"
              fi
            else
              SKIPPED_EXISTING=$((SKIPPED_EXISTING+1))
            fi
          fi
        done
        
        if [ $TOTAL_FILES -eq 0 ]; then
          notify-send "iPhone Conversion" "No MKV files found in Recordings folder"
        else
          notify-send "iPhone Conversion Complete" "Converted: $CONVERTED files
Skipped (already iPhone): $SKIPPED_IPHONE files
Skipped (has iPhone version): $SKIPPED_EXISTING files
Total files checked: $TOTAL_FILES"
        fi
        ;;
      
      *)
        echo "Error: Invalid convert format '$TARGET'"
        usage
        ;;
    esac
    ;;
  
  *)
    echo "Error: Invalid command '$COMMAND'"
    usage
    ;;
esac
