#!/usr/bin/env bash
# filepath: scripts/comprehensive-page-audit.sh
set -euo pipefail

echo "🔍 Traffic CRM - Comprehensive Frontend Audit"
echo "=============================================="
echo "Audit Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

FRONTEND_SRC="apps/frontend/src"
REPORT_FILE="apps/frontend/.comprehensive-audit-report.md"

# Initialize report
cat > "$REPORT_FILE" <<'MARKDOWN'
# Traffic CRM Frontend - Comprehensive Audit Report
**Generated:** $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Executive Summary
MARKDOWN

# 1. FILE INVENTORY
echo "📦 1. Collecting File Inventory..."
TOTAL_TS=$(find "$FRONTEND_SRC" -name "*.ts" -o -name "*.tsx" | wc -l | tr -d ' ')
TOTAL_JS=$(find "$FRONTEND_SRC" -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_PAGES=$(find "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_COMPONENTS=$(find "$FRONTEND_SRC/ui-component" "$FRONTEND_SRC/components" -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')

cat >> "$REPORT_FILE" <<MARKDOWN

### File Inventory
- **Total TypeScript Files:** $TOTAL_TS
- **Total JavaScript Files:** $TOTAL_JS ❌ (should be 0)
- **Page Components:** $TOTAL_PAGES
- **UI Components:** $TOTAL_COMPONENTS

MARKDOWN

# 2. BERRY PATTERN DETECTION
echo "🎨 2. Scanning for Berry Patterns..."

cat >> "$REPORT_FILE" <<MARKDOWN
### Berry Pattern Detection

MARKDOWN

# Berry imports
BERRY_IMPORTS=$(rg -l "from.*berry|import.*berry" --type ts --type tsx "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
{
  echo "- **Berry imports:** $BERRY_IMPORTS files"
  if [ "$BERRY_IMPORTS" -gt 0 ]; then
    echo '  ```'
    rg -l "from.*berry|import.*berry" --type ts --type tsx "$FRONTEND_SRC" 2>/dev/null | sed "s|$FRONTEND_SRC/||" | head -20
    echo '  ```'
  fi
} >> "$REPORT_FILE"

# MainCard/SubCard usage
BERRY_COMPONENTS=$(rg -l "MainCard|SubCard|AnimateButton" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
{
  echo "- **Berry components (MainCard/SubCard):** $BERRY_COMPONENTS files"
  if [ "$BERRY_COMPONENTS" -gt 0 ]; then
    echo '  ```'
    rg -l "MainCard|SubCard|AnimateButton" "$FRONTEND_SRC" 2>/dev/null | sed "s|$FRONTEND_SRC/||" | head -20
    echo '  ```'
  fi
} >> "$REPORT_FILE"

BERRY_THEME=$(rg -l "berry|Berry" --type ts --type tsx "$FRONTEND_SRC" 2>/dev/null | grep -v "blueberry\|strawberry\|cranberry" | wc -l | tr -d ' ')
echo "- **Berry theme references:** $BERRY_THEME files" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 3. CODING STANDARDS VIOLATIONS
echo "⚠️  3. Checking Coding Standards Violations..."

cat >> "$REPORT_FILE" <<MARKDOWN
### Coding Standards Violations

#### 🔗 Hardcoded API URLs
MARKDOWN

HARDCODED=$(rg "http://localhost:\d+|https?://[^'\"]*\.(com|io|dev)" "$FRONTEND_SRC" --type ts --type tsx 2>/dev/null | grep -v "VITE_\|import.meta.env\|// \|/\*" | wc -l | tr -d ' ')
{
  echo "**Count:** $HARDCODED violations"
  if [ "$HARDCODED" -gt 0 ]; then
    echo '```'
    rg "http://localhost:\d+" "$FRONTEND_SRC" --type ts --type tsx 2>/dev/null | grep -v "VITE_\|import.meta.env\|// " | head -15
    echo '```'
  fi
} >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<'MARKDOWN'
#### 🔑 Wrong Token Key (should be 'serviceToken')
MARKDOWN

WRONG_TOKEN=$(rg "localStorage\.getItem\(['\"]token['\"]" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
{
  echo "**Count:** $WRONG_TOKEN violations"
  if [ "$WRONG_TOKEN" -gt 0 ]; then
    echo '```'
    rg "localStorage\.getItem\(['\"]token['\"]" "$FRONTEND_SRC" 2>/dev/null | head -10
    echo '```'
  fi
} >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<'MARKDOWN'
#### 🔌 Per-Page API Client Instances (should use singleton)
MARKDOWN

PER_PAGE_API=$(rg -l "createClient\s*\(" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
{
  echo "**Count:** $PER_PAGE_API files"
  if [ "$PER_PAGE_API" -gt 0 ]; then
    echo '```'
    rg -l "createClient\s*\(" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | sed "s|$FRONTEND_SRC/||"
    echo '```'
  fi
} >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<MARKDOWN
#### 📜 JavaScript Files (should be TypeScript)
MARKDOWN

if [ "$TOTAL_JS" -gt 0 ]; then
  {
    echo "**Count:** $TOTAL_JS files ❌"
    echo '```'
    find "$FRONTEND_SRC" -name "*.js" -o -name "*.jsx" 2>/dev/null | sed "s|$FRONTEND_SRC/||"
    echo '```'
  } >> "$REPORT_FILE"
else
  echo "**Count:** 0 files ✅" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<'MARKDOWN'
#### 🚫 @ts-nocheck Files
MARKDOWN

TS_NOCHECK=$(rg -l "@ts-nocheck" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
{
  echo "**Count:** $TS_NOCHECK files"
  if [ "$TS_NOCHECK" -gt 0 ]; then
    echo '```'
    rg -l "@ts-nocheck" "$FRONTEND_SRC" 2>/dev/null | sed "s|$FRONTEND_SRC/||"
    echo '```'
  fi
} >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<'MARKDOWN'
#### 🎯 Files with 'any' Types (sample)
MARKDOWN

ANY_FILES=$(rg -l ": any\b|as any\b|<any>|\bany\[\]" "$FRONTEND_SRC" --type ts --type tsx 2>/dev/null | wc -l | tr -d ' ')
{
  echo "**Count:** $ANY_FILES files"
  if [ "$ANY_FILES" -gt 0 ]; then
    echo '```'
    rg -l ": any\b|as any\b|<any>" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | sed "s|$FRONTEND_SRC/||" | head -20
    echo '```'
  fi
} >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 4. SDK & TYPE USAGE
echo "📦 4. Analyzing SDK & Type Usage..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### SDK & Type Safety
MARKDOWN

SDK_IMPORTS=$(rg -l "from '@traffic-crm/sdk-js'" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Pages using SDK:** $SDK_IMPORTS / $TOTAL_PAGES" >> "$REPORT_FILE"

SDK_TYPES=$(rg -l "import type.*from '@traffic-crm/sdk-js'" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Pages using SDK types:** $SDK_TYPES / $TOTAL_PAGES" >> "$REPORT_FILE"

LOCAL_INTERFACES=$(rg -l "^interface [A-Z].*{" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Pages with local interfaces:** $LOCAL_INTERFACES (review for SDK type replacement)" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 5. MODERN PATTERNS
echo "✨ 5. Checking Modern Pattern Adoption..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### Modern Pattern Adoption
MARKDOWN

ERROR_BOUNDARY=$(rg -l "ErrorBoundary" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
MISSING_EB=$((TOTAL_PAGES - ERROR_BOUNDARY))
echo "- **Pages with ErrorBoundary:** $ERROR_BOUNDARY / $TOTAL_PAGES" >> "$REPORT_FILE"
echo "- **Missing ErrorBoundary:** $MISSING_EB pages ⚠️" >> "$REPORT_FILE"

ROUTER_V6=$(rg -l "from 'react-router-dom'" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/div[/...]
ROUTER_V6=$(rg -l "from 'react-router-dom'" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Pages using React Router v6:** $ROUTER_V6" >> "$REPORT_FILE"

CLASS_COMPONENTS=$(rg -l "class.*extends.*Component" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Class components:** $CLASS_COMPONENTS (should migrate to hooks)" >> "$REPORT_FILE"

PROPTYPES=$(rg -l "PropTypes\." "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Files using PropTypes:** $PROPTYPES (should use TS interfaces)" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 6. MUI V7 MIGRATION
echo "🎨 6. MUI v7 Migration Status..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### MUI v7 Migration
MARKDOWN

LEGACY_GRID=$(rg "Grid.*\b(xs|sm|md|lg|xl)=" "$FRONTEND_SRC" --type ts --type tsx 2>/dev/null | wc -l | tr -d ' ')
echo "- **Legacy Grid v1 usage:** $LEGACY_GRID occurrences ⚠️" >> "$REPORT_FILE"

GRID2_FILES=$(rg -l "Grid2|from.*@mui/material.*Grid2" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Files using Grid2:** $GRID2_FILES ✅" >> "$REPORT_FILE"

DEPRECATED_MUI=$(rg -l "makeStyles|withStyles|createStyles" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Files with deprecated MUI patterns:** $DEPRECATED_MUI" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 7. SECURITY CONCERNS
echo "🔒 7. Security Audit..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### Security Concerns
MARKDOWN

SECRETS=$(rg -i "password\s*=|api[_-]?key\s*=|secret\s*=" "$FRONTEND_SRC" --type ts --type tsx 2>/dev/null | grep -v "process.env\|import.meta.env\|// \|/\*" | wc -l | tr -d ' ')
{
  echo "- **Potential exposed secrets:** $SECRETS occurrences"
  if [ "$SECRETS" -gt 0 ]; then
    echo '  ```'
    rg -i "password\s*=|api[_-]?key\s*=|secret\s*=" "$FRONTEND_SRC" --type ts --type tsx 2>/dev/null | grep -v "process.env\|import.meta.env" | head -10
    echo '  ```'
  fi
} >> "$REPORT_FILE"

CONSOLE_LOG=$(rg "console\.log\(" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" 2>/dev/null | wc -l | tr -d ' ')
echo "- **console.log in pages:** $CONSOLE_LOG (should use proper logging)" >> "$REPORT_FILE"

EVAL_USAGE=$(rg "\beval\(" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **eval() usage:** $EVAL_USAGE (security risk)" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 8. PATH ALIAS USAGE
echo "🔗 8. Analyzing Path Alias Usage..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### Path Alias Compliance
MARKDOWN

RELATIVE_IMPORTS=$(rg "from '\.\./\.\./\.\." "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Deep relative imports (../../../):** $RELATIVE_IMPORTS (consider using @ aliases)" >> "$REPORT_FILE"

TRAFFIC_IMPORTS=$(rg -l "from '@traffic-crm/" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **Files using @traffic-crm/* imports:** $TRAFFIC_IMPORTS" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 9. ENVIRONMENT VARIABLE USAGE
echo "🌍 9. Environment Variable Audit..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### Environment Variables
MARKDOWN

VITE_VARS=$(rg "import\.meta\.env\.VITE_" "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **VITE_ env var references:** $VITE_VARS ✅" >> "$REPORT_FILE"

PROCESS_ENV=$(rg "process\.env\." "$FRONTEND_SRC" 2>/dev/null | wc -l | tr -d ' ')
echo "- **process.env usage:** $PROCESS_ENV (should use import.meta.env)" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# 10. PRIORITY FILE RANKING
echo "🎯 10. Ranking Priority Files..."

cat >> "$REPORT_FILE" <<'MARKDOWN'
### Priority Files for Remediation
MARKDOWN

declare -A FILE_SCORES
PAGE_FILES=$(find "$FRONTEND_SRC/pages" "$FRONTEND_SRC/views" -name "*.tsx" 2>/dev/null)

for file in $PAGE_FILES; do
  SCORE=0
  grep -q "berry\|Berry\|MainCard\|SubCard" "$file" 2>/dev/null && SCORE=$((SCORE + 5))
  grep -q "http://localhost:\d\+" "$file" 2>/dev/null && SCORE=$((SCORE + 3))
  grep -q "createClient\s*(" "$file" 2>/dev/null && SCORE=$((SCORE + 3))
  grep -q "localStorage.getItem(['\"]token" "$file" 2>/dev/null && SCORE=$((SCORE + 2))
  ! grep -q "ErrorBoundary" "$file" 2>/dev/null && SCORE=$((SCORE + 2))
  grep -q "Grid.*\bxs=" "$file" 2>/dev/null && SCORE=$((SCORE + 1))
  grep -q "@ts-nocheck" "$file" 2>/dev/null && SCORE=$((SCORE + 2))
  grep -q "class.*extends.*Component" "$file" 2>/dev/null && SCORE=$((SCORE + 3))
  ! grep -q "from '@traffic-crm/sdk-js'" "$file" 2>/dev/null && SCORE=$((SCORE + 1))
  if [ $SCORE -gt 0 ]; then
    FILE_SCORES["$file"]=$SCORE
  fi
DONE_LIST=$(for k in "${!FILE_SCORES[@]}"; do echo "$k ${FILE_SCORES[$k]}"; done | sort -k2 -rn | head -30 | awk '{print $1}')

echo "#### Top 30 Files by Issue Score" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Rank | File | Score | Issues |" >> "$REPORT_FILE"
echo "|------|------|-------|--------|" >> "$REPORT_FILE"

RANK=1
for file in $DONE_LIST; do
  SCORE=${FILE_SCORES[$file]}
  ISSUES=""
  grep -q "berry\|Berry\|MainCard" "$file" 2>/dev/null && ISSUES+="Berry, "
  grep -q "http://localhost" "$file" 2>/dev/null && ISSUES+="HardcodedURL, "
  grep -q "createClient" "$file" 2>/dev/null && ISSUES+="PerPageAPI, "
  grep -q "localStorage.getItem(['\"]token" "$file" 2>/demull && ISSUES+="WrongToken, "
  ! grep -q "ErrorBoundary" "$file" 2>/dev/null && ISSUES+="NoEB, "
  grep -q "Grid.*\bxs=" "$file" 2>/dev/null && ISSUES+="LegacyGrid, "
  grep -q "@ts-nocheck" "$file" 2>/dev/null && ISSUES+="TSNoCheck, "
  grep -q "class.*extends.*Component" "$file" 2>/dev/null && ISSUES+="ClassComp, "
  ISSUES=${ISSUES%, }
  SHORT_PATH="${file#$FRONTEND_SRC/}"
  echo "| $RANK | \\`$SHORT_PATH\\` | $SCORE | $ISSUES |" >> "$REPORT_FILE"
  RANK=$((RANK + 1))
done

echo "" >> "$REPORT_FILE"

# 11. SUMMARY STATISTICS
cat >> "$REPORT_FILE" <<'MARKDOWN'
## Summary Statistics

### Critical Issues (Fix Immediately)
MARKDOWN

CRITICAL_TOTAL=$((BERRY_COMPONENTS + HARDCODED + WRONG_TOKEN + TOTAL_JS + PER_PAGE_API))
cat >> "$REPORT_FILE" <<MARKDOWN
- 🔴 Berry patterns: $BERRY_COMPONENTS files
- 🔴 Hardcoded URLs: $HARDCODED occurrences
- 🔴 Wrong token key: $WRONG_TOKEN occurrences
- 🔴 JavaScript files: $TOTAL_JS files
- 🔴 Per-page API clients: $PER_PAGE_API files

### High Priority (Sprint 1)
- 🟠 Missing ErrorBoundary: $MISSING_EB pages
- 🟠 @ts-nocheck files: $TS_NOCHECK files
- 🟠 Class components: $CLASS_COMPONENTS files
- 🟠 Legacy Grid v1: $LEGACY_GRID occurrences

### Medium Priority (Sprint 2)
- 🟡 Files with 'any': $ANY_FILES files
- 🟡 PropTypes usage: $PROPTYPES files
- 🟡 Local interfaces: $LOCAL_INTERFACES files (check for SDK types)
- 🟡 Deep relative imports: $RELATIVE_IMPORTS occurrences

### Modernization Progress
- ✅ TypeScript files: $TOTAL_TS
- ✅ SDK imports: $SDK_IMPORTS pages
- ✅ SDK types: $SDK_TYPES pages
- ✅ Grid2 adoption: $GRID2_FILES files
- ✅ ErrorBoundary: $ERROR_BOUNDARY pages

### Health Score
MARKDOWN

MAX_POSSIBLE=$((TOTAL_PAGES * 8))
if [ $MAX_POSSible -gt 0 ]; then
  HEALTH_SCORE=$(((MAX_POSSIBLE - (BERRY_COMPONENTS + HARDCODED + WRONG_TOKEN + TOTAL_JS + PER_PAGE_API + MISSING_EB + TS_NOCHECK + CLASS_COMPONENTS)) * 100 / MAX_POSSIBLE))
else
  HEALTH_SCORE=100
fi

cat >> "$REPORT_FILE" <<MARKDOWN
**Overall Health: ${HEALTH_SCORE}%**
MARKDOWN

if [ $HEALTH_SCORE -ge 80 ]; then
  echo "Status: 🟢 Good - Minor cleanup needed" >> "$REPORT_FILE"
elif [ $HEALTH_SCORE -ge 60 ]; then
  echo "Status: 🟡 Fair - Significant work required" >> "$REPORT_FILE"
else
  echo "Status: 🔴 Needs Attention - Major remediation needed" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<'MARKDOWN'
## Actionable Recommendations

### Phase 1: Critical Fixes (Week 1)
1. **Create shared API client**
   ```bash
   # Create apps/frontend/src/services/api-client.ts
   pnpm --filter ./apps/frontend exec code src/services/api-client.ts
   ```

2. **Fix token key usage**
   ```bash
   find apps/frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' "s/localStorage.getItem(['\"']token['\"])/localStorage.getItem('serviceToken')/g"
   ```

3. **Remove hardcoded URLs**
   ```bash
   rg "http://localhost:\d+" apps/frontend/src --type ts --type tsx -l
   ```

4. **Migrate Berry components**
   - Replace MainCard with MUI Card or custom wrapper
   - Replace SubCard with CardContent
   - Remove AnimateButton (use MUI Button with sx props)

### Phase 2: Type Safety (Week 2)
1. **Add SDK type imports**
   ```typescript
   import type { components } from '@traffic-crm/sdk-js';
   type Contact = components['schemas']['Contact'];
   ```

2. **Add ErrorBoundary wrappers**
   ```typescript
   export default function Page() {
     return (
       <ErrorBoundary fallback={<ErrorFallback />}>
         <PageContent />
       </ErrorBoundary>
     );
   }
   ```

3. **Remove @ts-nocheck**
   - Fix underlying type issues
   - Use targeted @ts-expect-error with justification

### Phase 3: Modernization (Week 3)
1. **Convert class components to hooks**
2. **Migrate legacy Grid to Grid2**
3. **Remove PropTypes, use TypeScript interfaces**
4. **Replace deep relative imports with @ aliases**
MARKDOWN

echo ""
echo "✅ Audit Complete!"
echo ""
echo "📊 Report saved to: $REPORT_FILE"
echo ""
echo "Key Metrics:"
echo "  - Total Pages: $TOTAL_PAGES"
echo "  - Health Score: ${HEALTH_SCORE}%"
echo "  - Critical Issues: $CRITICAL_TOTAL"
echo "  - High Priority: $((MISSING_EB + TS_NOCHECK + CLASS_COMPONENTS))"
echo ""
echo "Next steps:"
echo "  1. Review $REPORT_FILE"
echo "  2. Create GitHub issues for each phase"
echo "  3. Start with top 10 priority files"
echo ""
