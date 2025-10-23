# @sdk-js/core

Typed TypeScript SDK for Traffic CRM Core API, auto-generated from OpenAPI/Swagger specs.

## Generate Types

```bash
# From monorepo root
pnpm --filter @sdk-js/core gen
```

This fetches `/docs-json` from the running Core API (<http://localhost:3000>) and generates TypeScript types.

## Usage

```typescript
import { createClient } from '@sdk-js/core';

const api = createClient({
  baseUrl: 'http://localhost:3000/api',
  getToken: async () => localStorage.getItem('jwt')
});

// Fully typed calls
const contacts = await api.listContacts();
const contact = await api.getContact('ct-123');
```

## Dev Setup

1. Start Core API: `pnpm --filter @apps/core-api dev`
2. Generate types: `pnpm --filter @sdk-js/core gen`
3. Use in frontend: Import from `@sdk-js/core`

## Regeneration

Re-run `pnpm --filter @sdk-js/core gen` whenever you:

- Add new endpoints
- Change DTOs/schemas
- Update API contracts
