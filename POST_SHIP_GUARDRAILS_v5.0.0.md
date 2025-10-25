# v5.0.0 Post-Ship Guardrails – Analytics Dashboard

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

### Lighthouse Performance (Optional)
```bash
npx lighthouse http://localhost:3000/analytics --view
```

### Frontend Load Test
```bash
# Open in browser and check DevTools
# Network tab: TTI should be < 2.5s
# Console: No errors
# Performance: LCP < 2.5s, FID < 100ms
```

---

## 📊 Baseline KPIs

**Capture Date**: `YYYY-MM-DD HH:MM UTC`

| Metric | Value | Source | Notes |
|--------|-------|--------|-------|
| Total Activities | — | `/api/analytics` | |
| Active Users | — | `/api/analytics` | |
| Avg Daily Activities | — | `/api/analytics` | |
| Median TTF (ms) | — | `/api/analytics` | |
| API Response Time (cached) | — | `curl` | Target: < 200ms |
| API Response Time (uncached) | — | `curl` | Target: < 500ms |
| Frontend TTI | — | Lighthouse | Target: < 2.5s |
| Lighthouse Performance Score | — | Lighthouse | Target: > 90 |

### Capture Script
```bash
# Save baseline to file
curl -s "http://localhost:3000/api/analytics" | jq '.' > baseline_$(date +%Y%m%d).json

# View pretty-printed
cat baseline_$(date +%Y%m%d).json
```

---

## 📈 APM / Logs Checks

### Error Rate
```bash
# Look for 5xx errors in last 10 minutes
grep "500\|502\|503" logs/api*.log | tail -n 20

# Count errors
grep "ERROR" logs/api*.log | wc -l

# Error rate (should be < 1%)
# Total requests / Error count
```

### Slow Queries
```bash
# Find queries > 300ms
grep "duration" logs/prisma*.log | grep -E "([3-9][0-9]{2,}|[1-9][0-9]{3,})ms"

# Top 5 slowest queries
grep "duration" logs/prisma*.log | sort -t: -k2 -n | tail -5
```

### Cache Performance
```bash
# Check cache hit rate (if instrumented)
# Target: > 80% hit rate
grep "cache" logs/api*.log | grep -c "HIT"
grep "cache" logs/api*.log | grep -c "MISS"
```

### Database Load
```bash
# Check active connections
# psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'traffic_crm';"

# Check slow queries
# psql -c "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

---

## 🚨 Follow-Ups

| Area | Owner | Status | Notes |
|------|-------|--------|-------|
| Perf baseline | — | ⏳ Pending | Capture within 24h |
| Cache metrics | — | ⏳ Pending | Verify > 80% hit rate |
| Error review | — | ⏳ Pending | Confirm < 1% error rate |
| UX feedback | — | ⏳ Pending | Collect from stakeholders |
| DB indexes | — | 📋 Backlog | Add if p95 > 300ms |
| Redis cache | — | 📋 Backlog | Add if multi-instance |
| Next steps (Sprint 6) | — | 🎯 Ready | Saved Views + Drill-Downs |

---

## 🕒 Schedule

- **T+0 (Release)**: Deploy v5.0.0 ✅
- **T+1h**: Run quick health checks
- **T+4h**: Capture baseline KPIs
- **T+24h**: Review logs, APM, user feedback
- **T+48h**: Close issue or create follow-ups

---

## 📝 Findings

### Health Check Results
```
Date: YYYY-MM-DD HH:MM UTC
Tester: [Your Name]

✅ /analytics loads: X.Xs
✅ KPI tiles render: OK
✅ Charts hydrate: OK
✅ Filters work: OK
✅ URL sync: OK
✅ E2E tests: 11/11 passing
✅ Lighthouse: XX/100
```

### Issues Found
- [ ] None (or list issues here)

### Performance Notes
- API response time: XXXms (cached), XXXms (uncached)
- Frontend TTI: X.Xs
- Cache hit rate: XX%
- Error rate: X.XX%

### User Feedback
- [ ] Positive feedback from [stakeholder]
- [ ] Feature request: [description]
- [ ] Bug report: [description]

---

## 🎯 Next Steps

Once stability is confirmed:
1. ✅ Close this issue
2. ✅ Link in release notes
3. ✅ Start Sprint 6: Saved Views + Drill-Downs
4. 📋 Create follow-up issues for any findings

---

## 📚 References

- **Release**: https://github.com/omar120489/-traffic-crm-frontend-ts/releases/tag/v5.0.0
- **PR**: https://github.com/omar120489/-traffic-crm-frontend-ts/pull/38
- **Sprint 5 Complete**: `SPRINT_5_COMPLETE.md`
- **E2E Tests**: `apps/frontend/e2e/analytics.spec.ts`

---

## 💡 Tips

- Run checks during **peak usage hours** for realistic metrics
- Compare baseline to **previous week** if available
- Monitor for **24-48 hours** before declaring success
- Share findings with team in **Slack/Email**
- Use this template for **future releases**

---

**Status**: ⏳ **In Progress**  
**Owner**: [Your Name]  
**Due**: Within 24h of release

