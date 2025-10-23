# Architecture Overview

**Traffic CRM Monorepo - Full-Stack TypeScript Platform**

**Version:** 1.6.0  
**Last Updated:** October 24, 2025  
**Repository:** <https://github.com/omar120489/-traffic-crm-frontend-ts>

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Traffic CRM System                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────┐
        │          Frontend (React + Vite)          │
        │  Port: 5173 │ Tech: React 19, MUI 7      │
        └───────────────────┬───────────────────────┘
                            │
                            │ HTTP/REST
                            │ (SDK Client)
                            ▼
        ┌───────────────────────────────────────────┐
        │     Core API (NestJS + Fastify)          │
        │  Port: 3000 │ Tech: NestJS 10, Prisma   │
        └───────┬───────────────────────┬───────────┘
                │                       │
        ┌───────▼──────┐       ┌────────▼────────┐
        │  PostgreSQL   │       │   BullMQ Jobs   │
        │  Port: 5432   │       │   (via Redis)   │
        └───────────────┘       └─────────┬───────┘
                                          │
                                ┌─────────▼────────┐
                                │  Workers Service │
                                │  Tech: BullMQ    │
                                └──────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        │                                   │
                ┌───────▼──────┐                   ┌────────▼────────┐
                │     Redis     │                   │   Reporting     │
                │  Port: 6379   │                   │   Port: 4040    │
                └───────────────┘                   └─────────────────┘
```

---

## 🏗️ Monorepo Structure

```
traffic-crm/
├── apps/                          # Applications
│   ├── frontend/                  # React 19 + Vite + TypeScript
│   ├── core-api/                  # NestJS + Fastify + Prisma
│   ├── workers/                   # BullMQ background jobs
│   ├── reporting/                 # NestJS reporting microservice
│   └── api-dev/                   # Legacy Express mock API (deprecated)
│
├── packages/                      # Shared packages
│   ├── sdk-js/                    # Auto-generated typed SDK
│   ├── shared-types/              # Shared TypeScript types
│   ├── eslint-config/             # Shared ESLint config
│   └── tsconfig/                  # Shared TypeScript configs
│
├── infra/                         # Infrastructure
│   └── docker/                    # Docker Compose services
│
├── scripts/                       # Automation scripts
│   ├── premerge.sh               # Pre-merge verification
│   ├── cleanup-history.sh        # Git history cleanup
│   └── sync_github_traffic_crm.sh # GitHub sync automation
│
└── docs/                          # Documentation
    ├── guides/                    # How-to guides
    ├── INDEX.md                   # Documentation index (you are here)
    └── [Other documentation]
