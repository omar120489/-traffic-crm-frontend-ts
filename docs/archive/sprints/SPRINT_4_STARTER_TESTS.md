# 🧪 Sprint 4 - Starter Test Stubs

**Purpose**: Skeleton tests and mocked data for fast Sprint 4 start.

---

## 📦 Test Stubs

### **1. Activity Timeline E2E Test**

```typescript
// e2e/activity-timeline.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Activity Timeline', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to contact page
    await page.goto('/login');
    await page.fill('[name="email"]', 'demo@traffic-crm.example.com');
    await page.fill('[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/deals');
    
    // Navigate to contact with activities
    await page.goto('/contacts/demo-contact-1');
  });

  test('should display activity timeline', async ({ page }) => {
    // Wait for timeline to load
    await page.waitForSelector('[data-testid="activity-timeline"]');
    
    // Verify timeline is visible
    const timeline = page.locator('[data-testid="activity-timeline"]');
    await expect(timeline).toBeVisible();
    
    // Verify at least one activity is displayed
    const activities = page.locator('[data-testid="activity-item"]');
    await expect(activities).toHaveCount(3); // Mocked data has 3 activities
  });

  test('should add new activity', async ({ page }) => {
    // Click "Add Activity" button
    await page.click('[data-testid="add-activity-btn"]');
    
    // Fill in activity form
    await page.selectOption('[name="type"]', 'note');
    await page.fill('[name="content"]', 'Test activity from E2E');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify activity appears in timeline
    await expect(page.locator('text=Test activity from E2E')).toBeVisible();
  });

  test('should filter activities by type', async ({ page }) => {
    // Open filter menu
    await page.click('[data-testid="filter-activities-btn"]');
    
    // Select "Notes" filter
    await page.click('[data-testid="filter-type-note"]');
    
    // Verify only notes are displayed
    const activities = page.locator('[data-testid="activity-item"]');
    await expect(activities).toHaveCount(2); // Mocked data has 2 notes
    
    // Verify activity types
    const types = await activities.locator('[data-testid="activity-type"]').allTextContents();
    expect(types.every(type => type === 'Note')).toBeTruthy();
  });

  test('should paginate activities', async ({ page }) => {
    // Scroll to bottom to trigger pagination
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for more activities to load
    await page.waitForTimeout(1000);
    
    // Verify more activities loaded
    const activities = page.locator('[data-testid="activity-item"]');
    await expect(activities).toHaveCount(6); // 3 initial + 3 more
  });

  test('should display empty state when no activities', async ({ page }) => {
    // Navigate to contact with no activities
    await page.goto('/contacts/demo-contact-empty');
    
    // Verify empty state is displayed
    await expect(page.locator('[data-testid="activity-timeline-empty"]')).toBeVisible();
    await expect(page.locator('text=No activities yet')).toBeVisible();
  });
});
```

---

### **2. Activity Timeline Component Test**

```typescript
// src/components/activities/__tests__/ActivityTimeline.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActivityTimeline } from '../ActivityTimeline';
import { mockActivities } from '../__mocks__/activities';

describe('ActivityTimeline', () => {
  it('renders activity timeline', () => {
    render(<ActivityTimeline activities={mockActivities} />);
    
    expect(screen.getByTestId('activity-timeline')).toBeInTheDocument();
    expect(screen.getAllByTestId('activity-item')).toHaveLength(3);
  });

  it('displays activity details correctly', () => {
    render(<ActivityTimeline activities={mockActivities} />);
    
    const firstActivity = mockActivities[0];
    expect(screen.getByText(firstActivity.content)).toBeInTheDocument();
    expect(screen.getByText(firstActivity.user.name)).toBeInTheDocument();
  });

  it('handles empty state', () => {
    render(<ActivityTimeline activities={[]} />);
    
    expect(screen.getByTestId('activity-timeline-empty')).toBeInTheDocument();
    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<ActivityTimeline activities={[]} loading={true} />);
    
    expect(screen.getByTestId('activity-timeline-loading')).toBeInTheDocument();
    expect(screen.getAllByTestId('activity-skeleton')).toHaveLength(3);
  });

  it('filters activities by type', async () => {
    const user = userEvent.setup();
    render(<ActivityTimeline activities={mockActivities} />);
    
    // Open filter menu
    await user.click(screen.getByTestId('filter-activities-btn'));
    
    // Select "Notes" filter
    await user.click(screen.getByTestId('filter-type-note'));
    
    // Verify only notes are displayed
    await waitFor(() => {
      expect(screen.getAllByTestId('activity-item')).toHaveLength(2);
    });
  });

  it('calls onAddActivity when add button clicked', async () => {
    const user = userEvent.setup();
    const onAddActivity = jest.fn();
    render(<ActivityTimeline activities={mockActivities} onAddActivity={onAddActivity} />);
    
    await user.click(screen.getByTestId('add-activity-btn'));
    
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });
});
```

