#!/usr/bin/env bash
# Traffic CRM — Asset Cleanup & Optimization
# Usage:
#   ./cleanup_assets.sh                 # dry-run (shows actions only)
#   ./cleanup_assets.sh --run           # execute changes (with confirm)
#   ./cleanup_assets.sh --run --auto-yes # execute without interactive prompts
#   ./cleanup_assets.sh --only-report   # produce inventory & plan only
#   Flags: --no-optimize --no-webp --skip-delete

set -euo pipefail

### CONFIG #####################################################################
ROOT_DIR="$(pwd)"
ASSETS_DIR="apps/frontend/src/assets/images"
REMOVE_DIRS=(
  "blog"
  "e-commerce"
  "landing/offer"
  "landing/pre-apps"
  "testaments"
  "pages"
)
REPORT_FILE="docs/ASSETS_CLEANUP_REPORT.md"
BRANCH_NAME="assets-cleanup"

# Tools (optional if optimizing)
PNGQUANT_BIN="${PNGQUANT_BIN:-pngquant}"
JPEGOPTIM_BIN="${JPEGOPTIM_BIN:-jpegoptim}"
CWEBP_BIN="${CWEBP_BIN:-cwebp}"

### FLAGS ######################################################################
DRY_RUN=1
EXECUTE=0
AUTO_YES=0
ONLY_REPORT=0
DO_OPTIMIZE=1
DO_WEBP=1
DO_DELETE=1

for arg in "$@"; do
  case "$arg" in
    --run) DRY_RUN=0; EXECUTE=1 ;;
    --auto-yes|--yes|-y) AUTO_YES=1 ;;
    --only-report) ONLY_REPORT=1 ;;
    --no-optimize) DO_OPTIMIZE=0 ;;
    --no-webp) DO_WEBP=0 ;;
    --skip-delete) DO_DELETE=0 ;;
    *) echo "Unknown flag: $arg" >&2; exit 1 ;;
  esac
done

### UTIL #######################################################################
log() { printf "\033[1;34m[INFO]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[WARN]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[ERR]\033[0m %s\n" "$*" >&2; }
ok()  { printf "\033[1;32m[OK]\033[0m  %s\n" "$*"; }

require_git_clean() {
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    err "Not inside a git repository."; exit 1
  fi
  if [ -n "$(git status --porcelain)" ]; then
    warn "Working tree not clean. Please commit/stash before proceeding."
  fi
}

confirm() {
  if [ $AUTO_YES -eq 1 ]; then return 0; fi
  read -r -p "${1:-Proceed?} [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]]
}

exists() { command -v "$1" >/dev/null 2>&1; }

bytes() { # human readable size for a path (sum)
  if [ -d "$1" ]; then
    du -sk "$1" 2>/dev/null | awk '{print $1*1024}'
  elif [ -f "$1" ]; then
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo 0
  else
    echo 0
  fi
}

hr_size() {
  awk 'function human(x){ s="B KMGTPE"; while (x>=1024 && length(s)>1){x/=1024; s=substr(s,3)} return sprintf("%.1f %s", x, substr(s,1,1)) } {print human($1)}'
}

### REPORTING ##################################################################
start_size=$(bytes "$ASSETS_DIR")
start_hr=$(echo "$start_size" | hr_size)
ts="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"

