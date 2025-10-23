#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
OUT_DIR="${OUT_DIR:-.project_checkup}"
REPORT="$OUT_DIR/report.md"
mkdir -p "$OUT_DIR"

section () { echo -e "\n## $1\n" >> "$REPORT"; }

cat > "$REPORT" <<HDR
# Project Checkup Report

Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Root: $ROOT

---
HDR

section "Git Status"
{ echo '```bash'; (git rev-parse --is-inside-work-tree >/dev/null 2>&1 && git status --porcelain=v1 -b) || echo "Not a git repo"; echo '```'; } >> "$REPORT"

section "Branches & Remotes"
{ echo '```bash'; (git rev-parse --is-inside-work-tree >/dev/null 2>&1 && { git branch --show-current; git remote -v; git --no-pager log --oneline -n 10; }) || true; echo '```'; } >> "$REPORT"

section "Package Manager & Scripts"
{
  echo "Detected package manager:"
  if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then echo "- pnpm"; fi
  if command -v yarn >/dev/null 2>&1 && [ -f yarn.lock ]; then echo "- yarn"; fi
  if [ -f package-lock.json ]; then echo "- npm"; fi
  if [ -f package.json ]; then
    echo -e "\n**package.json scripts:**"
    node -e "console.log(JSON.stringify(require('./package.json').scripts,null,2))" || true
  else
    echo "No package.json found"
  fi
} >> "$REPORT"

section "TypeScript Check"
{
  if [ -f tsconfig.json ]; then
    echo '```bash'
    (npx -y tsc --noEmit || true)
    echo '```'
  else
    echo "_No tsconfig.json found_"
  fi
} >> "$REPORT"

section "ESLint"
{
  if [ -f eslint.config.mjs ] || compgen -G ".eslintrc.*" > /dev/null; then
    echo '```bash'
    (npx -y eslint "src/**/*.{ts,tsx,js,jsx}" || true)
    echo '```'
  else
    echo "_No ESLint config found_"
  fi
} >> "$REPORT"

section "Route Map"
{ echo '```bash'; node scripts/audit_routes.ts || npx -y ts-node scripts/audit_routes.ts || true; echo '```'; } >> "$REPORT"

section "Import Hotspots & Legacy Detection"
{ echo '```bash'; node scripts/audit_imports.ts || npx -y ts-node scripts/audit_imports.ts || true; echo '```'; } >> "$REPORT"

section "Large Files (>= 1.5 MB)"
{ echo '```bash'; (find . -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.svg" -o -name "*.pdf" -o -name "*.mp4" -o -name "*.mov" -o -name "*.zip" \) -size +1500k -print 2>/dev/null) || true; echo '```'; } >> "$REPORT"

section "Dependency Scan (best-effort)"
{ echo '```bash'; (npx -y depcheck || true); echo '```'; } >> "$REPORT"

section "Build (optional)"
{ echo "_Run manually if desired:_"; echo '```bash'; echo "pnpm build  # or: npm run build"; echo '```'; } >> "$REPORT"

echo "Report written to $REPORT"

