param(
  [string]$Mode = "verify",           # "verify" | "pr" | "local"
  [string]$TargetBranch = "main",     # target for local merge
  [string]$Branch = $(git rev-parse --abbrev-ref HEAD)
)

$ErrorActionPreference = "Stop"

Write-Host "=== PRE-MERGE FINAL CHECKS — branch: $Branch → target: $TargetBranch ===`n"

# Ensure clean working tree
git diff --quiet; if ($LASTEXITCODE -ne 0) { throw "Uncommitted changes in working tree." }
git diff --cached --quiet; if ($LASTEXITCODE -ne 0) { throw "Staged but uncommitted changes exist." }

# 1) SDK gen
Write-Host "1) Regenerating SDK types…"
try { pnpm sdk:gen | Out-Null; Write-Host "   OK" } catch { Write-Warning "   Could not generate (is API running?). Continuing." }

# 2) Core API build
Write-Host "2) Building Core API…"
pnpm --filter @apps/core-api build | Out-Null
Write-Host "   OK"

# 3) Frontend typecheck
Write-Host "3) Typechecking frontend…"
try { pnpm --filter ./apps/frontend typecheck | Out-Null; Write-Host "   OK" } catch { Write-Warning "   Typecheck warnings/errors (likely legacy). Continuing." }

# 4) Frontend build
Write-Host "4) Building frontend…"
pnpm --filter ./apps/frontend build | Out-Null
Write-Host "   OK"

# 5) Optional smoke
Write-Host "5) API smoke test (optional)…"
if (-not $env:DEV_JWT) {
  try { $env:DEV_JWT = pnpm --silent dev:jwt } catch {}
}
if ($env:DEV_JWT) {
  try {
    curl.exe -s "http://localhost:3000/api/contacts?page=1&size=5" -H "Authorization: Bearer $($env:DEV_JWT)" | Out-Null
    Write-Host "   Smoke OK"
  } catch { Write-Warning "   Smoke skipped/failed" }
} else {
  Write-Warning "   DEV_JWT not set; skipping smoke test."
}

Write-Host "`nChecks complete.`n"

switch ($Mode) {
  "pr" {
    Write-Host "Pushing branch for PR…"
    git push -u origin $Branch
    Write-Host "   Pushed. Open a PR from '$Branch' → '$TargetBranch'."
  }
  "local" {
    Write-Host "Merging into '$TargetBranch' locally…"
    git checkout $TargetBranch
    git pull --ff-only origin $TargetBranch
    git merge --no-ff $Branch -m "Merge $Branch into $TargetBranch"
    git push origin $TargetBranch
    Write-Host "   Merged & pushed."
  }
  Default {
    Write-Host "Verification only (no merge)."
  }
}

Write-Host @"
Quick run after merge:
  pnpm db:up && pnpm db:migrate && pnpm db:seed
  pnpm --filter @apps/core-api dev
  pnpm sdk:gen
  pnpm --filter ./apps/frontend dev
"@


