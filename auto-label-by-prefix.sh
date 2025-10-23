#!/usr/bin/env bash
# auto-label-by-prefix.sh
# Automatically label PRs based on branch prefix
# Usage: ./auto-label-by-prefix.sh <PR-number>
# Example: ./auto-label-by-prefix.sh 42

set -euo pipefail

PR_NUM="${1:-}"
if [ -z "$PR_NUM" ]; then
  echo "Usage: $0 <pr-number>"
  echo "Example: $0 42"
  exit 1
fi

# Get the branch name for this PR
BRANCH=$(gh pr view "$PR_NUM" --json headRefName -q .headRefName)

if [ -z "$BRANCH" ]; then
  echo "❌ Could not find PR #$PR_NUM"
  exit 1
fi

echo "🔍 PR #$PR_NUM branch: $BRANCH"

# Extract prefix and determine labels
PREFIX="${BRANCH%%/*}"
LABELS=""

case "$PREFIX" in
  feat)
    LABELS="type:feat"
    ;;
  fix)
    LABELS="type:fix"
    ;;
  docs)
    LABELS="type:docs,area:docs"
    ;;
  test)
    LABELS="type:test"
    ;;
  refactor)
    LABELS="type:refactor"
    ;;
  perf)
    LABELS="type:performance"
    ;;
  chore)
    LABELS="type:cleanup"
    ;;
  *)
    echo "⚠️  Unknown prefix: $PREFIX (no labels added)"
    exit 0
    ;;
esac

# Detect area from branch name
if [[ "$BRANCH" == *"frontend"* ]]; then
  LABELS="$LABELS,area:frontend"
elif [[ "$BRANCH" == *"backend"* ]] || [[ "$BRANCH" == *"api"* ]]; then
  LABELS="$LABELS,area:backend"
elif [[ "$BRANCH" == *"worker"* ]]; then
  LABELS="$LABELS,area:workers"
elif [[ "$BRANCH" == *"ci"* ]]; then
  LABELS="$LABELS,area:ci"
elif [[ "$BRANCH" == *"sdk"* ]]; then
  LABELS="$LABELS,area:sdk"
fi

if [ -z "$LABELS" ]; then
  echo "⚠️  No labels to add"
  exit 0
fi

echo "🏷️  Adding labels: $LABELS"
IFS=',' read -ra LABEL_ARRAY <<< "$LABELS"
for label in "${LABEL_ARRAY[@]}"; do
  gh pr edit "$PR_NUM" --add-label "$label" 2>/dev/null || echo "  ⚠️  Label '$label' may not exist"
done

echo "✅ Labels added to PR #$PR_NUM"

