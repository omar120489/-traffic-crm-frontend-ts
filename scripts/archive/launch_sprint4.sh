#!/bin/bash
set -e

REPO_PATH="/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516"
FRONTEND_PATH="$REPO_PATH/apps/frontend"

echo "🚀 Launching Sprint 4..."
echo ""

# Step 1: Merge Sprint 3 & 4 docs to main
echo "📚 Step 1: Merging documentation to main..."
cd "$REPO_PATH"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Ensure we're up to date
git fetch origin

# Checkout main and pull latest
git checkout main
git pull origin main

# Merge feat/company-360 (contains all Sprint 3 complete + Sprint 4 docs)
echo "Merging feat/company-360 (Sprint 3 complete + Sprint 4 docs)..."
git merge feat/company-360 --no-ff -m "docs: merge Sprint 3 complete and Sprint 4 planning docs

- Sprint 3 complete documentation (8 files)
- Sprint 4 planning documentation (4 files)
- Release notes and action plans
- All cross-linked and ready for execution"

# Push to main
git push origin main

echo "✅ Documentation merged to main"
echo ""

# Step 2: Create Sprint 4 feature branch
echo "🌿 Step 2: Creating Sprint 4 feature branch..."
git checkout -b feat/sprint4-activity-timeline
git push -u origin feat/sprint4-activity-timeline

echo "✅ Feature branch 'feat/sprint4-activity-timeline' created"
echo ""

# Step 3: Scaffold project structure
echo "🏗️  Step 3: Scaffolding project structure..."
cd "$FRONTEND_PATH"

# Create component directories
mkdir -p src/components/activities
mkdir -p src/pages/deals/components
mkdir -p src/pages/contacts/components
mkdir -p src/components/filters
mkdir -p src/components/bulk

echo "  ✓ Created component directories"

# Create type files
touch src/types/activity.ts
touch src/types/deal-detail.ts
touch src/types/contact-detail.ts
touch src/types/filters.ts
touch src/types/bulk-actions.ts

echo "  ✓ Created type files"

# Create service files
touch src/services/activities.service.ts
touch src/services/deal-detail.service.ts
touch src/services/contact-detail.service.ts

echo "  ✓ Created service files"

echo "✅ Project scaffolding complete"
echo ""

# Step 4: Verify setup
echo "🔍 Step 4: Verifying setup..."

# Check if directories exist
if [ -d "src/components/activities" ] && \
   [ -d "src/pages/deals/components" ] && \
   [ -d "src/pages/contacts/components" ] && \
   [ -d "src/components/filters" ] && \
   [ -d "src/components/bulk" ]; then
    echo "  ✓ All directories created"
else
    echo "  ✗ Some directories missing"
    exit 1
fi

# Check if type files exist
if [ -f "src/types/activity.ts" ] && \
   [ -f "src/types/deal-detail.ts" ] && \
   [ -f "src/types/contact-detail.ts" ] && \
   [ -f "src/types/filters.ts" ] && \
   [ -f "src/types/bulk-actions.ts" ]; then
    echo "  ✓ All type files created"
else
    echo "  ✗ Some type files missing"
    exit 1
fi

# Check if service files exist
if [ -f "src/services/activities.service.ts" ] && \
   [ -f "src/services/deal-detail.service.ts" ] && \
   [ -f "src/services/contact-detail.service.ts" ]; then
    echo "  ✓ All service files created"
else
    echo "  ✗ Some service files missing"
    exit 1
fi

echo "✅ Setup verification complete"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Sprint 4 Launch Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Completed Steps:"
echo "  1. ✓ Documentation merged to main"
echo "  2. ✓ Feature branch 'feat/sprint4-activity-timeline' created"
echo "  3. ✓ Project structure scaffolded"
echo "  4. ✓ Setup verified"
echo ""
echo "📂 Created Structure:"
echo "  apps/frontend/src/"
echo "  ├── components/"
echo "  │   ├── activities/"
echo "  │   ├── filters/"
echo "  │   └── bulk/"
echo "  ├── pages/"
echo "  │   ├── deals/components/"
echo "  │   └── contacts/components/"
echo "  ├── types/"
echo "  │   ├── activity.ts"
echo "  │   ├── deal-detail.ts"
echo "  │   ├── contact-detail.ts"
echo "  │   ├── filters.ts"
echo "  │   └── bulk-actions.ts"
echo "  └── services/"
echo "      ├── activities.service.ts"
echo "      ├── deal-detail.service.ts"
echo "      └── contact-detail.service.ts"
echo ""
echo "🚀 Next Steps:"
echo "  1. Start development server:"
echo "     cd $FRONTEND_PATH"
echo "     pnpm dev"
echo ""
echo "  2. Start backend server (in another terminal):"
echo "     cd $REPO_PATH/apps/core-api"
echo "     pnpm start:dev"
echo ""
echo "  3. Start building Activity Timeline (3 pts):"
echo "     - Read SPRINT_4_QUICK_REFERENCE.md"
echo "     - Follow SPRINT_4_EXECUTION_CHECKLIST.md"
echo "     - Build ActivityTimeline.tsx component"
echo ""
echo "📚 Documentation:"
echo "  - Quick Reference: SPRINT_4_QUICK_REFERENCE.md"
echo "  - Detailed Plan: SPRINT_4_PLAN.md"
echo "  - Daily Checklist: SPRINT_4_EXECUTION_CHECKLIST.md"
echo ""
echo "🎯 Sprint 4 Goal:"
echo "  Deliver 21 story points of CRM enhancements!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Let's build something amazing! 💪"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

