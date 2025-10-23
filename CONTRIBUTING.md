# Contributing to Traffic CRM

Thank you for your interest in contributing to Traffic CRM! This guide will help you get started with our development workflow.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Management](#issue-management)
- [Commit Convention](#commit-convention)
- [Branch Naming](#branch-naming)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >=18 <21
- **pnpm**: 10.18.2 (managed via packageManager field)
- **GitHub CLI**: For workflow automation (`gh auth login`)
- **Git**: Latest stable version

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/omar120489/-traffic-crm-frontend-ts.git
cd -traffic-crm-frontend-ts

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp apps/frontend/.env.example apps/frontend/.env
cp apps/core-api/.env.example apps/core-api/.env

# 4. Start infrastructure
pnpm docker:up

# 5. Run database migrations
pnpm db:migrate
pnpm db:seed

# 6. Verify setup
pnpm -r typecheck
pnpm -r lint
pnpm -r test
```

---

## 🔄 Development Workflow

We use an automated workflow system with helper scripts. Here's how to work on an issue:

### Quick Start (Automated)

```bash
# 1. Start working on an issue (e.g., issue #1)
./workflow-helper.sh start 1

# 2. Make your changes
# ... edit code ...

# 3. Commit with conventional format
git add -A
git commit -m "feat(frontend): migrate ui-component imports"

# 4. Push your branch
git push -u origin feat/frontend-migrate-components

# 5. Create a draft PR (auto-labeled with templates)
./workflow-helper.sh pr 1

# 6. Mark PR as ready when done
gh pr ready
```

### Manual Workflow

If you prefer manual control:

```bash
# 1. Create a feature branch
git checkout -b feat/your-feature-name

# 2. Make changes and commit
git add -A
git commit -m "feat(scope): description"

# 3. Push and create PR
git push -u origin feat/your-feature-name
gh pr create --draft --assignee @me
```

### Workflow Helper Commands

```bash
./workflow-helper.sh start <N>   # Start work on issue #N
./workflow-helper.sh pr <N>      # Create PR for issue #N
./workflow-helper.sh list        # List all issue branches
./workflow-helper.sh status      # Show current issue
```

---

## 📝 Code Standards

### TypeScript

- **Strict mode**: Enabled across all packages
- **No `any`**: Use proper types or `unknown`
- **Prefer interfaces**: Over type aliases for object shapes
- **Export types**: Always export types used in public APIs

### Code Style

We use ESLint and Prettier for consistent formatting:

```bash
# Auto-fix linting issues
pnpm -r lint:fix

# Format code
pnpm -r prettier
```

### Path Aliases

Use path aliases for cleaner imports:

```typescript
// ✅ Good
import { Button } from '@shared/components';
import { useAuth } from '@shared/hooks';
import { Deal } from '@features/deals';

// ❌ Bad
import { Button } from '../../../shared/components/Button';
```

**Available aliases:**
- `@shared/*` - Shared components, hooks, utils
- `@features/*` - Feature-specific code
- `@data/*` - Data layer (API clients, hooks)
- `@core/*` - Core utilities (RBAC, filters, export)

---

## 🧪 Testing Requirements

### Test Coverage Goals

- **Hooks**: >60% coverage
- **Core Components**: >40% coverage
- **Business Logic**: >80% coverage
- **API Endpoints**: 100% critical paths

### Running Tests

```bash
# All tests
pnpm -r test

# Specific workspace
pnpm --filter ./apps/frontend test:unit
pnpm --filter @apps/core-api test:e2e

# With coverage
pnpm --filter ./apps/frontend test:unit -- --coverage

# Watch mode
pnpm --filter ./apps/frontend test:unit -- --watch
```

### Writing Tests

**Frontend (Vitest + React Testing Library):**

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Backend (NestJS Testing):**

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('LeadsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/leads (GET)', () => {
    return request(app.getHttpServer())
      .get('/leads')
      .expect(200)
      .expect((res) => {
        expect(res.body.items).toBeDefined();
      });
  });
});
```

---

## 🔀 Pull Request Process

### Before Creating a PR

- [ ] Code builds successfully (`pnpm build`)
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] No console.log statements (use proper logging)
- [ ] Documentation updated (if needed)

### PR Template

Our workflow automatically uses PR templates based on the issue number. Templates include:

- 🎯 Goal statement
- 📋 Checklist of changes
- ✅ Verification steps
- 🔗 Auto-closes related issue

### PR Review Process

1. **Draft PR**: Create as draft while working
2. **Self-review**: Review your own changes first
3. **Mark ready**: When complete and passing CI
4. **Code review**: At least one approval required
5. **Address feedback**: Make requested changes
6. **Merge**: Squash and merge (maintains clean history)

### CI Checks

All PRs must pass these checks:

- ✅ `pr-title-check` - Conventional commit format
- ✅ `typecheck-and-build` - Type safety and builds
- ✅ `lint` - Code style
- ✅ `test` - Test suite
- ✅ `security-audit` - Dependency vulnerabilities
- ✅ `ci-complete` - Overall status

---

## 🏷️ Issue Management

### Issue Labels

We use a structured labeling system:

**Area Labels:**
- `area:frontend` - Frontend work
- `area:backend` - Backend work
- `area:workers` - Workers & queues
- `area:ci` - CI/CD
- `area:sdk` - SDK & packages
- `area:docs` - Documentation

**Priority Labels:**
- `priority:high` - High priority
- `priority:medium` - Medium priority (default)
- `priority:low` - Low priority

**Type Labels:**
- `type:feat` - New feature
- `type:fix` - Bug fix
- `type:refactor` - Code refactoring
- `type:test` - Testing
- `type:docs` - Documentation
- `type:perf` - Performance improvement

### Creating Issues

Use our issue templates when available. Include:

- **Clear title**: Descriptive and specific
- **Context**: Why is this needed?
- **Acceptance criteria**: What defines "done"?
- **Related issues**: Link to related work

---

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or dependencies
- `ci`: CI configuration
- `chore`: Other changes (releases, etc.)
- `revert`: Revert a previous commit

### Scopes

Common scopes by area:

- **Frontend**: `frontend`, `ui`, `components`, `hooks`
- **Backend**: `api`, `auth`, `leads`, `deals`, `companies`
- **Workers**: `workers`, `queues`, `jobs`
- **SDK**: `sdk`, `types`
- **CI/CD**: `ci`, `build`, `deploy`

### Examples

```bash
# Feature
git commit -m "feat(frontend): add pagination to leads table"

# Bug fix
git commit -m "fix(api): handle null values in deal stage transitions"

# Documentation
git commit -m "docs: update API endpoint documentation"

# Refactor
git commit -m "refactor(hooks): extract pagination logic to custom hook"

# Breaking change
git commit -m "feat(api)!: change pagination response format

BREAKING CHANGE: pagination now returns { items, total, page, size } instead of { data, total }"
```

---

## 🌿 Branch Naming

### Convention

```
<type>/<scope>-<description>
```

### Examples

```bash
feat/frontend-migrate-components
fix/backend-align-dtos-shared-types
test/frontend-comprehensive-test-suite
docs/update-project-structure-guides
refactor/frontend-consolidate-layouts
```

### Branch Types

- `feat/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `docs/` - Documentation
- `chore/` - Maintenance tasks
- `hotfix/` - Production hotfixes

---

## 🎯 Definition of Done

A task is considered complete when:

- [ ] Code is implemented and working
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Code is reviewed and approved
- [ ] CI checks are green
- [ ] No regression in existing functionality
- [ ] Conventional commit message used
- [ ] PR description is complete
- [ ] Related issue is linked

---

## 🛠️ Common Tasks

### Adding a New Feature

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/your-feature

# 3. Implement feature with tests
# ... code ...

# 4. Verify locally
pnpm --filter <workspace> typecheck
pnpm --filter <workspace> test
pnpm --filter <workspace> build

# 5. Commit and push
git add -A
git commit -m "feat(scope): description"
git push -u origin feat/your-feature

# 6. Create PR
gh pr create --draft --assignee @me
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/bug-description

# 2. Write failing test (if applicable)
# 3. Fix the bug
# 4. Verify test passes
# 5. Commit and create PR

git commit -m "fix(scope): description"
```

### Updating Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update specific package
pnpm update <package-name>

# Update all (carefully!)
pnpm update --latest

# Verify everything still works
pnpm -r typecheck
pnpm -r test
pnpm -r build
```

---

## 📚 Additional Resources

- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md)
- [Local Workflow](./docs/LOCAL_WORKFLOW.md)
- [Testing Guide](./docs/TESTING.md)
- [Release Process](./docs/RELEASE_PLAYBOOK.md)

---

## 💬 Getting Help

- **Questions**: Open a discussion on GitHub
- **Bugs**: Create an issue with reproduction steps
- **Features**: Propose in an issue first
- **Security**: See [SECURITY.md](./SECURITY.md)

---

## 🎉 Thank You!

Your contributions make Traffic CRM better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
