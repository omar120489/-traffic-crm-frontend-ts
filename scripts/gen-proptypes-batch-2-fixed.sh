#!/bin/bash
set -euo pipefail

ROOT="apps/frontend/src"
OUT="scripts/batches/batch-2-files.txt"

# Already-converted files from batch-1
EXCLUDE_LIST=(
  "layout/MainLayout/Header/ProfileSection/index.jsx"
  "layout/MainLayout/Header/SearchSection/MobileSearch.jsx" 
  "layout/MainLayout/Header/SearchSection/index.jsx"
  "layout/MainLayout/LogoSection/index.jsx"
  "layout/MainLayout/HorizontalBar.jsx"
  "layout/MainLayout/Sidebar/MenuCard/index.jsx"
  "layout/NavMotion.jsx"
  "views/pages/authentication/jwt/AuthForgotPassword.jsx"
  "views/pages/authentication/jwt/AuthResetPassword.jsx"
  "views/pages/maintenance/ComingSoon/ComingSoon1/Slider.jsx"
)

mkdir -p "$(dirname "$OUT")"

echo "🔍 Scanning for PropTypes usage in legacy .jsx files..."

# Find PropTypes usage in .jsx files (excluding batch-1 files)
> "$OUT"  # Clear output file

find "$ROOT" -name "*.jsx" -type f | while read -r file; do
  relative_path="${file#$ROOT/}"
  
  # Skip if this file is in the exclude list
  skip=false
  for exclude_file in "${EXCLUDE_LIST[@]}"; do
    if [[ "$relative_path" == "$exclude_file" ]]; then
      skip=true
      break
    fi
  done
  
  if [[ "$skip" == "false" ]]; then
    # Check if file contains PropTypes usage
    if grep -q "from 'prop-types'\|\.propTypes" "$file" 2>/dev/null; then
      echo "$file" >> "$OUT"
    fi
  fi
done

# Sort and remove duplicates
sort -u "$OUT" -o "$OUT"

FILE_COUNT=$(wc -l < "$OUT" | tr -d ' ')

echo "✅ Found $FILE_COUNT files with PropTypes"
echo "📝 Written to: $OUT"
echo ""
echo "Preview:"
cat "$OUT"