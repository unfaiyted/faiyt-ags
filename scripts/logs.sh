#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Timestamp for the log file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="logs/ags_$TIMESTAMP.log"

echo "================================================================="
echo "Running AGS with enhanced debugging - Logs saved to: $LOG_FILE"
echo "================================================================="

# Run AGS with full debugging and save output to log file
GJS_DEBUG=all GJS_ENABLE_TRACING=1 GJS_DEBUG_OUTPUT=stderr GJS_DEBUG_TOPICS="JS ERROR;JS LOG" ags run src/app.ts 2>&1 | tee "$LOG_FILE"

echo "================================================================="
echo "Log saved to: $LOG_FILE"
echo "================================================================="