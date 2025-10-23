#!/usr/bin/env bash
# workflow-helper.sh
# Complete workflow: create branch → work → create PR

set -euo pipefail

show_usage() {
  cat <<EOF
Usage: $0 <command> [issue-number]

Commands:
  start <N>   - Create and checkout branch for issue #N
  pr <N>      - Create draft PR for issue #N (from current branch)
  list        - List all issue branches
  status      - Show current branch and related issue

Examples:
  $0 start 1   # Start work on issue #1
  $0 pr 1      # Create PR for issue #1
  $0 list      # Show all branches
EOF
}

BRANCHES=(
  "feat/frontend-migrate-components"
  "refactor/frontend-consolidate-layouts"
  "feat/frontend-organize-hooks-features"
  "feat/frontend-code-splitting-error-boundaries"
  "fix/backend-align-dtos-shared-types"
  "test/backend-e2e-critical-endpoints"
  "feat/backend-health-version-endpoints"
  "feat/workers-error-handling-retries-dlq"
  "feat/workers-health-metrics-endpoints"
  "docs/sdk-usage-examples"
  "test/frontend-comprehensive-test-suite"
  "feat/ci-caching-preview-builds"
  "docs/update-project-structure-guides"
)

cmd_start() {
  local issue_num="${1:-}"
  if [ -z "$issue_num" ] || [ "$issue_num" -lt 1 ] || [ "$issue_num" -gt 13 ]; then
    echo "❌ Issue number must be between 1-13"
    exit 1
  fi
  
  local idx=$((issue_num - 1))
  local branch="${BRANCHES[$idx]}"
  
  echo "🚀 Starting work on issue #$issue_num"
  echo "📦 Branch: $branch"
  
  git fetch origin main
  git checkout main
  git pull origin main
  
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    git checkout "$branch"
    echo "✅ Checked out existing branch: $branch"
  else
    git checkout -b "$branch"
    echo "✅ Created new branch: $branch"
  fi
  
  echo ""
  echo "💡 Next steps:"
  echo "   1. Make your changes"
  echo "   2. Commit with conventional format (feat:, fix:, etc.)"
  echo "   3. Run: $0 pr $issue_num"
}

cmd_pr() {
  local issue_num="${1:-}"
  if [ -z "$issue_num" ]; then
    echo "❌ Issue number required"
    exit 1
  fi
  
  ./create-pr.sh "$issue_num"
}

cmd_list() {
  echo "📋 Issue branches:"
  for i in "${!BRANCHES[@]}"; do
    local num=$((i + 1))
    local branch="${BRANCHES[$i]}"
    local exists="  "
    if git show-ref --verify --quiet "refs/heads/$branch"; then
      exists="✓ "
    fi
    echo "$exists #$num: $branch"
  done
}

cmd_status() {
  local current=$(git branch --show-current)
  echo "🔍 Current branch: $current"
  
  for i in "${!BRANCHES[@]}"; do
    if [ "${BRANCHES[$i]}" = "$current" ]; then
      local num=$((i + 1))
      echo "📌 Working on: Issue #$num"
      return
    fi
  done
  
  echo "⚠️  Not on an issue branch"
}

# Main
COMMAND="${1:-}"
shift || true

case "$COMMAND" in
  start)
    cmd_start "$@"
    ;;
  pr)
    cmd_pr "$@"
    ;;
  list)
    cmd_list
    ;;
  status)
    cmd_status
    ;;
  *)
    show_usage
    exit 1
    ;;
esac

