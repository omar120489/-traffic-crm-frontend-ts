#!/usr/bin/env bash
# Traffic CRM Dev Environment Launcher
# Ensures NVM + Node 20 are active before running commands

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Traffic CRM Dev Launcher${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ensure NVM is loaded
if [ -z "${NVM_DIR:-}" ]; then
  export NVM_DIR="$HOME/.nvm"
  echo "📦 Loading NVM..."
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
  else
    echo -e "${RED}✗${NC} NVM not found at $NVM_DIR/nvm.sh"
    echo "  Install from: https://github.com/nvm-sh/nvm"
    exit 1
  fi
fi

# Switch to Node 20
echo "📦 Activating Node 20..."
nvm use 20 &>/dev/null || {
  echo -e "${RED}✗${NC} Node 20 not installed"
  echo "  Installing Node 20..."
  nvm install 20
  nvm use 20
}

# Verify Node version
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node $NODE_VERSION active"
echo ""

# Check Docker
if ! docker info &> /dev/null; then
  echo -e "${YELLOW}⚠${NC} Docker is not running"
  echo ""
  echo "Please start Docker Desktop:"
  echo "  ${BLUE}open -a Docker${NC}"
  echo ""
  echo "Then re-run this script."
  exit 1
fi

echo -e "${GREEN}✓${NC} Docker is running"
echo ""

# Menu
echo "What would you like to do?"
echo ""
echo "  1) Run preflight checks"
echo "  2) Quick start (infrastructure + migrations + seed + JWT)"
echo "  3) Start backend only (core-api)"
echo "  4) Start frontend only"
echo "  5) Start all dev servers (backend + frontend)"
echo "  6) Generate dev JWT"
echo "  7) Regenerate SDK types"
echo "  8) Run database migrations"
echo "  9) Seed database"
echo "  0) Exit"
echo ""
read -p "Choose an option [1-9, 0]: " choice

case $choice in
  1)
    echo ""
    echo -e "${BLUE}Running preflight checks...${NC}"
    bash scripts/preflight-check.sh
    ;;
  2)
    echo ""
    echo -e "${BLUE}Running quick start...${NC}"
    bash scripts/quick-start.sh
    ;;
  3)
    echo ""
    echo -e "${BLUE}Starting backend (core-api)...${NC}"
    echo "  API will be available at: http://localhost:3000"
    echo "  Swagger docs at: http://localhost:3000/docs"
    echo ""
    pnpm --filter @apps/core-api dev
    ;;
  4)
    echo ""
    echo -e "${BLUE}Starting frontend...${NC}"
    echo "  Frontend will be available at: http://localhost:5173"
    echo ""
    pnpm --filter ./apps/frontend dev
    ;;
  5)
    echo ""
    echo -e "${BLUE}Starting all dev servers...${NC}"
    echo "  Backend: http://localhost:3000"
    echo "  Frontend: http://localhost:5173"
    echo ""
    echo -e "${YELLOW}Note:${NC} This will run in the current terminal."
    echo "       For separate terminals, run options 3 and 4 separately."
    echo ""
    pnpm dev
    ;;
  6)
    echo ""
    echo -e "${BLUE}Generating dev JWT...${NC}"
    pnpm dev:jwt
    echo ""
    echo -e "${YELLOW}Copy the token above and add to apps/frontend/.env.local:${NC}"
    echo "  VITE_DEV_JWT=<your-token>"
    ;;
  7)
    echo ""
    echo -e "${BLUE}Regenerating SDK types...${NC}"
    pnpm dev:sdk
    ;;
  8)
    echo ""
    echo -e "${BLUE}Running database migrations...${NC}"
    pnpm db:migrate
    ;;
  9)
    echo ""
    echo -e "${BLUE}Seeding database...${NC}"
    pnpm db:seed
    ;;
  0)
    echo ""
    echo "👋 Goodbye!"
    exit 0
    ;;
  *)
    echo ""
    echo -e "${RED}Invalid option${NC}"
    exit 1
    ;;
esac
