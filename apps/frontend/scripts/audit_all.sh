#!/usr/bin/env bash
set -euo pipefail

OUT=".project_audit"
mkdir -p "$OUT"

report="$OUT/REPORT.md"
manifest="$OUT/manifest.json"
routes="$OUT/routes.txt"
menus="$OUT/menus.txt"
mismatch="$OUT/routes_vs_menu.md"
imports="$OUT/imports_top.txt"
legacy="$OUT/legacy_hits.txt"
large="$OUT/large_files.txt"
todos="$OUT/todos_fixmes.txt"
licenses="$OUT/license_headers.md"
dupes="$OUT/duplicate_files.txt"

section(){ echo -e "\n## $1\n" >> "$report"; }

# fresh report
cat > "$report" <<HDR
# Project Audit Report

Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Root: $(pwd)

---
HDR

### 0) Git status
section "Git Status"
{
  echo '```bash'
  (git rev-parse --is-inside-work-tree >/dev/null 2>&1 && git status -b --porcelain=v1) || echo "Not a git repo"
  echo '```'
} >> "$report"

### 1) Full file tree (top 2 levels printed in report, full saved)
section "File Tree (top 2 levels)"
{
  echo '```text'
  (command -v tree >/dev/null 2>&1 && tree -L 2 || find . -maxdepth 2 -print) | sed 's#^\./##' | head -n 500
  echo '```'
} >> "$report"

# full tree to file
(command -v tree >/dev/null 2>&1 && tree -a -I "node_modules|.git" > "$OUT/tree_full.txt") || find . -not -path "./node_modules/*" -not -path "./.git/*" -print > "$OUT/tree_full.txt"

### 2) Build a JSON manifest of all files (path, size, ext, text/binary guess)
node scripts/manifest.ts > "$manifest" 2>/dev/null || npx -y ts-node scripts/manifest.ts > "$manifest" || echo "{}" > "$manifest"
section "Manifest"
echo "- Saved to \`$manifest\`" >> "$report"

### 3) TypeScript + ESLint summaries
section "TypeScript Check"
{
  echo '```bash'
  if [ -f tsconfig.json ]; then (npx -y tsc --noEmit || true); else echo "No tsconfig.json"; fi
  echo '```'
} >> "$report"

section "ESLint"
{
  echo '```bash'
  if [ -f eslint.config.mjs ] || compgen -G ".eslintrc.*" >/dev/null; then (npx -y eslint "src/**/*.{ts,tsx,js,jsx}" || true); else echo "No ESLint config"; fi
  echo '```'
} >> "$report"

### 4) Routes & Menus + mismatch table
node scripts/audit_routes.ts > "$routes" 2>/dev/null || npx -y ts-node scripts/audit_routes.ts > "$routes" || true
node scripts/audit_menus.ts > "$menus" 2>/dev/null || npx -y ts-node scripts/audit_menus.ts > "$menus" || true
node scripts/routes_vs_menu.ts "$routes" "$menus" > "$mismatch" 2>/dev/null || npx -y ts-node scripts/routes_vs_menu.ts "$routes" "$menus" > "$mismatch" || true
section "Routes vs Menu"
{
  echo -e "- Routes saved to \`$routes\`\n- Menus saved to \`$menus\`\n"
  echo "Mismatch matrix:"
  echo
  cat "$mismatch" 2>/dev/null || echo "_No mismatch file produced_"
} >> "$report"

### 5) Import hotspots & legacy patterns
node scripts/audit_imports.ts > "$imports" 2>/dev/null || npx -y ts-node scripts/audit_imports.ts > "$imports" || true
section "Import Hotspots"
{ echo '```text'; head -n 200 "$imports" || true; echo '```'; } >> "$report"

# Legacy list from earlier
LEGACY='ui-component|@tabler/icons-react|apexcharts|react-perfect-scrollbar|fullcalendar|moment|MainCard'
(git grep -nE "$LEGACY" -- src || rg -n "$LEGACY" src || grep -RniE "$LEGACY" src) > "$legacy" 2>/dev/null || true
section "Legacy Pattern Hits"
{ echo '```text'; sed -e 's#^\./##' "$legacy" 2>/dev/null | head -n 400 || true; echo '```'; } >> "$report"

### 6) Large assets (>= 1.5 MB)
(find . -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.svg" -o -name "*.pdf" -o -name "*.mp4" -o -name "*.mov" -o -name "*.zip" \) -size +1500k -print 2>/dev/null) > "$large" || true
section "Large Files (>=1.5MB)"
{ echo '```text'; sed -e 's#^\./##' "$large" 2>/dev/null | head -n 200 || true; echo '```'; } >> "$report"

### 7) TODO/FIXME scan
(git grep -nE "TODO|FIXME|HACK|@ts-ignore" -- ':!node_modules' || rg -n "TODO|FIXME|HACK|@ts-ignore" || true) > "$todos" 2>/dev/null || true
section "TODO / FIXME / HACK / @ts-ignore"
{ echo '```text'; sed -e 's#^\./##' "$todos" 2>/dev/null | head -n 300 || true; echo '```'; } >> "$report"

### 8) License headers (simple heuristic)
node scripts/license_check.ts > "$licenses" 2>/dev/null || npx -y ts-node scripts/license_check.ts > "$licenses" || echo "_Skipped_" > "$licenses"
section "License Header Check"
cat "$licenses" >> "$report"

### 9) Duplicate filenames (useful for collisions)
{ find src -type f -printf "%f\n" 2>/dev/null | sort | uniq -d > "$dupes" || true; } || true
section "Duplicate Filenames in src/"
{ echo '```text'; cat "$dupes" 2>/dev/null || true; echo '```'; } >> "$report"

### 10) Dependency scan (best-effort)
section "Depcheck (unused deps)"
{ echo '```bash'; (npx -y depcheck || true); echo '```'; } >> "$report"

echo
echo "== Done =="
echo "Open $report"

