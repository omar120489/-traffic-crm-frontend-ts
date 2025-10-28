#!/usr/bin/env bash
set -euo pipefail

FILES_LIST="${1:-./scripts/batches/batch-1-files.txt}"
BATCH_NAME="${2:-batch-1}"

if [[ ! -s "$FILES_LIST" ]]; then
  echo "No files found at $FILES_LIST"
  exit 0
fi

echo "Starting PropTypes migration: $BATCH_NAME"
echo "Files:"
cat "$FILES_LIST"
echo "-----"

./scripts/remove-proptypes-legacy.sh "$FILES_LIST" false

echo "Running lint..."
pnpm --filter ./apps/frontend lint -- --fix || true

echo "Running typecheck..."
pnpm --filter ./apps/frontend typecheck

echo "Running unit tests..."
pnpm --filter ./apps/frontend test:unit -- --runInBand || true

echo "Re-running audit..."
./scripts/audit-proptypes.sh apps/frontend/src ./proptypes-audit.txt

REMAINING=$(tail -n +2 ./proptypes-audit.txt | grep -c . || true)

if git diff --quiet; then
  echo "No changes detected; skipping commit."
  exit 0
fi

git add -A
git commit -m "migrate(prop-types): ${BATCH_NAME} — remaining=${REMAINING}"
echo "Batch ${BATCH_NAME} committed with remaining=${REMAINING}"
