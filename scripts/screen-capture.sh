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

  record-hq <target>     Start/stop high-quality recording (for YouTube)
    Targets:
      selection           - Record selected area in high quality
      eDP-1              - Record eDP-1 display in high quality
      HDMI-A-1           - Record HDMI-A-1 display in high quality
      stop               - Stop current recording

  status                 Check if recording is active (exit 0 if recording, 1 if not)

  convert <format>       Convert recordings
    Formats:
      webm               - Convert MKV files to WebM
      iphone             - Convert MKV files for iPhone
      youtube            - Convert MKV files for YouTube (high quality)

Examples:
  $SCRIPT_NAME screenshot selection
  $SCRIPT_NAME record eDP-1
  $SCRIPT_NAME record-hq eDP-1
  $SCRIPT_NAME record stop
  $SCRIPT_NAME convert youtube

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

record_high_quality() {
  local output_file="$1"
  shift
  
  # High quality settings for YouTube uploads
  # - h264_vaapi for hardware encoding (if available) or libx264 for software
  # - yuv420p pixel format for maximum compatibility
  # - High bitrate (8000k) for quality
  # - GOP size of 30 for better seeking
  # - Preset 'slow' for better compression efficiency
  # - CRF 18 for high quality (lower = better quality, 0-51 scale)
  # - Audio at 192k bitrate
  # - 60 FPS for smooth motion
  # - No color filters to maintain original colors
  
  # Check if VAAPI hardware encoding is available
  if vainfo &>/dev/null && wf-recorder --help | grep -q "h264_vaapi"; then
    # Use hardware encoding for better performance
    wf-recorder "$@" -f "$output_file" \
      -c h264_vaapi \
      -p "preset=slow" \
      -p "crf=18" \
      -r 60 \
      -b 8000000 \
      -B 192000 \
      --pixel-format yuv420p \
      -g 30
  else
    # Fallback to software encoding
    wf-recorder "$@" -f "$output_file" \
      -c libx264 \
      -p "preset=slow" \
      -p "crf=18" \
      -r 60 \
      -b 8000000 \
      -B 192000 \
      --pixel-format yuv420p \
      -g 30
  fi
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
  
  "record-hq")
    # Change file extension to mp4 for high quality recordings
    VID_HQ="${HOME}/Videos/Recordings/$(date +%Y-%m-%d_%H-%m-%s)-hq.mp4"
    
    case "$TARGET" in
      "stop")
        wf-recorder_check
        ;;
      "selection")
        wf-recorder_check
        echo "$VID_HQ" >/tmp/recording.txt
        notify-send "High Quality Recording" "Starting YouTube-quality recording..."
        record_high_quality "$VID_HQ" -g "$(slurp)"
        ;;
      "eDP-1")
        wf-recorder_check
        echo "$VID_HQ" >/tmp/recording.txt
        notify-send "High Quality Recording" "Starting YouTube-quality recording on eDP-1..."
        record_high_quality "$VID_HQ" -a -o eDP-1
        ;;
      "HDMI-A-1")
        wf-recorder_check
        echo "$VID_HQ" >/tmp/recording.txt
        notify-send "High Quality Recording" "Starting YouTube-quality recording on HDMI-A-1..."
        record_high_quality "$VID_HQ" -a -o HDMI-A-1
        ;;
      *)
        echo "Error: Invalid record-hq target '$TARGET'"
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

      "youtube")
        # Check if ffmpeg is installed
        if ! command -v ffmpeg >/dev/null 2>&1; then
          notify-send "Error" "ffmpeg is not installed. Please install it to use this feature."
          exit 1
        fi

        RECORDING_DIR="${HOME}/Videos/Recordings"
        CONVERTED=0
        SKIPPED_YOUTUBE=0
        SKIPPED_EXISTING=0
        TOTAL_FILES=0
        
        # Process both MKV and MP4 files
        for video_file in "${RECORDING_DIR}"/*.{mkv,mp4}; do
          if [ -f "$video_file" ]; then
            TOTAL_FILES=$((TOTAL_FILES+1))
            base_filename=$(basename "$video_file")
            
            # Skip files already marked as YouTube uploads
            if [[ $base_filename == *"youtube"* ]]; then
              SKIPPED_YOUTUBE=$((SKIPPED_YOUTUBE+1))
              continue
            fi
            
            # Create YouTube optimized filename
            youtube_file="${video_file%.*}-youtube.mp4"
            
            # Check if YouTube version doesn't already exist
            if [ ! -f "$youtube_file" ]; then
              notify-send "Converting for YouTube" "Processing: $(basename "$video_file")"
              
              # YouTube recommended settings:
              # - H.264 codec with High profile
              # - 1080p or source resolution
              # - 60fps or source framerate
              # - High bitrate for quality (8-12 Mbps for 1080p60)
              # - AAC audio at 384kbps
              # - yuv420p pixel format for compatibility
              # - Keyframe interval of 2 seconds (GOP)
              # - No filters to preserve original colors
              
              ffmpeg -y -i "$video_file" \
                -c:v libx264 \
                -profile:v high \
                -preset slow \
                -crf 18 \
                -pix_fmt yuv420p \
                -c:a aac \
                -b:a 384k \
                -movflags +faststart \
                "$youtube_file" 2>/tmp/ffmpeg_error.log
              
              if [ $? -eq 0 ]; then
                CONVERTED=$((CONVERTED+1))
                file_size=$(du -h "$youtube_file" | cut -f1)
                notify-send "YouTube Conversion Success" "$(basename "$video_file") → $(basename "$youtube_file") ($file_size)"
              else
                error=$(cat /tmp/ffmpeg_error.log | tail -n 5)
                notify-send "YouTube Conversion Failed" "Error converting $(basename "$video_file"): $error"
              fi
            else
              SKIPPED_EXISTING=$((SKIPPED_EXISTING+1))
            fi
          fi
        done
        
        if [ $TOTAL_FILES -eq 0 ]; then
          notify-send "YouTube Conversion" "No video files found in Recordings folder"
        else
          notify-send "YouTube Conversion Complete" "Converted: $CONVERTED files
Skipped (already YouTube): $SKIPPED_YOUTUBE files
Skipped (has YouTube version): $SKIPPED_EXISTING files
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
