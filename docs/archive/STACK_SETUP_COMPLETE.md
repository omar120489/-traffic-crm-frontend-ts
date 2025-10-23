# 🚀 Full Stack Setup Complete

Your Traffic CRM monorepo is now wired end-to-end with:

- ✅ **Typed SDK** generated from Core API Swagger
- ✅ **Prisma Seeds** with demo data
- ✅ **Dev JWT Generator** for local auth bypass
- ✅ **Workers** scaffolding (BullMQ + Redis)
- ✅ **Docker Infrastructure** (Postgres, Redis, MailHog, MinIO)

---

## 📦 What Was Added

### 1. **Packages/SDK-JS** (`packages/sdk-js/`)

- OpenAPI-generated TypeScript client using `ky`
- Auto-typed from `/docs-json` endpoint
- Supports contacts, companies, leads, deals modules

### 2. **Frontend SDK Client** (`apps/frontend/src/data/clients/sdk.ts`)

- Unified API client with auth header injection
- Reads JWT from `.env.local` (`VITE_DEV_JWT`) or `localStorage`
- Example service: `services/contacts.sdk.ts`

### 3. **Prisma Seed** (`apps/core-api/prisma/seed.ts`)

- Demo org: `demo-org`
- 1 company: Acme Inc.
- 2 contacts: John Doe, Jane Smith
- 2 leads: Website Inquiry, Referral
- 2 deals: Acme Pilot, Enterprise Package

### 4. **JWT Generator** (`apps/core-api/scripts/make-dev-jwt.mjs`)

- Creates valid JWT tokens for local dev
- Claims: `orgId`, `sub` (userId), `roles`
- Valid for 24 hours

### 5. **Workers** (`apps/workers/`)

- **lead-scoring** queue: Automatic lead qualification
- **enrichment** queue: Contact/company data enrichment
- Uses BullMQ + IORedis

### 6. **Docker Compose** (`infra/docker/docker-compose.yml`)

- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)
- MailHog (ports 1025/8025)
- MinIO (ports 9000/9001)

---

## 🎯 Quick Start (5 Steps)

### Step 1: Start Infrastructure

```bash
# From monorepo root
pnpm docker:up

# Wait for services to be healthy (~10 seconds)
docker compose -f infra/docker/docker-compose.yml ps
```

**Expected Output:**

```
trafficcrm-postgres   running   healthy   5432/tcp
trafficcrm-redis      running   healthy   6379/tcp
trafficcrm-mailhog    running   healthy   1025/tcp, 8025/tcp
trafficcrm-minio      running   healthy   9000/tcp, 9001/tcp
```

### Step 2: Database Setup

```bash
# Run migrations
pnpm db:migrate

# Seed demo data
pnpm db:seed
```

**Expected Output:**

```
🌱 Seeding database...
✅ Org: Demo Org (demo-org)
✅ Company: Acme Inc.
✅ Contact: John Doe (john.doe@acme.com)
✅ Contact: Jane Smith (jane.smith@acme.com)
✅ Lead: Website Inquiry (NEW)
✅ Lead: Referral from Partner (QUALIFIED)
✅ Deal: Acme Pilot Project ($12000)
✅ Deal: Enterprise Package ($50000)

✅ Seed complete for org: demo-org
```

### Step 3: Generate Dev JWT

```bash
pnpm dev:jwt
```

**Expected Output:**

```
🔐 Dev JWT Token (valid for 24h):

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImRlbW8tb3JnI...

📋 To use in frontend:
   echo "VITE_DEV_JWT=<token>" >> apps/frontend/.env.local
```

**Copy the token** and add it to your frontend env:

```bash
echo "VITE_DEV_JWT=<paste_token_here>" >> apps/frontend/.env.local
```

### Step 4: Start Core API

```bash
pnpm --filter @apps/core-api dev
```

**Wait for:**

```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
[Nest] INFO [RoutesResolver] ContactsController {/contacts}:
[Nest] INFO [NestApplication] Listening on http://localhost:3000
[Nest] INFO Swagger docs: http://localhost:3000/docs
```

