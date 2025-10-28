#!/usr/bin/env bash
set -euo pipefail

# Traffic CRM Quick Start Script
# Automates the common development startup sequence

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

cd "$ROOT"

echo "🚀 Traffic CRM Quick Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SKIP_DOCKER=0

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "⚠️ Docker is not running; skipping infrastructure steps."
  SKIP_DOCKER=1
else
  # Step 1: Start infrastructure
  echo "📦 Step 1/4: Starting Docker infrastructure..."
  pnpm docker:up
  echo "   ✅ PostgreSQL, Redis, MailHog, MinIO started"
  echo ""

  # Wait for services to be healthy
  echo "⏳ Waiting for services to be healthy (10s)..."
  sleep 10

  # Step 2: Check if database needs setup
  if ! docker exec trafficcrm-postgres psql -U postgres -d trafficcrm -c "SELECT 1 FROM _prisma_migrations LIMIT 1" >/dev/null 2>&1; then
    echo "📊 Step 2/4: Setting up database..."
    echo "   Running migrations..."
    pnpm db:migrate --name init
    echo "   ✅ Migrations complete"

    echo "   Seeding demo data..."
    pnpm db:seed
    echo "   ✅ Seed complete (demo-org, 2 contacts, 2 leads, 2 deals)"
  else
    echo "📊 Step 2/4: Database already set up"
    echo "   ✅ Skipping migrations and seed"
  fi
  echo ""
fi

# Step 3: Generate JWT if .env.local doesn't exist
if [ ! -f "apps/frontend/.env.local" ] || ! grep -q "VITE_DEV_JWT" "apps/frontend/.env.local" 2>/dev/null; then
  echo "🔐 Step 3/4: Generating dev JWT token..."
  JWT_TOKEN=$(node apps/core-api/scripts/make-dev-jwt.mjs 2>/dev/null | grep -A1 "Dev JWT Token" | tail -1 | xargs)
  
  if [ -n "$JWT_TOKEN" ]; then
    echo "VITE_APP_API_URL=http://localhost:3000/api" > apps/frontend/.env.local
    echo "VITE_DEV_JWT=$JWT_TOKEN" >> apps/frontend/.env.local
    echo "   ✅ JWT saved to apps/frontend/.env.local"
  else
    echo "   ⚠️  JWT generation failed, you may need to generate manually:"
    echo "      pnpm dev:jwt"
  fi
else
  echo "🔐 Step 3/4: JWT already configured"
  echo "   ✅ Using existing apps/frontend/.env.local"
fi
echo ""

# Step 4: Generate SDK types (if API is not running, will fail gracefully)
if [[ "$SKIP_DOCKER" -eq 0 ]]; then
  echo "🔧 Step 4/4: Checking SDK types..."
  if curl -s http://localhost:3000/docs-json >/dev/null 2>&1; then
    echo "   Regenerating SDK from live API..."
    pnpm sdk:gen
    echo "   ✅ SDK types updated"
  else
    echo "   ⚠️  Core API not running yet, skipping SDK generation"
    echo "   Run 'pnpm sdk:gen' after starting the API"
  fi
  echo ""
else
  echo "🔧 Step 4/4: Skipping SDK generation (Docker unavailable)"
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start Core API:"
echo "   pnpm --filter @apps/core-api dev"
echo "   Wait for: http://localhost:3000/docs"
echo ""
echo "2️⃣  Generate SDK types (if not done above):"
echo "   pnpm sdk:gen"
echo ""
echo "3️⃣  Start Frontend (new terminal):"
echo "   pnpm --filter ./apps/frontend dev"
echo "   Open: http://localhost:5173"
echo ""
echo "4️⃣  (Optional) Start Workers:"
echo "   pnpm --filter @apps/workers dev"
echo ""
echo "📚 Full guide: STACK_SETUP_COMPLETE.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
