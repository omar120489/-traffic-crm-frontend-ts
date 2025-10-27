#!/usr/bin/env bash
set -euo pipefail

# ===== START: preflight =====
echo "== Preflight checks =="
git rev-parse --is-inside-work-tree >/dev/null || { echo "Not a git repo"; exit 1; }

BASE_BRANCH="${BASE_BRANCH:-main}"

# Ensure clean state
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree not clean. Commit or stash first."; exit 1;
fi

# Ensure structure-cleanup is merged (per decision 2c)
if git show-ref --verify --quiet refs/heads/chore/structure-cleanup; then
  echo "Merging chore/structure-cleanup into ${BASE_BRANCH}..."
  git checkout "${BASE_BRANCH}"
  git merge --no-ff chore/structure-cleanup -m "merge: structure cleanup"
fi

# New branch
BR="chore/monorepo-structure"
git checkout -b "${BR}"

# ===== START: scaffold layout =====
echo "== Scaffolding monorepo layout =="
mkdir -p apps packages tools infra
mkdir -p apps/frontend apps/api-dev apps/reporting
mkdir -p packages/shared-types packages/eslint-config packages/tsconfig
mkdir -p infra/nginx infra/k8s

# ===== START: move projects (git mv to preserve history) =====
echo "== Moving projects =="

# Frontend: Move everything that's not a backend to apps/frontend
# First, move backends out of the way
if [ -d "dev-backend" ]; then
  git mv dev-backend apps/api-dev
fi

if [ -d "traffic-crm-backend-reporting" ]; then
  git mv traffic-crm-backend-reporting apps/reporting
fi

# Now move frontend files
echo "Moving frontend files..."
# List of files/dirs to move to apps/frontend
for item in index.html vite.config.mjs package.json tsconfig.json tsconfig.node.json tsconfig.node.tsbuildinfo \
            eslint.config.mjs jsconfig.json jsconfig.node.json \
            src public e2e docs scripts playwright.config.ts vitest.config.ts vitest.setup.ts \
            docker-compose.yml Dockerfile nginx.conf vercel.json \
            favicon.svg RUN.md README.md Traffic_CRM_API.postman_collection.json; do
  if [ -e "$item" ]; then
    git mv "$item" apps/frontend/ 2>/dev/null || true
  fi
done

# Move pnpm-lock.yaml to frontend (will regenerate at root later)
if [ -f "pnpm-lock.yaml" ]; then
  git mv pnpm-lock.yaml apps/frontend/ 2>/dev/null || true
fi

# ===== START: root files =====
echo "== Writing root workspace files =="
cat > pnpm-workspace.yaml <<'YML'
packages:
  - "apps/*"
  - "packages/*"
  - "tools/*"
YML

cat > tsconfig.base.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@traffic-crm/shared-types/*": ["packages/shared-types/src/*"]
    }
  }
}
JSON

cat > package.json <<'JSON'
{
  "name": "traffic-crm",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev": "pnpm -r --parallel --filter ./apps/* run dev",
    "build": "pnpm -r --filter ./apps/* run build",
    "typecheck": "pnpm -r run typecheck",
    "lint": "pnpm -r run lint",
    "test": "pnpm -r run test",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down",
    "audit:full": "pnpm --filter ./apps/frontend run audit:full",
    "fix:typescript": "pnpm --filter ./apps/frontend run fix:typescript"
  }
}
JSON

# ===== START: per-app tsconfig extends root =====
echo "== Patching app tsconfigs to extend tsconfig.base.json =="

patch_ts_ext () {
  local ts="$1"
  if [ -f "$ts" ]; then
    node - "$ts" <<'NODE'
const fs = require('fs');
const path = process.argv[2];
const raw = fs.readFileSync(path, 'utf8');
let json = {};
try { json = JSON.parse(raw); } catch(e){ process.exit(0); }
json.extends = "../../tsconfig.base.json";
fs.writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
NODE
  fi
}

patch_ts_ext apps/frontend/tsconfig.json || true
patch_ts_ext apps/frontend/tsconfig.node.json || true
patch_ts_ext apps/api-dev/tsconfig.json || true
patch_ts_ext apps/reporting/tsconfig.json || true

# ===== START: create minimal shared-types package =====
echo "== Creating packages/shared-types =="
mkdir -p packages/shared-types/src

cat > packages/shared-types/package.json <<'JSON'
{
  "name": "@traffic-crm/shared-types",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint ."
  }
}
JSON

cat > packages/shared-types/tsconfig.json <<'JSON'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "emitDeclarationOnly": false
  },
  "include": ["src"]
}
JSON

cat > packages/shared-types/src/index.ts <<'TS'
export type EntityId = string;
export type Paginated<T> = { data: T[]; total: number; page: number; pageSize: number; };
TS

# ===== START: write root .env.example =====
echo "== Root .env.example =="
cat > .env.example <<'ENV'
PORT_FRONTEND=3002
PORT_API_DEV=8787
PORT_REPORTING=3001
ENV

# ===== START: tidy & commit =====
echo "== Installing deps at root =="
pnpm install

echo "== Committing =="
git add -A
git commit -m "chore(monorepo): scaffold /apps & /packages, workspaces, base tsconfig; move frontend/api-dev/reporting (preserve history)"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    MONOREPO SETUP COMPLETE ✅                                ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📂 Structure created:"
echo "   apps/frontend/    - Vite + React"
echo "   apps/api-dev/     - Express mock API"
echo "   apps/reporting/   - NestJS reporting service"
echo "   packages/shared-types/ - Shared type definitions"
echo ""
echo "🔧 Next steps:"
echo "   1) cd apps/frontend && verify .env.example values"
echo "   2) pnpm dev   # run all apps in parallel (if each app defines dev)"
echo "      or run each app in its own terminal:"
echo "      (cd apps/api-dev && pnpm dev)"
echo "      (cd apps/reporting && pnpm dev)"
echo "      (cd apps/frontend && pnpm dev)"
echo ""
echo "✅ Verification commands:"
echo "   git log --follow apps/frontend/src/App.jsx | head -n 5"
echo "   pnpm -r ls --depth -1"
echo "   grep extends apps/frontend/tsconfig.json"
echo "   pnpm typecheck"
echo "   pnpm build --filter ./apps/frontend"
echo ""

