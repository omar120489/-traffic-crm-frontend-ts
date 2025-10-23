# Development Workflow Scripts

Automated workflow tools for Traffic CRM development. These scripts streamline issue management, branch creation, and PR workflows.

## 🚀 Quick Start

```bash
# One-command setup (recommended)
./setup-dev-workflow.sh
```

This will:
1. ✅ Make all scripts executable
2. ✅ Seed GitHub labels
3. ✅ Create 13 development issues
4. ✅ Generate PR templates
5. ✅ Create local branches
6. ✅ (Optional) Push branches to GitHub

---

## 📋 Available Scripts

### `setup-dev-workflow.sh`
**Complete automated setup**

Runs all setup steps in order. Use this for initial setup or when onboarding new team members.

```bash
./setup-dev-workflow.sh
```

---

### `seed-labels.sh`
**Create GitHub labels**

Creates 16 color-coded labels for organizing issues and PRs:
- Area labels (frontend, backend, workers, ci, sdk, docs)
- Priority labels (high, medium, low)
- Type labels (refactor, architecture, performance, etc.)

```bash
./seed-labels.sh
```

---

### `seed-issues.sh`
**Create development issues**

Creates 13 pre-defined issues covering:
- Frontend refactoring and testing
- Backend API improvements
- Workers reliability
- SDK documentation
- CI/CD optimization

```bash
# Default: assigns to omar120489
./seed-issues.sh

# Custom assignee
ASSIGNEE="yourusername" ./seed-issues.sh

# With milestone
MILESTONE="Sprint 1" ./seed-issues.sh
```

---

### `workflow-helper.sh`
**Main workflow tool**

Your primary interface for day-to-day development.

```bash
# Start work on an issue
./workflow-helper.sh start 1

# Create PR for current issue
./workflow-helper.sh pr 1

# List all issue branches
./workflow-helper.sh list

# Show current issue
./workflow-helper.sh status
```

**Example workflow:**
```bash
# 1. Start issue #1
./workflow-helper.sh start 1

# 2. Make changes
git add -A
git commit -m "feat(frontend): migrate ui-component imports"

# 3. Push
git push -u origin feat/frontend-migrate-components

# 4. Create PR
./workflow-helper.sh pr 1
```

---

### `create-branches.sh`
**Create all issue branches**

Creates 13 local branches (one per issue) from main.

```bash
./create-branches.sh
```

Branches created:
- `feat/frontend-migrate-components`
- `refactor/frontend-consolidate-layouts`
- `feat/frontend-organize-hooks-features`
- ... (10 more)

---

### `push-all-branches.sh`
**Push all branches to GitHub**

Pushes all 13 issue branches to origin in one command.

```bash
./push-all-branches.sh
```

Useful when:
- Setting up a new team member
- Syncing branches across machines
- Preparing for parallel development

---

### `generate-pr-templates.sh`
**Generate PR description templates**

Creates 13 PR templates in `.github/PR_TEMPLATES/` with:
- Goal statement
- Change checklist
- Verification steps
- Auto-closes related issue

```bash
./generate-pr-templates.sh
```

Templates are automatically used by `create-pr.sh`.

---

### `create-pr.sh`
**Create PR with template and labels**

Creates a draft PR with the correct template and auto-applied labels.

```bash
# Create PR for issue #1
./create-pr.sh 1

# Output:
# ✅ Draft PR created: https://github.com/.../pull/42
```

**Features:**
- Loads issue-specific template
- Auto-applies correct labels
- Creates as draft (mark ready when done)
- Assigns to you

---

### `auto-label-prs.sh`
**Manually add labels to existing PR**

If you created a PR manually and need to add labels:

```bash
# Add labels to PR #42 for issue #1
./auto-label-prs.sh 42 1
```

---

## 🎯 Common Workflows

### Starting a New Issue

```bash
# Option 1: Using workflow helper (recommended)
./workflow-helper.sh start 3
# ... make changes ...
git add -A && git commit -m "feat(frontend): organize hooks"
git push -u origin feat/frontend-organize-hooks-features
./workflow-helper.sh pr 3

# Option 2: Manual
git checkout -b feat/my-feature
# ... make changes ...
git push -u origin feat/my-feature
./create-pr.sh 3  # if it matches issue #3
```

### Checking Your Status

```bash
# What issue am I working on?
./workflow-helper.sh status

# What branches exist?
./workflow-helper.sh list
```

### Setting Up a New Team Member

```bash
# 1. They clone the repo
git clone <repo-url>
cd <repo>

# 2. Run setup (they'll get all branches and issues)
./setup-dev-workflow.sh

# 3. Start working
./workflow-helper.sh start 5
```

---

## 🏷️ Label Mapping

Each issue is automatically labeled:

| Issue | Labels |
|-------|--------|
| #1 | `area:frontend`, `priority:high`, `type:refactor` |
| #2 | `area:frontend`, `type:cleanup` |
| #3 | `area:frontend`, `type:architecture` |
| #4 | `area:frontend`, `type:performance` |
| #5 | `area:backend`, `priority:high`, `type:consistency` |
| #6 | `area:backend`, `type:test` |
| #7 | `area:backend`, `type:ops` |
| #8 | `area:workers`, `priority:high`, `type:reliability` |
| #9 | `area:workers`, `type:observability` |
| #10 | `area:sdk`, `type:docs` |
| #11 | `area:frontend`, `type:test` |
| #12 | `area:ci`, `type:performance` |
| #13 | `area:docs`, `type:docs` |

---

## 🔧 Customization

### Change Default Assignee

Edit `seed-issues.sh`:
```bash
ASSIGNEE="${ASSIGNEE:-yourusername}"
```

### Add Milestone

Edit `seed-issues.sh`:
```bash
MILESTONE="${MILESTONE:-Sprint 1}"
```

### Modify Issue Templates

Edit the `create_issue` calls in `seed-issues.sh`.

### Add More Issues

1. Add issue to `seed-issues.sh`
2. Add branch to `BRANCHES` array in all scripts
3. Add label mapping to `create-pr.sh`
4. Create PR template in `generate-pr-templates.sh`

---

## 🐛 Troubleshooting

### "gh: command not found"

Install GitHub CLI:
```bash
# macOS
brew install gh

# Linux
# See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Then authenticate
gh auth login
```

### "Permission denied" when running scripts

Make scripts executable:
```bash
chmod +x *.sh
```

### "Branch already exists"

```bash
# Delete local branch
git branch -D feat/branch-name

# Delete remote branch
git push origin --delete feat/branch-name

# Re-run create-branches.sh
./create-branches.sh
```

### PR template not found

```bash
# Regenerate templates
./generate-pr-templates.sh

# Verify they exist
ls -la .github/PR_TEMPLATES/
```

---

## 📚 Related Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Full contribution guide
- [docs/LOCAL_WORKFLOW.md](./docs/LOCAL_WORKFLOW.md) - Local development setup
- [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - Codebase structure

---

## 💡 Tips

1. **Use workflow-helper.sh**: It's the easiest way to work with issues
2. **Draft PRs**: Always create as draft, mark ready when done
3. **Conventional commits**: Enforced by commitlint, use the right format
4. **Check status**: Run `./workflow-helper.sh status` if you forget what you're working on
5. **List branches**: Run `./workflow-helper.sh list` to see all issues

---

**Questions?** See [CONTRIBUTING.md](./CONTRIBUTING.md) or open a discussion on GitHub.

