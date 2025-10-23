# 🎯 Next Steps - Traffic CRM

## ✅ What's Been Completed

### Phase 1: Monorepo Setup ✅

- ✅ PNPM workspaces configured
- ✅ Apps organized: frontend, core-api, workers, reporting, api-dev
- ✅ Shared packages: @shared-types, @sdk-js/core
- ✅ Path aliases configured across all apps
- ✅ Docker Compose infrastructure (PostgreSQL, Redis, MailHog, MinIO)

### Phase 2A: Shared Types ✅

- ✅ `packages/shared-types` with domain models (Contacts, Leads, Deals, Companies)
- ✅ Frontend services migrated to use `@shared-types`
- ✅ Base types (UUID, ISODateString, BaseEntity, PaginatedResponse)
- ✅ `forceConsistentCasingInFileNames` enabled

### Core API + SDK + Seeds ✅

- ✅ NestJS Core API with Fastify + Prisma
- ✅ Swagger/OpenAPI documentation at `/docs`
- ✅ JWT Guard for org-scoped auth
- ✅ Modules: Contacts, Companies, Leads, Deals
- ✅ Typed SDK (`@sdk-js/core`) auto-generated from OpenAPI
- ✅ Frontend SDK client with auth injection
- ✅ Prisma seed with demo data (demo-org, Acme Inc., 2 contacts, 2 leads, 2 deals)
- ✅ Dev JWT generator script
- ✅ Workers scaffolding (BullMQ + Redis)

### Branding ✅

- ✅ Logo component updated for RIO Travels PNG
- ✅ Favicon and PWA manifest configured
- ✅ HTML meta tags updated

### Documentation ✅

- ✅ `STACK_SETUP_COMPLETE.md` - Full setup guide
- ✅ `docs/guides/SDK_MIGRATION.md` - SDK migration patterns
- ✅ `docs/guides/BRANDING_SETUP.md` - Logo setup
- ✅ `scripts/quick-start.sh` - Automated startup
- ✅ Root `README.md` - Project overview

---

## 🚀 What to Do Next (Prioritized)

### Immediate (Today)

#### 1. **Start the Stack** (5 minutes)

```bash
# Option A: Automated
./scripts/quick-start.sh

# Option B: Manual
pnpm docker:up
pnpm db:migrate
pnpm db:seed
pnpm dev:jwt  # Copy token to apps/frontend/.env.local
```

Then start services:

```bash
# Terminal 1: Core API
pnpm --filter @apps/core-api dev

# Terminal 2: Frontend
pnpm sdk:gen  # Generate SDK types first
pnpm --filter ./apps/frontend dev
```

**Goal:** Verify <http://localhost:5173/contacts> shows John Doe & Jane Smith

#### 2. **Place RIO Travels Logo** (2 minutes)

```bash
./scripts/install_logo.sh ~/path/to/rio-travels-logo.png
```

Or manually copy to:

- `apps/frontend/public/rio-travels.png`
- `apps/frontend/src/assets/images/brand/rio-travels.png`

**Goal:** See RIO logo in header and browser tab

### Short-Term (This Week)

#### 3. **Migrate Services to SDK** (1-2 hours)

Following the Contacts pattern in `services/contacts.sdk.ts`, create:

- `services/leads.sdk.ts`
- `services/deals.sdk.ts`
- `services/companies.sdk.ts`

Update component imports to use SDK services.

**Guide:** `docs/guides/SDK_MIGRATION.md`

**Goal:** All list pages use typed SDK calls

#### 4. **Test End-to-End Flows** (1 hour)

- Create a new contact
- Convert to lead
- Promote to deal
- Update deal stage
- Close deal (won/lost)

**Goal:** Verify data persists in PostgreSQL, no errors

#### 5. **Enable Background Workers** (30 minutes)

```bash
# Ensure Redis is running
pnpm docker:up

# Start workers
pnpm --filter @apps/workers dev
```

In Core API, enqueue jobs:

```typescript
// apps/core-api/src/leads/leads.service.ts
import { leadScoringQueue } from '@apps/workers';

async create(dto: CreateLeadDto) {
  const lead = await this.prisma.lead.create({ data: dto });
  await leadScoringQueue.add('score', { leadId: lead.id });
  return lead;
}
```

**Goal:** Leads automatically scored on creation

#### 6. **Add More Core API Modules** (2-3 hours)

```bash
cd apps/core-api
nest g resource activities
nest g resource notifications
nest g resource attachments
```

Then regenerate SDK: `pnpm sdk:gen`

**Goal:** Full CRUD for activities, notifications, attachments

### Medium-Term (Next 2 Weeks)

#### 7. **Replace Legacy API Mocks** (4-6 hours)

- Remove `apps/api-dev` (Express mock API)
- Update all frontend services to use Core API via SDK
- Test all pages with real backend

**Goal:** Delete `apps/api-dev` directory

#### 8. **Implement Real Authentication** (1-2 days)

Choose:

- **Auth0** (recommended, easiest)
- **AWS Cognito**
- **Keycloak**

Update:

- `apps/core-api/src/auth/jwt.guard.ts` to verify real JWKs
- Frontend to use Auth0 React SDK
- Remove `VITE_DEV_JWT` from `.env.local`

**Goal:** Secure login/logout flow

#### 9. **Phase 2B: API Contracts (OpenAPI)** (2-3 days)

