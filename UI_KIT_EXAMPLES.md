# UI Kit Examples & Best Practices

**Package:** `@ui-kit/core`  
**Created:** Sprint 1  
**Components:** AppPage, DataTable, FilterBar, EntityTimeline

---

## 📦 Installation & Setup

The UI Kit is already installed as a workspace package. Import components using the path alias:

```typescript
import { AppPage, DataTable, FilterBar, EntityTimeline } from '@ui-kit/core';
import type { Column, TimelineEvent } from '@ui-kit/core';
```

---

## 🎨 Components

### **1. AppPage**

A consistent page layout component with breadcrumbs, title, actions, and filters.

#### **Props**

```typescript
interface AppPageProps {
  title: string;                          // Page title
  breadcrumbs?: Array<{                   // Optional breadcrumb navigation
    label: string;
    href?: string;
  }>;
  actions?: ReactNode;                    // Action buttons (top-right)
  filters?: ReactNode;                    // Filter components (below title)
  children: ReactNode;                    // Page content
}
```

#### **Example**

```typescript
<AppPage
  title="Contacts"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Contacts' }
  ]}
  actions={
    <Button variant="contained" startIcon={<AddIcon />}>
      Add Contact
    </Button>
  }
  filters={
    <FilterBar>
      <TextField label="Search" size="small" />
      <Select size="small">
        <MenuItem value="all">All</MenuItem>
      </Select>
    </FilterBar>
  }
>
  {/* Your content here */}
</AppPage>
```

---

### **2. DataTable**

A generic, type-safe table component with pagination.

#### **Props**

```typescript
interface DataTableProps<T extends { id: string }> {
  rows: T[];                              // Data rows
  columns: Column<T>[];                   // Column definitions
  page: number;                           // Current page (1-based)
  pageSize: number;                       // Items per page
  total: number;                          // Total item count
  onPageChange?: (page: number) => void;  // Page change handler
}

type Column<T> = {
  key: keyof T;                           // Data key
  header: string;                         // Column header text
  render?: (row: T) => ReactNode;         // Custom renderer
  width?: number | string;                // Column width
};
```

#### **Basic Example**

```typescript
type Contact = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'archived';
};

const columns: Column<Contact>[] = [
  { key: 'name', header: 'Name', width: '40%' },
  { key: 'email', header: 'Email', width: '40%' },
  { 
    key: 'status', 
    header: 'Status',
    render: (row) => (
      <Chip 
        label={row.status} 
        color={row.status === 'active' ? 'success' : 'default'}
      />
    )
  }
];

<DataTable
  rows={contacts}
  columns={columns}
  page={page}
  pageSize={20}
  total={totalCount}
  onPageChange={setPage}
/>
```

#### **Advanced Example with Actions**

```typescript
const columns: Column<Contact>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '30%',
    render: (row) => (
      <Box>
        <Box sx={{ fontWeight: 500 }}>{row.name}</Box>
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {row.title}
        </Box>
      </Box>
    )
  },
  {
    key: 'id',
    header: 'Actions',
    width: '15%',
    render: (row) => (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton size="small" onClick={() => handleEdit(row.id)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleDelete(row.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    )
  }
];
```

---

### **3. FilterBar**

A flexible container for filter controls with automatic wrapping.

#### **Props**

```typescript
interface FilterBarProps {
  children?: ReactNode;  // Filter components
}
```

#### **Example**

```typescript
<FilterBar>
  <TextField
    label="Search"
    size="small"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{ minWidth: 250 }}
  />
  
  <Select
    size="small"
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    sx={{ minWidth: 150 }}
  >
    <MenuItem value="all">All Status</MenuItem>
    <MenuItem value="active">Active</MenuItem>
    <MenuItem value="archived">Archived</MenuItem>
  </Select>
  
  <DatePicker
    label="From Date"
    value={fromDate}
    onChange={setFromDate}
    slotProps={{ textField: { size: 'small' } }}
  />
  
  {hasFilters && (
    <Button size="small" onClick={clearFilters}>
      Clear Filters
    </Button>
  )}
</FilterBar>
```

---

### **4. EntityTimeline**

Display a chronological timeline of events for an entity.

#### **Props**

```typescript
interface EntityTimelineProps {
  events: TimelineEvent[];
}

type TimelineEvent = {
  id: string;
  at: string;        // ISO date string
  type: string;      // event type (note, email, call, stage_change)
  subject?: string;  // event subject/title
  body?: string;     // event description
};
```

#### **Example**

