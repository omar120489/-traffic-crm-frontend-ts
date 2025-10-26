# 🚀 Assets Cleanup - Quick Start

## For Reviewers

```bash
# 1. Checkout branch
git fetch origin
git checkout assets-cleanup

# 2. Install & build
pnpm install
pnpm build

# 3. Start dev server
pnpm start

# 4. Open browser
open http://localhost:3002

# 5. Check these pages:
# - /login
# - /register  
# - /error
# - /coming-soon
# - /under-construction

# 6. Verify no console errors (F12)
```

## For QA

1. Open `docs/ASSETS_CLEANUP_QA.md`
2. Follow checklist step-by-step
3. Record all findings
4. Sign off when complete

## For Merge

```bash
# After approval
git checkout main
git merge assets-cleanup
git push origin main

# Clean up
git branch -d assets-cleanup
git push origin --delete assets-cleanup
```

## Rollback (if needed)

```bash
git revert <commit-hash>
# or
git reset --hard HEAD~1
git push --force
```

## Quick Verification Commands

```bash
# Check for broken asset references
grep -r "blog/\|e-commerce/\|landing/offer\|testaments/\|pages/" apps/frontend/src --include="*.{ts,tsx,js,jsx}"

# Compare bundle sizes
du -sh apps/frontend/dist/

# Run Lighthouse audit
npx lighthouse http://localhost:3002 --view

# Check build time
time pnpm build
```

## Expected Results

**Before Cleanup:**
- Total assets: 240 files
- Total size: 16 MB
- Build time: Baseline

**After Cleanup:**
- Total assets: ~90 files (-62%)
- Total size: ~3 MB (-81%)
- Build time: -30-40% faster

## Common Issues

### Issue: Missing images on auth pages
**Solution:** Check if auth assets were accidentally deleted

### Issue: Build fails
**Solution:** Run `pnpm install` and `pnpm build` again

### Issue: 404 errors in console
**Solution:** Check Network tab for specific missing files

### Issue: Slow image loading
**Solution:** Verify WebP variants were generated

## Performance Testing

```bash
# Install Lighthouse CLI (if not installed)
npm install -g lighthouse

# Run audit on key pages
lighthouse http://localhost:3002 --output html --output-path ./lighthouse-home.html
lighthouse http://localhost:3002/login --output html --output-path ./lighthouse-login.html
lighthouse http://localhost:3002/error --output html --output-path ./lighthouse-error.html

# Open reports
open lighthouse-*.html
```

## Bundle Analysis

```bash
# Install bundle analyzer (if not installed)
pnpm add -D rollup-plugin-visualizer

# Add to vite.config.js temporarily:
# import { visualizer } from 'rollup-plugin-visualizer';
# plugins: [visualizer({ open: true })]

# Build and view
pnpm build
```

## Documentation

- **Deep Analysis:** `docs/ASSETS_DEEP_ANALYSIS.md`
- **Cleanup Report:** `docs/ASSETS_CLEANUP_REPORT.md` (auto-generated)
- **QA Checklist:** `docs/ASSETS_CLEANUP_QA.md`
- **PR Template:** `docs/PULL_REQUEST_TEMPLATE_ASSETS.md`

## Support

If you encounter issues:
1. Check `docs/ASSETS_CLEANUP_REPORT.md` for what was changed
2. Review `docs/ASSETS_DEEP_ANALYSIS.md` for context
3. Run verification commands above
4. Check git history: `git log --oneline assets-cleanup`

## Timeline

- **Review:** 1-2 hours
- **QA Testing:** 2-4 hours
- **Merge:** After approval
- **Monitoring:** 24-48 hours post-merge