**Verify Swagger:** Open <http://localhost:3000/docs>

### Step 5: Generate SDK Types & Start Frontend

```bash
# Generate types from live API
pnpm sdk:gen

# Start frontend
pnpm --filter ./apps/frontend dev
```

**Open:** <http://localhost:5173>

---

## 🧪 Manual Testing

### Test 1: API with JWT

```bash
# Get JWT
pnpm dev:jwt

# Test contacts endpoint (replace <TOKEN>)
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/api/contacts
```

**Expected Response:**

```json
{
  "items": [
    {
      "id": "ct-john",
      "orgId": "demo-org",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@acme.com",
      "phone": "+1-555-0100",
      "companyId": "cmp-acme",
      "createdAt": "2025-10-23T...",
      "updatedAt": "2025-10-23T..."
    },
    {
      "id": "ct-jane",
      ...
    }
  ],
  "total": 2,
  "page": 1,
  "size": 10
}
```

### Test 2: Frontend SDK Call

Open browser console on <http://localhost:5173> and run:

```javascript
// Import SDK (if not already available globally)
import { api } from '/src/data/clients/sdk';

// Fetch contacts
const contacts = await api.listContacts();
console.log(contacts);
```

**Expected:** See John Doe and Jane Smith in the response.

### Test 3: Contacts Page

Navigate to <http://localhost:5173/contacts>

**Expected:**

- Table with John Doe and Jane Smith
- Pagination controls
- Search bar functional
- No 401/403 errors

---

## 🔧 Configuration Files

### Frontend `.env.local`

```env
# Core API URL
VITE_APP_API_URL=http://localhost:3000/api

# Dev JWT (from pnpm dev:jwt)
VITE_DEV_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth0 (if using real auth)
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=

# Feature flags
VITE_ENABLE_CHAT=false
VITE_ENABLE_WORKERS=false
```

### Core API `.env`

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trafficcrm

# Redis (for workers)
REDIS_URL=redis://localhost:6379

# JWT (for dev only - use Auth0/JWKS in prod)
DEV_JWT_SECRET=dev-secret-change-me

# SMTP (MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# S3 (MinIO)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=traffic-crm

# Server
PORT=3000
NODE_ENV=development
```

---

## 📚 Available Scripts

### Root-Level Scripts

```bash
# Development
pnpm dev                  # Start all apps in parallel
pnpm dev:jwt              # Generate dev JWT token
pnpm sdk:gen              # Regenerate SDK types from Swagger

# Infrastructure
pnpm docker:up            # Start all Docker services
pnpm docker:down          # Stop all Docker services
pnpm db:up                # Start Postgres only
pnpm db:migrate           # Run Prisma migrations
pnpm db:seed              # Seed demo data

# Quality
pnpm typecheck            # Typecheck all workspaces
pnpm lint                 # Lint all workspaces
pnpm test                 # Run all tests
pnpm build                # Build all apps
```

### Core API Scripts

```bash
pnpm --filter @apps/core-api dev            # Start API with hot reload
pnpm --filter @apps/core-api build          # Build for production
pnpm --filter @apps/core-api prisma:studio  # Open Prisma Studio
pnpm --filter @apps/core-api dev:jwt        # Generate JWT
pnpm --filter @apps/core-api db:seed        # Seed database
```

### Frontend Scripts

```bash
pnpm --filter ./apps/frontend dev       # Start Vite dev server
pnpm --filter ./apps/frontend build     # Production build
pnpm --filter ./apps/frontend preview   # Preview production build
pnpm --filter ./apps/frontend typecheck # Type check only
```

### Workers Scripts (Optional)

```bash
# Ensure Redis is running first
docker compose -f infra/docker/docker-compose.yml up -d redis

# Start workers
pnpm --filter @apps/workers dev
```

---

## 🔄 Development Workflow

### Daily Workflow

```bash
# 1. Start infrastructure (first time or after reboot)
pnpm docker:up

