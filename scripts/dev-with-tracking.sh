#!/bin/bash

# Development script with enhanced error tracking

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Starting AGS with enhanced error tracking...${NC}"

# Build CSS
echo -e "${BLUE}Building CSS...${NC}"
bunx tailwindcss -i ./input.css -o ./src/output.css

# Apply CSS patches
./scripts/tailwind-patch.js ./src/output.css

# Get the absolute path to the config directory
CONFIG_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Create a wrapper script that injects error tracking
cat > /tmp/ags-error-wrapper.ts << EOF
// Auto-generated wrapper for error tracking
import '${CONFIG_DIR}/src/utils/error-tracker';
import '${CONFIG_DIR}/src/app';
EOF

# Run AGS with error tracking
echo -e "${GREEN}Starting AGS...${NC}"
echo -e "${YELLOW}Errors will be logged with source locations${NC}"

# Run AGS and pipe through error enhancement
ags run --gtk4 /tmp/ags-error-wrapper.ts 2>&1 | while IFS= read -r line; do
    # Check if line contains error patterns
    if [[ "$line" =~ "ERROR" ]] || [[ "$line" =~ "Error:" ]] || [[ "$line" =~ "TypeError" ]]; then
        echo -e "${RED}$line${NC}"
        
        # Extract file location if present
        if [[ "$line" =~ ([^[:space:]]+\.(ts|tsx)):([0-9]+) ]]; then
            file="${BASH_REMATCH[1]}"
            line_num="${BASH_REMATCH[2]}"
            echo -e "${CYAN}  → Source: $file:$line_num${NC}"
        fi
    elif [[ "$line" =~ "WARN" ]]; then
        echo -e "${YELLOW}$line${NC}"
    else
        echo "$line"
    fi
done

# Cleanup
rm -f /tmp/ags-error-wrapper.ts