write_report_header() {
  mkdir -p "$(dirname "$REPORT_FILE")"
  cat > "$REPORT_FILE" <<EOF
# 📊 Assets Cleanup Report

**Generated:** $ts  
**Mode:** $([ $DRY_RUN -eq 1 ] && echo "Dry-run" || echo "Execute")  
**Root:** \`$ROOT_DIR\`  
**Assets Directory:** \`$ASSETS_DIR\`

---
EOF
}

append_section() { printf "\n## %s\n\n" "$1" >> "$REPORT_FILE"; }

inventory() {
  append_section "Inventory (Before)"
  echo "| Type | Count | Total Size |" >> "$REPORT_FILE"
  echo "|------|------:|-----------:|" >> "$REPORT_FILE"

  total_files=$(find "$ASSETS_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
  png_count=$(find "$ASSETS_DIR" -type f -iname "*.png" | wc -l | tr -d ' ')
  jpg_count=$(find "$ASSETS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | wc -l | tr -d ' ')
  svg_count=$(find "$ASSETS_DIR" -type f -iname "*.svg" | wc -l | tr -d ' ')

  printf "| PNG | %s | - |\n" "$png_count" >> "$REPORT_FILE"
  printf "| JPG | %s | - |\n" "$jpg_count" >> "$REPORT_FILE"
  printf "| SVG | %s | - |\n" "$svg_count" >> "$REPORT_FILE"
  printf "| **All** | **%s** | **%s** |\n" "$total_files" "$start_hr" >> "$REPORT_FILE"

  append_section "Planned Removals"
  printf "Directories marked for deletion (if present):\n\n" >> "$REPORT_FILE"
  for d in "${REMOVE_DIRS[@]}"; do
    printf -- "- \`%s/%s\`\n" "$ASSETS_DIR" "$d" >> "$REPORT_FILE"
  done
}

### ACTIONS ####################################################################
create_branch() {
  if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    log "Branch $BRANCH_NAME already exists; switching."
    git checkout "$BRANCH_NAME"
  else
    log "Creating branch $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"
  fi
}

delete_unused() {
  [ $DO_DELETE -eq 1 ] || { warn "Skipping deletes (--skip-delete)."; return; }
  append_section "Deletions"
  for d in "${REMOVE_DIRS[@]}"; do
    path="$ASSETS_DIR/$d"
    if [ -e "$path" ]; then
      sz=$(bytes "$path"); hr=$(echo "$sz" | hr_size)
      if [ $DRY_RUN -eq 1 ]; then
        printf -- "- WOULD DELETE \`%s\` (%s)\n" "$path" "$hr" >> "$REPORT_FILE"
        log "Would delete: $path ($hr)"
      else
        log "Deleting: $path ($hr)"
        git rm -r --quiet "$path" || rm -rf "$path"
        printf -- "- Deleted \`%s\` (%s)\n" "$path" "$hr" >> "$REPORT_FILE"
      fi
    else
      printf -- "- Not found: \`%s\`\n" "$path" >> "$REPORT_FILE"
    fi
  done
}

verify_references() {
  append_section "Reference Scan"
  printf "Checking for references to deleted directories...\n\n" >> "$REPORT_FILE"
  
  for d in "${REMOVE_DIRS[@]}"; do
    printf "### %s\n\n" "$d" >> "$REPORT_FILE"
    if grep -RIn --include="*.{ts,tsx,js,jsx,scss}" "$d/" apps/frontend/src 2>/dev/null | head -5; then
      grep -RIn --include="*.{ts,tsx,js,jsx,scss}" "$d/" apps/frontend/src 2>/dev/null | head -5 | sed 's/^/- /' >> "$REPORT_FILE"
    else
      printf -- "- No references found\n" >> "$REPORT_FILE"
    fi
    printf "\n" >> "$REPORT_FILE"
  done
}

optimize_png_jpg() {
  [ $DO_OPTIMIZE -eq 1 ] || { warn "Skipping optimization (--no-optimize)."; return; }

  missing_tools=0
  for t in "$PNGQUANT_BIN" "$JPEGOPTIM_BIN"; do
    if ! exists "$t"; then
      warn "Missing tool: $t (install via Homebrew: brew install pngquant jpegoptim)"
      missing_tools=1
    fi
  done
  if [ $missing_tools -eq 1 ]; then
    warn "Skipping optimization due to missing tools."
    return
  fi

  append_section "Optimization (PNG/JPG)"
  if [ $DRY_RUN -eq 1 ]; then
    log "Would optimize PNG/JPG under $ASSETS_DIR"
    printf -- "- Would run pngquant (65–80 quality) on PNGs\n" >> "$REPORT_FILE"
    printf -- "- Would run jpegoptim (max=85) on JPGs\n" >> "$REPORT_FILE"
  else
    log "Optimizing PNGs…"
    find "$ASSETS_DIR" -type f -iname "*.png" -print0 | xargs -0 -I{} "$PNGQUANT_BIN" --force --skip-if-larger --quality=65-80 --ext .png {} 2>/dev/null || true
    log "Optimizing JPGs…"
    find "$ASSETS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0 | xargs -0 -I{} "$JPEGOPTIM_BIN" --strip-all --max=85 --preserve {} 2>/dev/null || true
    printf -- "- PNG/JPG optimization completed\n" >> "$REPORT_FILE"
  fi
}

convert_to_webp() {
  [ $DO_WEBP -eq 1 ] || { warn "Skipping WebP conversion (--no-webp)."; return; }
  if ! exists "$CWEBP_BIN"; then
    warn "Missing tool: $CWEBP_BIN (install via Homebrew: brew install webp). Skipping WebP."
    return
  fi

  append_section "WebP Conversion"
  if [ $DRY_RUN -eq 1 ]; then
    log "Would convert PNG/JPG to WebP (q=80)…"
    printf -- "- Would generate .webp variants for PNG/JPG assets (q=80)\n" >> "$REPORT_FILE"
  else
    log "Converting PNG/JPG to WebP (q=80)…"
    while IFS= read -r -d '' f; do
      out="${f%.*}.webp"
      "$CWEBP_BIN" -quiet -q 80 "$f" -o "$out" 2>/dev/null || true
    done < <(find "$ASSETS_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)
    printf -- "- WebP conversion completed (non-destructive)\n" >> "$REPORT_FILE"
  fi
}

brand_todos() {
  append_section "Branding TODOs"
  cat >> "$REPORT_FILE" <<'EOF'
- Replace "RIO Travels" branding with "Traffic CRM"
  - Create `traffic-crm-logo.svg` (+ dark variant)
  - Update `apps/frontend/src/ui-component/Logo.jsx`
  - Update favicon + PWA manifest
- Consider lazy-loading heavy illustrations (maintenance/auth pages)
EOF
}

finalize_commit() {
  if [ $DRY_RUN -eq 1 ] || [ $EXECUTE -eq 0 ]; then
    warn "Dry-run mode: no commit created."
    return
  fi
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "chore(assets): remove unused template images, optimize PNG/JPG, add WebP variants"
    ok "Committed changes on branch $BRANCH_NAME"
  else
    warn "No changes to commit."
  fi
}

summary_sizes() {
  end_size=$(bytes "$ASSETS_DIR")
  end_hr=$(echo "$end_size" | hr_size)
  saved=$(( start_size - end_size ))
  saved_hr=$(echo "$saved" | hr_size)

  append_section "Size Summary"
  printf -- "- Before: **%s**\n- After: **%s**\n- Saved: **%s**\n" "$start_hr" "$end_hr" "$saved_hr" >> "$REPORT_FILE"

  log "Before: $start_hr | After: $end_hr | Saved: $saved_hr"
  ok  "Report: $REPORT_FILE"
}

### MAIN #######################################################################
log "Traffic CRM — Assets Cleanup & Optimization"
log "Assets dir: $ASSETS_DIR"
[ -d "$ASSETS_DIR" ] || { err "Assets directory not found: $ASSETS_DIR"; exit 1; }

write_report_header
inventory

if [ $ONLY_REPORT -eq 1 ]; then
  ok "Report generated (report-only mode)."
  exit 0
fi

require_git_clean

if [ $EXECUTE -eq 1 ]; then
  create_branch
  if [ $AUTO_YES -eq 0 ]; then
    confirm "Proceed with changes on branch '$BRANCH_NAME'?" || { warn "Aborted."; exit 0; }
  fi
else
  warn "Dry-run mode: add --run to execute changes."
fi

delete_unused
verify_references
optimize_png_jpg
convert_to_webp
brand_todos
finalize_commit
summary_sizes

