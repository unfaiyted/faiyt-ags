#!/bin/bash
# Test Apple TV integration scripts

echo "Testing Apple TV integration..."

# Test discover command
echo "Testing discover command..."
python3 /home/faiyt/.config/ags/scripts/remote-control/apple-tv.py discover

# Test fast script
echo -e "\nTesting fast script (should show error for no device configured)..."
python3 /home/faiyt/.config/ags/scripts/remote-control/apple-tv-fast.py up

echo -e "\nTest complete!"