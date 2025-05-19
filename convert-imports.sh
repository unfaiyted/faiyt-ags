#!/bin/bash

# Function to update a file with the right imports
update_file() {
  local file="$1"
  
  # Use sed to replace astal/gtk4 imports with gi:// imports
  sed -i 's/import { \([^}]*\) } from "astal\/gtk4";/import Astal from "gi:\/\/Astal";\nconst { \1 } = Astal;/g' "$file"
  
  # Use sed to replace astal imports
  sed -i 's/import { \([^}]*\) } from "astal";/import Astal from "gi:\/\/Astal";\nconst { \1 } = Astal;/g' "$file"
  
  # Print the file that was updated
  echo "Updated $file"
}

# Update the app.ts file
update_file "src/app.ts"

# Update Bar component
update_file "src/widget/bar/index.tsx"

# Find all other tsx and ts files for updating
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | while read -r file; do
  update_file "$file"
done

echo "Import conversion complete!"