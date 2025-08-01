#!/bin/bash

# Colors
MODIFIED_COLOR='\033[38;2;104;151;187m'    # #6897BB
CREATED_COLOR='\033[38;2;98;151;85m'       # #629755
DELETED_COLOR='\033[38;2;108;108;108m'     # #6C6C6C
NC='\033[0m'                                # Reset

# Detect files
MODIFIED_FILES=$(git ls-files -m)


# Header
echo -e "\n\033[1m🔍 Git File Changes Summary\033[0m"

# Modified
if [ -n "$MODIFIED_FILES" ]; then
  echo -e "\n${MODIFIED_COLOR}• Modified Files:${NC}"
  echo "$MODIFIED_FILES" | awk -v color="$MODIFIED_COLOR" -v reset="$NC" '{print color " - " $0 reset}'
fi

# Created (Untracked)
if [ -n "$CREATED_FILES" ]; then
  echo -e "\n${CREATED_COLOR}• New Files (Untracked):${NC}"
  echo "$CREATED_FILES" | awk -v color="$CREATED_COLOR" -v reset="$NC" '{print color " - " $0 reset}'
fi

# Deleted
if [ -n "$DELETED_FILES" ]; then
  echo -e "\n${DELETED_COLOR}• Deleted Files:${NC}"
  echo "$DELETED_FILES" | awk -v color="$DELETED_COLOR" -v reset="$NC" '{print color " - " $0 reset}'
fi

# Nothing changed
if [ -z "$MODIFIED_FILES$CREATED_FILES$DELETED_FILES" ]; then
  echo -e "\n\033[33m⚠️  No modified, new, or deleted files.\033[0m"
fi
