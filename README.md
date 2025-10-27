# Traffic CRM Monorepo

Traffic CRM is a TypeScript-first workspace that brings together the React frontend, NestJS services, BullMQ workers, and shared packages that power the product.

---

## Contents

- **apps/frontend** – React 19 + Vite application with modular features, Playwright/Vitest harnesses, and a hardened Docker/Nginx runtime. See `docs/FRONTEND_STRUCTURE.md` for the tree snapshot.
- **apps/core-api** – NestJS service backed by Prisma and Fastify. Ships JWT tooling, OpenAPI emission, and database seed scripts.
- **apps/reporting/traffic-crm-backend-reporting** – NestJS microservice scaffold reserved for reporting workloads.
- **apps/workers** – BullMQ processors (lead scoring, enrichment stubs) using Redis.
- **packages/sdk-js** – Generated TypeScript client (OpenAPI → ky) consumed by the frontend.
- **packages/ui-kit** – Material UI based shared component library.
- **packages/rbac** – Lightweight RBAC helpers.
- **packages/shared-types** (`@traffic-crm/shared-types`) – Monorepo-wide data contracts.
- **infra/docker** – Docker Compose stack (Postgres, Redis, MailHog, MinIO).
- **docs** – Currently `FRONTEND_STRUCTURE.md`; additional docs live at the root (e.g. `PROJECT_STATUS_OVERVIEW.md`).

---

## Prerequisites

- Node.js 20.x (project engines enforce `>=20 <21`; run `nvm use` if available).
- pnpm ≥ 9 (enable with `corepack enable pnpm`).
- Docker Desktop (optional for local development, required for container builds and the quick-start script).

---

## Quick Start

```bash
pnpm install
cp .env.example .env          # optional custom ports
pnpm docker:up                # optional: Postgres, Redis, MailHog, MinIO
pnpm --filter @apps/core-api dev
pnpm --filter ./apps/frontend dev
```

- API: <http://localhost:3000> (Swagger at `/docs`)
- Frontend: <http://localhost:5173>

> Prefer automation? `bash scripts/quick-start.sh` starts Docker dependencies, runs migrations/seeds, generates a dev JWT, and refreshes the SDK types.

---

## Common Commands

| Task | Command |
| --- | --- |
| Start all dev servers | `pnpm dev` |
| Build workspace | `pnpm build` |
| Lint workspace | `pnpm lint` |
| Type-check workspace | `pnpm typecheck` |
| Run all tests | `pnpm test` |
| Generate SDK types | `pnpm sdk:gen` |
| Start workers | `pnpm --filter @apps/workers dev` |
| Prisma migrations | `pnpm --filter @apps/core-api prisma:migrate` |

- Frontend-only build: `pnpm --filter ./apps/frontend build`
- Docker image: `docker build -f apps/frontend/Dockerfile -t traffic-crm/frontend:local .`
  - Nginx runs as non-root `appuser`; smoke test via `docker run --rm -p 8080:80 traffic-crm/frontend:local`.

---

## Testing

- Frontend unit/integration tests: `pnpm --filter ./apps/frontend test:unit`
- Frontend E2E tests: `pnpm --filter ./apps/frontend test:e2e`
- Backend tests: `pnpm --filter @apps/core-api test`
- Pre-commit hooks (Husky + lint-staged) enforce ESLint, TypeScript checks, and markdownlint.

---

## CI/CD

- `.github/workflows/ci.yml` – primary lint/typecheck/test/build pipeline.
- `.github/workflows/frontend-docker.yml` – builds and pushes the frontend Docker image to GHCR (requires repository permission “Improve repository permissions”).
- `.github/workflows/update-status.yml` – regenerates `PROJECT_STATUS_OVERVIEW.md` when key directories change.
- Additional workflows cover SDK publishing, CodeQL, docs linting, preview builds, and scheduled health checks.

---

## Documentation

- Monorepo status ledger: [PROJECT_STATUS_OVERVIEW.md](./PROJECT_STATUS_OVERVIEW.md)
- Frontend structure snapshot: [docs/FRONTEND_STRUCTURE.md](./docs/FRONTEND_STRUCTURE.md)
- Quick-start script: [`scripts/quick-start.sh`](./scripts/quick-start.sh)
- Docker Compose definitions: [`infra/docker/docker-compose.yml`](./infra/docker/docker-compose.yml)
- Agent guidance & guardrails: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) (workers status,
  reporting boundaries, security rules, module federation notes, and MUI v7 migration tips)

Update the status overview and structure snapshot after major refactors to keep onboarding material accurate.

---

## GitHub Container Registry (GHCR)

We publish Docker images to GitHub Container Registry (GHCR) at
`ghcr.io/omar120489/traffic-crm-frontend-ts`.

### Image names

- **Latest**: `ghcr.io/omar120489/traffic-crm-frontend-ts:latest`
- **Commit SHA**: `ghcr.io/omar120489/traffic-crm-frontend-ts:<commit-sha>`

### Pulling the image (read-only)

If the image is public, pull with:

```bash
docker pull ghcr.io/omar120489/traffic-crm-frontend-ts:latest
```

If the image is private, authenticate first using a Personal Access Token
with `read:packages`:

```bash
echo "<PERSONAL_ACCESS_TOKEN>" | docker login ghcr.io -u omar120489 \
  --password-stdin
docker pull ghcr.io/omar120489/traffic-crm-frontend-ts:latest
```

### Pushing an image locally (one-off; usually the action does this)

1. **Build**:

   ```bash
   docker build \
     -t ghcr.io/omar120489/traffic-crm-frontend-ts:local-test .
   ```

2. **Login** (use PAT with `write:packages`):

   ```bash
   echo "<PERSONAL_ACCESS_TOKEN>" | docker login ghcr.io -u omar120489 \
     --password-stdin
   ```

3. **Push**:

   ```bash
   docker push ghcr.io/omar120489/traffic-crm-frontend-ts:local-test
   ```

### CI publishing

The repository includes a GitHub Actions workflow (`.github/workflows/publish-ghcr.yml`)
that will build and publish on pushes to `main` and on tag pushes
(e.g., `v1.2.3`).

- Workflows use `GITHUB_TOKEN` to authenticate with GHCR; ensure repository Actions
  permissions allow `packages: write` (already enabled).
- Adjust workflow triggers and tags as you prefer in the workflow file.### CI publishing

The repository includes a GitHub Actions workflow (`.github/workflows/publish-ghcr.yml`)
that will build and publish on pushes to `main` and on tag pushes (e.g., `v1.2.3`).

- Workflows use `GITHUB_TOKEN` to authenticate with GHCR; ensure repository Actions
  permissions allow `packages: write` (already enabled).
- Adjust workflow triggers and tags as you prefer in the workflow file.

---

## Troubleshooting

- **Node version errors** – run `nvm use` or install Node 20.x (engines enforce `<21`).
- **API  connection issues** – confirm the core API is running on `http://localhost:3000` and `VITE_APP_API_URL` matches.
- **Playwright config errors** – ensure tests use `apps/frontend/playwright.config.mjs`
  and `VITE_MODE` is set if you rely on non-default env files.
- **JWT parsing failures** – clear the `access_token` entry from `localStorage`; the Auth context will fall back to dev defaults.

---

## 📊 Project Status

For a phase-by-phase progress report, documentation coverage, and next-action checklist head to [PROJECT_STATUS_OVERVIEW.md](./PROJECT_STATUS_OVERVIEW.md).