---

### **3. Mocked Activity Data**

```typescript
// src/components/activities/__mocks__/activities.ts
import type { Activity } from '@/types/activity';

export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    type: 'note',
    content: 'Called to discuss Q4 budget. They are interested in enterprise plan.',
    entityType: 'contact',
    entityId: 'demo-contact-1',
    userId: 'demo-user-1',
    user: {
      id: 'demo-user-1',
      name: 'John Demo',
      email: 'john@demo.com',
    },
    createdAt: '2025-10-24T10:30:00Z',
    updatedAt: '2025-10-24T10:30:00Z',
  },
  {
    id: 'activity-2',
    type: 'call',
    content: 'Follow-up call scheduled for next week.',
    entityType: 'contact',
    entityId: 'demo-contact-1',
    userId: 'demo-user-1',
    user: {
      id: 'demo-user-1',
      name: 'John Demo',
      email: 'john@demo.com',
    },
    createdAt: '2025-10-23T14:15:00Z',
    updatedAt: '2025-10-23T14:15:00Z',
  },
  {
    id: 'activity-3',
    type: 'email',
    content: 'Sent proposal document via email.',
    entityType: 'contact',
    entityId: 'demo-contact-1',
    userId: 'demo-user-2',
    user: {
      id: 'demo-user-2',
      name: 'Jane Demo',
      email: 'jane@demo.com',
    },
    createdAt: '2025-10-22T09:00:00Z',
    updatedAt: '2025-10-22T09:00:00Z',
  },
];

export const mockEmptyActivities: Activity[] = [];

export const mockActivityTypes = [
  { value: 'note', label: 'Note' },
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
];
```

---

### **4. Activity Types**

```typescript
// src/types/activity.ts
export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'task';

export interface Activity {
  readonly id: string;
  readonly type: ActivityType;
  readonly content: string;
  readonly entityType: 'contact' | 'deal' | 'company';
  readonly entityId: string;
  readonly userId: string;
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateActivityInput {
  readonly type: ActivityType;
  readonly content: string;
  readonly entityType: 'contact' | 'deal' | 'company';
  readonly entityId: string;
}

export interface ActivityFilters {
  readonly types?: readonly ActivityType[];
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly userId?: string;
}
```

---

### **5. Activity Service Stub**

```typescript
// src/services/activities.service.ts
import { http } from '@/lib/http';
import type { Activity, CreateActivityInput, ActivityFilters } from '@/types/activity';

export async function getActivities(
  entityType: string,
  entityId: string,
  filters?: ActivityFilters
): Promise<readonly Activity[]> {
  const params = new URLSearchParams({
    entityType,
    entityId,
    ...(filters?.types && { types: filters.types.join(',') }),
    ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters?.dateTo && { dateTo: filters.dateTo }),
    ...(filters?.userId && { userId: filters.userId }),
  });

  const { data } = await http.get<readonly Activity[]>(`/api/activities?${params}`);
  return data;
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  const { data } = await http.post<Activity>('/api/activities', input);
  return data;
}

export async function updateActivity(id: string, content: string): Promise<Activity> {
  const { data } = await http.patch<Activity>(`/api/activities/${id}`, { content });
  return data;
}

export async function deleteActivity(id: string): Promise<void> {
  await http.delete(`/api/activities/${id}`);
}
```

---

## ✅ Checklist

- [ ] E2E test stub created (`e2e/activity-timeline.spec.ts`)
- [ ] Component test stub created (`ActivityTimeline.test.tsx`)
- [ ] Mocked data created (`__mocks__/activities.ts`)
- [ ] Activity types defined (`types/activity.ts`)
- [ ] Activity service stub created (`services/activities.service.ts`)
- [ ] Tests run successfully (`pnpm test`)
- [ ] E2E tests run successfully (`pnpm test:e2e`)

---

## 🚀 Quick Start

```bash
# Create Sprint 4 branch
git checkout -b feat/s4-activity-timeline

# Create test directories
mkdir -p apps/frontend/src/components/activities/__tests__
mkdir -p apps/frontend/src/components/activities/__mocks__

# Copy test stubs (from this document)
# ... copy files ...

# Run tests
cd apps/frontend
pnpm test

# Run E2E tests
pnpm test:e2e e2e/activity-timeline.spec.ts
```

---

## 📞 Support

- **Engineering Lead**: @omar120489
- **QA Team**: qa@traffic-crm.example.com

---

**Status**: ✅ Ready to Use  
**Time**: ~15 minutes to set up  
**Impact**: High (fast Sprint 4 start)

