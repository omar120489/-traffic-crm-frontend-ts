# 🚀 Release Checklist

**Complete checklist for creating and publishing releases**

---

## ✅ Pre-Release Checklist

### **1. Verify All Features Complete**
- [ ] All feature branches merged to `main`
- [ ] All PRs approved and merged
- [ ] CI/CD pipeline passing (green)
- [ ] No open critical bugs
- [ ] All tests passing (unit, integration, E2E)

### **2. Code Quality Gates**
- [ ] Zero TypeScript errors (`pnpm typecheck:all`)
- [ ] Zero linter warnings (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] No console errors in production build
- [ ] Bundle size acceptable

### **3. Documentation Complete**
- [ ] Sprint complete summary created
- [ ] Release notes prepared
- [ ] README updated with latest release
- [ ] API documentation updated
- [ ] Migration guide (if needed)

### **4. Testing Complete**
- [ ] Manual QA complete
- [ ] E2E tests passing
- [ ] Performance testing done
- [ ] Accessibility audit passed
- [ ] Cross-browser testing done
- [ ] Mobile testing done

---

## 🏷️ Creating the Release

### **Step 1: Merge All Branches**

```bash
# Ensure you're on main
git checkout main
git pull origin main

# Merge any remaining feature branches
git merge feat/sprint3-auth --no-ff
git merge feat/deals-kanban --no-ff
git merge feat/kanban-filters --no-ff
git merge feat/kanban-polish --no-ff
git merge feat/company-360 --no-ff

# Push to main
git push origin main
```

### **Step 2: Create and Push Tag**

```bash
# Create tag
git tag v3.0.0 -m "Sprint 3 - Kanban & Company 360 Complete"

# Push tag to remote
git push origin v3.0.0

# Verify tag
git tag -l
git show v3.0.0
```

### **Step 3: Create GitHub Release**

#### **Option A: Using GitHub CLI** (Recommended)

```bash
# Create release with notes file
gh release create v3.0.0 \
  --title "Sprint 3 – Kanban & Company 360 Complete" \
  --notes-file GITHUB_RELEASE_v3.0.0.md \
  --target main \
  --latest

# Verify release
gh release view v3.0.0
```

#### **Option B: Using GitHub Web UI**

1. Go to: `https://github.com/omar120489/-traffic-crm-frontend-ts/releases/new`
2. **Choose a tag**: Select `v3.0.0` (or create new tag)
3. **Release title**: `Sprint 3 – Kanban & Company 360 Complete`
4. **Description**: Copy content from `GITHUB_RELEASE_v3.0.0.md`
5. **Target**: `main` branch
6. **Set as latest release**: ✅ Check
7. Click **Publish release**

### **Step 4: Verify Release**

- [ ] Release appears on GitHub Releases page
- [ ] Tag is correct (`v3.0.0`)
- [ ] Title is correct
- [ ] Description is complete and formatted
- [ ] Target branch is `main`
- [ ] Marked as "Latest"
- [ ] Release date is correct

---

## 🚀 Post-Release Actions

### **Immediate Actions** (Within 1 hour)

#### **1. Deploy to Staging**
```bash
# Build frontend
cd apps/frontend
pnpm build

# Build backend
cd ../core-api
pnpm build

# Deploy to staging
# (Adjust for your infrastructure)
```

- [ ] Staging deployment successful
- [ ] Smoke tests pass on staging
- [ ] No errors in staging logs

#### **2. Verify Features**
- [ ] Kanban board works
- [ ] Drag & drop works
- [ ] Filters work
- [ ] Company 360 page loads
- [ ] All data displays correctly
- [ ] No console errors

#### **3. Run Full Test Suite**
```bash
# Unit tests
pnpm --filter ./apps/frontend run test

# E2E tests
pnpm --filter ./apps/frontend run test:e2e

# Backend tests
pnpm --filter ./apps/core-api run test
```

- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] All backend tests pass

### **Within 24 Hours**

#### **4. Monitor Production**
- [ ] Set up monitoring alerts
- [ ] Check error rates (target: < 1%)
- [ ] Check performance metrics (target: < 3s load)
- [ ] Monitor API response times (target: < 500ms)
- [ ] Check user engagement metrics

#### **5. Announce Release**
- [ ] Post in team Slack/chat
- [ ] Email stakeholders
- [ ] Update project board
- [ ] Share on social media (if applicable)
- [ ] Update status page

#### **6. Backup & Archive**
- [ ] Tag backed up
- [ ] Documentation archived
- [ ] Release assets saved
- [ ] Database backup (if applicable)

### **Within 1 Week**

#### **7. Gather Feedback**
- [ ] User feedback collected
- [ ] Bug reports reviewed
- [ ] Performance data analyzed
- [ ] Usage metrics reviewed

#### **8. Plan Next Sprint**
- [ ] Sprint retrospective complete
- [ ] Next sprint planned
- [ ] Backlog updated
- [ ] Priorities set

---

## 📊 Release Validation Checklist

