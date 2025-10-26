# 🧪 Assets Cleanup - QA Checklist

**Tester:** ___________  
**Date:** ___________  
**Branch:** `assets-cleanup`  
**Base:** `main`

---

## 🚀 Pre-Test Setup

- [ ] Pull latest `assets-cleanup` branch
- [ ] Run `pnpm install` (if needed)
- [ ] Run `pnpm build` successfully
- [ ] Start dev server: `pnpm start`
- [ ] Open browser to http://localhost:3002
- [ ] Open browser console (F12)
- [ ] Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)

---

## 🎨 Visual Regression Testing

### Authentication Pages

**Login Page** (`/login`)
- [ ] Background pattern displays
- [ ] Logo displays correctly
- [ ] Social auth icons present (Google, Facebook, etc.)
- [ ] No broken images
- [ ] No console errors

**Register Page** (`/register`)
- [ ] Signup illustration displays
- [ ] Form renders correctly
- [ ] Social auth buttons work
- [ ] No broken images

**Forgot Password** (`/forgot-password`)
- [ ] Forgot password illustration displays
- [ ] Email input renders
- [ ] No broken images

**Reset Password** (`/reset-password`)
- [ ] Reset password illustration displays
- [ ] Form renders correctly
- [ ] No broken images

### Maintenance Pages

**404 Error** (navigate to `/nonexistent-page`)
- [ ] Error illustration displays
- [ ] Error message shows
- [ ] "Go Home" button works
- [ ] No console errors

**500 Error** (`/error`)
- [ ] Server error illustration displays
- [ ] Error message shows
- [ ] No broken images

**Coming Soon** (`/coming-soon`)
- [ ] Coming soon illustration displays
- [ ] Countdown/message shows
- [ ] No broken images

**Under Construction** (`/under-construction`)
- [ ] Construction illustration displays
- [ ] Message shows correctly
- [ ] No broken images

### Layout Components

**Header/Navigation**
- [ ] Logo displays in header
- [ ] Logo is correct size
- [ ] Logo is clickable (goes to home)
- [ ] Profile avatar displays (if logged in)
- [ ] Notification icons display

**Sidebar** (if applicable)
- [ ] Menu icons display
- [ ] Layout customization icons work
- [ ] No broken images

### Dark Mode (if supported)

- [ ] Switch to dark mode
- [ ] Logo switches to dark variant (if applicable)
- [ ] Background patterns update
- [ ] All images display correctly
- [ ] No broken images in dark mode

---

## 🔧 Functional Testing

### Asset Loading

- [ ] All images load within 2 seconds
- [ ] No 404 errors in Network tab
- [ ] No broken image icons (🖼️)
- [ ] WebP images served to modern browsers (check Network tab)
- [ ] PNG/JPG fallbacks work in older browsers

### Authentication Flow

- [ ] Can navigate to login page
- [ ] Can navigate to register page
- [ ] Social auth buttons clickable
- [ ] Forgot password flow works
- [ ] All images load during auth flow

### Navigation

- [ ] Can navigate between pages
- [ ] Images load on route change
- [ ] No flash of unstyled content
- [ ] Back button works correctly

---

## 📊 Performance Testing

### Build Metrics

```bash
# Run these commands and record results
pnpm build
# Record build time: _____ seconds

du -sh apps/frontend/dist/
# Record bundle size: _____ MB
```

**Results:**
- Build time: _____ seconds (baseline: _____ seconds)
- Bundle size: _____ MB (baseline: _____ MB)
- Improvement: _____% faster, _____% smaller

### Runtime Performance

**Lighthouse Audit** (Chrome DevTools > Lighthouse)

Run on these pages:
1. Home/Dashboard
2. Login page
3. Error page

**Home/Dashboard:**
- Performance: _____ (baseline: _____)
- LCP: _____ ms (baseline: _____ ms)
- FCP: _____ ms (baseline: _____ ms)

**Login Page:**
- Performance: _____ (baseline: _____)
- LCP: _____ ms (baseline: _____ ms)

**Error Page:**
- Performance: _____ (baseline: _____)
- LCP: _____ ms (baseline: _____ ms)

### Network Analysis

Open Network tab (F12 > Network):
- [ ] Filter by "Img"
- [ ] Record number of image requests: _____
- [ ] Record total image size: _____ KB
- [ ] Check for any 404s: _____
- [ ] Verify WebP served (if browser supports): _____

---

## 🐛 Bug Tracking

### Issues Found

| # | Page | Issue | Severity | Screenshot |
|---|------|-------|----------|------------|
| 1 |      |       | 🔴/🟡/🟢 |            |
| 2 |      |       | 🔴/🟡/🟢 |            |
| 3 |      |       | 🔴/🟡/🟢 |            |

**Severity:**
- 🔴 Critical - Blocks release
- 🟡 High - Should fix before merge
- 🟢 Low - Can fix later

---

## ✅ Code Quality

### Static Analysis

```bash
# TypeScript check
pnpm typecheck
# Result: _____ errors

# Linting
pnpm lint
# Result: _____ warnings

# Tests
pnpm test
# Result: _____ passed, _____ failed
```

### Asset References

```bash
# Check for references to deleted assets
grep -r "blog/\|e-commerce/\|landing/offer\|testaments/\|pages/" apps/frontend/src --include="*.{ts,tsx,js,jsx}"
```

**Result:**
- [ ] No references found ✅
- [ ] References found (list below): _____

---

## 📝 Notes

**Additional observations:**

---

**Recommendations:**

---

## ✅ Sign-off

- [ ] All critical tests passed
- [ ] No regressions found
- [ ] Performance improved or maintained
- [ ] Ready for merge

**Tester Signature:** `_____________`  
**Date:** `_____________`
