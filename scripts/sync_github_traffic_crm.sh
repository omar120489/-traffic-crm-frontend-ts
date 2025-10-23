#!/usr/bin/env bash
set -euo pipefail

TARGET_REMOTE="${TARGET_REMOTE:-https://github.com/omar120489/traffic-crm-frontend-ts.git}"
CLEANUP_SCRIPT="${CLEANUP_SCRIPT:-./scripts/cleanup-history.sh}"

ts() { date +"%Y-%m-%d %H:%M:%S"; }
say() { printf "%s %s\n" "$(ts)" "$*"; }
ok()  { say "✅ $*"; }
warn(){ say "⚠️  $*"; }
err() { say "❌ $*" >&2; exit 1; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || err "Not a Git repository."
if ! git diff --quiet || ! git diff --cached --quiet; then
  err "Working tree has uncommitted changes. Commit or stash before running."
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"
ahead="$(git rev-list --left-right --count "${current_branch}"...origin/"${current_branch}" 2>/dev/null | awk '{print $1}' || echo "n/a")"
remote_url="$(git remote get-url origin 2>/dev/null || echo "(none)")"
git_size="$(du -sh .git 2>/dev/null | awk '{print $1}')"

say "ℹ Current branch: ${current_branch}"
say "ℹ Commits ahead of remote: ${ahead}"
say "ℹ Current remote: ${remote_url}"
say "ℹ .git size: ${git_size}"

say "ℹ Auto-configuring remote to: ${TARGET_REMOTE}"
git remote set-url origin "${TARGET_REMOTE}"
ok "Remote set to: $(git remote get-url origin)"

stamp="$(date +%Y%m%d-%H%M%S)"
backup_branch="backup/before-sync-${stamp}"
backup_git_dir=".git.backup.${stamp}"

say "ℹ Creating backup branch: ${backup_branch}"
git branch "${backup_branch}" >/dev/null 2>&1 || true
ok "Backup branch created: ${backup_branch}"

say "ℹ Backing up .git to: ${backup_git_dir}"
cp -R .git "${backup_git_dir}"
ok ".git backup complete"
say "ℹ Restore guide:"
say "   git checkout ${backup_branch}"
say "   rm -rf .git && mv ${backup_git_dir} .git"

if [ -x "${CLEANUP_SCRIPT}" ]; then
  echo
  read -r -p "Run cleanup-history.sh to shrink repo (recommended)? [y/N]: " do_cleanup
  if [[ "${do_cleanup}" =~ ^[Yy]$ ]]; then
    say "ℹ Running ${CLEANUP_SCRIPT} ..."
    "${CLEANUP_SCRIPT}" || err "cleanup-history.sh failed"
    ok "Cleanup complete"
  else
    warn "Skipping cleanup. Large files may still block push."
  fi
else
  warn "cleanup-history.sh not found/executable (${CLEANUP_SCRIPT}). Skipping."
fi

echo
say "=========================================="
say "  FINAL CONFIRMATION"
say "=========================================="
say "This will FORCE-PUSH all branches and tags to:"
say "  ${TARGET_REMOTE}"
say "Backups:"
say "  Branch: ${backup_branch}"
say "  .git:   ${backup_git_dir}"
echo
read -r -p "Are you ABSOLUTELY sure you want to force-push? [y/N]: " okpush
[[ "${okpush}" =~ ^[Yy]$ ]] || err "Aborted by user."

say "ℹ Force-pushing all branches..."
git push origin --force --all
ok "Branches pushed"

say "ℹ Force-pushing all tags..."
git push origin --force --tags
ok "Tags pushed"

say "ℹ Local HEAD: $(git rev-parse HEAD)"
ok "Sync complete. Verify on GitHub, then resume normal workflow (MODE=pr ./scripts/premerge.sh)."