- Already done! SDK is generated from Swagger.
- Add `packages/api-contracts` for versioned OpenAPI specs (optional)
- Generate client SDK for mobile/external consumers

**Goal:** Stable API versioning strategy

#### 10. **Phase 2C: Frontend Standardization** (3-5 days)

- Enforce `AppPage` wrapper on all pages
- Implement `useUrlQuery` for URL-driven filters
- Add route-aware CSV/XLSX/PDF exports via `core/export`
- Implement RBAC via `core/rbac/permissions.ts`
- Ensure no horizontal scroll on mobile

**Guide:** Phase 2C in `docs/planning/PHASE_2_PLAN.md` (if exists)

**Goal:** Consistent UX across all pages

#### 11. **Phase 2D: Dev Experience & Guardrails** (1-2 days)

- Pre-commit hooks: `lint-staged` + `simple-git-hooks`
- GitHub Actions CI matrix for all apps/packages
- ESLint import zones (forbid legacy imports)
- Playwright smoke tests on PR

**Goal:** Automated quality gates

### Long-Term (Next Month)

#### 12. **Observability & Logging** (2-3 days)

- Request/response logging in Core API
- Frontend error boundary with Sentry/LogRocket
- Web vitals tracking
- Real-time dashboard for job queues (BullMQ dashboard)

**Goal:** Production-ready monitoring

#### 13. **Reporting Service Integration** (3-5 days)

- Wire `apps/reporting` to Core API database
- Add P&L, attribution, conversion reports
- Create scheduled report emails

**Goal:** Automated business intelligence

#### 14. **Mobile/PWA Optimization** (1 week)

- Service worker for offline support
- Push notifications via Web Push API
- Install prompt for PWA
- Mobile-first responsive design audit

**Goal:** Installable mobile experience

#### 15. **Performance Optimization** (1 week)

- Lazy load routes with React.lazy
- Image optimization (WebP, responsive images)
- CDN setup for static assets
- Database query optimization (Prisma indexes)

**Goal:** < 2s page load, 95+ Lighthouse score

---

## 📋 Verification Checklist

Use this to track your progress:

### Infrastructure

- [ ] Docker services running (`pnpm docker:up`)
- [ ] PostgreSQL accessible on port 5432
- [ ] Redis accessible on port 6379
- [ ] MailHog UI at <http://localhost:8025>
- [ ] MinIO console at <http://localhost:9001>

### Core API

- [ ] Migrations run (`pnpm db:migrate`)
- [ ] Seed data loaded (`pnpm db:seed`)
- [ ] API running at <http://localhost:3000>
- [ ] Swagger docs at <http://localhost:3000/docs>
- [ ] JWT guard active (401 without token)

### SDK

- [ ] SDK types generated (`pnpm sdk:gen`)
- [ ] `packages/sdk-js/src/types.gen.ts` exists
- [ ] No TypeScript errors in SDK package
- [ ] Frontend can import `@sdk-js/core`

### Frontend

- [ ] JWT in `.env.local` (`VITE_DEV_JWT=...`)
- [ ] Frontend running at <http://localhost:5173>
- [ ] Contacts page loads with demo data
- [ ] No 401/403 errors in console
- [ ] Logo visible in header

### Branding

- [ ] Logo PNG placed in `apps/frontend/public/`
- [ ] Logo PNG placed in `apps/frontend/src/assets/images/brand/`
- [ ] Favicon visible in browser tab
- [ ] PWA manifest loads without errors

### Workers (Optional)

- [ ] Redis running
- [ ] Workers running (`pnpm --filter @apps/workers dev`)
- [ ] Jobs enqueued and processed
- [ ] No connection errors in logs

---

## 🆘 Stuck? Quick Fixes

### "Can't connect to database"

```bash
pnpm docker:up
# Wait 10 seconds for health checks
docker compose -f infra/docker/docker-compose.yml ps
```

### "401 Unauthorized in frontend"

```bash
pnpm dev:jwt
# Copy token
echo "VITE_DEV_JWT=<paste_token>" >> apps/frontend/.env.local
# Restart frontend
```

### "SDK types not found"

```bash
# Ensure API is running first
pnpm --filter @apps/core-api dev
# Then in new terminal:
pnpm sdk:gen
```

### "Port 3000 already in use"

```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Resources

- **Setup Guide:** `STACK_SETUP_COMPLETE.md`
- **SDK Migration:** `docs/guides/SDK_MIGRATION.md`
- **Branding:** `docs/guides/BRANDING_SETUP.md`
- **Infrastructure:** `infra/docker/README.md`
- **Quick Start:** `./scripts/quick-start.sh`

---

## 🎉 Success Metrics

You'll know you're on track when:

1. **Week 1:**
   - ✅ All services running locally
   - ✅ Demo data loads on all list pages
   - ✅ Can create/edit/delete entities
   - ✅ Logo visible everywhere

2. **Week 2:**
   - ✅ All services migrated to SDK
   - ✅ Legacy mock API removed
   - ✅ Background workers processing jobs
   - ✅ Real auth flow (Auth0/Cognito)

3. **Month 1:**
   - ✅ All features use Core API
   - ✅ CI/CD pipeline passing
   - ✅ Production deployment ready
   - ✅ Observability set up

---

**Ready to ship!** 🚀

Start with `./scripts/quick-start.sh` and work through the prioritized list above. You've got a solid foundation!
