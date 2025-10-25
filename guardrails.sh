#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3000/api/analytics}"
STAMP="$(date +%Y%m%d_%H%M)"
BASELINE="baseline_${STAMP}.json"

echo "=== Post-Ship Guardrails (v5.0.0) ==="
echo "API: ${API_URL}"
echo

# 1) API performance
echo "1) API Performance"
PERF_LINE=$(curl -s -w "Total: %{time_total}s\n" -o /dev/null "${API_URL}")
echo "${PERF_LINE}"
echo

# 2) KPI snapshot
echo "2) KPI Snapshot → ${BASELINE}"
if command -v jq >/dev/null 2>&1; then
  curl -s "${API_URL}" | jq '.' > "${BASELINE}"
else
  echo "(tip) install jq for pretty JSON: brew install jq"
  curl -s "${API_URL}" > "${BASELINE}"
fi
echo "Saved baseline: ${BASELINE}"
echo

# 3) E2E smoke
echo "3) E2E Smoke (analytics)"
pushd apps/frontend >/dev/null
pnpm test:e2e analytics.spec.ts || (echo "E2E failed"; exit 1)
popd >/dev/null
echo
echo "=== Guardrails Complete ==="

