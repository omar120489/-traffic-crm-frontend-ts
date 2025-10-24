# Node Version Management Guide

## 🎯 Required Version

This project requires **Node 20.x** (specified in `.nvmrc`)

## ⚠️ Current Issue

Pre-push hook enforces Node 20, but system is running Node 24.7.0

## ✅ Solution Options

### Option A: Switch to Node 20 (Recommended)

```bash
# Install Node 20 if not present
nvm install 20

# Use Node 20 for this session
nvm use 20

# Verify version
node -v  # Should show v20.x.x

# Now git push will work
git push origin feat/deals-kanban
```

### Option B: Make Node 20 Default (Permanent Fix)

```bash
# Set Node 20 as default for all new shells
nvm alias default 20

# Verify
nvm current  # Should show v20.x.x

# Restart terminal or IDE
# All new shells will use Node 20
```

### Option C: Bypass Hook (Quick Push Only)

```bash
# Only use if you've already verified typecheck passes
git push --no-verify origin feat/deals-kanban
```

⚠️ **Note**: Option C bypasses the Sprint 2 typecheck. Only use if you're confident the code is clean.

---

## 🔍 Troubleshooting

### Hook Still Fails After `nvm use 20`

**Cause**: Different shell/terminal than where you ran `nvm use`

**Fix**:
```bash
# Ensure you're in the same terminal
which node && node -v

# If still showing Node 24, restart terminal or:
source ~/.nvm/nvm.sh
nvm use 20
```

### VS Code / GUI Git Clients

**Issue**: GUI tools may use a different shell that didn't load `nvm`

**Fix**:
1. Close VS Code / GUI tool
2. Run `nvm alias default 20` in terminal
3. Reopen VS Code / GUI tool
4. Or push from terminal where `nvm use 20` was run

### Verify Hook Configuration

```bash
# Check .nvmrc
cat .nvmrc  # Should show "20"

# Check pre-push hook
cat .husky/pre-push  # Should have Node version guard

# Test hook manually
.husky/pre-push  # Should pass if Node 20 is active
```

---

## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `nvm install 20` | Install Node 20 |
| `nvm use 20` | Switch to Node 20 (current shell) |
| `nvm alias default 20` | Make Node 20 default (all shells) |
| `nvm current` | Show active Node version |
| `node -v` | Verify Node version |
| `which node` | Show Node binary path |

---

## 🎯 Recommended Workflow

```bash
# One-time setup
nvm install 20
nvm alias default 20

# Verify (should show v20.x.x)
node -v

# Normal development
git push  # Hook will pass automatically

# If you need Node 24 for other projects
nvm use 24  # Temporarily switch
nvm use 20  # Switch back before pushing
```

---

## ✅ Current Status

- **Required**: Node 20.x
- **Current**: Node 24.7.0
- **Action**: Run `nvm use 20` before pushing
- **Permanent Fix**: Run `nvm alias default 20`

---

## 🚀 After Fixing

Once Node 20 is active:

```bash
# Verify Sprint 2 typecheck
cd apps/frontend
pnpm typecheck:sprint2  # Should pass

# Push normally
git push origin feat/deals-kanban  # Hook will pass
```

---

**Note**: The pre-push hook runs `pnpm tsc --noEmit -p tsconfig.sprint2.json` to ensure Sprint 2 code is type-safe before pushing. This is a quality gate to prevent TypeScript errors from reaching the remote.