```

---

## 🎯 Core Components

### 1. Frontend (`apps/frontend/`)

**Technology Stack:**

- **Framework:** React 19 (RC)
- **Build Tool:** Vite 7
- **UI Library:** Material-UI (MUI) 7
- **State Management:** Redux Toolkit + Redux Persist
- **Routing:** React Router 7
- **Data Fetching:** SWR + SDK Client
- **Forms:** Formik + Yup
- **Charts:** ApexCharts

**Key Features:**

- Responsive Material Design UI
- Real-time data updates via SWR
- Type-safe API calls via generated SDK
- Authentication with JWT
- Role-based access control (RBAC)
- Analytics dashboard
- CRUD operations for: Contacts, Leads, Deals, Companies
- Pagination and advanced filtering
- Export to CSV/XLSX/PDF

**Directory Structure:**

```
apps/frontend/src/
├── core/              # Core utilities (filters, export, RBAC)
├── data/              # Data layer (SDK client, hooks)
├── features/          # Feature modules (chat, etc.)
├── shared/            # Shared components, hooks, utils
├── views/             # Page components
├── routes/            # Routing configuration
├── store/             # Redux store
├── themes/            # MUI theming
└── assets/            # Static assets (images, styles)
```

**Port:** 5173 (development)

---

### 2. Core API (`apps/core-api/`)

**Technology Stack:**

- **Framework:** NestJS 10
- **HTTP Server:** Fastify 4
- **ORM:** Prisma 5
- **Database:** PostgreSQL 16
- **Authentication:** Jose (JWT)
- **Validation:** Class-validator + Class-transformer
- **Job Queue:** BullMQ (Redis)
- **API Docs:** Swagger/OpenAPI

**Key Features:**

- RESTful API with OpenAPI documentation
- JWT-based authentication
- Multi-tenancy (organization-scoped)
- CRUD endpoints for all entities
- Pagination and filtering
- Background job scheduling
- Webhook support
- File uploads (MinIO/S3)

**Modules:**

```
apps/core-api/src/
├── auth/              # Authentication & authorization
├── common/            # Shared utilities, DTOs, guards
├── modules/           # Business logic modules
│   ├── contacts/      # Contact management
│   ├── leads/         # Lead management
│   ├── deals/         # Deal pipeline
│   ├── companies/     # Company records
│   ├── activities/    # Activity tracking
│   ├── comments/      # Comments system
│   └── notifications/ # Notifications
├── prisma/            # Prisma schema and migrations
└── main.ts            # Application entry point
```

**Port:** 3000 (development)

---

### 3. Workers (`apps/workers/`)

**Technology Stack:**

- **Queue:** BullMQ
- **Storage:** Redis
- **Language:** TypeScript

**Job Queues:**

1. **Lead Scoring**
   - Automatic lead qualification
   - Score calculation based on engagement
   - Trigger: New lead creation, activity updates

2. **Contact Enrichment**
   - Fetch additional data from external APIs
   - Update contact/company records
   - Trigger: Manual trigger, scheduled batch

3. **Email Sending** (future)
   - Transactional emails
   - Marketing campaigns
   - Trigger: User actions, scheduled

**Usage:**

```typescript
import { leadScoringQueue } from '@apps/workers';

await leadScoringQueue.add('score', { 
  leadId: 'ld-123',
  orgId: 'org-456'
});
```

---

### 4. Reporting (`apps/reporting/`)

**Technology Stack:**

- **Framework:** NestJS
- **Purpose:** Analytics and reporting microservice

**Features:**

- Sales pipeline analytics
- Revenue forecasting
- Activity reports
- Performance metrics

**Port:** 4040

---

## 📦 Shared Packages

### 1. SDK (`packages/sdk-js/`)

**Auto-generated TypeScript SDK** from Core API's OpenAPI spec.

**Features:**

- Type-safe API calls
- Automatic request/response typing
- Built-in error handling
- Retry logic

**Usage:**

```typescript
import { api } from '@/data/clients/sdk';

// Fully typed!
const contacts = await api.listContacts({ page: 1, size: 20 });
const contact = await api.getContact('ct-123');
```

**Generation:**

```bash
pnpm sdk:gen
```

### 2. Shared Types (`packages/shared-types/`)

**Shared TypeScript types and Zod schemas.**

**Contents:**

- Domain models (Contact, Lead, Deal, etc.)
- DTOs (Data Transfer Objects)
- Zod validation schemas
- Utility types

**Usage:**

```typescript
import type { Contact, Lead, Deal } from '@shared-types';
import { ContactSchema } from '@shared-types/schemas';
```

---

## 🗄️ Data Layer

### Database Schema (PostgreSQL + Prisma)

**Core Entities:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│     Org     │────▶│   Contact   │────▶│   Company   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │
                    ┌──────▼──────┐
                    │     Lead     │
                    └──────┬──────┘
                           │
                           │
                    ┌──────▼──────┐
                    │     Deal     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼──────┐ ┌──▼──────────┐
       │  Activity   │ │ Comment │ │ Attachment  │
       └─────────────┘ └─────────┘ └─────────────┘
```

**Key Tables:**

- `orgs` - Organizations (multi-tenancy)
- `contacts` - Individual contacts
- `companies` - Company records
- `leads` - Sales leads with scoring
- `deals` - Sales opportunities with stages
- `activities` - Activity timeline
- `comments` - Comments on entities
- `attachments` - File attachments
- `notifications` - User notifications

**Relationships:**

- Org has many Contacts, Companies, Leads, Deals
- Contact belongs to Company
- Lead belongs to Contact (optional)
- Deal belongs to Contact and Company
- Activities, Comments, Attachments are polymorphic

---

## 🔄 Data Flow

### 1. User Action → API → Database

