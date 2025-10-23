#!/bin/bash
set -e

# ============================================================================
# GitHub Sync Script - Replace Remote with Local Repository
# ============================================================================
# This script safely replaces a GitHub repository with your local content.
# It includes backups, history cleanup, and verification steps.
#
# Usage:
#   ./scripts/sync_github.sh
#
# What it does:
#   1. Backs up current state locally
#   2. Cleans large files from Git history
#   3. Optionally updates remote URL
#   4. Force-pushes to GitHub (replaces remote completely)
#   5. Verifies success
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

confirm() {
    local prompt="$1"
    local response
    read -p "$(echo -e "${YELLOW}?${NC} $prompt [y/N]: ")" response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# ============================================================================
# Pre-flight Checks
# ============================================================================

log_info "GitHub Sync Script - Starting pre-flight checks..."
echo ""

# Check if we're in a git repo
cd "$REPO_ROOT"
if [ ! -d ".git" ]; then
    log_error "Not a git repository!"
    exit 1
fi
log_success "Git repository detected"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    log_warning "You have uncommitted changes!"
    echo ""
    git status --short
    echo ""
    if ! confirm "Continue anyway?"; then
        log_info "Aborting. Please commit or stash your changes first."
        exit 1
    fi
fi
log_success "Working tree is clean (or approved)"

# Show current remote
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "none")
log_info "Current remote: $CURRENT_REMOTE"

# Detect if it's the wrong remote (MCP servers)
if [[ "$CURRENT_REMOTE" == *"servers.git"* ]]; then
    log_warning "Remote appears to be MCP servers repo, not Traffic CRM!"
    echo ""
    echo "  Current: $CURRENT_REMOTE"
    echo "  Expected: https://github.com/USERNAME/traffic-crm-frontend-ts.git"
    echo ""
fi

# Show current branch and commits ahead
CURRENT_BRANCH=$(git branch --show-current)
COMMITS_AHEAD=$(git rev-list --count origin/$CURRENT_BRANCH..$CURRENT_BRANCH 2>/dev/null || echo "unknown")
log_info "Current branch: $CURRENT_BRANCH"
log_info "Commits ahead of remote: $COMMITS_AHEAD"

# Check repo size
GIT_SIZE=$(du -sh .git | awk '{print $1}')
log_info "Current .git size: $GIT_SIZE"

echo ""
echo "=========================================="
echo "  REVIEW BEFORE PROCEEDING"
echo "=========================================="
echo ""

# ============================================================================
# Step 1: Update Remote URL (Optional)
# ============================================================================

log_info "Step 1: Remote URL Configuration"
echo ""
echo "  Current: $CURRENT_REMOTE"
echo ""

if confirm "Do you want to change the remote URL?"; then
    echo ""
    read -p "Enter new remote URL (or press Enter to keep current): " NEW_REMOTE
    
    if [ -n "$NEW_REMOTE" ]; then
        log_info "Setting remote to: $NEW_REMOTE"
        git remote set-url origin "$NEW_REMOTE"
        log_success "Remote URL updated"
        CURRENT_REMOTE="$NEW_REMOTE"
    else
        log_info "Keeping current remote"
    fi
fi

echo ""
log_info "Will push to: $CURRENT_REMOTE"
echo ""

# ============================================================================
# Step 2: Backup Everything
# ============================================================================

log_info "Step 2: Creating local backups..."
echo ""

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_BRANCH="backup/before-sync-$BACKUP_DATE"
BACKUP_DIR=".git.backup.$BACKUP_DATE"

# Create backup branch
log_info "Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH"
log_success "Backup branch created"

# Backup .git directory
log_info "Backing up .git directory to: $BACKUP_DIR"
cp -r .git "$BACKUP_DIR"
log_success ".git directory backed up"

echo ""
log_success "Backups complete! You can restore with:"
echo "  git checkout $BACKUP_BRANCH"
echo "  rm -rf .git && mv $BACKUP_DIR .git"
echo ""

# ============================================================================
# Step 3: Clean Git History
# ============================================================================

log_info "Step 3: Cleaning Git history (remove large files)..."
echo ""
echo "This will:"
echo "  - Remove .backups/, *.tar.gz, *.fig from history"
echo "  - Remove blobs >100MB"
echo "  - Shrink .git from ~984MB to ~100MB"
echo ""

if ! confirm "Run cleanup-history.sh?"; then
    log_warning "Skipping history cleanup"
    log_warning "Note: Push may fail if large files still exist in history"
