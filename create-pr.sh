#!/usr/bin/env bash
# create-pr.sh (enhanced with auto-labeling)
# Quick PR creation with template and automatic labels
# Usage: ./create-pr.sh <issue-number>

set -euo pipefail

ISSUE_NUM="${1:-}"
if [ -z "$ISSUE_NUM" ]; then
  echo "Usage: $0 <issue-number>"
  echo "Example: $0 1"
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

TEMPLATE_FILE=".github/PR_TEMPLATES/$(printf '%02d' "$ISSUE_NUM")-*.md"
TEMPLATE_PATH=$(ls $TEMPLATE_FILE 2>/dev/null | head -1)

if [ ! -f "$TEMPLATE_PATH" ]; then
  echo "❌ Template not found for issue #$ISSUE_NUM"
  echo "Run ./generate-pr-templates.sh first"
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
LABELS="${ISSUE_LABELS[$ISSUE_NUM]:-}"

echo "📝 Creating PR from branch: $CURRENT_BRANCH"
echo "📄 Using template: $TEMPLATE_PATH"
[ -n "$LABELS" ] && echo "🏷️  Labels: $LABELS"
echo ""

# Create PR
PR_URL=$(gh pr create \
  --body-file "$TEMPLATE_PATH" \
  --assignee "@me" \
  ${LABELS:+--label "$LABELS"} \
  --draft \
  --json url -q .url)

echo ""
echo "✅ Draft PR created: $PR_URL"
echo "💡 Edit and mark ready when done."

