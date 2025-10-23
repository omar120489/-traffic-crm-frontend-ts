# Project Scripts

This document describes the utility scripts available in the `scripts/` directory.

## scripts/premerge.sh

**Pre-merge verification and merge helper** for ensuring code quality before merging.

### What It Does

1. **Regenerates SDK types** from the Core API's OpenAPI spec
2. **Builds Core API** to verify compilation
3. **Typechecks frontend** (TypeScript validation)
4. **Builds frontend** to ensure production bundle works
5. **Smoke tests API** (optional, if `DEV_JWT` is available)

### ⚠️ Note About PR Mode

**PR mode (`MODE=pr`) is currently unavailable** due to large files in the Git history that prevent GitHub pushes.

- **Current workaround**: Use `MODE=local` for local-only merging
- **Why it fails**: Files like `.backups/*.tar.gz` and `berry-v3.9.0.fig` exceed GitHub's size limits
- **How to fix**: Run `./scripts/cleanup-history.sh` when ready to enable remote workflow
- **More details**: See [Local Workflow Guide](./LOCAL_WORKFLOW.md) for working efficiently without remote pushes

### Usage

#### Verify Only (Default)

Just run the checks without merging or pushing:

```bash
./scripts/premerge.sh
```

#### Push for PR

Run checks, then push your current branch to origin:

```bash
MODE=pr ./scripts/premerge.sh
```

This will push the branch and remind you to create a PR in your Git host UI.

#### Local Merge

Run checks, then merge into a target branch locally and push:

```bash
MODE=local TARGET_BRANCH=main ./scripts/premerge.sh
```

Default target branch is `main` if not specified.

### Environment Variables

- `BRANCH` - Branch to work with (default: current branch)
- `TARGET_BRANCH` - Target branch for local merge (default: `main`)
- `DEV_JWT` - JWT token for API smoke test (auto-generated if available)
- `MODE` - Operation mode: `verify` (default), `pr`, or `local`

### Examples

```bash
# Verify builds on feature branch
git checkout feature/my-feature
./scripts/premerge.sh

# Push for PR with custom branch
BRANCH=feature/custom ./scripts/premerge.sh MODE=pr

# Merge into develop instead of main
MODE=local TARGET_BRANCH=develop ./scripts/premerge.sh

# With manual JWT for smoke test
DEV_JWT=$(pnpm --silent dev:jwt) ./scripts/premerge.sh
```

---

## scripts/premerge.ps1

**PowerShell version** of `premerge.sh` for Windows users.

### Usage

```powershell
# Verify only
.\scripts\premerge.ps1

# Push for PR
.\scripts\premerge.ps1 -Mode pr

# Local merge to main
.\scripts\premerge.ps1 -Mode local -TargetBranch main

# Local merge to develop
.\scripts\premerge.ps1 -Mode local -TargetBranch develop
```

### Parameters

- `-Mode` - Operation mode: `verify` (default), `pr`, or `local`
- `-TargetBranch` - Target branch for local merge (default: `main`)
- `-Branch` - Branch to work with (default: current branch)

---

## scripts/cleanup-history.sh

**Git history cleanup utility** for removing large files that block GitHub push.

### ⚠️ WARNING

**This script rewrites Git history!** Use with extreme caution.

- Coordinate with your entire team before running
- All collaborators will need to re-clone or rebase their branches
- Creates an automatic backup, but you should backup separately too
- Cannot be easily undone once pushed

### What It Removes

- `.backups/` directory and all contents
- `*.tar.gz` backup archives
- `*.fig` Figma design files (e.g., `berry-v3.9.0.fig`)
- `backup_*` directories
- Template directories: `full-version/`, `seed/`
- Downloaded template archives: `javascript_v5.0.0-*/`, `typescript_v5.0.0-*/`
- Any remaining blob larger than 100MB

### Prerequisites

Install `git-filter-repo`:

```bash
# macOS
brew install git-filter-repo

# Ubuntu/Debian
sudo apt install git-filter-repo

# Via pip
pip install git-filter-repo
```

### Usage

```bash
./scripts/cleanup-history.sh
```

The script will:
1. Check if `git-filter-repo` is installed
2. Verify your working tree is clean
3. Show current repo size
4. Ask for confirmation (type `yes`)
5. Create automatic backup in parent directory
6. Remove large files from history
7. Run garbage collection
8. Show new repo size
9. Provide next steps for force-pushing

### After Running

The script will remove your remote for safety. You must re-add it:

```bash
# Re-add remote
git remote add origin https://github.com/your-org/your-repo.git

# Force push (⚠️ coordinate with team!)
git push --force --all
git push --force --tags
```

### Team Communication

After force-pushing, notify your team:

> ⚠️ **Repository history has been rewritten**
>
> The repo history was cleaned to remove large files. You must:
>
> **Option A: Re-clone (recommended)**
> ```bash
> git clone https://github.com/your-org/your-repo.git traffic-crm-clean
> ```
>
> **Option B: Reset local repo**
> ```bash
> git fetch origin
> git reset --hard origin/main
> ```
>
> Do not try to push from old clones - it will fail or create conflicts.

### Expected Results

- **Before**: ~500MB+ (with 431MB + 170MB files)
- **After**: < 100MB
- **Reduction**: ~80-90% smaller

---

## Troubleshooting

### premerge.sh Issues

**"Could not generate SDK types"**
- Make sure Core API is running: `pnpm --filter @apps/core-api dev`
- Check if `http://localhost:3000/docs-json` is accessible

**"Typecheck reported issues"**
- This is expected for legacy code (unused contexts, etc.)
- Script continues anyway - review warnings to prioritize cleanup

**"API smoke test skipped"**
- Optional test, not critical
- Generate JWT: `export DEV_JWT=$(pnpm --silent dev:jwt)`

### cleanup-history.sh Issues

**"git-filter-repo not found"**
- Install using one of the methods shown in the Prerequisites section

**"Your working tree has uncommitted changes"**
- Commit or stash all changes first
- Run `git status` to verify clean state

**Remote push fails after cleanup**
- Ensure you re-added the remote: `git remote -v`
- Use `--force` flag as shown in the script output
- Verify you have push permissions

---

## Quick Reference

```bash
# Pre-merge verification
./scripts/premerge.sh

# Push for PR after verification
MODE=pr ./scripts/premerge.sh

# Merge to main locally
MODE=local ./scripts/premerge.sh

# Clean Git history (use with caution!)
./scripts/cleanup-history.sh

# After history cleanup, re-add remote and force push
git remote add origin <url>
git push --force --all
```

---

## See Also

- [Monorepo Setup](./MONOREPO_SETUP_COMPLETE.md)
- [Phase 2 Plan](./PHASE_2_PLAN.md)
- [Project Structure](./PROJECT_STRUCTURE.md)


