# SDK Migration Guide

## Overview

The typed SDK (`@sdk-js/core`) is auto-generated from the Core API's OpenAPI spec and provides type-safe API calls with zero boilerplate.

## Benefits

- ✅ **Type Safety**: All endpoints, request/response types auto-generated
- ✅ **IntelliSense**: Full autocomplete in VS Code
- ✅ **DRY**: No manual type definitions or axios wrappers
- ✅ **Auth**: JWT header injection handled automatically
- ✅ **Sync**: Regenerate with `pnpm sdk:gen` after API changes

## Migration Pattern

### Before (Legacy axios service)

```typescript
// apps/frontend/src/services/contacts.ts
import { apiGet, apiPost } from '@data/clients/axios';
import type { Contact, ContactCreateDto } from '@shared-types';

export async function listContacts() {
  return apiGet<{ items: Contact[]; total: number }>('/api/contacts');
}

export async function createContact(payload: ContactCreateDto) {
  return apiPost<ContactCreateDto, Contact>('/api/contacts', payload);
}
```

**Issues:**

- Manual typing required
- No compile-time validation of endpoints
- Duplicated auth logic

### After (SDK-based service)

```typescript
// apps/frontend/src/services/contacts.sdk.ts
import { api } from '@/data/clients/sdk';

export async function listContacts() {
  return api.listContacts(); // Fully typed, no manual annotations needed
}

export async function createContact(payload: any) {
  return api.createContact(payload); // Type-checked against API schema
}

export const contactsSdkApi = {
  listContacts,
  createContact,
  // ... other methods
};
```

**Benefits:**

- Types come directly from Core API
- Endpoints validated at compile time
- Auth handled in client

## Step-by-Step Migration

### Step 1: Generate SDK Types

Ensure the Core API is running, then:

```bash
pnpm sdk:gen
```

This creates `packages/sdk-js/src/types.gen.ts` with all API types.

### Step 2: Create SDK Service

Create a new file alongside the legacy service:

```typescript
// apps/frontend/src/services/leads.sdk.ts
import { api } from '@/data/clients/sdk';

export async function listLeads() {
  return api.listLeads();
}

export async function getLead(id: string) {
  return api.getLead(id);
}

export async function createLead(body: any) {
  return api.createLead(body);
}

export async function updateLead(id: string, body: any) {
  return api.updateLead(id, body);
}

export async function deleteLead(id: string) {
  return api.deleteLead(id);
}

export const leadsSdkApi = {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
};
```

### Step 3: Update Component Imports

Find all imports of the old service:

```bash
grep -r "from '@services/leads'" apps/frontend/src
```

Replace with SDK import:

```diff
- import { listLeads } from '@services/leads';
+ import { listLeads } from '@services/leads.sdk';
```

Or use a barrel import:

```typescript
// apps/frontend/src/services/index.ts
export * from './contacts.sdk';
export * from './leads.sdk';
export * from './deals.sdk';
export * from './companies.sdk';
```

Then:

```typescript
import { listLeads } from '@services';
```

### Step 4: Test

Run the app and verify:

- No TypeScript errors
- API calls work as expected
- Data loads correctly

### Step 5: Remove Legacy Service

Once verified, delete the old service:

```bash
rm apps/frontend/src/services/leads.ts
```

## Extending the SDK

### Adding New Methods

Edit `packages/sdk-js/src/index.ts`:

```typescript
export function createClient(opts: { baseUrl: string; getToken?: () => Promise<string | null> }) {
  // ... existing code ...

  return {
    // Existing methods...
    listContacts: async () => http.get('contacts').json(),
    
    // Add new method
    searchContacts: async (query: string) =>
      http.get('contacts/search', { searchParams: { q: query } }).json(),
    
    // Paginated list with query params
    listLeadsWithFilters: async (params: { page?: number; size?: number; status?: string }) =>
      http.get('leads', { searchParams: params }).json(),
  };
}
```

### Adding Query Parameters

```typescript
// In SDK
listLeads: async (query?: { page?: number; size?: number; status?: string }) =>
  http.get('leads', { searchParams: query }).json(),

// In service
export async function listLeads(query?: { page?: number; size?: number; status?: string }) {
  return api.listLeads(query);
}

// In component
const leads = await listLeads({ page: 1, size: 10, status: 'NEW' });
```

### Custom Request Options

```typescript
// Pass additional ky options
http.get('contacts', {
  searchParams: { page: 1 },
  timeout: 5000,
  retry: 3,
}).json()
```

## Advanced Patterns

### Error Handling

```typescript
import { HTTPError } from 'ky';

export async function listContacts() {
  try {
    return await api.listContacts();
  } catch (err) {
    if (err instanceof HTTPError) {
      if (err.response.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized, redirect to login');
      } else if (err.response.status === 404) {
        // Handle not found
        console.error('Resource not found');
      }
    }
    throw err; // Re-throw for caller to handle
  }
}
```

