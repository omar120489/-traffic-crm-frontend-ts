#!/usr/bin/env bash
set -euo pipefail

# Sprint 2 Feature Backlog Issues
# Creates GitHub issues for remaining Sprint 2 work

if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) not found. Install: https://cli.github.com/"
  exit 1
fi

echo "🎯 Creating Sprint 2 Feature Issues..."
echo ""

# Issue 1: SDK Migration - Contacts
gh issue create \
  --title "FE: Migrate Contacts to SDK client" \
  --label "frontend,enhancement,sprint-2" \
  --body "## Goal
Replace axios/fetch calls with @traffic-crm/sdk-js client in Contacts pages.

## Tasks
- [ ] Update ContactsListPage to use \`api.listContacts()\`
- [ ] Update ContactDetailPage to use \`api.getContact()\`
- [ ] Update ContactFormPage to use \`api.createContact()\` / \`api.updateContact()\`
- [ ] Remove old axios service files
- [ ] Test all CRUD operations

## Acceptance Criteria
- All Contacts pages use SDK client
- No direct fetch/axios calls remain
- Error handling works correctly
- Types are inferred from SDK

## Reference
- SDK client: \`packages/sdk-js/src/index.ts\`
- Example: \`apps/frontend/src/pages/contacts/ContactsListPage.tsx\`"

echo "✅ Created: FE: Migrate Contacts to SDK client"

# Issue 2: SDK Migration - Companies
gh issue create \
  --title "FE: Migrate Companies to SDK client" \
  --label "frontend,enhancement,sprint-2" \
  --body "## Goal
Replace axios/fetch calls with @traffic-crm/sdk-js client in Companies pages.

## Tasks
- [ ] Update CompaniesListPage to use \`api.listCompanies()\`
- [ ] Update CompanyDetailPage to use \`api.getCompany()\`
- [ ] Update CompanyFormPage to use \`api.createCompany()\` / \`api.updateCompany()\`
- [ ] Remove old axios service files
- [ ] Test all CRUD operations

## Acceptance Criteria
- All Companies pages use SDK client
- No direct fetch/axios calls remain
- Error handling works correctly
- Types are inferred from SDK"

echo "✅ Created: FE: Migrate Companies to SDK client"

# Issue 3: SDK Migration - Leads
gh issue create \
  --title "FE: Migrate Leads to SDK client" \
  --label "frontend,enhancement,sprint-2" \
  --body "## Goal
Replace axios/fetch calls with @traffic-crm/sdk-js client in Leads pages.

## Tasks
- [ ] Update LeadsListPage to use \`api.listLeads()\`
- [ ] Update LeadDetailPage to use \`api.getLead()\`
- [ ] Update LeadFormPage to use \`api.createLead()\` / \`api.updateLead()\`
- [ ] Add lead scoring display
- [ ] Test all CRUD operations

## Acceptance Criteria
- All Leads pages use SDK client
- Lead scoring column visible
- No direct fetch/axios calls remain
- Types are inferred from SDK"

echo "✅ Created: FE: Migrate Leads to SDK client"

# Issue 4: SDK Migration - Deals
gh issue create \
  --title "FE: Migrate Deals to SDK client" \
  --label "frontend,enhancement,sprint-2" \
  --body "## Goal
Replace axios/fetch calls with @traffic-crm/sdk-js client in Deals pages.

## Tasks
- [ ] Update DealsListPage to use \`api.listDeals()\`
- [ ] Update DealDetailPage to use \`api.getDeal()\`
- [ ] Update DealFormPage to use \`api.createDeal()\` / \`api.updateDeal()\`
- [ ] Add stage change tracking
- [ ] Test all CRUD operations

## Acceptance Criteria
- All Deals pages use SDK client
- Stage changes recorded in timeline
- No direct fetch/axios calls remain
- Types are inferred from SDK"

echo "✅ Created: FE: Migrate Deals to SDK client"

# Issue 5: Pipelines & Stages UI
gh issue create \
  --title "FE: Pipelines & Stages Settings Page" \
  --label "frontend,feature,sprint-2" \
  --body "## Goal
Build settings page for managing pipelines and stages.

## Tasks
- [ ] Wire PipelinesPage.tsx to routes
- [ ] Add drag-to-reorder for stages
- [ ] Add stage probability editing
- [ ] Add default pipeline toggle
- [ ] Test CRUD operations
- [ ] Add validation (prevent deleting pipeline with deals)

## Acceptance Criteria
- Users can create/edit/delete pipelines
- Users can create/edit/delete/reorder stages
- Stage probability affects deal forecasting
- UI uses AppPage + DataTable from @ui-kit

## Reference
- Component: \`apps/frontend/src/pages/settings/PipelinesPage.tsx\`
- API: \`/pipelines\`, \`/stages\`, \`/stages/reorder\`"

echo "✅ Created: FE: Pipelines & Stages Settings Page"

# Issue 6: Activity Timeline
gh issue create \
  --title "FE: Activity Timeline on Contact & Deal Pages" \
  --label "frontend,feature,sprint-2" \
  --body "## Goal
Add activity timeline to Contact and Deal detail pages.

## Tasks
- [ ] Wire ContactDetailPage.tsx to routes
- [ ] Add timeline to Deal detail page
- [ ] Implement optimistic activity creation
- [ ] Add activity type selector (note, call, email, meeting, task)
- [ ] Add error rollback on failed creation
- [ ] Test timeline rendering

## Acceptance Criteria
- Timeline visible on Contact & Deal pages
- Users can add notes/activities
- Optimistic updates work correctly
- Failed creates rollback gracefully
- Uses EntityTimeline from @ui-kit

## Reference
- Component: \`apps/frontend/src/pages/contacts/ContactDetailPage.tsx\`
- API: \`/activities\`"

echo "✅ Created: FE: Activity Timeline on Contact & Deal Pages"

# Issue 7: Tag Management
gh issue create \
  --title "FE: Tag Chips & Filters" \
  --label "frontend,feature,sprint-2" \
  --body "## Goal
Add tag management to list pages with filtering.

## Tasks
- [ ] Add TagManager component to Contact/Company/Lead/Deal list pages
- [ ] Add tag filter pills to FilterBar
- [ ] Implement tag assignment/removal
- [ ] Add tag creation dialog
- [ ] Add tag color picker
- [ ] Test tag filtering

## Acceptance Criteria
- Users can assign/remove tags from entities
- Users can create new tags with colors
- Tag filters work on list pages
- Uses TagManager component

## Reference
- Component: \`apps/frontend/src/components/tags/TagManager.tsx\`
- API: \`/tags\`, \`/tags/assign\`, \`/tags/entity\`"

echo "✅ Created: FE: Tag Chips & Filters"

# Issue 8: RBAC Enforcement
gh issue create \
  --title "API: Add RBAC Guards to CRUD Controllers" \
  --label "backend,security,sprint-2" \
  --body "## Goal
Enforce RBAC on all CRUD endpoints using RbacGuard.

## Tasks
- [ ] Add \`@UseGuards(RbacGuard)\` to Contacts controller
- [ ] Add \`@UseGuards(RbacGuard)\` to Companies controller
- [ ] Add \`@UseGuards(RbacGuard)\` to Leads controller
- [ ] Add \`@UseGuards(RbacGuard)\` to Deals controller
- [ ] Add \`@RequirePermission()\` decorators per route
- [ ] Add unit tests for permission checks
- [ ] Test with different user roles

## Acceptance Criteria
- All CRUD routes protected by RBAC
- Viewers can only read
- Users can read/write
- Managers can assign
- Admins have full access

## Reference
- Guard: \`apps/core-api/src/auth/rbac.guard.ts\`
- Permissions: \`packages/rbac/src/types.ts\`"

echo "✅ Created: API: Add RBAC Guards to CRUD Controllers"

# Issue 9: OpenAPI DTOs
gh issue create \
  --title "API: Tighten DTOs with Swagger Decorators" \
  --label "backend,documentation,sprint-2" \
  --body "## Goal
Improve OpenAPI spec quality with @nestjs/swagger decorators.

## Tasks
- [ ] Add \`@ApiProperty()\` to all DTO fields
- [ ] Add \`@ApiResponse()\` to controller methods
- [ ] Add examples to DTOs
- [ ] Add validation decorators from class-validator
- [ ] Regenerate SDK types
- [ ] Verify improved type inference

## Acceptance Criteria
- All DTOs have Swagger decorators
- OpenAPI spec includes examples
- SDK types are more specific
- Validation errors are clear

## Reference
- Docs: https://docs.nestjs.com/openapi/types-and-parameters"

echo "✅ Created: API: Tighten DTOs with Swagger Decorators"

# Issue 10: E2E Smoke Tests in CI
gh issue create \
  --title "CI: Add Playwright Smoke Tests" \
  --label "testing,ci,sprint-2" \
  --body "## Goal
Run Sprint 2 smoke tests in CI on every PR.

## Tasks
- [ ] Add Playwright CI job to \`.github/workflows/ci.yml\`
- [ ] Cache Playwright browsers
- [ ] Run \`sprint2-smoke.spec.ts\` only (fast subset)
- [ ] Add test database setup
- [ ] Mark as required check after 1 week of green
- [ ] Add test results reporting

## Acceptance Criteria
- Smoke tests run on every PR
- Tests complete in < 2 minutes
- Failures block merge
- Test results visible in PR

## Reference
- Tests: \`apps/frontend/e2e/sprint2-smoke.spec.ts\`
- Docs: https://playwright.dev/docs/ci"

echo "✅ Created: CI: Add Playwright Smoke Tests"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ Created 10 Sprint 2 Issues                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 View issues: gh issue list --label sprint-2"
echo "🎯 Start work: ./workflow-helper.sh start <issue-number>"
echo ""


