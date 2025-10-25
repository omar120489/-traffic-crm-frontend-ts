## 🩺 Objective
Verify production health after v5.0.0 (Analytics Dashboard) launch and capture baseline KPIs.

---

## ✅ Checklist
- [ ] `/analytics` loads under **2.5s TTI**
- [ ] 4 KPI tiles render with data
- [ ] 3 charts hydrate correctly
- [ ] Filters + URL sync functional
- [ ] Logs show < 1% error rate
- [ ] DB query p95 < 300ms
- [ ] Cache hit rate > 80%

---

## 🧪 Quick Health Checks

### Backend Health
```bash
# Test API endpoint response time
curl -s -w "Time: %{time_total}s\n" -o /dev/null http://localhost:3000/api/analytics

# With filters
curl -s -w "Time: %{time_total}s\n" -o /dev/null "http://localhost:3000/api/analytics?from=2025-09-26&to=2025-10-25"
```

### E2E Smoke Test
```bash
cd apps/frontend
pnpm test:e2e analytics.spec.ts
```

### Lighthouse Performance
```bash
npx lighthouse http://localhost:3000/analytics --view
```

---

## 📊 Baseline KPIs

**Capture Date**: `____-__-__ __:__ UTC`

| Metric | Value | Notes |
|--------|-------|-------|
| Total Activities | — | |
| Active Users | — | |
| Avg Daily Activities | — | |
| Median TTF (ms) | — | |
| API Response (cached) | — | Target: < 200ms |
| API Response (uncached) | — | Target: < 500ms |
| Frontend TTI | — | Target: < 2.5s |
| Lighthouse Score | — | Target: > 90 |

### Capture Script
```bash
curl -s "http://localhost:3000/api/analytics" | jq '.' > baseline_$(date +%Y%m%d).json
cat baseline_$(date +%Y%m%d).json
```

---

## 📈 APM / Logs

### Error Rate
```bash
# 5xx errors in last 10 min
grep "500\|502\|503" logs/api*.log | tail -n 20

# Error count
grep "ERROR" logs/api*.log | wc -l
```

### Slow Queries
```bash
# Queries > 300ms
grep "duration" logs/prisma*.log | grep -E "([3-9][0-9]{2,}|[1-9][0-9]{3,})ms"
```

---

## 🚨 Follow-Ups

| Area | Owner | Status |
|------|-------|--------|
| Perf baseline | — | ⏳ Pending |
| Cache metrics | — | ⏳ Pending |
| Error review | — | ⏳ Pending |
| UX feedback | — | ⏳ Pending |
| Next steps | — | 🎯 Sprint 6 |

---

## 📝 Findings

### Health Check Results
```
Date: ____-__-__ __:__ UTC
Tester: [Your Name]

✅ /analytics loads: _._ s
✅ KPI tiles: OK
✅ Charts: OK
✅ Filters: OK
✅ E2E: 11/11 passing
✅ Lighthouse: __/100
```

---

## 🎯 Next Steps

- [ ] Close this issue after 24-48h
- [ ] Link in release notes
- [ ] Start Sprint 6: Saved Views + Drill-Downs

---

## 📚 References

- **Release**: https://github.com/omar120489/-traffic-crm-frontend-ts/releases/tag/v5.0.0
- **PR**: https://github.com/omar120489/-traffic-crm-frontend-ts/pull/38
- **Full Checklist**: `POST_SHIP_GUARDRAILS_v5.0.0.md`