```typescript
const events: TimelineEvent[] = [
  {
    id: '1',
    at: '2025-10-24T10:30:00Z',
    type: 'note',
    subject: 'Initial contact',
    body: 'Had a great intro call. Very interested in enterprise features.'
  },
  {
    id: '2',
    at: '2025-10-23T14:15:00Z',
    type: 'email',
    subject: 'Follow-up email sent',
    body: 'Sent pricing information and case studies.'
  },
  {
    id: '3',
    at: '2025-10-22T09:00:00Z',
    type: 'stage_change',
    subject: 'Stage changed: Prospecting → Proposal'
  }
];

<EntityTimeline events={events} />
```

---

## 🎯 Complete Page Example

See **[ContactsPageExample.tsx](./apps/frontend/src/pages/ContactsPageExample.tsx)** for a full implementation showing:

- ✅ AppPage layout with breadcrumbs and actions
- ✅ FilterBar with search and status filter
- ✅ DataTable with custom columns and renderers
- ✅ Loading and error states
- ✅ Empty state handling
- ✅ Pagination
- ✅ Action buttons (edit, email, call)

---

## 🔧 Service Layer Pattern

See **[contacts.service.ts](./apps/frontend/src/services/contacts.service.ts)** for a clean API service pattern:

```typescript
import { contactsService } from '@/services/contacts.service';

// List with filters
const response = await contactsService.list({
  page: 1,
  pageSize: 20,
  search: 'john',
  status: 'active'
});

// Get by ID
const contact = await contactsService.getById('contact-id');

// Create
const newContact = await contactsService.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Update
const updated = await contactsService.update('contact-id', {
  title: 'Senior Manager'
});

// Archive (soft delete)
await contactsService.archive('contact-id');
```

---

## 🎨 Best Practices

### **1. Type Safety**

Always define your data types:

```typescript
type Contact = {
  id: string;
  name: string;
  email?: string;
  // ... other fields
};

const columns: Column<Contact>[] = [
  // TypeScript will enforce correct keys
];
```

### **2. Loading States**

Always show loading indicators:

```typescript
{loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress />
  </Box>
) : (
  <DataTable {...props} />
)}
```

### **3. Error Handling**

Display errors to users:

```typescript
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

### **4. Empty States**

Provide helpful empty states:

```typescript
{contacts.length === 0 ? (
  <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
    <Box sx={{ fontSize: '1.25rem', mb: 1 }}>No contacts found</Box>
    <Box>Try adjusting your filters or add a new contact</Box>
  </Box>
) : (
  <DataTable {...props} />
)}
```

### **5. Debounce Search**

Debounce search inputs to reduce API calls:

```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebounce(searchInput, 300);

useEffect(() => {
  // This will only trigger 300ms after user stops typing
  fetchData({ search: debouncedSearch });
}, [debouncedSearch]);
```

### **6. Cleanup Effects**

Always cleanup async operations:

```typescript
useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    const data = await fetchData();
    if (mounted) {
      setData(data);
    }
  };

  loadData();

  return () => {
    mounted = false;
  };
}, []);
```

---

## 🚀 Next Steps

### **Enhancements to Consider**

1. **DataTable Sorting**
   - Add clickable column headers
   - Show sort direction indicators
   - Support multi-column sorting

2. **DataTable Row Selection**
   - Add checkbox column
   - Bulk actions toolbar
   - Select all/none

3. **FilterBar Improvements**
   - Filter count badge
   - Saved filter presets
   - Collapse/expand on mobile

4. **EntityTimeline Enhancements**
   - Group by date
   - Filter by event type
   - Expandable event details

5. **Additional Components**
   - FormField (consistent form inputs)
   - Card (content containers)
   - Modal (dialogs)
   - Tabs (navigation)
   - Stats (KPI cards)

---

## 📚 Related Documentation

- [SPRINT_1_COMPLETE.md](./SPRINT_1_COMPLETE.md) — Sprint 1 overview
- [SCHEMA_WORKFLOW.md](./SCHEMA_WORKFLOW.md) — Database workflow
- [PRODUCT_ROADMAP.md](./docs/PRODUCT_ROADMAP.md) — Full roadmap

---

## 🤝 Contributing

When adding new UI Kit components:

1. Create component in `packages/ui-kit/src/`
2. Export from `packages/ui-kit/src/index.ts`
3. Add TypeScript types
4. Create usage example
5. Update this documentation

---

**📍 You are here:** UI Kit Examples  
**🏠 Return to:** [README](./README.md) | [Sprint 1 Complete](./SPRINT_1_COMPLETE.md)
