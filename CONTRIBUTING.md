# Contributing to Traffic CRM

Thank you for contributing! This guide will help you get started quickly.

## 🛠 Tooling Requirements

- **Node**: Node 20 LTS (use `nvm use` to switch)
- **Package manager**: pnpm 10+
- **Git hooks**: Husky v10 (auto-installed on `pnpm install`)

## 🚀 Quick Start

```bash
# Clone and install
git clone <repo-url>
cd traffic-crm-frontend-ts
nvm use  # Switch to Node 20
pnpm install

# Start development
pnpm --filter @apps/core-api start:dev  # Backend (port 3000)
pnpm --filter ./apps/frontend dev        # Frontend (port 5173)
```

## 📋 Pre-Push Gates

Husky runs a **fast Sprint-2-only TypeScript check** before every push:
- ✅ Validates all Sprint 2 code (`src/pages/{contacts,deals,companies,settings,auth}`, `src/components`, `src/lib`, `src/contexts`)
- ✅ Ignores legacy code (shimmed in `src/legacy/ambient.d.ts`)
- ✅ Takes ~10 seconds
- ❌ Blocks push if Sprint 2 code has TypeScript errors

## 🧪 TypeScript Commands

```bash
# Fast Sprint 2 check (same as pre-push)
pnpm --filter ./apps/frontend run typecheck

# Explicit Sprint 2 check
pnpm --filter ./apps/frontend run typecheck:sprint2

# Full repo check (with legacy shims)
pnpm --filter ./apps/frontend run typecheck:legacy

# Both checks (comprehensive)
pnpm --filter ./apps/frontend run typecheck:all
```

## 📦 Monorepo Structure

```
traffic-crm-frontend-ts/
├── apps/
│   ├── core-api/          # NestJS backend
│   └── frontend/          # React + Vite frontend
├── packages/
│   ├── ui-kit/            # Shared UI components
│   ├── rbac/              # Role-based access control
│   └── sdk-js/            # Generated TypeScript SDK
└── workers/               # BullMQ background jobs
```

## 🎯 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
```

### 2. Make Your Changes

- **Sprint 2 code** (new features): Write fully-typed TypeScript
- **Legacy code** (existing files): Gradual migration (see below)

### 3. Run Checks Locally

```bash
# TypeScript
pnpm --filter ./apps/frontend run typecheck:sprint2

# Linting
pnpm --filter ./apps/frontend run lint

# Tests
pnpm --filter ./apps/frontend run test:unit
pnpm --filter ./apps/frontend run test:e2e
```

### 4. Commit with Conventional Commits

```bash
git commit -m "feat(contacts): add tag multiselect filter"
git commit -m "fix(api): handle null company in contacts service"
git commit -m "chore(deps): upgrade @mui/material to 7.0"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance (deps, config)
- `docs`: Documentation only
- `refactor`: Code restructuring (no behavior change)
- `test`: Adding/updating tests
- `perf`: Performance improvement

### 5. Push and Create PR

```bash
git push origin feat/your-feature-name
# Create PR on GitHub
```

## 🧹 Legacy Code Migration Policy

### Current State

Legacy code is **shimmed** in `apps/frontend/src/legacy/ambient.d.ts` to allow the full-repo typecheck to pass without blocking development.

### Migration Process

When you modernize a legacy area:

1. **Update the file** with proper types
2. **Delete the corresponding shim** from `src/legacy/ambient.d.ts`
3. **Verify** with `pnpm run typecheck:legacy`
4. **Commit** with a `refactor:` prefix

Example:
```bash
# Migrate hooks/useNotifications.ts
# 1. Add proper types to the file
# 2. Remove this line from ambient.d.ts:
#    declare module 'hooks/useNotifications' { ... }
# 3. Verify
pnpm --filter ./apps/frontend run typecheck:legacy
# 4. Commit
git commit -m "refactor(hooks): migrate useNotifications to TypeScript"
```

### Track Progress

```bash
# Count remaining shims
grep -c "declare module" apps/frontend/src/legacy/ambient.d.ts

# List all shimmed modules
grep "declare module" apps/frontend/src/legacy/ambient.d.ts
```

**Goal:** When count reaches 0, delete `ambient.d.ts` entirely! 🎉

## 🔒 Code Quality Standards

### TypeScript
- ✅ Sprint 2 code: **Strict mode**, no `any`
- ✅ Props: Use `Readonly<>` or `readonly` fields
- ✅ Arrays: Use `ReadonlyArray<T>` for props
- ✅ Avoid deprecated APIs (check Sonar warnings)

### React
- ✅ Functional components only
- ✅ Hooks for state management
- ✅ Proper accessibility (`aria-label`, `htmlFor`, etc.)
- ✅ Use `onKeyDown` (not deprecated `onKeyPress`)

### Imports
- ✅ Use workspace aliases: `@traffic-crm/ui-kit`, `@traffic-crm/sdk-js`
- ✅ Group imports: external → internal → relative

## 🧪 Testing

### Unit Tests (Vitest)
```bash
pnpm --filter ./apps/frontend run test:unit
pnpm --filter @apps/core-api run test
```

### E2E Tests (Playwright)
```bash
pnpm --filter ./apps/frontend run test:e2e
pnpm --filter ./apps/frontend run test:e2e:ui  # Interactive mode
```

### Smoke Tests
```bash
pnpm --filter ./apps/frontend run test:smoke
```

## 📚 Key Documentation

- [Sprint 2 Handoff](./SPRINT_2_HANDOFF.md) - Sprint 2 features & architecture
- [Sprint 2 Runbook](./SPRINT_2_RUNBOOK.md) - Deployment & operations
- [Branch Protection](./docs/GITHUB_BRANCH_PROTECTION_SETTINGS.md) - Required checks
- [Product Roadmap](./PRODUCT_ROADMAP.md) - Feature roadmap
- [Release Playbook](./RELEASE_PLAYBOOK.md) - Release process

## 🐛 Troubleshooting

### "Unsupported engine" warning
You're on Node 24, but the project expects Node 20:
```bash
nvm use 20  # or nvm install 20 && nvm use 20
```

### Pre-push hook fails
```bash
# Check what's failing
cd apps/frontend
pnpm tsc --noEmit -p tsconfig.sprint2.json

# Fix errors, then retry push
```

### Workspace package not found
```bash
# Rebuild all packages
pnpm -r run build

# Re-link workspaces
pnpm install
```

### Prisma client out of sync
```bash
cd apps/core-api
pnpm prisma:generate
pnpm build
```

## 💬 Getting Help

- **Issues**: [GitHub Issues](https://github.com/omar120489/-traffic-crm-frontend-ts/issues)
- **Discussions**: [GitHub Discussions](https://github.com/omar120489/-traffic-crm-frontend-ts/discussions)
- **Code Review**: Tag `@omar120489` in PRs

## 📜 License

[MIT](./LICENSE)
