# 📖 Frontend Pagination Integration Guide

**Date:** October 23, 2025  
**Status:** Ready to use

---

## 🎯 Quick Start

All CRUD modules now support pagination. Here's how to use it in the frontend.

---

## 1️⃣ Regenerate SDK Types

```bash
# Start Core API first
pnpm --filter @apps/core-api dev

# In another terminal, regenerate SDK
pnpm sdk:gen
```

This updates `packages/sdk-js` so `listContacts`, `listLeads`, etc. return typed pagination responses.

---

## 2️⃣ New Hooks Available

### **`usePagination`** - State management only

```typescript
import { usePagination } from '@/hooks/usePagination';

const { query, page, size, search, setPage, setSize, setSearch, reset } = 
  usePagination({ page: 1, size: 10 });

// query = { page: 1, size: 10, search: '' }
// Use with your own useEffect + SDK call
```

### **`usePaginatedQuery`** - All-in-one hook

```typescript
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { listContacts } from '@services/contacts.sdk';

const { data, loading, error, page, size, search, setPage, setSize, setSearch, refetch } = 
  usePaginatedQuery({
    fetcher: (query) => listContacts(query),
    page: 1,
    size: 10,
  });

// data.items: Contact[]
// data.total: number
// data.totalPages: number
```

---

## 3️⃣ Pagination Toolbar Component

**`<PaginationToolbar />`** - Drop-in UI component

```typescript
import PaginationToolbar from '@/ui-component/PaginationToolbar';

<PaginationToolbar
  page={page}
  size={size}
  search={search}
  total={data.total}
  totalPages={data.totalPages}
  loading={loading}
  onPageChange={setPage}
  onSizeChange={setSize}
  onSearchChange={setSearch}
  onRefresh={refetch}
/>
```

**Features:**

- ✅ Search input with icon
- ✅ Page size selector (5, 10, 25, 50, 100)
- ✅ MUI Pagination with first/last buttons
- ✅ Item count display ("Showing 1-10 of 42")
- ✅ Optional refresh button
- ✅ Auto-reset to page 1 on search/size change

---

## 4️⃣ Complete Example: ContactsListPage

```typescript
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { listContacts } from '@services/contacts.sdk';
import PaginationToolbar from '@/ui-component/PaginationToolbar';
import MainCard from '@/ui-component/cards/MainCard';
import type { Contact } from '@shared-types';

export default function ContactsListPage() {
  const {
    data,
    loading,
    error,
    page,
    size,
    search,
    setPage,
    setSize,
    setSearch,
    refetch,
  } = usePaginatedQuery<Contact>({
    fetcher: (query) => listContacts(query),
    page: 1,
    size: 10,
  });

  return (
    <MainCard title="Contacts">
      <PaginationToolbar
        page={page}
        size={size}
        search={search}
        total={data.total}
        totalPages={data.totalPages}
        loading={loading}
        onPageChange={setPage}
        onSizeChange={setSize}
        onSearchChange={setSearch}
        onRefresh={refetch}
      />

      {error && <Alert severity="error">{error.message}</Alert>}

      {/* Your table/grid here */}
      <DataGrid
        rows={data.items}
        loading={loading}
        // ... other props
      />
    </MainCard>
  );
}
```

---

## 5️⃣ Service Methods (All Ready)

```typescript
// Contacts
import { listContacts } from '@services/contacts.sdk';
const result = await listContacts({ page: 1, size: 10, search: 'john' });

// Leads
import { listLeads } from '@services/leads.sdk';
const result = await listLeads({ page: 1, size: 10, search: 'website' });

// Deals
import { listDeals } from '@services/deals.sdk';
const result = await listDeals({ page: 1, size: 10, search: 'acme' });

// Companies
import { listCompanies } from '@services/companies.sdk';
const result = await listCompanies({ page: 1, size: 10, search: 'corp' });
```

**Response format:**

```typescript
{
  items: T[];       // Your entities
  total: number;    // Total count
  page: number;     // Current page (1-indexed)
  size: number;     // Items per page
  totalPages: number; // Calculated total pages
}
```

---

## 6️⃣ Migration Guide

### **Before (old hook):**

```typescript
const { contacts, data, loading, query, updateQuery, refetch } = useContacts();
```

### **After (new hook):**

```typescript
const { data, loading, page, size, search, setPage, setSize, setSearch, refetch } = 
  usePaginatedQuery({
    fetcher: (query) => listContacts(query),
    page: 1,
    size: 10,
  });

// data.items replaces contacts
// data.total, data.totalPages available
```

---

## 7️⃣ URL Sync (Optional Enhancement)

If you want to sync pagination state with URL params:

```typescript
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

const { data, loading, setPage, setSize, setSearch } = usePaginatedQuery({
  fetcher: (query) => listContacts(query),
  page: Number(searchParams.get('page')) || 1,
  size: Number(searchParams.get('size')) || 10,
  search: searchParams.get('search') || '',
});

// Sync changes to URL
const handlePageChange = (page: number) => {
  setPage(page);
  setSearchParams({ page: String(page), size: String(size) });
};
```

---

## 8️⃣ Advanced Features

### **Custom Search Fields**

Backend already supports per-module search:

- **Contacts**: `name`, `email`
- **Leads**: `source`, `status`
- **Deals**: `title`, `stage`
- **Companies**: `name`, `domain`

### **Add Sorting (Future)**

Extend `PaginationQueryDto`:

```typescript
export class PaginationQueryDto {
  @IsOptional() sortBy?: string;
  @IsOptional() sortOrder?: 'asc' | 'desc';
  // ... existing fields
}
```

Update service:

```typescript
orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' }
```

### **Add Filters (Future)**

Create module-specific query DTOs:

```typescript
export class LeadQueryDto extends PaginationQueryDto {
  @IsOptional() status?: LeadStatus;
  @IsOptional() dateFrom?: string;
  @IsOptional() dateTo?: string;
}
```

---

## 9️⃣ Testing

```bash
# Test API directly
TOKEN=$(pnpm --silent dev:jwt)

curl "http://localhost:3000/api/contacts?page=1&size=5&search=john" \
  -H "Authorization: Bearer $TOKEN" | jq '.total, .totalPages'

# Test frontend
pnpm --filter ./apps/frontend dev
# Navigate to /contacts, /leads, /deals, /companies
# Verify pagination controls work
```

---

## 🎯 Benefits

✅ **Consistent UX** - Same pagination UI across all list pages  
✅ **Type Safety** - Fully typed responses from SDK  
✅ **Performance** - Only fetch what's needed  
✅ **Validation** - Backend validates page size (1-100)  
✅ **Search** - Built-in case-insensitive search  
✅ **Reusable** - `PaginationToolbar` works everywhere  

---

## 📚 Files Reference

**Hooks:**

- `apps/frontend/src/hooks/usePagination.ts` - State management
- `apps/frontend/src/hooks/usePaginatedQuery.ts` - Data fetching

**Components:**

- `apps/frontend/src/ui-component/PaginationToolbar.tsx` - UI toolbar

**Backend:**

- `apps/core-api/src/common/dto/pagination.dto.ts` - DTOs
- All `*.controller.ts` - Updated endpoints
- All `*.service.ts` - Pagination logic

---

**Ready to use!** 🚀 Just regenerate SDK and start using the new hooks.
