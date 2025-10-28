#!/usr/bin/env bash
set -euo pipefail

AUDIT_FILE="${1:-./proptypes-audit.txt}"
OUT_DIR="${2:-./scripts/batches}"
BATCH_SIZE="${3:-8}"

if [[ ! -f "$AUDIT_FILE" ]]; then
  echo "Audit file not found: $AUDIT_FILE" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

awk -F'|' '
  NR == 1 { next }
  {
    path=$1
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", path)
    if (path == "")
      next
    split(path, parts, "/")
    folder = (length(parts) >= 2) ? parts[1] "/" parts[2] : parts[1]
    count[folder]++
    fileCount[path]++
    fileFolder[path]=folder
  }
  END {
    print "=== PropTypes by folder ==="
    for (k in count) {
      printf "%-35s %d\n", k, count[k]
    }
  }
' "$AUDIT_FILE" | sort >"$OUT_DIR/plan-by-folder.txt"

awk -F'|' '
  NR == 1 { next }
  {
    path=$1
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", path)
    if (path == "")
      next
    split(path, parts, "/")
    folder = (length(parts) >= 2) ? parts[1] "/" parts[2] : parts[1]
    occ[path]++
    fileFolder[path]=folder
  }
  END {
    print "folder,file,occurrences"
    for (f in occ) {
      printf "%s,%s,%d\n", fileFolder[f], f, occ[f]
    }
  }
' "$AUDIT_FILE" | sort >"$OUT_DIR/remaining.csv"

tail -n +2 "$OUT_DIR/remaining.csv" | cut -d',' -f2 | head -n "$BATCH_SIZE" >"$OUT_DIR/batch-1-files.txt"
tail -n +2 "$OUT_DIR/remaining.csv" | cut -d',' -f2 | tail -n +$((BATCH_SIZE + 1)) | head -n "$BATCH_SIZE" >"$OUT_DIR/batch-2-files.txt" || true

echo "Generated:"
echo "  - $OUT_DIR/plan-by-folder.txt"
echo "  - $OUT_DIR/remaining.csv"
if [[ -s "$OUT_DIR/batch-1-files.txt" ]]; then
  echo "  - $OUT_DIR/batch-1-files.txt"
fi
if [[ -s "$OUT_DIR/batch-2-files.txt" ]]; then
  echo "  - $OUT_DIR/batch-2-files.txt"
fi
