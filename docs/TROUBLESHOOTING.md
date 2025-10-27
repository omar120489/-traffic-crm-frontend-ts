# Traffic CRM Troubleshooting Guide

> Quick reference for common development environment issues

## Quick Diagnostics

Run the preflight check script to validate your environment:

```bash
bash scripts/preflight-check.sh
```

---

## Issue: Node Version Mismatch

**Symptom:** `WARN Unsupported engine: wanted: {"node":">=20 <21"} (current: {"node":"v24.7.0"})`

**Fix:**
```bash
# Using nvm
nvm use 20

# If Node 20 not installed
nvm install 20
nvm use 20

# Verify
node --version  # Should show v20.x.x
```

**Why:** The project uses features and dependencies tested against Node 20.x. Node 24 may have breaking changes.

---

## Issue: Docker Not Running

**Symptom:** `Error: Docker is not running` or `bash scripts/quick-start.sh` fails immediately

**Fix:**
```bash
# Launch Docker Desktop
open -a Docker

# Wait ~30 seconds for daemon to start
sleep 30

# Verify
docker info

# Start infrastructure
pnpm docker:up
```

**Verify services:**
```bash
docker ps
# Should show: trafficcrm-postgres, trafficcrm-redis, trafficcrm-mailhog, trafficcrm-minio
```

---

## Issue: Postgres Connection Error (P1001)

**Symptom:** `Error: P1001: Can't reach database server at localhost:5432`

**Fix:**
```bash
# Check if Postgres container is running
docker ps | grep trafficcrm-postgres

# If not running, start it
pnpm docker:up

# Check logs for errors
docker logs trafficcrm-postgres

# Verify connection
docker exec trafficcrm-postgres psql -U postgres -d trafficcrm -c "SELECT 1;"
```

**Alternative fix (if port 5432 is occupied):**
```bash
# Find what's using port 5432
lsof -i :5432

# Kill the process or change Docker port in infra/docker/docker-compose.yml
```

---

## Issue: Vite Port Permission Error

**Symptom:** `Error: listen EPERM 0.0.0.0:3002` or similar EPERM on frontend ports

**Fix Option 1 - Use localhost instead of 0.0.0.0:**
```bash
# Create or edit apps/frontend/.env.local
echo "PORT=5173" >> apps/frontend/.env.local
echo "HOST=127.0.0.1" >> apps/frontend/.env.local

# Then start
pnpm --filter ./apps/frontend dev
```

**Fix Option 2 - Check port conflicts:**
```bash
# Check if ports are in use
lsof -i :5173 -i :3002 -i :3000

# Kill conflicting processes if found
kill <PID>
```

**Fix Option 3 - macOS Firewall:**
```bash
# System Settings > Network > Firewall
# Temporarily disable or add exception for Node/Vite
```

---

## Issue: Missing Dev JWT

**Symptom:** Frontend loads but shows "Unauthorized" or can't authenticate

**Fix:**
```bash
# Generate dev JWT
pnpm dev:jwt

# Copy the output token and add to apps/frontend/.env.local
echo 'VITE_DEV_JWT=<your-token-here>' >> apps/frontend/.env.local

# Restart frontend
pnpm --filter ./apps/frontend dev
```

**Verify:**
- Open browser DevTools → Application → Local Storage
- Check for `serviceToken` key with JWT value

---

## Issue: Prisma Client Not Generated

**Symptom:** `Error: @prisma/client did not initialize yet` or import errors

**Fix:**
```bash
# Regenerate Prisma client
pnpm --filter @apps/core-api prisma:generate

# Or full reset
cd apps/core-api
npx prisma generate
```

---

## Issue: Database Schema Drift

**Symptom:** Migrations fail or Prisma reports schema mismatch

**Fix (DEVELOPMENT ONLY - destroys data):**
```bash
# Reset database and reapply migrations
pnpm db:migrate

# Reseed data
pnpm db:seed
```

**For production-like environments:**
```bash
cd apps/core-api
npx prisma migrate deploy
```

---

## Issue: pnpm Workspace Resolution Errors

**Symptom:** Module not found errors for `@traffic-crm/*` packages

**Fix:**
```bash
# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install --frozen-lockfile

# Verify workspace links
pnpm list --depth 0 | grep @traffic-crm
```

---

## Issue: Frontend Build Fails

**Symptom:** TypeScript errors during build or Vite errors

**Fix:**
```bash
# Run typecheck first to see exact errors
pnpm --filter ./apps/frontend typecheck

# Check for missing SDK types
pnpm dev:sdk

# Clear Vite cache
rm -rf apps/frontend/node_modules/.vite
pnpm --filter ./apps/frontend build
```

---

## Issue: ESLint/Markdownlint Pre-commit Failures

**Symptom:** `husky - pre-commit script failed`

**Fix:**
```bash
# Auto-fix linting issues
pnpm --filter ./apps/frontend lint:fix

# For markdown files
pnpm lint:md:fix

# If truly necessary, bypass hooks (use sparingly)
git commit --no-verify -m "your message"
```

---

## Complete Clean Reset

If all else fails, nuclear option:

```bash
# Stop all services
pnpm docker:down
docker ps -aq | xargs docker stop
docker ps -aq | xargs docker rm

# Remove all volumes (WARNING: deletes data)
docker volume prune -f

# Clean node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Reinstall
pnpm install

# Start fresh
bash scripts/quick-start.sh
```

---

## Environment Variables Checklist

### Backend (apps/core-api/.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trafficcrm?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dev-secret-change-me"
NODE_ENV="development"
```

### Frontend (apps/frontend/.env.local)
```env
VITE_DEV_JWT=<generated-token>
VITE_API_BASE_URL=http://localhost:3000
PORT=5173
```

---

## Useful Commands

```bash
# Check all service health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View container logs
docker logs -f trafficcrm-postgres
docker logs -f trafficcrm-redis

# Access Postgres shell
docker exec -it trafficcrm-postgres psql -U postgres -d trafficcrm

# Access Redis CLI
docker exec -it trafficcrm-redis redis-cli

# View MailHog UI (email testing)
open http://localhost:8025

# View MinIO console (S3-like storage)
open http://localhost:9001
```

---

## Still Stuck?

1. Check logs in `/tmp/core-dev.log`, `/tmp/frontend-dev.log`
2. Run `bash scripts/preflight-check.sh` for diagnostics
3. Review `PROJECT_STATUS_OVERVIEW.md` for known issues
4. Check `.github/copilot-instructions.md` for architecture context
5. Verify you're on Node 20.x with `node --version`

## Getting Help

When reporting issues, include:
- Output of `bash scripts/preflight-check.sh`
- Node version: `node --version`
- pnpm version: `pnpm --version`
- Docker status: `docker ps`
- Relevant error logs from `/tmp/*.log`
