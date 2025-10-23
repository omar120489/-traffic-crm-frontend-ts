# Project Audit Pack - Quick Start

This audit pack inventories your entire codebase to identify inconsistencies, legacy patterns, and opportunities for standardization.

## 🚀 Quick Start

### Run Full Audit

```bash
./scripts/audit_all.sh
```

This generates a comprehensive report in `.project_audit/REPORT.md` along with detailed breakdowns in individual files.

### Review Results

```bash
# Open the main report
cat .project_audit/REPORT.md

# Or open in your editor
code .project_audit/REPORT.md
```

## 📊 What Gets Audited

The audit pack analyzes:

1. **Git Status** - Current branch and uncommitted changes
2. **File Tree** - Complete directory structure
3. **Manifest** - JSON inventory of all files with sizes and types
4. **TypeScript** - Type checking errors
5. **ESLint** - Linting issues
6. **Routes vs Menus** - Mismatch between route definitions and menu entries
7. **Import Hotspots** - Top 50 most-imported modules
8. **Legacy Patterns** - Usage of deprecated patterns (ui-component, @tabler/icons-react, MainCard, etc.)
9. **Large Files** - Assets ≥1.5MB that may need optimization
10. **TODOs/FIXMEs** - Code comments requiring attention
11. **License Headers** - Files missing license/copyright headers
12. **Duplicate Filenames** - Name collisions in src/
13. **Unused Dependencies** - Packages that may be removable

## 📁 Output Files

All results are written to `.project_audit/` (gitignored):

| File | Contents |
|------|----------|
| `REPORT.md` | Consolidated audit report with all findings |
| `manifest.json` | Complete file inventory with metadata |
| `routes.txt` | All route paths found in src/routes/ |
| `menus.txt` | All menu URLs found in src/menu-items/ |
| `routes_vs_menu.md` | Mismatch analysis between routes and menus |
| `imports_top.txt` | Top 50 imports + legacy pattern matches |
| `legacy_hits.txt` | All occurrences of legacy patterns |
| `large_files.txt` | Files ≥1.5MB |
| `todos_fixmes.txt` | All TODO/FIXME/HACK/@ts-ignore comments |
| `license_headers.md` | Files missing license headers |
| `duplicate_files.txt` | Duplicate filenames in src/ |
| `tree_full.txt` | Complete directory tree |

## 🔧 Optional Codemods

The audit pack includes **optional** codemods for automated code transformations. These are **disabled by default** and require explicit opt-in.

### 1. Modernization Codemod (Legacy Patterns)

**Preview Changes (Dry-Run):**

```bash
npm run codemod:preview
# or
npx ts-node scripts/codemod_modernize.ts
```

**Apply Changes:**

```bash
npm run codemod:apply
# or
npx ts-node scripts/codemod_modernize.ts --apply
```

**What it does:**

1. **MUI Grid Import Normalization** - Standardizes Grid imports
2. **MainCard → AppPage Transformation** - Migrates legacy card wrappers

### 2. TypeScript Fixes Codemod (Remaining Errors)

**Preview Changes (Dry-Run):**

```bash
npx ts-node scripts/fix_remaining.ts
```

**Apply Changes:**

```bash
npx ts-node scripts/fix_remaining.ts --write
```

**What it fixes:**

1. **Vitest imports** - Adds explicit imports to test files
2. **Unused React imports** - Removes from test files (React 19 doesn't need them)
3. **ID type coercions** - Wraps mixed number|string IDs with String()
4. **useDebounced hook** - Replaces with correct typed implementation
5. **Journey events** - Adds safety guards for undefined values

**Verification after applying:**

```bash
pnpm dlx prettier --write "src/**/*.{ts,tsx,js,jsx}"
pnpm run lint --fix
pnpm run typecheck
pnpm test
```

**⚠️ Important:** Always review the dry-run output before applying changes.

## 🔍 Running Individual Audits

You can run specific audit scripts independently:

```bash
# Routes audit
npx ts-node scripts/audit_routes.ts

# Menus audit
npx ts-node scripts/audit_menus.ts

# Import analysis
npx ts-node scripts/audit_imports.ts

# Routes vs Menu comparison
npx ts-node scripts/routes_vs_menu.ts .project_audit/routes.txt .project_audit/menus.txt

# License header check
npx ts-node scripts/license_check.ts

# File manifest
npx ts-node scripts/manifest.ts
```

## 💡 NPM Scripts

For convenience, the following scripts are available in `package.json`:

```bash
npm run audit:full          # Run complete audit
npm run codemod:preview     # Preview codemod changes (dry-run)
npm run codemod:apply       # Apply codemod changes (modifies files)
```

## 🐛 Troubleshooting

### Permission denied when running audit_all.sh

```bash
chmod +x scripts/audit_all.sh
```

### TypeScript scripts fail to run

Ensure you have ts-node or use npx:

```bash
npm install -g ts-node
# or use npx (no installation needed)
npx ts-node scripts/audit_routes.ts
```

### tree command not found

The script falls back to `find` automatically. To install tree:

```bash
# macOS
brew install tree

# Ubuntu/Debian
sudo apt-get install tree
```

### Git grep not working

The script falls back to `rg` (ripgrep) or standard `grep` automatically.

## 📝 Best Practices

1. **Run audits regularly** - Before major releases or after significant refactoring
2. **Review dry-run first** - Always preview codemod changes before applying
3. **Commit before codemod** - Create a git checkpoint before applying automated transformations
4. **Share results selectively** - The `.project_audit/` directory is gitignored by default
5. **Fix incrementally** - Use audit results to prioritize technical debt

## 🎯 Next Steps

After running the audit:

1. Review `REPORT.md` for high-level findings
2. Check `routes_vs_menu.md` for navigation inconsistencies
3. Examine `legacy_hits.txt` to prioritize modernization work
4. Optimize assets listed in `large_files.txt`
5. Address TODOs and FIXMEs from `todos_fixmes.txt`
6. Run codemod preview to see automated fix opportunities

## 📚 More Information

For questions or issues with the audit pack, refer to:

- Project documentation in `docs/`
- `.project_audit/REPORT.md` for detailed findings
- `.project_audit/codemod_results.md` for transformation details
