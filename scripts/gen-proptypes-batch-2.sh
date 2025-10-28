#!/usr/bin/env bash
# Generate batch-2 file list for PropTypes → TypeScript migration
# Excludes already-migrated batch-1 files

set -euo pipefail

ROOT="apps/frontend/src"
OUT="scripts/batches/batch-2-files.txt"

# Batch-1 files (already migrated)
EXCLUDE="$(
  cat <<'EOF'
layout/MainLayout/Header/MegaMenuSection/index.jsx
layout/MainLayout/Header/SearchSection/index.jsx
layout/MainLayout/HorizontalBar.jsx
layout/MainLayout/Sidebar/MenuCard/index.jsx
layout/NavMotion.jsx
views/pages/authentication/jwt/AuthForgotPassword.jsx
views/pages/authentication/jwt/AuthResetPassword.jsx
views/pages/maintenance/ComingSoon/ComingSoon1/Slider.jsx
EOF
)"

# Build ripgrep exclude flags
EXC=""
while read -r f; do
  [ -n "$f" ] && EXC="$EXC -g '!$f'"
done <<< "$EXCLUDE"

mkdir -p "$(dirname "$OUT")"

echo "🔍 Scanning for PropTypes usage in legacy .jsx files..."

# Find PropTypes sites in remaining legacy .jsx (exclude already-converted .tsx)
eval rg -n --no-heading "from 'prop-types'|\\.propTypes\\s*=" "$ROOT" -g '!**/*.tsx' $EXC \
  | cut -d: -f1 \
  | sort -u > "$OUT" || true

FILE_COUNT=$(wc -l < "$OUT" | xargs)

echo "✅ Found $FILE_COUNT files with PropTypes"
echo "📝 Written to: $OUT"
echo ""
echo "Preview:"
cat "$OUT"