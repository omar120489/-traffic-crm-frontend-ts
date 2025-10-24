# 🚀 Sprint 4 - Development Kickoff

**Branch**: `feat/s4-activity-timeline`  
**Status**: ✅ Ready to Code  
**Date**: October 25, 2025

---

## ✅ **Environment Ready**

### **1. Dependencies & Type Check**
```bash
# Update dependencies
pnpm install

# Run type check
pnpm -w typecheck

# Run linter
pnpm -w lint
```

### **2. Start Both Apps**
```bash
# Terminal 1: Backend
pnpm --filter ./apps/core-api run start:dev

# Terminal 2: Frontend
pnpm --filter ./apps/frontend run dev
```

### **3. Feature Branch Created** ✅
```bash
# Already on branch
git branch
# * feat/s4-activity-timeline
```

---

## 🧱 **First Build Targets**

| **Component** | **Scope** | **Notes** | **Status** |
|---------------|-----------|-----------|------------|
| `ActivityTimeline.tsx` | UI list + virtual scroll | Use `@tanstack/react-virtual` | ⏳ Next |
| `ActivityItem.tsx` | Card layout | Type icon, user, date, description | ⏳ Next |
| `ActivityService` | `GET /activities?entity=&id=` | ✅ Scaffolded with mock data | ✅ Done |
| `ActivityFilters.tsx` | Date range + user/type dropdowns | Persist to URL state | ⏳ Next |
| Mock data | `src/mock/activities.json` | ✅ 8 sample activities | ✅ Done |
| E2E | `timeline.spec.ts` | Test filters + infinite scroll | ⏳ Next |

---

## 📦 **Scaffolded Files** ✅

### **Types** ✅
- `src/types/activity.ts` - Complete TypeScript types
  - `Activity`, `ActivityType`, `CreateActivityInput`, `UpdateActivityInput`
  - `ActivityFilters`, `ActivityListResponse`

### **Mock Data** ✅
- `src/mock/activities.json` - 8 sample activities
  - Mix of types: call, note, email, meeting, task
  - Multiple users with avatars
  - Realistic content and timestamps

### **Service** ✅
- `src/services/activities.service.ts` - Complete service with mock data
  - `getActivities()` - Fetch with filters
  - `createActivity()` - Create new activity
  - `updateActivity()` - Update existing
  - `deleteActivity()` - Delete activity
  - `getActivityTypeOptions()` - Type options for UI
  - **Feature flag**: `USE_MOCK_DATA = true` (switch to false when backend ready)

---

## 🧪 **Testing Commands**

### **Unit Tests**
```bash
# Run all tests
pnpm --filter ./apps/frontend test

# Run specific test file
pnpm --filter ./apps/frontend test ActivityTimeline

# Watch mode
pnpm --filter ./apps/frontend test --watch
```

### **E2E Tests**
```bash
# Run E2E in UI mode
pnpm --filter ./apps/frontend test:e2e --ui

# Run specific E2E test
pnpm --filter ./apps/frontend test:e2e timeline.spec.ts

# Headless mode
pnpm --filter ./apps/frontend test:e2e
```

### **Lint & Type Safety** (Before PR)
```bash
# Run all checks
pnpm -w lint && pnpm -w typecheck

# Fix auto-fixable issues
pnpm -w lint --fix
```

---

## 🚦 **Branch + PR Rules**

### **PR Name Format**
```
feat: activity timeline base
```

### **Requirements**
- ✅ CODEOWNERS approval required
- ✅ All checks pass: audit, typecheck, e2e
- ✅ Target branch: `main`
- ✅ Squash and merge (keep history clean)

### **PR Template**
```markdown
## 🎯 Objective
Implement Activity Timeline component for Sprint 4

## 📝 Changes
- [ ] ActivityTimeline component with virtual scroll
- [ ] ActivityItem card layout
- [ ] Activity filters (type, user, date range)
- [ ] Mock data integration
- [ ] E2E tests

## ✅ Checklist
- [ ] TypeScript errors: 0
- [ ] Linter errors: 0
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing complete

## 📸 Screenshots
[Add screenshots here]

## 🔗 Related Issues
Closes #FE-TIMELINE-01
```

---

## 🧭 **Daily Cadence (Sprint 4)**

| **Day** | **Focus** | **Deliverable** | **Status** |
|---------|-----------|-----------------|------------|
| **Mon** | Timeline UI skeleton | Visible layout + dummy data | ⏳ Today |
| **Tue** | Filters + virtual scroll | Filter working w/ mocked data | ⏳ Pending |
| **Wed** | API integration | Backend + real data | ⏳ Pending |
| **Thu** | E2E + bug fix | All tests passing | ⏳ Pending |
| **Fri** | PR review + merge | Ready for demo | ⏳ Pending |

---

## 🚀 **Next Steps** (Start Coding Now!)

### **Step 1: Install Dependencies** (if needed)
```bash
cd apps/frontend

# Install @tanstack/react-virtual for virtual scrolling
pnpm add @tanstack/react-virtual

# Install date-fns for date formatting
pnpm add date-fns
```

