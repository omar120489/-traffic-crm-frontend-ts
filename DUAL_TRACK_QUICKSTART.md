# 🚀 Dual Track Quickstart: Guardrails + Sprint 6

**Time**: 30 minutes  
**Goal**: Verify v5.0.0 health + Test Sprint 6 SavedViews backend

---

## ✅ **TRACK A: POST-SHIP GUARDRAILS (12 min)**

### **Prerequisites**
- Backend running on `http://localhost:3000`
- Frontend dev server running (for E2E tests)

### **Run the Script**

```bash
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

# Run guardrails checks
./guardrails.sh
```

### **What It Does**
1. ✅ Tests API performance (`/api/analytics`)
2. ✅ Captures KPI baseline to `baseline_YYYYMMDD_HHMM.json`
3. ✅ Runs E2E smoke tests (`analytics.spec.ts`)

### **Expected Output**
```
=== Post-Ship Guardrails (v5.0.0) ===
API: http://localhost:3000/api/analytics

1) API Performance
Total: 0.234s

2) KPI Snapshot → baseline_20251025_1430.json
Saved baseline: baseline_20251025_1430.json

3) E2E Smoke (analytics)
Running 11 tests using 1 worker
  11 passed (15.2s)

=== Guardrails Complete ===
```

### **Record Results**

Go to your GitHub issue and paste:
- API response time: `Total: 0.XXXs`
- E2E status: `11 passed`
- Baseline file: `baseline_YYYYMMDD_HHMM.json`

---

## ✅ **TRACK B: SPRINT 6 BACKEND KICKOFF (18 min)**

### **Step 1: Create Feature Branch** (30 sec)

```bash
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516
git checkout -b feat/s6-saved-views-drilldowns
```

### **Step 2: Run Prisma Migration** (2 min)

```bash
cd apps/core-api
pnpm prisma migrate dev --name add_saved_views
pnpm prisma generate
cd ../..
```

**Expected Output**:
```
✔ Generated Prisma Client
✔ Migration applied: 20251025_add_saved_views
```

### **Step 3: Start Backend** (1 min)

```bash
# Terminal 1: Backend
cd apps/core-api
pnpm run start:dev
```

**Wait for**: `Application is running on: http://localhost:3000`

### **Step 4: Get JWT Token** (2 min)

**Option 1**: Use existing dev token
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Option 2**: Generate new token (if you have the script)
```bash
cd apps/core-api
node scripts/make-dev-jwt.mjs
# Copy the output token
export TOKEN="<paste-token-here>"
cd ../..
```

**Option 3**: Use a test token (dev only)
```bash
# This is a sample dev token - replace with your own!
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEiLCJvcmdJZCI6Im9yZ18xIiwidXNlcklkIjoidXNlcl8xIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk4MjQwMDAwfQ.test"
```

### **Step 5: Run SavedViews Smoke Test** (10 min)

```bash
# Terminal 2: Test script
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

# Make sure TOKEN is set
echo $TOKEN

# Run the smoke test
./savedviews-smoke.sh
```

### **Expected Output**
```
=== Saved Views API Smoke ===
API base: http://localhost:3000

1) List (initial)
{
  "personal": [],
  "default": []
}

2) Create
{
  "id": "clxxx123456789",
  "orgId": "org_1",
  "userId": "user_1",
  "name": "Q4 Sales",
  "filters": {
    "from": "2025-10-01",
    "to": "2025-12-31",
    "types": ["email", "call"]
  },
  "isDefault": false,
  "isShared": false,
  "createdAt": "2025-10-25T14:30:00.000Z",
  "updatedAt": "2025-10-25T14:30:00.000Z",
  "User": {
    "id": "user_1",
    "name": "Test User",
    "email": "test@example.com"
  }
}
Created VIEW_ID=clxxx123456789

3) List (after create)
{
  "personal": [
    {
      "id": "clxxx123456789",
      "name": "Q4 Sales",
      ...
    }
  ],
  "default": []
}

4) Get single
{
  "id": "clxxx123456789",
  "name": "Q4 Sales",
  ...
}

5) Update
{
  "id": "clxxx123456789",
  "name": "Q4 Sales – Updated",
  ...
}

=== Saved Views Smoke Complete ===
```

### **Step 6: Commit Progress** (2 min)

```bash
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

git add -A
git commit -m "feat(sprint6): run SavedViews migration and test endpoints

- Migration: add_saved_views applied
- Endpoints tested: GET, POST, PATCH, DELETE
- All CRUD operations working
- Ready for frontend integration"

git push -u origin feat/s6-saved-views-drilldowns
```

---

## 🚨 **COMMON GOTCHAS**

### **401 Unauthorized**
```bash
# TOKEN missing or expired
# Generate a fresh dev JWT:
cd apps/core-api
node scripts/make-dev-jwt.mjs
export TOKEN="<new-token>"
```

### **404 /api/saved-views**
```bash
# Module not wired or server not restarted
# Restart backend:
cd apps/core-api
pnpm run start:dev
```

### **Prisma Migration Mismatch**
```bash
cd apps/core-api
pnpm prisma migrate dev --name add_saved_views
pnpm prisma generate
```

### **Port Conflicts**
```bash
# Check if port 3000 is in use
lsof -ti:3000
# Kill the process if needed
kill -9 $(lsof -ti:3000)
```

### **Playwright Missing Browsers**
```bash
cd apps/frontend
pnpm exec playwright install --with-deps
```

### **jq Not Installed**
```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq
```

---

## 📊 **WHAT TO REPORT BACK**

After running both scripts, reply with:

### **Guardrails**
- API perf line: `Total: X.XXXs`
- E2E: `N passed`
- Baseline filename: `baseline_YYYYMMDD_HHMM.json`

### **Saved Views**
- VIEW_ID returned: `clxxx...`
- Any errors in terminal? Yes/No
- Any errors in backend logs? Yes/No

### **Example Report**
```
✅ Guardrails
- API: Total: 0.234s
- E2E: 11 passed
- Baseline: baseline_20251025_1430.json

✅ Saved Views
- VIEW_ID: clxxx123456789
- Terminal errors: No
- Backend errors: No
```

---

## 🎯 **NEXT STEPS (After You Report)**

Once you confirm both tracks are green, I'll immediately:

1. ✅ Create `SavedViewsService` (frontend)
2. ✅ Create `SaveViewModal` component
3. ✅ Create `SavedViewsDropdown` component
4. ✅ Wire into `AnalyticsPage`
5. ✅ Add chart drill-down handlers
6. ✅ Create `DrillDownPanel` component
7. ✅ Add E2E tests for saved views
8. ✅ Add E2E tests for drill-downs

**Total**: ~2-3 hours of implementation, fully tested and production-ready!

---

## 🚀 **READY TO RUN?**

```bash
# Quick checklist:
# [ ] Backend running on :3000
# [ ] Frontend dev server running (for E2E)
# [ ] jq installed (brew install jq)

# Run Track A (Guardrails)
./guardrails.sh

# Create feature branch
git checkout -b feat/s6-saved-views-drilldowns

# Run migration
cd apps/core-api
pnpm prisma migrate dev --name add_saved_views
pnpm prisma generate

# Start backend (new terminal)
pnpm run start:dev

# Get JWT token
export TOKEN="your-token-here"

# Run Track B (SavedViews)
cd ../..
./savedviews-smoke.sh

# Report results back!
```

**GO! 🚀**

