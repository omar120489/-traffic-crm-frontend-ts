# Local-Only Development Workflow

> **Why Local-Only?** Large files in Git history are currently blocking GitHub pushes. This guide helps you work efficiently locally until `cleanup-history.sh` is run.

## Current Status

- **Problem**: Repository contains large files (`.backups/*.tar.gz`, `berry-v3.9.0.fig`) in Git history
- **Impact**: `git push` fails with "remote rejected" error
- **Solution**: Use local-only workflow until history is cleaned with `cleanup-history.sh`
- **Timeline**: Run cleanup when ready to transition to PR-based workflow

## Daily Development Loop

### 1. Pull Latest (if working with others locally)

```bash
git checkout main
git pull origin main  # Will fail until history cleaned; skip for now
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Work and Commit

```bash
# Make your changes
git add .
git commit -m "feat: your descriptive message"
```

### 4. Verify Your Changes

```bash
# Full verification (SDK gen, builds, typechecks, API smoke)
./scripts/premerge.sh

# Skip SDK gen if Core API isn't running
SKIP_SDK=true ./scripts/premerge.sh

# Quick build check only
pnpm build
```

### 5. Merge Locally

```bash
# Merge and update main (no push to remote)
MODE=local ./scripts/premerge.sh

# Or manually:
git checkout main
git merge feature/your-feature-name --no-ff
git branch -d feature/your-feature-name
```

### 6. Tag Stable Points

```bash
# After successful merge, tag the stable version
git tag -a v1.2.3-local -m "Stable: Pagination rollout complete"
```

## Safety Practices

### Before Risky Changes

```bash
# Create backup branch
git branch backup/$(date +%Y%m%d-%H%M%S)

# Or backup entire .git directory
cp -r .git .git.backup.$(date +%Y%m%d-%H%M%S)
```

### Regular Checkpoints

```bash
# Tag stable points after each major feature
git tag -a v1.0.0-local -m "Stable: Initial monorepo setup"
git tag -a v1.1.0-local -m "Stable: SDK integration complete"
git tag -a v1.2.0-local -m "Stable: Pagination rollout"

# List all tags
git tag -l
```

### When to Backup

- Before running `cleanup-history.sh` (destructive, rewrites history)
- Before major refactors (e.g., directory restructuring)
- Before merging large features
- End of each day/week (stable checkpoint)

## Rollback Procedures

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
# Your changes are now staged; edit and re-commit
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
# WARNING: This discards all changes in that commit
```

### Restore from Backup Branch

```bash
# List backup branches
git branch | grep backup/

# Restore main from backup
git checkout main
git reset --hard backup/20251023-143000
```

### Restore from Stable Tag

```bash
# List tags
git tag -l

# Restore to tagged version
git checkout main
git reset --hard v1.1.0-local
```

### Emergency Recovery

```bash
# View reflog (history of HEAD changes)
git reflog

# Restore to specific reflog entry
git reset --hard HEAD@{5}

# Or restore entire .git from backup
rm -rf .git
cp -r .git.backup.20251023-143000 .git
```

## Integration with Scripts

### `./scripts/premerge.sh`

**Verification Only** (default):

```bash
./scripts/premerge.sh
# Runs: SDK gen → Builds → Typechecks → API smoke test
# Does NOT merge or push
```

**Skip SDK Generation**:

```bash
SKIP_SDK=true ./scripts/premerge.sh
# Use when Core API isn't running
```

**Local Merge** (merge to main, no remote push):

```bash
MODE=local ./scripts/premerge.sh
# Runs verification + merges to main locally
```

**PR Mode** (currently unavailable):

```bash
MODE=pr ./scripts/premerge.sh
# WILL FAIL: Blocked by large files in history
# Use MODE=local instead
```

### Common Issues

**Issue**: SDK generation fails with connection error

```bash
# Solution: Skip SDK gen if API isn't running
SKIP_SDK=true ./scripts/premerge.sh
```

**Issue**: Build fails in one package

```bash
# Solution: Build that package individually to see full error
cd apps/core-api  # or apps/frontend
pnpm build
```

**Issue**: TypeScript errors after merge

```bash
# Solution: Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

**Issue**: Accidentally ran `git push`

```bash
# You'll see: "remote: error: File X is Y MB; this exceeds GitHub's file size limit"
# This is expected; just continue working locally
```

## Verification Checklist

Before merging any feature:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` succeeds for all packages
- [ ] `pnpm typecheck` passes (or run `./scripts/premerge.sh`)
- [ ] Manual smoke test in browser (if frontend changes)
- [ ] API smoke test (if backend changes): `curl http://localhost:4040/health`

## Future: Transitioning to PR Workflow

### When to Clean History

Run `cleanup-history.sh` when you're ready to:

- Push to GitHub and enable PR workflow
- Collaborate with remote team members
- Set up CI/CD pipelines

### Steps to Enable Remote PRs

1. **Backup everything**:

   ```bash
   cp -r .git .git.backup.before-cleanup
   git branch backup/before-cleanup
   ```

2. **Run cleanup**:

   ```bash
   ./scripts/cleanup-history.sh
   ```

3. **Force push** (one-time only):

   ```bash
   git push origin main --force
   ```

4. **Update all clones**:

   ```bash
   # On other machines
   git fetch origin
   git reset --hard origin/main
   ```

5. **Enable PR mode**:

   ```bash
   MODE=pr ./scripts/premerge.sh
   # Should now work without push errors
   ```

### Team Coordination

If working with others:

1. **Announce cleanup**: Let everyone know you're rewriting history
2. **Set deadline**: Give team time to push any local work
3. **Run cleanup**: Execute `cleanup-history.sh` once
4. **Force push**: Push cleaned history to origin
5. **Team re-clones**: Everyone fetches and resets to new history

## Quick Reference

| Task                          | Command                                |
| ----------------------------- | -------------------------------------- |
| Create feature branch         | `git checkout -b feature/name`         |
| Verify changes                | `./scripts/premerge.sh`                |
| Merge locally                 | `MODE=local ./scripts/premerge.sh`     |
| Tag stable point              | `git tag -a vX.Y.Z-local -m "message"` |
| Backup branch                 | `git branch backup/$(date +%Y%m%d)`    |
| Undo last commit (keep work)  | `git reset --soft HEAD~1`              |
| Undo last commit (discard)    | `git reset --hard HEAD~1`              |
| Restore from tag              | `git reset --hard v1.0.0-local`        |
| View history                  | `git reflog`                           |
| Skip SDK gen                  | `SKIP_SDK=true ./scripts/premerge.sh`  |

## Additional Resources

- **Scripts documentation**: See `docs/SCRIPTS.md` for detailed script usage
- **History cleanup**: See `scripts/cleanup-history.sh` for how to fix push issues
- **CI/CD setup**: See `.github/workflows/ci.yml` for automated checks (future)

---

**Questions or issues?** Check `docs/SCRIPTS.md` or review `git reflog` for recent history.

