#!/usr/bin/env bash
# auto-label-prs.sh
# Automatically add labels to PRs based on branch name
# Usage: ./auto-label-prs.sh <PR-number> <issue-number>
# Example: ./auto-label-prs.sh 42 1

set -euo pipefail

PR_NUM="${1:-}"
ISSUE_NUM="${2:-}"

if [ -z "$PR_NUM" ] || [ -z "$ISSUE_NUM" ]; then
  echo "Usage: $0 <pr-number> <issue-number>"
  echo "Example: $0 42 1"
  exit 1
fi

# Map issue numbers to labels
declare -A ISSUE_LABELS=(
  [1]="area:frontend,priority:high,type:refactor"
  [2]="area:frontend,type:cleanup"
  [3]="area:frontend,type:architecture"
  [4]="area:frontend,type:performance"
  [5]="area:backend,priority:high,type:consistency"
  [6]="area:backend,type:test"
  [7]="area:backend,type:ops"
  [8]="area:workers,priority:high,type:reliability"
  [9]="area:workers,type:observability"
  [10]="area:sdk,type:docs"
  [11]="area:frontend,type:test"
  [12]="area:ci,type:performance"
  [13]="area:docs,type:docs"
)

LABELS="${ISSUE_LABELS[$ISSUE_NUM]}"

if [ -z "$LABELS" ]; then
  echo "❌ No labels defined for issue #$ISSUE_NUM"
  exit 1
fi

echo "🏷️  Adding labels to PR #$PR_NUM: $LABELS"
IFS=',' read -ra LABEL_ARRAY <<< "$LABELS"
for label in "${LABEL_ARRAY[@]}"; do
  gh pr edit "$PR_NUM" --add-label "$label"
done

echo "✅ Labels added!"

