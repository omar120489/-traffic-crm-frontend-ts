#!/usr/bin/env bash
set -euo pipefail
mk() { gh label create "$1" --color "$2" --description "$3" 2>/dev/null || gh label edit "$1" --color "$2" --description "$3"; }
mk "area:frontend"     "1f6feb" "Frontend work"
mk "area:backend"      "8250df" "Backend work"
mk "area:workers"      "0969da" "Workers & queues"
mk "area:ci"           "0e8a16" "CI/CD"
mk "area:sdk"          "d93f0b" "SDK & packages"
mk "area:docs"         "fbca04" "Documentation"
mk "priority:high"     "b60205" "High priority"
mk "type:refactor"     "a2eeef" "Refactoring"
mk "type:architecture" "5319e7" "Architecture"
mk "type:performance"  "fef2c0" "Perf"
mk "type:consistency"  "cfd3d7" "Contracts & alignment"
mk "type:test"         "d4c5f9" "Testing"
mk "type:ops"          "e4e669" "Ops/health/version"
mk "type:reliability"  "7057ff" "Reliability"
mk "type:observability""5319e7" "Metrics/observability"
mk "type:cleanup"      "ededed" "Cleanup"
echo "✅ Labels seeded"