# 2. Start API
pnpm --filter @apps/core-api dev

# 3. Start frontend (new terminal)
pnpm --filter ./apps/frontend dev

# Optional: Start workers
pnpm --filter @apps/workers dev
```

### After API Changes

```bash
# 1. Update Prisma schema
# 2. Run migration
pnpm db:migrate

# 3. Regenerate SDK types
pnpm sdk:gen

# 4. Frontend will hot-reload with new types
```

### After Schema Changes

```bash
# Update prisma/schema.prisma
pnpm --filter @apps/core-api prisma:generate
pnpm --filter @apps/core-api prisma:migrate --name <migration_name>
pnpm sdk:gen  # Regenerate frontend types
```

---

## 🚀 Next Steps (Fast Wins)

### 1. Replace Legacy Services with SDK

**Current:** `services/contacts.ts` uses axios directly  
**New:** Use `services/contacts.sdk.ts` (already created)

**Migration:**

```typescript
// Old: apps/frontend/src/services/contacts.ts
import { apiGet } from '@data/clients/axios';

export async function listContacts() {
  return apiGet('/api/contacts');
}

// New: apps/frontend/src/services/contacts.sdk.ts
import { api } from '@/data/clients/sdk';

export async function listContacts() {
  return api.listContacts(); // Fully typed!
}
```

**To migrate:**

1. Test SDK service alongside old one
2. Update imports in components: `import { listContacts } from '@services/contacts.sdk'`
3. Delete old service once verified

### 2. Add SDK Methods for Leads/Deals/Companies

Edit `packages/sdk-js/src/index.ts` and add methods following the Contacts pattern:

```typescript
// Leads
listLeads: async (query?) =>
  http.get('leads', { searchParams: query }).json(),
getLead: async (id: string) =>
  http.get(`leads/${id}`).json(),
createLead: async (body) =>
  http.post('leads', { json: body }).json(),

// Similar for Deals and Companies
```

### 3. Enable Background Jobs

In the Core API, enqueue jobs on entity changes:

```typescript
// apps/core-api/src/leads/leads.service.ts
import { leadScoringQueue } from '@apps/workers';

async create(dto: CreateLeadDto) {
  const lead = await this.prisma.lead.create({ data: dto });
  
  // Enqueue scoring job
  await leadScoringQueue.add('score', { leadId: lead.id });
  
  return lead;
}
```

Start workers: `pnpm --filter @apps/workers dev`

### 4. Add More Modules to Core API

Follow the Contacts pattern in `apps/core-api/src/`:

```bash
cd apps/core-api
nest g resource notifications
nest g resource activities
nest g resource attachments
```

Then regenerate SDK: `pnpm sdk:gen`

### 5. Add Real Authentication

Replace dev JWT with Auth0/Cognito/Keycloak:

1. Update `JwtGuard` in `apps/core-api/src/auth/jwt.guard.ts` to verify real tokens
2. Configure JWKS endpoint
3. Remove `VITE_DEV_JWT` from frontend `.env`
4. Implement proper login flow

---

## 🐛 Troubleshooting

### SDK Types Not Generated?

```bash
# Ensure API is running
pnpm --filter @apps/core-api dev

# Wait for "Listening on http://localhost:3000"

# Then generate
pnpm sdk:gen
```

### 401 Unauthorized in Frontend?

```bash
# Regenerate JWT
pnpm dev:jwt

# Copy token to .env.local
echo "VITE_DEV_JWT=<token>" >> apps/frontend/.env.local

# Restart frontend
pnpm --filter ./apps/frontend dev
```

### Database Connection Failed?

```bash
# Check Postgres is running
docker compose -f infra/docker/docker-compose.yml ps

# If not, start it
pnpm docker:up

# Check DATABASE_URL in apps/core-api/.env
# Should be: postgresql://postgres:postgres@localhost:5432/trafficcrm
```

### Workers Not Processing Jobs?

```bash
# Ensure Redis is running
docker compose -f infra/docker/docker-compose.yml ps | grep redis

