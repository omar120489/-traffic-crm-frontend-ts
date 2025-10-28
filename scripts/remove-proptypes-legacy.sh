#!/usr/bin/env bash
set -euo pipefail

ROOT_ARG="${1:-apps/frontend/src}"
DRY="${2:-true}" # set to "false" to apply

if [[ "$DRY" != "true" && "$DRY" != "false" ]]; then
  echo "Second argument must be 'true' (dry-run) or 'false' (apply)." >&2
  exit 1
fi

FILES=()
MODE="scan"

if [[ -f "$ROOT_ARG" && ! -d "$ROOT_ARG" ]]; then
  MODE="list"
  while IFS= read -r line || [[ -n "$line" ]]; do
    trimmed="$(printf '%s' "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [[ -z "$trimmed" ]] && continue
    [[ "$trimmed" =~ ^# ]] && continue
    if [[ -f "$trimmed" ]]; then
      FILES+=("$trimmed")
    else
      echo "⚠️  Skipping missing file: $trimmed" >&2
    fi
  done <"$ROOT_ARG"
else
  ROOT_DIR="$ROOT_ARG"
fi

if [[ "$MODE" == "scan" ]]; then
  mapfile -t FILES < <(grep -RIl --include='*.{js,jsx,ts,tsx}' \
    -e "from 'prop-types'" \
    -e 'from \"prop-types\"' \
    -e '\.propTypes\s*=' \
    -e 'React\.PropTypes' \
    "$ROOT_ARG" 2>/dev/null || true)
fi

unique_files=()
declare -A seen
for f in "${FILES[@]}"; do
  if [[ -n "${seen[$f]:-}" ]]; then
    continue
  fi
  seen["$f"]=1
  unique_files+=("$f")
done
FILES=("${unique_files[@]}")

if [[ "$MODE" == "list" ]]; then
  echo "🧹 Target: file list ($ROOT_ARG)  (DRY-RUN=$DRY)"
else
  echo "🧹 Target root: $ROOT_ARG  (DRY-RUN=$DRY)"
fi

list_matches() {
  local pattern="$1"
  local label="$2"
  local any=0
  echo "$label"
  for file in "${FILES[@]}"; do
    if grep -qE "$pattern" "$file"; then
      echo "  $file"
      any=1
    fi
  done
  if [[ $any -eq 0 ]]; then
    echo "  (none)"
  fi
}

list_matches "from ['\"]prop-types['\"]" "— Imports:"
list_matches '\.propTypes\s*=' "— Assignments:"
list_matches 'React\.PropTypes' "— React.PropTypes usage:"

if [[ "$DRY" == "true" ]]; then
  echo "🔎 DRY-RUN: no changes applied. Re-run with second arg 'false' to modify files."
  exit 0
fi

if [[ "${#FILES[@]}" -eq 0 ]]; then
  echo "No files to process."
  exit 0
fi

echo "✍️ Applying removals..."

process_file() {
  local file="$1"
  python3 - <<'PY' "$file"
from __future__ import annotations
import re
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
original = text

text = re.sub(
    r'^\s*import\s+PropTypes\s+from\s+[\'"]prop-types[\'"];\s*\n?',
    '',
    text,
    flags=re.MULTILINE,
)

text = re.sub(r'\bReact\.PropTypes\.[A-Za-z0-9_]+\b', 'any', text)

text = re.sub(
    r'\n?\s*[A-Za-z0-9_.]+\s*\.propTypes\s*=\s*\{.*?\}\s*;?\s*',
    '\n',
    text,
    flags=re.DOTALL,
)

if text != original:
    path.write_text(text)
PY
}

changed=0
for file in "${FILES[@]}"; do
  process_file "$file"
  changed=$((changed + 1))
done

echo "✅ Completed. Files touched: $changed"
