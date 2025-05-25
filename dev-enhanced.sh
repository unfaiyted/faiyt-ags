#!/bin/bash

# Enhanced development script with better error output

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

# Run AGS with error tracking enabled
echo -e "${GREEN}Starting AGS...${NC}"
echo -e "${YELLOW}Errors will show TypeScript source locations${NC}"

# Enable enhanced logging and run AGS
LOG_LEVEL=DEBUG GSK_RENDERER=gl ags run --gtk4 ./src/app.ts 2>&1 | while IFS= read -r line; do
    # Check if line contains error patterns
    if [[ "$line" =~ "ERROR" ]] || [[ "$line" =~ "Error:" ]] || [[ "$line" =~ "TypeError" ]]; then
        echo -e "${RED}$line${NC}"
        
        # Extract TypeScript file location if present
        if [[ "$line" =~ ([^[:space:]]+\.(ts|tsx)):([0-9]+):?([0-9]+)? ]]; then
            file="${BASH_REMATCH[1]}"
            line_num="${BASH_REMATCH[2]}"
            col_num="${BASH_REMATCH[3]:-1}"
            
            # Make it clickable for VSCode
            echo -e "${CYAN}  → ${file}:${line_num}:${col_num}${NC}"
            
            # Show code context if file exists
            if [[ -f "$file" ]]; then
                echo -e "${CYAN}  Code context:${NC}"
                # Show 3 lines before and after
                start=$((line_num - 3))
                end=$((line_num + 3))
                if [ $start -lt 1 ]; then start=1; fi
                
                sed -n "${start},${end}p" "$file" | while IFS= read -r code_line; do
                    current_line=$((start++))
                    if [ $current_line -eq $line_num ]; then
                        echo -e "${YELLOW}  > ${current_line}: ${code_line}${NC}"
                    else
                        echo -e "    ${current_line}: ${code_line}"
                    fi
                done
            fi
        fi
    elif [[ "$line" =~ "WARN" ]]; then
        echo -e "${YELLOW}$line${NC}"
    elif [[ "$line" =~ "DEBUG" ]]; then
        echo -e "${BLUE}$line${NC}"
    else
        echo "$line"
    fi
done