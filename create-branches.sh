#!/usr/bin/env bash
# create-branches.sh
# Creates feature branches for all 13 issues
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

echo "📦 Creating 13 feature branches from main..."
git fetch origin main
git checkout main
git pull origin main

for branch in "${BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    echo "⚠️  Branch $branch already exists, skipping"
  else
    git branch "$branch" main
    echo "✅ Created $branch"
  fi
done

echo ""
echo "🎉 All branches created! Push them with:"
echo "   ./push-all-branches.sh"
echo ""
echo "Or work locally and push individually as you start each issue."

