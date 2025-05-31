#!/bin/bash

echo "📂 Mac File & Folder Opener"
echo "============================"
echo "This will open files and folders from your Desktop, Documents, and Downloads."

# Prompt the user for how many files/folders to open
read -p "Enter how many items you want to open per folder (1–9999): " MAX_ITEMS

# Validate input is a number between 1 and 9999
if ! [[ "$MAX_ITEMS" =~ ^[0-9]+$ ]] || [ "$MAX_ITEMS" -lt 1 ] || [ "$MAX_ITEMS" -gt 9999 ]; then
    echo "❌ Invalid number. Please enter a value between 1 and 9999."
    exit 1
fi

# Define target directories
base_dirs=("$HOME/Desktop" "$HOME/Documents" "$HOME/Downloads")

for base in "${base_dirs[@]}"; do
    echo "🔍 Searching in: $base"
    
    # Find files and directories, skipping hidden items
    items=$(find "$base" -mindepth 1 -maxdepth 2 ! -path '*/\.*' 2>/dev/null | head -n "$MAX_ITEMS")
    
    # Ask user to confirm opening for this folder
    read -p "Open $MAX_ITEMS items from $base? [Y/n] " confirm
    if [[ $confirm =~ ^[Nn]$ ]]; then
        echo "❌ Skipping $base"
        continue
    fi

    # Open each file/folder
    while IFS= read -r item; do
        echo "📂 Opening: $item"
        open "$item"
    done <<< "$items"

    echo "✅ Done with $base."
done

echo "🎉 All requested files/folders processed."
