#!/usr/bin/env bash
# setup-dev-workflow.sh
# Complete setup: labels + issues + templates + branches
set -euo pipefail

echo "🚀 Setting up complete development workflow..."
echo ""

# Step 1: Make scripts executable
echo "1️⃣  Making scripts executable..."
chmod +x seed-labels.sh seed-issues.sh generate-pr-templates.sh \
         create-branches.sh create-pr.sh workflow-helper.sh \
         push-all-branches.sh auto-label-prs.sh

# Step 2: Seed labels
echo ""
echo "2️⃣  Seeding GitHub labels..."
./seed-labels.sh

# Step 3: Create issues
echo ""
echo "3️⃣  Creating 13 GitHub issues..."
./seed-issues.sh

# Step 4: Generate PR templates
echo ""
echo "4️⃣  Generating PR templates..."
./generate-pr-templates.sh

# Step 5: Create branches
echo ""
echo "5️⃣  Creating local branches..."
./create-branches.sh

# Step 6: (Optional) Push branches
echo ""
read -p "6️⃣  Push all branches to origin now? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  ./push-all-branches.sh
else
  echo "⏭️  Skipped. Run ./push-all-branches.sh later if needed."
fi

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "   # Start working on an issue:"
echo "   ./workflow-helper.sh start 1"
echo ""
echo "   # Make changes, commit, push:"
echo "   git add -A"
echo "   git commit -m 'feat(frontend): your change'"
echo "   git push -u origin feat/frontend-migrate-components"
echo ""
echo "   # Create PR (with auto-labels):"
echo "   ./workflow-helper.sh pr 1"
echo ""
echo "   # Check status:"
echo "   ./workflow-helper.sh status"
echo "   ./workflow-helper.sh list"
echo ""
echo "🎯 Happy coding!"