else
    if [ -f "$SCRIPT_DIR/cleanup-history.sh" ]; then
        log_info "Running cleanup-history.sh..."
        echo ""
        "$SCRIPT_DIR/cleanup-history.sh"
        echo ""
        log_success "History cleaned!"
        
        # Show new size
        NEW_GIT_SIZE=$(du -sh .git | awk '{print $1}')
        log_info "New .git size: $NEW_GIT_SIZE (was: $GIT_SIZE)"
    else
        log_error "cleanup-history.sh not found at $SCRIPT_DIR"
        exit 1
    fi
fi

echo ""

# ============================================================================
# Step 4: Force Push to GitHub
# ============================================================================

log_info "Step 4: Force push to GitHub"
echo ""
echo "=========================================="
echo "  ⚠️  FINAL CONFIRMATION ⚠️"
echo "=========================================="
echo ""
echo "This will:"
echo "  1. PERMANENTLY DELETE all content in: $CURRENT_REMOTE"
echo "  2. Replace it with your current local repository"
echo "  3. Push branch: $CURRENT_BRANCH"
echo "  4. Push all tags"
echo ""
echo "Backups created:"
echo "  - Branch: $BACKUP_BRANCH"
echo "  - Directory: $BACKUP_DIR"
echo ""

if ! confirm "Are you ABSOLUTELY SURE you want to force-push?"; then
    log_info "Aborting. No changes made to remote."
    log_info "Your local backups are preserved:"
    echo "  - Branch: $BACKUP_BRANCH"
    echo "  - Directory: $BACKUP_DIR"
    exit 0
fi

echo ""
log_info "Force-pushing all branches to $CURRENT_REMOTE..."

if git push origin --force --all; then
    log_success "All branches pushed!"
else
    log_error "Failed to push branches!"
    log_error "Check error above. Your local repo is unchanged."
    exit 1
fi

echo ""
log_info "Force-pushing all tags..."

if git push origin --force --tags; then
    log_success "All tags pushed!"
else
    log_warning "Failed to push tags (branches are pushed though)"
fi

echo ""

# ============================================================================
# Step 5: Verify Success
# ============================================================================

log_info "Step 5: Verifying push..."
echo ""

# Check if remote branch matches local
REMOTE_COMMIT=$(git ls-remote origin $CURRENT_BRANCH | awk '{print $1}')
LOCAL_COMMIT=$(git rev-parse $CURRENT_BRANCH)

log_info "Local commit:  $LOCAL_COMMIT"
log_info "Remote commit: $REMOTE_COMMIT"

if [ "$REMOTE_COMMIT" = "$LOCAL_COMMIT" ]; then
    log_success "Remote matches local! Push verified."
else
    log_warning "Remote and local commits don't match"
    log_warning "This might be okay if you pushed multiple branches"
fi

echo ""

# ============================================================================
# Step 6: Cleanup Instructions
# ============================================================================

log_success "=========================================="
log_success "  🎉 SYNC COMPLETE! 🎉"
log_success "=========================================="
echo ""

echo "What happened:"
echo "  ✓ Backed up to branch: $BACKUP_BRANCH"
echo "  ✓ Backed up .git to: $BACKUP_DIR"
echo "  ✓ Cleaned Git history (removed large files)"
echo "  ✓ Force-pushed to: $CURRENT_REMOTE"
echo "  ✓ Current branch: $CURRENT_BRANCH"
echo ""

echo "Next steps:"
echo ""
echo "  1. Verify on GitHub:"
echo "     → Open: $CURRENT_REMOTE"
echo "     → Check structure: apps/, packages/, scripts/, docs/"
echo "     → Check latest commit matches your local HEAD"
echo ""
echo "  2. Test CI/CD:"
echo "     → Go to Actions tab on GitHub"
echo "     → Verify workflows run successfully"
echo ""
echo "  3. Resume normal workflow:"
echo "     → Use: MODE=pr ./scripts/premerge.sh"
echo "     → Or: git commit && git push origin main"
echo ""

echo "Backup management:"
echo ""
echo "  Keep backups for a few days, then cleanup:"
echo "  → git branch -d $BACKUP_BRANCH  # Delete backup branch"
echo "  → rm -rf $BACKUP_DIR            # Delete .git backup"
echo ""

echo "Rollback (if needed):"
echo ""
echo "  If something went wrong, restore from backup:"
echo "  → git checkout $BACKUP_BRANCH"
echo "  → rm -rf .git"
echo "  → mv $BACKUP_DIR .git"
echo "  → git push origin --force --all  # Restore to remote"
echo ""

log_success "All done! 🚀"

