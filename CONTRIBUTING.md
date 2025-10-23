# Contributing to Traffic CRM

Thank you for your interest in contributing to Traffic CRM! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **pnpm**: v8+ (`npm install -g pnpm`)
- **PostgreSQL**: v14+
- **Redis**: v7+
- **Docker** (optional, for containerized development)
- **git-filter-repo** (for history management, if needed)

### Initial Setup

1. **Fork & Clone**

```bash
# Fork the repository on GitHub first
git clone https://github.com/YOUR_USERNAME/-traffic-crm-frontend-ts.git
cd -traffic-crm-frontend-ts
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Environment Configuration**

```bash
# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local

# Core API
cp apps/core-api/.env.example apps/core-api/.env

# Workers
cp apps/workers/.env.example apps/workers/.env
```

4. **Database Setup**

```bash
cd apps/core-api
pnpm prisma migrate dev
pnpm prisma db seed
```

5. **Start Development Servers**

```bash
# From monorepo root
pnpm dev
```

## 🔄 Development Workflow

### Branch Naming Conventions

Use descriptive branch names that follow this pattern:

```
<type>/<short-description>

Examples:
- feat/add-contact-import
- fix/deal-amount-calculation
- docs/api-endpoints
- chore/update-dependencies
- refactor/auth-service
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: CI/CD configuration changes

### Daily Development Loop

```bash
# 1. Create a feature branch
git checkout -b feat/my-new-feature

# 2. Make your changes
# ... code code code ...

# 3. Run pre-merge checks
./scripts/premerge.sh

# 4. Commit with conventional commits
git add .
git commit -m "feat(contacts): add bulk import functionality"

# 5. Push to your fork
git push origin feat/my-new-feature

# 6. Open a Pull Request on GitHub
```

### Local Testing

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Run tests
pnpm test

# Build all packages
pnpm build

# Run all checks (recommended before PR)
./scripts/premerge.sh
```

## 📝 Coding Standards

### TypeScript

- **Strict Mode**: All TypeScript must compile with strict mode enabled
- **Type Safety**: Avoid `any` unless absolutely necessary; use `unknown` instead
- **Interfaces over Types**: Prefer `interface` for object shapes
- **Explicit Return Types**: Always specify return types for functions

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User | null> {
  // implementation
}

// ❌ Bad
function getUser(id) {
  // implementation
}
```

### Code Style

- **Formatting**: Use Prettier (configured in `.prettierrc`)
- **Line Length**: Max 100 characters
- **Quotes**: Single quotes for strings, double for JSX attributes
- **Semicolons**: Required
- **Trailing Commas**: Required for multi-line

### React/Frontend

- **Functional Components**: Use function components with hooks
- **Component Structure**:

```typescript
// 1. Imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types
interface Props {
  userId: string;
}

// 3. Component
export function UserProfile({ userId }: Props) {
  // Hooks first
  const { data, isLoading } = useQuery(/*...*/);

  // Event handlers
  const handleClick = () => {
    // ...
  };

  // Render
  if (isLoading) return <Spinner />;
  return <div>{/* ... */}</div>;
}
```

- **Hooks**: Custom hooks must start with `use`
- **File Naming**: PascalCase for components, camelCase for utilities

### Backend/API

- **NestJS Conventions**: Follow NestJS architecture patterns
- **DTOs**: Use class-validator decorators for validation
- **Services**: Keep controllers thin, logic in services
- **Error Handling**: Use NestJS exception filters

```typescript
// ✅ Good - Thin controller
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async list(@Query() query: PaginationQueryDto) {
    return this.contactsService.list(query);
  }
}

// ✅ Good - Business logic in service
@Injectable()
export class ContactsService {
  async list(query: PaginationQueryDto) {
    // Business logic here
  }
}
```

### Database

- **Migrations**: Always create migrations for schema changes
- **Naming**: Use snake_case for database columns
- **Indexing**: Add indexes for frequently queried columns
- **Seeding**: Update seed data when schema changes

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**

