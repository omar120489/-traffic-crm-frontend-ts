#!/bin/bash
# Generate batch-3 file list for PropTypes → TypeScript migration
# Excludes already-migrated batch-1 and batch-2 files

set -euo pipefail

ROOT="apps/frontend/src"
OUT="scripts/batches/batch-3-files.txt"

# Actually-migrated files (only files that have been converted to .tsx)
EXCLUDE_LIST=(
  # Batch-2 completed (actually converted)
  "layout/MainLayout/Header/MegaMenuSection/index.jsx"
)

mkdir -p "$(dirname "$OUT")"

echo "🔍 Scanning for PropTypes usage in remaining .jsx files..."
echo "📋 Excluding only actually-converted files (MegaMenuSection)"

# Find PropTypes usage in .jsx files (excluding completed batches)
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

echo "✅ Found $FILE_COUNT files with PropTypes for batch-3"
echo "📝 Written to: $OUT"
echo ""
echo "📄 Batch-3 Files Preview:"
echo "========================"
cat "$OUT"

echo ""
echo "🧪 Next Steps:"
echo "  1. Review files: cat $OUT"
echo "  2. Run dry-run: ./scripts/run-proptypes-batch.sh $OUT batch-3 dry-run"
echo "  3. Apply changes: ./scripts/run-proptypes-batch.sh $OUT batch-3 apply"
echo ""
echo "🎯 Batch-3 Ready for Migration!"