#!/usr/bin/env bash
# push-all-branches.sh
# Push all 13 issue branches to origin in one shot
set -euo pipefail

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

echo "📤 Pushing 13 branches to origin..."
for branch in "${BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    git push origin "$branch" 2>&1 | grep -E "(new branch|up-to-date|->)" || true
    echo "✅ Pushed $branch"
  else
    echo "⚠️  Branch $branch doesn't exist locally, skipping"
  fi
done

echo ""
echo "🎉 Done! View branches: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/branches"

