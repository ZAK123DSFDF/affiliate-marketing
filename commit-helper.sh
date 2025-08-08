#!/bin/bash

# Custom HEX Colors (RGB format for ANSI)
MODIFIED_COLOR='\033[38;2;104;151;187m'     # #6897BB (modified)
CREATED_COLOR='\033[38;2;98;151;85m'        # #629755 (created)
DELETED_COLOR='\033[38;2;108;108;108m'      # #6C6C6C (deleted)
NC='\033[0m'  # No Color

# Get Git unstaged changes
MODIFIED_FILES=$(git diff --name-only --diff-filter=M 2>/dev/null)
DELETED_FILES=$(git diff --name-only --diff-filter=D 2>/dev/null)
UNTRACKED_FILES=$(git ls-files --others --exclude-standard 2>/dev/null)

# Display header
echo -e "\n\033[1m🔍 Git Changes Preview (Unstaged)\033[0m"

# 1. Modified Files
if [ -n "$MODIFIED_FILES" ]; then
  echo -e "\n${MODIFIED_COLOR}• Modified Files:${NC}"
  echo "$MODIFIED_FILES" | awk -v color="$MODIFIED_COLOR" -v reset="$NC" '{print color " - " $0 reset}'
fi

# 2. Deleted Files
if [ -n "$DELETED_FILES" ]; then
  echo -e "\n${DELETED_COLOR}• Deleted Files:${NC}"
  echo "$DELETED_FILES" | awk -v color="$DELETED_COLOR" -v reset="$NC" '{print color " - " $0 reset}'
fi

# (Do NOT show untracked files here visually)

# 3. Suggested Commit Message
if [ -n "$MODIFIED_FILES$DELETED_FILES$UNTRACKED_FILES" ]; then
  echo -e "\n\033[1m💬 Suggested Commit Message:\033[0m"

  if [ -n "$MODIFIED_FILES" ]; then
    echo -e "${MODIFIED_COLOR}Update:$(echo "$MODIFIED_FILES" | wc -l) file(s)${NC}"
  fi

  if [ -n "$UNTRACKED_FILES" ]; then
    echo -e "${CREATED_COLOR}Add:$(echo "$UNTRACKED_FILES" | wc -l) file(s)${NC}"
  fi

  if [ -n "$DELETED_FILES" ]; then
    echo -e "${DELETED_COLOR}Remove:$(echo "$DELETED_FILES" | wc -l) file(s)${NC}"
  fi
else
  echo -e "\n\033[33m⚠️ No unstaged or untracked changes detected.${NC}"
fi