### **Functional Validation**
- [ ] All new features work as expected
- [ ] No regressions in existing features
- [ ] All user flows complete successfully
- [ ] Data integrity maintained

### **Performance Validation**
- [ ] Page load time < 3s
- [ ] Time to interactive < 2s
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Bundle size acceptable

### **Security Validation**
- [ ] No security vulnerabilities
- [ ] Authentication works
- [ ] Authorization works
- [ ] Data encryption working
- [ ] HTTPS enabled

### **Accessibility Validation**
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets standards
- [ ] Focus indicators visible

---

## 🚨 Rollback Plan

### **If Critical Issues Found**

#### **Step 1: Assess Severity**
- **Critical**: Breaks core functionality, data loss, security issue
- **High**: Major feature broken, affects many users
- **Medium**: Minor feature broken, workaround available
- **Low**: Cosmetic issue, minimal impact

#### **Step 2: Decide Action**
- **Critical/High**: Immediate rollback
- **Medium**: Hot fix or rollback
- **Low**: Fix in next release

#### **Step 3: Rollback Procedure**
```bash
# Revert to previous version
git checkout v2.0.0

# Deploy previous version
# (Follow your deployment process)

# Notify users
# (Post status update)
```

#### **Step 4: Post-Rollback**
- [ ] Investigate root cause
- [ ] Fix issue
- [ ] Test thoroughly
- [ ] Create new release

---

## 📝 Release Notes Template

Use this template for future releases:

```markdown
# [Release Title] - v[X.Y.Z]

**Release Date**: [Date]
**Status**: 🟩 Production Ready

## 🚀 What's New

### [Feature 1] (X pts)
[Description]

**Key Features**:
- Feature A
- Feature B
- Feature C

### [Feature 2] (Y pts)
[Description]

**Key Features**:
- Feature D
- Feature E

## 📊 Metrics

| Metric | Value |
|--------|-------|
| Story Points | X/X (100%) |
| Files Created | X |
| Components | X |
| Lines of Code | ~X,XXX |
| TypeScript Errors | 0 ✅ |

## 🏗️ Technical Highlights

- Technical point 1
- Technical point 2
- Technical point 3

## 🔌 Backend API Changes

### New Endpoints
- `GET /api/...`
- `POST /api/...`

### Breaking Changes
- None (or list them)

## 🧪 Testing

- [x] Unit tests
- [x] E2E tests
- [x] Manual QA
- [x] Performance testing

## 📚 Documentation

- [Link to docs]
- [Link to migration guide]

## 🔜 What's Next

- Feature A (Sprint X)
- Feature B (Sprint X)
- Feature C (Sprint X)

## 🏆 Contributors

- @username1
- @username2

---

**Full Details**: See [SPRINT_X_COMPLETE.md](./SPRINT_X_COMPLETE.md)
```

---

## 🤖 Automated Release (GitHub Actions)

For future releases, use the automated workflow:

```bash
# Trigger automated release
git tag v4.0.0
git push origin v4.0.0

# GitHub Actions will automatically:
# 1. Create release
# 2. Generate release notes
# 3. Build artifacts
# 4. Upload assets
# 5. Deploy to staging
```

See `.github/workflows/release.yml` for configuration.

---

## 📋 Quick Reference

### **Create Release**
```bash
# 1. Merge branches
git checkout main && git pull

# 2. Create tag
git tag v3.0.0 -m "Sprint 3 Complete"
git push origin v3.0.0

# 3. Create release
gh release create v3.0.0 \
  --title "Sprint 3 – Kanban & Company 360 Complete" \
  --notes-file GITHUB_RELEASE_v3.0.0.md \
  --latest
```

### **Verify Release**
```bash
# View release
gh release view v3.0.0

# List releases
gh release list

# Check tag
git tag -l
git show v3.0.0
```

### **Rollback**
```bash
# Checkout previous version
git checkout v2.0.0

# Deploy previous version
# (Follow deployment process)
```

---

## 🎯 Success Criteria

### **Release is Successful When**
- [ ] All features work in production
- [ ] No critical bugs reported
- [ ] Performance metrics met
- [ ] User feedback positive
- [ ] Monitoring shows healthy metrics
- [ ] No rollback needed

---

## 📞 Emergency Contacts

- **Tech Lead**: [Name/Contact]
- **DevOps**: [Name/Contact]
- **Product Manager**: [Name/Contact]
- **On-call Engineer**: [Name/Contact]

---

## 📚 Related Documentation

- [SPRINT_3_COMPLETE.md](./SPRINT_3_COMPLETE.md) - Sprint 3 summary
- [RELEASE_NOTES_SPRINT_3.md](./RELEASE_NOTES_SPRINT_3.md) - Release notes
- [POST_SPRINT_3_ACTION_PLAN.md](./POST_SPRINT_3_ACTION_PLAN.md) - Post-release actions
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

---

**Last Updated**: October 24, 2025  
**Version**: 1.0  
**Status**: ✅ Ready to Use

