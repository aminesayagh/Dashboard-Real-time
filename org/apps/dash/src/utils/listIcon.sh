#!/bin/bash

# array of icons folder 
ICONS=("Outline" "Solid")


# Set the directory containing the icons
ICON_DIR="./public/icons/Outline"
OUTPUT_FILE="./public/icons/IconsList.tsx"

for file in "$ICON_DIR"/*\ *; do
  # remove the space in the filename, and replace it with an underscore, same for - and any other special characters
  mv "$file" "${file// /_}"
  mv "$file" "${file//-/_}"
done

# Remove the existing file
rm -f $OUTPUT_FILE

# Add the import statement
echo "import React from 'react';" >>$OUTPUT_FILE
echo "" >>$OUTPUT_FILE


for file in $ICON_DIR/*.svg; do
    filename=$(basename $file) # Get the filename
    name_with_extension="${filename}" # Get the filename with extension
    name="${filename%.*}" # Get the filename without extension
    echo "export { default as $name } from './Outline/$name_with_extension';" >>$OUTPUT_FILE
done

echo "Icons list generated in $OUTPUT_FILE"