#!/usr/bin/env bash
set -euo pipefail

# Traffic CRM Preflight Check
# Validates environment before running dev servers

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Traffic CRM Preflight Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check 1: Node version
echo "📦 Checking Node version..."
NODE_VERSION=$(node --version | sed 's/v//')
MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d. -f1)

if [ "$MAJOR_VERSION" -eq 20 ]; then
  echo -e "${GREEN}✓${NC} Node $NODE_VERSION (required: 20.x)"
else
  echo -e "${RED}✗${NC} Node $NODE_VERSION detected. Required: 20.x"
  echo -e "  ${YELLOW}Fix:${NC} nvm use 20 (or nvm install 20 && nvm use 20)"
  exit 1
fi

# Check 2: pnpm availability
echo ""
echo "📦 Checking pnpm..."
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm --version)
  echo -e "${GREEN}✓${NC} pnpm $PNPM_VERSION"
else
  echo -e "${RED}✗${NC} pnpm not found"
  echo -e "  ${YELLOW}Fix:${NC} corepack enable pnpm"
  exit 1
fi

# Check 3: Docker
echo ""
echo "🐳 Checking Docker..."
if ! docker info &> /dev/null; then
  echo -e "${RED}✗${NC} Docker daemon not reachable"
  echo -e "  ${YELLOW}Fix:${NC} open -a Docker (wait 30s, then retry)"
  exit 1
else
  echo -e "${GREEN}✓${NC} Docker is running"
fi

# Check 4: Required ports
echo ""
echo "🔌 Checking port availability..."
PORTS=(3000 3002 5173 5432 6379 8025)
PORT_CONFLICTS=()

for PORT in "${PORTS[@]}"; do
  if lsof -Pi :$PORT -sTCP:LISTEN -t &>/dev/null; then
    PORT_CONFLICTS+=($PORT)
  fi
done

if [ ${#PORT_CONFLICTS[@]} -eq 0 ]; then
  echo -e "${GREEN}✓${NC} All required ports available (3000, 3002, 5173, 5432, 6379, 8025)"
else
  echo -e "${YELLOW}⚠${NC} Ports in use: ${PORT_CONFLICTS[*]}"
  echo "  This may cause conflicts. Run 'lsof -i :<port>' to identify processes."
fi

# Check 5: Docker services
echo ""
echo "🐳 Checking Docker services..."
if docker ps --format '{{.Names}}' | grep -q "trafficcrm-postgres"; then
  echo -e "${GREEN}✓${NC} Postgres container running"
else
  echo -e "${YELLOW}⚠${NC} Postgres container not running"
  echo -e "  ${YELLOW}Fix:${NC} pnpm docker:up"
fi

if docker ps --format '{{.Names}}' | grep -q "trafficcrm-redis"; then
  echo -e "${GREEN}✓${NC} Redis container running"
else
  echo -e "${YELLOW}⚠${NC} Redis container not running"
  echo -e "  ${YELLOW}Fix:${NC} pnpm docker:up"
fi

# Check 6: Frontend .env files
echo ""
echo "📝 Checking frontend configuration..."
if [ -f "apps/frontend/.env" ]; then
  echo -e "${GREEN}✓${NC} apps/frontend/.env exists"
else
  echo -e "${YELLOW}⚠${NC} apps/frontend/.env not found (optional, will use defaults)"
fi

if [ -f "apps/frontend/.env.local" ]; then
  if grep -q "VITE_DEV_JWT" apps/frontend/.env.local; then
    echo -e "${GREEN}✓${NC} Dev JWT configured in .env.local"
  else
    echo -e "${YELLOW}⚠${NC} No VITE_DEV_JWT in .env.local"
    echo -e "  ${YELLOW}Fix:${NC} pnpm dev:jwt (then append to apps/frontend/.env.local)"
  fi
else
  echo -e "${YELLOW}⚠${NC} apps/frontend/.env.local not found"
  echo -e "  ${YELLOW}Fix:${NC} pnpm dev:jwt > apps/frontend/.env.local"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓${NC} Preflight check complete!"
echo ""
echo "Next steps:"
echo "  1. pnpm docker:up          # Start infrastructure"
echo "  2. pnpm db:migrate         # Run migrations"
echo "  3. pnpm db:seed            # Seed demo data"
echo "  4. pnpm dev:jwt            # Generate dev JWT"
echo "  5. pnpm dev                # Start all dev servers"
echo ""
echo "Or use: bash scripts/quick-start.sh"