### Response Transformation

```typescript
export async function listLeads() {
  const response = await api.listLeads();
  
  // Transform response if needed
  return {
    ...response,
    items: response.items.map(lead => ({
      ...lead,
      displayName: `${lead.title} - ${lead.status}`,
    })),
  };
}
```

### Caching with SWR

```typescript
import useSWR from 'swr';
import { api } from '@/data/clients/sdk';

export function useContacts() {
  const { data, error, mutate } = useSWR(
    '/api/contacts',
    () => api.listContacts(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    contacts: data?.items ?? [],
    loading: !data && !error,
    error,
    refresh: mutate,
  };
}
```

### Optimistic Updates

```typescript
export async function updateContact(id: string, body: any) {
  // Optimistically update local state
  const optimisticUpdate = { ...body, id };
  
  try {
    const result = await api.updateContact(id, body);
    return result;
  } catch (err) {
    // Revert optimistic update on error
    throw err;
  }
}
```

## Regenerating SDK

After any API changes (new endpoints, changed DTOs, updated responses):

```bash
# Ensure API is running
pnpm --filter @apps/core-api dev

# Wait for startup, then:
pnpm sdk:gen
```

The frontend will hot-reload with updated types.

## Troubleshooting

### SDK Generation Fails

**Error:** `GET http://localhost:3000/docs-json: Connection refused`

**Fix:** Ensure Core API is running:

```bash
pnpm --filter @apps/core-api dev
```

### Type Errors After Regeneration

**Error:** `Type 'X' is not assignable to type 'Y'`

**Fix:** API schema changed. Update your code to match the new types:

```typescript
// Before: API returned { data: Contact[] }
const contacts = await api.listContacts();
console.log(contacts.data);

// After: API now returns { items: Contact[] }
const contacts = await api.listContacts();
console.log(contacts.items); // ✅ Updated
```

### Auth Token Not Sent

**Error:** `401 Unauthorized`

**Fix:** Ensure JWT is in `.env.local`:

```bash
# Generate new token
pnpm dev:jwt

# Add to .env.local
echo "VITE_DEV_JWT=<token>" >> apps/frontend/.env.local

# Restart frontend
pnpm --filter ./apps/frontend dev
```

## Best Practices

1. **Keep SDK Thin**: Don't add business logic to SDK methods
2. **Service Layer**: Wrap SDK calls in service functions for:
   - Error handling
   - Response transformation
   - Caching
   - Logging
3. **Regenerate Often**: After every API change, run `pnpm sdk:gen`
4. **Type Safety**: Let TypeScript catch API mismatches at compile time
5. **Named Exports**: Use named exports from services for easier refactoring

## Example: Full Migration

### Legacy Service

```typescript
// services/deals.ts
import { apiGet, apiPost, apiPatch, apiDelete } from '@data/clients/axios';
import type { Deal, DealCreateDto, DealUpdateDto } from '@shared-types';

export async function listDeals() {
  return apiGet<{ items: Deal[]; total: number }>('/api/deals');
}

export async function getDeal(id: string) {
  return apiGet<Deal>(`/api/deals/${id}`);
}

export async function createDeal(payload: DealCreateDto) {
  return apiPost<DealCreateDto, Deal>('/api/deals', payload);
}

export async function updateDeal(id: string, payload: DealUpdateDto) {
  return apiPatch<DealUpdateDto, Deal>(`/api/deals/${id}`, payload);
}

export async function deleteDeal(id: string) {
  return apiDelete<void>(`/api/deals/${id}`);
}
```

### SDK Service

```typescript
// services/deals.sdk.ts
import { api } from '@/data/clients/sdk';

export async function listDeals() {
  return api.listDeals();
}

export async function getDeal(id: string) {
  return api.getDeal(id);
}

export async function createDeal(payload: any) {
  return api.createDeal(payload);
}

export async function updateDeal(id: string, payload: any) {
  return api.updateDeal(id, payload);
}

export async function deleteDeal(id: string) {
  return api.deleteDeal(id);
}

export const dealsSdkApi = {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
};
```

**Lines of Code:** 27 → 22 (18% reduction)  
**Type Safety:** Manual → Auto-generated  
**Maintenance:** High → Low

---

## Migration Checklist

- [ ] Core API running with Swagger at `/docs`
- [ ] SDK types generated: `pnpm sdk:gen`
- [ ] Frontend has `@sdk-js/core` dependency
- [ ] SDK client configured in `data/clients/sdk.ts`
- [ ] JWT token in `.env.local` (or localStorage)
- [ ] New SDK service created (e.g., `contacts.sdk.ts`)
- [ ] Component imports updated to use SDK service
- [ ] Manual testing passed
- [ ] Legacy service removed
- [ ] CI passing with new types

---

**Ready to migrate?** Start with Contacts (already done) and replicate the pattern for Leads, Deals, and Companies!