# If not:
docker compose -f infra/docker/docker-compose.yml up -d redis

# Check Redis connection in workers logs
pnpm --filter @apps/workers dev
# Should see: ✅ Workers running. Queues: lead-scoring, enrichment
```

### Port Already in Use?

```bash
# Find process using port 3000 (Core API)
lsof -ti:3000 | xargs kill -9

# Find process using port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

---

## 📊 Service URLs Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | <http://localhost:5173> | React app |
| **Core API** | <http://localhost:3000> | NestJS REST API |
| **Swagger Docs** | <http://localhost:3000/docs> | API documentation |
| **Swagger JSON** | <http://localhost:3000/docs-json> | OpenAPI spec (for SDK) |
| **PostgreSQL** | localhost:5432 | Database |
| **Prisma Studio** | <http://localhost:5555> | Database GUI (run `prisma:studio`) |
| **Redis** | localhost:6379 | Job queues, cache |
| **MailHog UI** | <http://localhost:8025> | Email testing |
| **MinIO Console** | <http://localhost:9001> | S3 storage UI (admin/minioadmin) |

---

## 📁 New File Structure

```
traffic-crm/
├── package.json                        # ✏️ Updated: docker:up, db scripts
├── pnpm-workspace.yaml                 # Already includes all workspaces
├── apps/
│   ├── core-api/
│   │   ├── prisma/
│   │   │   └── seed.ts                 # ✅ Created: demo data
│   │   └── scripts/
│   │       └── make-dev-jwt.mjs        # ✅ Created: JWT generator
│   ├── frontend/
│   │   ├── .env.example                # ✅ Created: API URL config
│   │   ├── src/data/clients/
│   │   │   └── sdk.ts                  # ✅ Created: SDK client
│   │   └── src/services/
│   │       └── contacts.sdk.ts         # ✅ Created: example SDK service
│   └── workers/
│       ├── package.json                # ✅ Created: BullMQ + IORedis
│       ├── tsconfig.json               # ✅ Created
│       └── src/
│           └── index.ts                # ✅ Created: lead-scoring, enrichment queues
├── packages/
│   └── sdk-js/
│       ├── package.json                # ✅ Created: openapi-typescript, ky
│       ├── tsconfig.json               # ✅ Created
│       └── src/
│           └── index.ts                # ✅ Created: typed client
└── infra/
    └── docker/
        ├── docker-compose.yml          # ✅ Created: PG, Redis, MailHog, MinIO
        └── README.md                   # ✅ Created: infra docs
```

---

## ✅ Verification Checklist

- [ ] Infrastructure running: `docker compose -f infra/docker/docker-compose.yml ps`
- [ ] Database migrated: `pnpm db:migrate`
- [ ] Seed data loaded: `pnpm db:seed`
- [ ] JWT generated: `pnpm dev:jwt` (token copied to `.env.local`)
- [ ] Core API running: <http://localhost:3000/docs>
- [ ] SDK types generated: `pnpm sdk:gen` (no errors)
- [ ] Frontend running: <http://localhost:5173>
- [ ] Contacts page loads with John Doe & Jane Smith
- [ ] No 401/403 errors in browser console
- [ ] Workers ready (optional): `pnpm --filter @apps/workers dev`

---

## 🎉 You're Ready

Your full stack is now operational:

- ✅ **Backend**: NestJS + Fastify + Prisma + PostgreSQL
- ✅ **Frontend**: React + Vite + TypeScript + MUI
- ✅ **SDK**: Typed API client with auth
- ✅ **Workers**: Background job processing
- ✅ **Infrastructure**: Dockerized dev services
- ✅ **Seeds**: Demo data for testing

**Next:** Start building features! 🚀

---

**Questions?** Check:

- `packages/sdk-js/README.md` - SDK usage
- `infra/docker/README.md` - Infrastructure details
- `apps/workers/README.md` - Workers usage
- `apps/core-api/README.md` - API development

**Need help with a specific module?** All patterns are established - just follow the Contacts example!
