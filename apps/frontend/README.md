# Traffic CRM Frontend

React 19 + Vite application that powers the customer-facing and internal dashboards for Traffic CRM. The project lives inside a pnpm monorepo and consumes shared packages such as the generated SDK, UI kit, and RBAC helpers.

## Prerequisites

- Node.js 20.x (`nvm use` picks up the pinned engine from `.nvmrc`)
- pnpm 9+ (`corepack enable pnpm` or install globally)
- Docker Desktop (optional, required for the container image build)

## Local Development

```bash
pnpm install
pnpm --filter ./apps/frontend dev
```

Visit <http://localhost:5173> after the dev server boots. The app expects the core API on <http://localhost:3000> by default; override via `apps/frontend/.env.local`.

### Useful Scripts

- `pnpm --filter ./apps/frontend lint`
- `pnpm --filter ./apps/frontend typecheck`
- `pnpm --filter ./apps/frontend test:unit`
- `pnpm --filter ./apps/frontend test:e2e`

## Building

```bash
pnpm --filter ./apps/frontend build
pnpm --filter ./apps/frontend preview
```

Static assets output to `apps/frontend/dist`.

## Docker Image

The app ships with a hardened multi-stage Dockerfile.

```bash
docker build -f apps/frontend/Dockerfile -t traffic-crm/frontend:local .
docker run --rm -p 8080:80 traffic-crm/frontend:local
```

Assets are served by nginx running as a non-root `appuser`.

## CI/CD

`.github/workflows/frontend-docker.yml` builds and pushes the image to GHCR on pushes to `main` and manual runs. Ensure “Improve repository permissions” is enabled so `GITHUB_TOKEN` can write package artifacts.

## Environment Variables

Key Vite flags live in the env files under `apps/frontend`:

- `VITE_APP_API_URL`, `VITE_APP_REPORTING_API_URL`
- Feature toggles such as `VITE_ENABLE_WEBSOCKET`, `VITE_FEATURE_PNL`
- E2E overrides in `.env.test`

Update `docs/FRONTEND_STRUCTURE.md` whenever the module tree changes to keep high-level documentation in sync.