```
User clicks "Create Contact"
        │
        ▼
Frontend form validation (Formik + Yup)
        │
        ▼
SDK client makes POST /api/contacts
        │
        ▼
Core API receives request
        │
        ▼
NestJS validates DTO (class-validator)
        │
        ▼
JWT Guard extracts orgId
        │
        ▼
Service creates contact in database (Prisma)
        │
        ▼
Return contact with ID
        │
        ▼
Frontend updates cache (SWR)
        │
        ▼
UI shows new contact
```

### 2. Background Job Flow

```
User creates lead
        │
        ▼
Core API creates lead in database
        │
        ▼
Core API enqueues "lead-scoring" job
        │
        ▼
BullMQ stores job in Redis
        │
        ▼
Worker picks up job
        │
        ▼
Worker calculates lead score
        │
        ▼
Worker updates lead in database
        │
        ▼
(Optional) Worker sends notification
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User enters credentials
        │
        ▼
2. POST /api/auth/login
        │
        ▼
3. Core API validates credentials
        │
        ▼
4. Generate JWT with claims:
   {
     sub: userId,
     orgId: "org-123",
     email: "user@example.com",
     roles: ["admin"]
   }
        │
        ▼
5. Return JWT to frontend
        │
        ▼
6. Frontend stores JWT in localStorage
        │
        ▼
7. Frontend includes JWT in Authorization header
        │
        ▼
8. Core API validates JWT on each request
```

### Authorization

**Guards:**

- `JwtAuthGuard` - Validates JWT token
- `OrgGuard` - Ensures user belongs to organization
- `RolesGuard` - Checks user roles (admin, manager, user)

**Example:**

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('/admin/users')
async listUsers() { ... }
```

---

## 🚀 Deployment Architecture

### Production Setup

```
                      ┌──────────────┐
                      │   Vercel     │
                      │  (Frontend)  │
                      └──────┬───────┘
                             │
                             │ HTTPS
                             │
                      ┌──────▼───────┐
                      │   Railway    │
                      │  (Core API)  │
                      └──────┬───────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌────▼────┐ ┌──────▼──────┐
       │  PostgreSQL │ │  Redis  │ │   Workers   │
       │  (AWS RDS)  │ │(Upstash)│ │  (Railway)  │
       └─────────────┘ └─────────┘ └─────────────┘
```

**Recommended Platforms:**

| Component | Platform Options |
|-----------|------------------|
| Frontend | Vercel, Netlify, AWS S3 + CloudFront |
| Core API | Railway, Fly.io, AWS ECS, Heroku |
| Workers | Railway, Fly.io, AWS ECS |
| PostgreSQL | AWS RDS, Supabase, Railway |
| Redis | Upstash, AWS ElastiCache, Railway |
| File Storage | AWS S3, MinIO, Cloudflare R2 |

---

## 🔧 Development Workflow

### Local Development

```bash
# 1. Start infrastructure
pnpm docker:up

# 2. Run migrations
pnpm db:migrate
pnpm db:seed

# 3. Generate SDK (after API changes)
pnpm sdk:gen

# 4. Start services (separate terminals)
pnpm --filter @apps/core-api dev        # Terminal 1
pnpm --filter ./apps/frontend dev       # Terminal 2
pnpm --filter @apps/workers dev         # Terminal 3 (optional)
```

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes

# 3. Run checks
pnpm typecheck
pnpm lint
pnpm test

# 4. Create PR
MODE=pr ./scripts/premerge.sh
```

---

## 📡 API Endpoints

### Core API Routes

**Authentication:**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token

**Contacts:**

- `GET /api/contacts` - List contacts (paginated)
- `GET /api/contacts/:id` - Get contact
- `POST /api/contacts` - Create contact
- `PATCH /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

**Leads:**

- `GET /api/leads` - List leads
- `POST /api/leads` - Create lead
- `PATCH /api/leads/:id` - Update lead
- `POST /api/leads/:id/score` - Trigger scoring

**Deals:**

- `GET /api/deals` - List deals
- `POST /api/deals` - Create deal
- `PATCH /api/deals/:id` - Update deal
- `PATCH /api/deals/:id/stage` - Move deal stage

**Companies:**

- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `PATCH /api/companies/:id` - Update company

**Activities:**

- `GET /api/activities` - List activities
- `POST /api/activities` - Log activity

**OpenAPI Docs:**

- `GET /api/docs` - Swagger UI
- `GET /api/docs-json` - OpenAPI JSON spec

---

## 🧪 Testing Strategy

### Unit Tests

```bash
# Frontend
pnpm --filter ./apps/frontend test

