#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-apps/frontend/src}"
OUT="${2:-/tmp/proptypes-audit.txt}"

search_prop_types() {
  if command -v rg >/dev/null 2>&1; then
    rg --with-filename --line-number --no-heading \
      -g '*.{js,jsx,ts,tsx}' \
      -e "from 'prop-types'" \
      -e 'from "prop-types"' \
      -e '\.propTypes\s*=' \
      -e 'React\.PropTypes' \
      "$ROOT"
  else
    grep -RIn --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' \
      -e "from 'prop-types'" \
      -e 'from "prop-types"' \
      -e '\.propTypes\s*=' \
      -e 'React\.PropTypes' \
      "$ROOT"
  fi
}

echo "🔎 Scanning for PropTypes in: $ROOT"
printf "File|Line|Match\n" >"$OUT"

search_prop_types | sed 's/:/|/g' >>"$OUT" || true

echo "✅ Audit complete -> $OUT"
echo "Tip: open in VS Code: code $OUT"

count_with_proptypes() {
  local count
  count="$( (search_prop_types | cut -d: -f1 | sort -u) | wc -l | awk '{print $1}' )"
  echo "$count"
}
if command -v fd >/dev/null 2>&1; then
  TOTAL="$(fd -e js -e jsx -e ts -e tsx . "$ROOT" | wc -l | awk '{print $1}')"
else
  TOTAL="$(find "$ROOT" -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' \) | wc -l | awk '{print $1}')"
fi

WITH_PTs="$(count_with_proptypes)"
COMPLETION=0
if [[ "$TOTAL" -gt 0 ]]; then
  COMPLETION=$(( (TOTAL - WITH_PTs) * 100 / TOTAL ))
fi

echo "───────────────────────────────"
echo "Files total: $TOTAL"
echo "Files with PropTypes: $WITH_PTs"
echo "Migration completion: ${COMPLETION}%"
echo "───────────────────────────────"