```
feat(contacts): add bulk import from CSV

- Add CSV parser with Papa Parse
- Implement validation for contact fields
- Add progress indicator for large imports
- Handle duplicate detection

Closes #123
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, whitespace)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance, dependencies, tooling
- `ci`: CI/CD changes
- `revert`: Revert a previous commit

### Scope

The scope specifies which part of the codebase is affected:

- `frontend`: Frontend application
- `core-api`: Core API service
- `workers`: Background workers
- `reporting`: Reporting service
- `sdk`: SDK package
- `shared-types`: Shared types package
- `contacts`, `leads`, `deals`, `companies`: Specific modules
- `deps`: Dependencies
- `config`: Configuration files

### Subject

- Use imperative mood: "add" not "added" or "adds"
- No capitalization of first letter
- No period at the end
- Keep it under 72 characters

### Body (Optional)

- Explain the **why** and **what**, not the **how**
- Use bullet points for multiple changes
- Wrap at 72 characters

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

## 🔀 Pull Request Process

### Before Opening a PR

1. **Run Pre-merge Checks**

```bash
./scripts/premerge.sh
```

2. **Update Documentation**
   - Update relevant `.md` files
   - Add JSDoc comments for new functions
   - Update API documentation if endpoints changed

3. **Add Tests**
   - Unit tests for new functions
   - Integration tests for API endpoints
   - E2E tests for critical user flows

4. **Self-Review**
   - Review your own diff
   - Remove debug code, console.logs
   - Check for commented-out code

### PR Template

When opening a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No linter errors
- [ ] Ready for review

## Related Issues
Closes #[issue number]
```

### Review Process

1. **Automated Checks**: CI must pass (build, lint, typecheck, test)
2. **Code Review**: At least 1 approval required
3. **Review Criteria**:
   - Code quality and readability
   - Test coverage
   - Documentation
   - Performance considerations
   - Security implications

### Merging

- **Squash and Merge**: Default for feature branches
- **Rebase**: For small fixes and updates
- **Merge Commit**: For large features with meaningful commit history

After merge, the branch will be automatically deleted.

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Integration Tests

```bash
# Frontend integration tests
cd apps/frontend
pnpm test:integration

# API integration tests
cd apps/core-api
pnpm test:e2e
```

### E2E Tests

```bash
# Run Playwright tests
cd apps/frontend
pnpm test:e2e
```

### Test Coverage Requirements

- **Minimum Coverage**: 80% for new code
- **Critical Paths**: 100% coverage required
- **Utilities**: 100% coverage required
- **UI Components**: Minimum 70% coverage

### Writing Tests

```typescript
// ✅ Good test structure
describe('ContactsService', () => {
  describe('list', () => {
    it('should return paginated contacts', async () => {
      // Arrange
      const query = { page: 1, size: 10 };
      
      // Act
      const result = await service.list(query);
      
      // Assert
      expect(result.items).toHaveLength(10);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should filter by search query', async () => {
      // ...
    });
  });
});
```

## 📚 Documentation

### Code Documentation

- **JSDoc**: Document all public functions
- **Complex Logic**: Add inline comments for complex algorithms
- **TODOs**: Use `// TODO:` with issue reference

```typescript
/**
 * Calculates the weighted lead score based on multiple factors.
 * 
 * @param lead - The lead to score
 * @param weights - Scoring weights configuration
 * @returns Normalized score between 0-100
 * 
 * @example
 * ```typescript
 * const score = calculateLeadScore(lead, defaultWeights);
 * console.log(score); // 85
 * ```
 */
export function calculateLeadScore(
  lead: Lead,
  weights: ScoringWeights
): number {
  // Implementation
}
```

### README Updates

Update `README.md` when adding:
- New features
- New dependencies
- New environment variables
- New scripts

### Architecture Documentation

Update `docs/ARCHITECTURE_OVERVIEW.md` when:
- Adding new services
- Changing data flow
- Modifying authentication
- Adding new integrations

## 🚢 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** (v2.0.0): Breaking changes
- **MINOR** (v1.1.0): New features, backward compatible
- **PATCH** (v1.0.1): Bug fixes, backward compatible

### Creating a Release

1. **Update CHANGELOG.md**

```markdown
## [1.1.0] - 2025-10-23

### Added
- Bulk contact import from CSV
- Advanced search filters

### Changed
- Improved pagination performance
- Updated UI components

### Fixed
- Deal amount calculation bug
- Auth token refresh issue
```

2. **Bump Version**

```bash
# In each package
pnpm version minor
```

3. **Create Git Tag**

```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
```

4. **GitHub Release**
   - Go to GitHub Releases
   - Create new release from tag
   - Copy CHANGELOG entry
   - Publish release

## 🆘 Getting Help

- **Documentation**: Start with `docs/INDEX.md`
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Slack/Discord**: [Add your team chat link]

## 📞 Contact

- **Maintainer**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [@yourusername](https://github.com/yourusername)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as this project (see [LICENSE](./LICENSE) file).

---

**Thank you for contributing to Traffic CRM!** 🎉

Your contributions help make this project better for everyone.

