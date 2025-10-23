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

## scripts/sync_github.sh

**Automated GitHub sync utility** for safely replacing a GitHub repository with your local content.

### What It Does

This script automates the entire process of replacing a GitHub repository with your local code:

1. **Backs up current state** (creates backup branch and .git directory copy)
2. **Cleans Git history** (runs `cleanup-history.sh` to remove large files)
3. **Updates remote URL** (optional, if you need to change target repo)
4. **Force-pushes to GitHub** (replaces remote completely)
5. **Verifies success** (checks remote matches local)

### ⚠️ WARNING

**This script performs destructive operations!**

- Rewrites Git history (removes large files)
- Force-pushes to GitHub (replaces all remote content)
- Cannot be easily undone once pushed

### When to Use

Use this script when you want to:
- Replace an existing GitHub repo with your local content
- Clean up Git history and enable remote pushes
- Migrate from one repo to another
- Start fresh on GitHub with cleaned history

### Usage

```bash
./scripts/sync_github.sh
```

The script is fully interactive and will:
- Show current status and remote URL
- Ask for confirmation before each destructive step
- Offer to change remote URL if needed
- Create automatic backups before proceeding

### What Happens

**Step 1: Remote URL Configuration**
- Shows current remote
- Offers to change it (e.g., from `servers.git` to `traffic-crm.git`)
- Detects if you're targeting the wrong repo

**Step 2: Local Backups**
- Creates backup branch: `backup/before-sync-YYYYMMDD-HHMMSS`
- Copies `.git` directory to `.git.backup.YYYYMMDD-HHMMSS`

**Step 3: Clean Git History**
- Runs `cleanup-history.sh` automatically
- Removes `.backups/`, `*.tar.gz`, `*.fig`, and blobs >100MB
- Shrinks `.git` from ~984MB to ~100MB

**Step 4: Force Push**
- Asks for final confirmation
- Pushes all branches with `--force`
- Pushes all tags with `--force`

**Step 5: Verification**
- Checks remote commit matches local
- Provides next steps and rollback instructions

### Example Session

```bash
$ ./scripts/sync_github.sh

ℹ GitHub Sync Script - Starting pre-flight checks...
✓ Git repository detected
✓ Working tree is clean
ℹ Current remote: https://github.com/omar120489/servers.git
⚠ Remote appears to be MCP servers repo, not Traffic CRM!
ℹ Current branch: main
ℹ Commits ahead of remote: 40
ℹ Current .git size: 984M

==========================================
  REVIEW BEFORE PROCEEDING
==========================================

ℹ Step 1: Remote URL Configuration
  Current: https://github.com/omar120489/servers.git

? Do you want to change the remote URL? [y/N]: y
Enter new remote URL: https://github.com/omar120489/traffic-crm-frontend-ts.git
ℹ Setting remote to: https://github.com/omar120489/traffic-crm-frontend-ts.git
✓ Remote URL updated

ℹ Step 2: Creating local backups...
✓ Backup branch created
✓ .git directory backed up
✓ Backups complete!

ℹ Step 3: Cleaning Git history...
? Run cleanup-history.sh? [y/N]: y
[cleanup output...]
✓ History cleaned!
ℹ New .git size: 98M (was: 984M)

ℹ Step 4: Force push to GitHub
==========================================
  ⚠️  FINAL CONFIRMATION ⚠️
==========================================

This will:
  1. PERMANENTLY DELETE all content in: https://github.com/omar120489/traffic-crm-frontend-ts.git
  2. Replace it with your current local repository
  3. Push branch: main
  4. Push all tags

? Are you ABSOLUTELY SURE you want to force-push? [y/N]: y

✓ All branches pushed!
✓ All tags pushed!

✓ Remote matches local! Push verified.

==========================================
  🎉 SYNC COMPLETE! 🎉
==========================================
```

### Rollback Procedure

If something goes wrong, you can restore from backups:

```bash
# Option 1: Restore from backup branch
git checkout backup/before-sync-YYYYMMDD-HHMMSS
git branch -D main
git checkout -b main

# Option 2: Restore .git directory
rm -rf .git
mv .git.backup.YYYYMMDD-HHMMSS .git

# Option 3: Force push backup to restore remote
git push origin --force --all
```

### After Successful Sync

Once the script completes:

1. **Verify on GitHub:**
   - Open your repo in browser
   - Check structure: `apps/`, `packages/`, `scripts/`, `docs/`
   - Confirm latest commit message matches local

2. **Test CI/CD:**
   - Go to Actions tab on GitHub
   - Verify workflows run successfully

3. **Resume normal workflow:**
   ```bash
   # PR mode now works!
   MODE=pr ./scripts/premerge.sh
   
   # Or regular git workflow
   git commit -m "feat: new feature"
   git push origin main
   ```

4. **Cleanup backups (after a few days):**
   ```bash
   git branch -d backup/before-sync-YYYYMMDD-HHMMSS
   rm -rf .git.backup.YYYYMMDD-HHMMSS
   ```

### Troubleshooting

**"Remote appears to be MCP servers repo"**
- The script detects if you're targeting the wrong repo
- Change remote URL when prompted
- Or confirm if you really want to overwrite that repo

**"Failed to push branches"**
- Check network connection
- Verify GitHub credentials
- Ensure you have push permissions to the repo
- Check if repo is archived or locked

**"Remote and local commits don't match"**
- This might be normal if you pushed multiple branches
- Verify manually on GitHub
- Check that the correct branch was pushed

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

# Sync to GitHub (automated: backup + cleanup + force push)
./scripts/sync_github.sh

# Clean Git history manually (use with caution!)
./scripts/cleanup-history.sh

# After manual cleanup, re-add remote and force push
git remote add origin <url>
git push --force --all
```

---

## See Also

- [Monorepo Setup](./MONOREPO_SETUP_COMPLETE.md)
- [Phase 2 Plan](./PHASE_2_PLAN.md)
- [Project Structure](./PROJECT_STRUCTURE.md)