### **Step 2: Create ActivityItem Component**
```bash
# Create component directory
mkdir -p src/components/activities

# Create ActivityItem.tsx
# (See scaffold below)
```

### **Step 3: Create ActivityTimeline Component**
```bash
# Create ActivityTimeline.tsx
# (See scaffold below)
```

### **Step 4: Create ActivityFilters Component**
```bash
# Create ActivityFilters.tsx
# (See scaffold below)
```

### **Step 5: Integrate into ContactDetailPage**
```bash
# Update ContactDetailPage.tsx to include timeline
# (See integration example below)
```

---

## 📋 **Component Scaffolds** (Ready to Copy)

### **ActivityItem.tsx** (Card Layout)
```typescript
// src/components/activities/ActivityItem.tsx
import { Avatar, Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import type { Activity } from '@/types/activity';

const ACTIVITY_ICONS: Record<Activity['type'], string> = {
  note: '📝',
  call: '📞',
  email: '📧',
  meeting: '🤝',
  task: '✅',
};

const ACTIVITY_COLORS: Record<Activity['type'], string> = {
  note: '#2196f3',
  call: '#4caf50',
  email: '#ff9800',
  meeting: '#9c27b0',
  task: '#f44336',
};

export interface ActivityItemProps {
  readonly activity: Activity;
  readonly onClick?: (activity: Activity) => void;
}

export function ActivityItem({ activity, onClick }: ActivityItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(activity);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 2 } : {},
        transition: 'box-shadow 0.2s',
      }}
      onClick={handleClick}
      data-testid="activity-item"
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Activity Type Icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: `${ACTIVITY_COLORS[activity.type]}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            {ACTIVITY_ICONS[activity.type]}
          </Box>

          {/* Activity Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Header: Type + Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={activity.type}
                size="small"
                sx={{
                  backgroundColor: `${ACTIVITY_COLORS[activity.type]}20`,
                  color: ACTIVITY_COLORS[activity.type],
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </Typography>
            </Box>

            {/* Content */}
            <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
              {activity.content}
            </Typography>

            {/* Footer: User */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={activity.user.avatar}
                alt={activity.user.name}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="caption" color="text.secondary">
                {activity.user.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
```

### **ActivityTimeline.tsx** (Virtual Scroll List)
```typescript
// src/components/activities/ActivityTimeline.tsx
import { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Activity, ActivityFilters } from '@/types/activity';
import { getActivities } from '@/services/activities.service';
import { ActivityItem } from './ActivityItem';

export interface ActivityTimelineProps {
  readonly entityType: 'contact' | 'deal' | 'company';
  readonly entityId: string;
  readonly filters?: ActivityFilters;
  readonly onActivityClick?: (activity: Activity) => void;
}

export function ActivityTimeline({
  entityType,
  entityId,
  filters,
  onActivityClick,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<readonly Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  // Virtual scrolling
  const virtualizer = useVirtualizer({
    count: activities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Estimated height of each item
    overscan: 5, // Render 5 extra items above/below viewport
  });

  // Fetch activities
  useEffect(() => {
    let cancelled = false;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getActivities(entityType, entityId, filters);

        if (!cancelled) {
          setActivities(response.activities);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load activities');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      cancelled = true;
    };
  }, [entityType, entityId, filters]);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}
        data-testid="activity-timeline-loading"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary',
        }}
        data-testid="activity-timeline-empty"
      >
        <Typography variant="h6" gutterBottom>
          No activities yet
        </Typography>
        <Typography variant="body2">
          Activities will appear here as you interact with this {entityType}.
        </Typography>
      </Box>
    );
  }

  // Timeline with virtual scrolling
  return (
    <Box
      ref={parentRef}
      sx={{
        height: '600px',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 4,
        },
      }}
      data-testid="activity-timeline"
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const activity = activities[virtualItem.index];
          return (
            <Box
              key={virtualItem.key}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ActivityItem activity={activity} onClick={onActivityClick} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
```

---

## 🎯 **Optional Enhancements** (Sprint 4.5)

- [ ] Add loading shimmer for virtualized rows
- [ ] Include activity grouping by day ("Today", "Yesterday", "Earlier")
- [ ] Add "New Activity" modal placeholder for Sprint 5
- [ ] Add activity edit/delete actions
- [ ] Add activity reactions (like, comment)

---

## 📞 **Support**

- **Engineering Lead**: @omar120489
- **Sprint 4 Plan**: `SPRINT_4_PLAN.md`
- **GitHub Issues**: `SPRINT_4_GITHUB_ISSUES.md`
- **Test Stubs**: `SPRINT_4_STARTER_TESTS.md`

---

**Status**: ✅ **READY TO CODE**  
**Branch**: `feat/s4-activity-timeline`  
**Next**: Copy component scaffolds and start building!

---

**🚀 Let's ship Sprint 4!** 🎉

