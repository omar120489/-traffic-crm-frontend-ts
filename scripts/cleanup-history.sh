#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Git History Cleanup for Traffic CRM
# Removes large files that block GitHub push
#
# ⚠️  WARNING: This rewrites Git history!
#    - Coordinate with your team before running
#    - All collaborators will need to re-clone or rebase
#    - Backup your repo first: tar -czf repo-backup.tar.gz .git
# ──────────────────────────────────────────────────────────────────────────────

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 Git History Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
  echo "❌ git-filter-repo not found. Install it first:"
  echo ""
  echo "   macOS:   brew install git-filter-repo"
  echo "   Ubuntu:  sudo apt install git-filter-repo"
  echo "   Arch:    sudo pacman -S git-filter-repo"
  echo "   pip:     pip install git-filter-repo"
  echo ""
  exit 1
fi

# Safety check: ensure working tree is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Your working tree has uncommitted changes."
  echo "   Please commit or stash first, then re-run."
  exit 1
fi

echo "📊 Current repo size:"
du -sh .git
echo ""

echo "⚠️  This will remove from history:"
echo "   • .backups/ directory (all files)"
echo "   • *.tar.gz files (backups)"
echo "   • *.fig files (Figma)"
echo "   • backup_* directories"
echo "   • Full-version/ and seed/ template directories"
echo "   • Any blob > 100MB"
echo ""

read -p "Continue? (type 'yes' to proceed): " confirm
if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "🔄 Creating backup..."
BACKUP_NAME="repo-history-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "../$BACKUP_NAME" .git
echo "   ✅ Backup saved: ../$BACKUP_NAME"
echo ""

echo "🗑️  Removing large files from history..."

# Remove specific paths known to be large
git filter-repo --force \
  --path .backups/ --invert-paths \
  --path backup_src_20251023-051653.tar.gz --invert-paths \
  --path berry-v3.9.0.fig --invert-paths \
  --path-glob 'backup_*/' --invert-paths \
  --path-glob '*.tar.gz' --invert-paths \
  --path-glob 'full-version/' --invert-paths \
  --path-glob 'seed/' --invert-paths \
  --path-glob 'javascript_v5.0.0-*/' --invert-paths \
  --path-glob 'typescript_v5.0.0-*/' --invert-paths

# Also remove any remaining blobs > 100MB
git filter-repo --force --strip-blobs-bigger-than 100M

echo "   ✅ History cleaned"
echo ""

echo "📊 New repo size:"
du -sh .git
echo ""

echo "🔄 Cleanup & garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive
echo "   ✅ Done"
echo ""

echo "📊 Final repo size:"
du -sh .git
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ History cleaned successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📤 Next steps:"
echo ""
echo "1) Re-add your remote (filter-repo removes it for safety):"
echo "   git remote add origin <your-repo-url>"
echo ""
echo "2) Force-push to update remote history:"
echo "   git push --force --all"
echo "   git push --force --tags"
echo ""
echo "3) Notify team members to re-clone:"
echo "   git clone <your-repo-url> traffic-crm-clean"
echo ""
echo "⚠️  Important: Old clones won't work correctly after force-push."
echo "   Team members should re-clone or run:"
echo "   git fetch origin && git reset --hard origin/main"
echo ""


