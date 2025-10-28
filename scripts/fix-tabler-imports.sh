#!/usr/bin/env bash
# Fix Tabler Icons Import Refactor Script
# Converts direct @tabler/icons-react imports to @/icons alias pattern
# 
# This script:
# - Finds all files importing from @tabler/icons-react
# - Rewrites imports to use the unified @/icons wrapper
# - Handles both named and deep path imports
# - Creates backup files for safety (.bak extension)
# - Provides detailed progress output

set -euo pipefail

ROOT="apps/frontend/src"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 Scanning for @tabler/icons-react imports in $ROOT..."

cd "$PROJECT_ROOT"

# Find all files with @tabler/icons-react imports
if command -v rg &> /dev/null; then
    echo "Using ripgrep for search"
    FILES_TO_FIX=$(rg -l "@tabler/icons-react" "$ROOT" 2>/dev/null || true)
else
    echo "Using grep for search (ripgrep not available)"
    FILES_TO_FIX=$(grep -r -l --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' "@tabler/icons-react" "$ROOT" 2>/dev/null || true)
fi

if [ -z "$FILES_TO_FIX" ]; then
    echo "✅ No @tabler/icons-react imports found. Nothing to fix."
    exit 0
fi

FILE_COUNT=$(echo "$FILES_TO_FIX" | wc -l | tr -d ' ')
echo "📁 Found $FILE_COUNT files with @tabler/icons-react imports"

echo ""
echo "🧹 Starting import refactor..."

# Counter for progress
counter=0

while IFS= read -r file; do
    if [ -n "$file" ]; then
        counter=$((counter + 1))
        echo "[$counter/$FILE_COUNT] 🔧 $file"
        
        # Create backup
        cp "$file" "${file}.bak"
        
        # Replace @tabler/icons-react with @/icons
        # Handle both standard imports and deep path imports
        sed -i.tmp \
            -e "s|from '@tabler/icons-react'|from '@/icons'|g" \
            -e "s|from \"@tabler/icons-react\"|from \"@/icons\"|g" \
            -e "s|from '@tabler/icons-react/.*'|from '@/icons'|g" \
            -e "s|from \"@tabler/icons-react/.*\"|from \"@/icons\"|g" \
            "$file"
        
        # Remove the .tmp file created by sed
        rm -f "${file}.tmp"
        
        # Show what changed (optional - can be commented out for cleaner output)
        if ! diff -q "${file}.bak" "$file" > /dev/null 2>&1; then
            echo "   ✓ Updated imports"
        else
            echo "   ⚠ No changes needed"
            # Remove backup if no changes were made
            rm -f "${file}.bak"
        fi
    fi
done <<< "$FILES_TO_FIX"

echo ""
echo "✅ Import refactor complete!"
echo "📋 Summary:"
echo "   - Processed: $FILE_COUNT files"
echo "   - Backup files: ${file}.bak (review and clean up)"
echo ""
echo "🧪 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Run linting: pnpm --filter ./apps/frontend lint"
echo "   3. Run typecheck: pnpm --filter ./apps/frontend typecheck"
echo "   4. Clean backups: find $ROOT -name '*.bak' -delete"
echo ""
echo "🚀 Ready for clean PropTypes migration batches!"