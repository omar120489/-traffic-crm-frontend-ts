#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Traffic CRM - Clutter Cleanup Script"
echo "========================================"
echo ""

# Function to prompt for confirmation
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Function to get directory size in MB
get_size_mb() {
    if [ -e "$1" ]; then
        du -sm "$1" 2>/dev/null | awk '{print $1}'
    else
        echo "0"
    fi
}

TOTAL_SIZE=0
cd "$(dirname "$0")/.."

echo "Analyzing clutter..."
echo ""

# 1. Template Archives (384 MB)
TEMPLATE_SIZE=0
for dir in "javascript_v5.0.0-eaoys0 (2)" "javascript_v5.0.0-eaoys0 (3)" \
           "typescript_v5.0.0-nq4ghb (2)" "typescript_v5.0.0-nq4ghb (3)" \
           rio-travels-v3.9.0.fig full-version seed; do
    TEMPLATE_SIZE=$((TEMPLATE_SIZE + $(get_size_mb "$dir")))
done

if [ $TEMPLATE_SIZE -gt 0 ]; then
    echo "📦 Template archives: ${TEMPLATE_SIZE} MB"
    if confirm "  Delete template archives?"; then
        rm -rf "javascript_v5.0.0-eaoys0 (2)" "javascript_v5.0.0-eaoys0 (3)" \
               "typescript_v5.0.0-nq4ghb (2)" "typescript_v5.0.0-nq4ghb (3)" \
               rio-travels-v3.9.0.fig full-version seed 2>/dev/null || true
        echo "  ✅ Removed template archives"
        TOTAL_SIZE=$((TOTAL_SIZE + TEMPLATE_SIZE))
    fi
fi

# 2. Old backup (17 MB)
BACKUP_SIZE=$(get_size_mb "backup_src_20251023-000400")
if [ $BACKUP_SIZE -gt 0 ]; then
    echo "💾 Old backup: ${BACKUP_SIZE} MB"
    if confirm "  Delete old backup (newer one in .backups/)?"; then
        rm -rf backup_src_20251023-000400
        echo "  ✅ Removed old backup"
        TOTAL_SIZE=$((TOTAL_SIZE + BACKUP_SIZE))
    fi
fi

# 3. Module packs
if [ -d "chat-module-pack-v1" ] || [ -d "vite-standard-modules-pack" ]; then
    echo "📦 Module packs (already integrated into src/)"
    if confirm "  Delete module pack directories?"; then
        rm -rf chat-module-pack-v1 vite-standard-modules-pack 2>/dev/null || true
        echo "  ✅ Removed module packs"
    fi
fi

# 4. Berry template HTML files
if [ -f "discord.html" ] || [ -d "docs_and_support-rwulxu" ]; then
    echo "📄 Berry template HTML redirect files"
    if confirm "  Delete template HTML files?"; then
        rm -f discord.html
        rm -rf docs_and_support-rwulxu
        echo "  ✅ Removed template HTML files"
    fi
fi

# 5. Conflicting lock files
if [ -f "package-lock.json" ] || [ -f "yarn.lock" ]; then
    echo "🔒 Conflicting lock files (you're using pnpm)"
    if confirm "  Remove npm/yarn lock files?"; then
        rm -f package-lock.json yarn.lock
        echo "  ✅ Removed conflicting lock files"
    fi
fi

# 6. Old checkup directory
if [ -d ".project_checkup" ]; then
    echo "📊 Old .project_checkup (superseded by .project_audit)"
    if confirm "  Delete .project_checkup?"; then
        rm -rf .project_checkup
        echo "  ✅ Removed old checkup directory"
    fi
fi

# 7. Move scripts to scripts/
LOOSE_SCRIPTS=""
[ -f "deploy-docker.sh" ] && LOOSE_SCRIPTS="$LOOSE_SCRIPTS deploy-docker.sh"
[ -f "deploy-vercel.sh" ] && LOOSE_SCRIPTS="$LOOSE_SCRIPTS deploy-vercel.sh"
[ -f "smoke_test.sh" ] && LOOSE_SCRIPTS="$LOOSE_SCRIPTS smoke_test.sh"
[ -f "verify-setup.sh" ] && LOOSE_SCRIPTS="$LOOSE_SCRIPTS verify-setup.sh"

if [ -n "$LOOSE_SCRIPTS" ]; then
    echo "📜 Loose scripts in root"
    if confirm "  Move scripts to scripts/ directory?"; then
        for script in $LOOSE_SCRIPTS; do
            if [ -f "$script" ]; then
                mv "$script" scripts/
                chmod +x "scripts/$script"
            fi
        done
        [ -f "fix_markdown.sh" ] && rm -f fix_markdown.sh
        echo "  ✅ Consolidated scripts"
    fi
fi

# 8. .qodo directory
if [ -d ".qodo" ]; then
    echo "🤖 .qodo directory (AI tool)"
    if confirm "  Delete .qodo?"; then
        rm -rf .qodo
        echo "  ✅ Removed .qodo"
    fi
fi

# 9. Check build/ directory
if [ -d "build" ]; then
    echo "🏗️  build/ directory found"
    if confirm "  Check if build/ is used? (will grep configs)"; then
        REFS=$(grep -r "build/" --include="*.{json,mjs,ts,js}" . 2>/dev/null | grep -v node_modules | wc -l)
        echo "  Found $REFS references to 'build/' in config files"
        if [ "$REFS" -eq 0 ]; then
            if confirm "  No references found. Delete build/?"; then
                rm -rf build
                echo "  ✅ Removed unused build/ directory"
            fi
        fi
    fi
fi

echo ""
echo "🎉 Cleanup complete!"
if [ $TOTAL_SIZE -gt 0 ]; then
    echo "   Freed ~${TOTAL_SIZE} MB disk space"
fi
echo ""
echo "Next steps:"
echo "1. Run: git status"
echo "2. Verify: pnpm run typecheck && pnpm build"
echo "3. Commit: git add -A && git commit -m 'chore: remove clutter'"
echo ""
echo "📖 See .project_audit/EXTRA_FILES_ANALYSIS.md for details"
