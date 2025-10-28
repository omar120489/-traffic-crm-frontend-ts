# Traffic CRM - Quick Reference

## 🚀 Starting Development (with Node 20)

### Option 1: Interactive Menu (Recommended)

```bash
# Loads NVM + Node 20, then shows interactive menu
bash scripts/dev-launcher.sh
```

### Option 2: Manual Commands

**Load Node 20 first:**

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 20
```

**Then run any command:**

```bash
# Preflight check
bash scripts/preflight-check.sh

# Quick start (everything)
bash scripts/quick-start.sh

# Start backend only
pnpm --filter @apps/core-api dev

# Start frontend only
pnpm --filter ./apps/frontend dev

# Start all services
pnpm dev
```

---

## 📦 One-Liner for Node 20 + Command

```bash
# Example: Run quick-start with Node 20
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20 && bash scripts/quick-start.sh

# Example: Start backend with Node 20
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20 && pnpm --filter @apps/core-api dev

# Example: Start frontend with Node 20
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20 && pnpm --filter ./apps/frontend dev
```

---

## 🔧 Common Tasks

| Task | Command |
|------|---------|
| **Verify Node version** | `node --version` (should be v20.x) |
| **Check Docker status** | `docker ps` |
| **Start Docker services** | `pnpm docker:up` |
| **Stop Docker services** | `pnpm docker:down` |
| **Run migrations** | `pnpm db:migrate` |
| **Seed database** | `pnpm db:seed` |
| **Generate dev JWT** | `pnpm dev:jwt` |
| **Regenerate SDK** | `pnpm dev:sdk` |
| **Typecheck workspace** | `pnpm typecheck` |
| **Lint workspace** | `pnpm lint` |
| **Run tests** | `pnpm test` |

---

## 🐳 Docker Services

After `pnpm docker:up`:

- **Postgres:** `localhost:5432` (user: `postgres`, pass: `postgres`, db: `trafficcrm`)
- **Redis:** `localhost:6379`
- **MailHog UI:** <http://localhost:8025>
- **MailHog SMTP:** `localhost:1025`
- **MinIO Console:** <http://localhost:9001>

---

## 🌐 Development URLs

- **Backend API:** <http://localhost:3000>
- **Swagger Docs:** <http://localhost:3000/docs>
- **Frontend:** <http://localhost:5173>
- **MailHog (email testing):** <http://localhost:8025>

---

## ⚠️ Troubleshooting

### Node version wrong?

```bash
# Source NVM and switch to Node 20
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 20
node --version  # Should show v20.x
```

### Docker not running?

```bash
# Start Docker Desktop
open -a Docker

# Wait ~30s, then verify
docker info
```

### Database connection error?

```bash
# Check Postgres is running
docker ps | grep trafficcrm-postgres

# View logs
docker logs trafficcrm-postgres

# Restart if needed
pnpm docker:down && pnpm docker:up
```

### Frontend port error?

```bash
# Check what's using ports
lsof -i :5173 -i :3000 -i :3002

# Kill conflicting processes
kill <PID>
```

---

## 📚 Documentation

- **Architecture & Agent Guide:** `.github/copilot-instructions.md`
- **Project Status:** `PROJECT_STATUS_OVERVIEW.md`
- **Frontend Structure:** `docs/FRONTEND_STRUCTURE.md`
- **Full Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **Main README:** `README.md`

---

## 🎯 Typical Development Session

```bash
# 1. Start Docker Desktop (if not running)
open -a Docker

# 2. Use interactive launcher (handles Node 20 automatically)
bash scripts/dev-launcher.sh
# Choose option 2 (Quick start) or 5 (Start all dev servers)

# 3. Access the app
open http://localhost:5173  # Frontend
open http://localhost:3000/docs  # API docs
```

---

## 💡 Pro Tips

- **Use the interactive launcher** (`bash scripts/dev-launcher.sh`) - it handles Node 20 automatically
- **Run preflight checks** before starting dev to catch issues early
- **Keep Docker Desktop running** to avoid database connection errors
- **Terminal multiplexer?** Use tmux/screen to run backend + frontend simultaneously
- **VS Code Integrated Terminal** works great with NVM when you source it first

---

## 🆘 Still Stuck?

Run this diagnostic:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 20
bash scripts/preflight-check.sh
```

Then check `docs/TROUBLESHOOTING.md` for solutions.