# Backend
pnpm --filter @apps/core-api test

# Coverage
pnpm --filter @apps/core-api test:cov
```

### E2E Tests

```bash
# Playwright (frontend)
pnpm --filter ./apps/frontend test:e2e
pnpm --filter ./apps/frontend test:e2e:ui  # Interactive mode
```

### API Tests

```bash
# Supertest (backend)
pnpm --filter @apps/core-api test:e2e
```

---

## 📊 Performance Considerations

### Frontend Optimization

- **Code Splitting:** Vite automatic chunking
- **Lazy Loading:** React.lazy for routes
- **Memoization:** React.memo, useMemo, useCallback
- **Virtual Scrolling:** For large lists (react-window)
- **Image Optimization:** Lazy loading, responsive images

### Backend Optimization

- **Database Indexes:** On frequently queried fields
- **Query Optimization:** Prisma query optimization
- **Caching:** Redis for frequently accessed data
- **Rate Limiting:** Fastify rate limiter
- **Connection Pooling:** Prisma connection pool

### Infrastructure

- **CDN:** Static assets via CloudFront/Vercel Edge
- **Load Balancing:** Multiple API instances
- **Database Replication:** Read replicas for scaling
- **Monitoring:** Sentry, DataDog, New Relic

---

## 🔍 Monitoring & Observability

### Application Monitoring

- **Error Tracking:** Sentry
- **Performance:** New Relic, DataDog
- **Uptime:** UptimeRobot, Pingdom

### Logging

- **Centralized Logging:** Papertrail, CloudWatch
- **Log Levels:** Error, Warn, Info, Debug
- **Structured Logging:** JSON format

### Metrics

- **API Response Times:** p50, p95, p99
- **Error Rates:** 4xx, 5xx responses
- **Database Performance:** Query times, connections
- **Job Queue:** Queue depth, processing times

---

## 🛡️ Security

### Best Practices

- ✅ JWT authentication with short expiry
- ✅ HTTPS only in production
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation (class-validator)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React auto-escaping)
- ✅ CSRF protection (SameSite cookies)
- ✅ Dependabot security updates
- ✅ Environment variable management

### Secrets Management

- **Development:** `.env` files (git-ignored)
- **Production:** Platform secrets (Vercel, Railway)
- **Never commit:** API keys, database URLs, JWT secrets

---

## 📚 Further Reading

### Documentation

- [Getting Started](../README.md)
- [Local Development Workflow](./LOCAL_WORKFLOW.md)
- [Scripts Reference](./SCRIPTS.md)
- [SDK Migration Guide](./guides/SDK_MIGRATION.md)
- [Post-Sync Validation](./POST_SYNC_VALIDATION_CHECKLIST.md)

### External Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vite Documentation](https://vitejs.dev/)

---

## 🎯 Architecture Decisions

### Why Monorepo?

- **Shared code:** Types, utilities, configs
- **Atomic changes:** Update API + SDK + frontend in one PR
- **Simplified dependency management:** Single `pnpm-lock.yaml`
- **Easier refactoring:** Cross-project search and replace

### Why NestJS?

- **TypeScript-first:** Strong typing throughout
- **Modular:** Clear separation of concerns
- **Fastify:** High performance HTTP server
- **Ecosystem:** Great integration with Prisma, BullMQ

### Why Vite?

- **Fast:** Instant HMR, fast builds
- **Modern:** ESM-first, native TypeScript support
- **Developer Experience:** Better than webpack

### Why Prisma?

- **Type-safe:** Generated TypeScript client
- **Migrations:** Version-controlled schema changes
- **Developer Experience:** Intuitive API

---

**Last Updated:** October 24, 2025  
**Version:** 1.6.0  
**Maintained by:** Development Team  
**Questions?** See [Documentation Index](./INDEX.md)
