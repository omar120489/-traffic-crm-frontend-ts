# Legacy → TypeScript Migration Tracker

This document tracks the gradual migration of legacy code to fully-typed TypeScript.

## 🎯 Goal

Remove all entries from `apps/frontend/src/legacy/ambient.d.ts` by migrating legacy modules to proper TypeScript.

## 📊 Current Progress

```bash
# Run this command to see remaining shims:
grep -c "declare module" apps/frontend/src/legacy/ambient.d.ts
```

**Target:** 0 shims remaining

## 📋 Migration Checklist

### Hooks (`hooks/*`)
- [ ] `hooks/useJourneyEvents`
- [ ] `hooks/useNotifications`
- [ ] `hooks/useNotificationPreferences`
- [ ] Other hooks (wildcard: `hooks/*`)

### Layouts (`layouts/*`)
- [ ] `layouts/AppPage`
- [ ] Other layouts (wildcard: `layouts/*`)

### Utils (`utils/*`)
- [ ] `utils/notifications`
- [ ] `utils/analytics`
- [ ] Other utils (wildcard: `utils/*`)

### Services (`services/*`)
- [ ] `services/reporting`
- [ ] Other services (wildcard: `services/*`)

### Types (`types/*`)
- [ ] `types/api` (Deal, Lead, Notification, ApiResponse, etc.)
- [ ] `types/metrics` (CohortItem, FunnelStage, TimeSeriesPoint)
- [ ] Other types (wildcard: `types/*`)

### Constants (`constants/*`)
- [ ] `constants/deals` (DEAL_STAGES, DEAL_STATUSES)
- [ ] Other constants (wildcard: `constants/*`)

### UI Components (`ui-component/*`)
- [ ] `ui-component/cards/MainCard`
- [ ] Other UI components (wildcard: `ui-component/*`)

### Store (`store/*`)
- [ ] `store` (Redux store)
- [ ] `store/slices/*` (Redux slices)

### SDK
- [ ] `@sdk-js/core` (old SDK placeholder)

## 🔄 Migration Process

For each module above:

### 1. Choose a Module
Pick a module from the checklist (start with small, isolated modules).

### 2. Add Proper Types
```typescript
// Before (shimmed as 'any')
export const useNotifications = () => { ... };

// After (properly typed)
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  createdAt: Date;
}

export interface NotificationFilter {
  type?: Notification['type'];
  unreadOnly?: boolean;
}

export const useNotifications = (filter?: NotificationFilter): {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  clearAll: () => void;
} => {
  // Implementation
};
```

### 3. Remove Shim
Open `apps/frontend/src/legacy/ambient.d.ts` and delete the corresponding `declare module` block:

```typescript
// DELETE THIS:
declare module 'hooks/useNotifications' {
  export const useNotifications: any;
  export type NotificationFilter = any;
}
```

### 4. Verify
```bash
# Check Sprint 2 code (should still pass)
pnpm --filter ./apps/frontend run typecheck:sprint2

# Check full repo (should still pass)
pnpm --filter ./apps/frontend run typecheck:legacy

# If errors appear, fix them in the consuming files
```

### 5. Commit
```bash
git add apps/frontend/src/hooks/useNotifications.ts
git add apps/frontend/src/legacy/ambient.d.ts
git commit -m "refactor(hooks): migrate useNotifications to TypeScript"
```

## 📈 Progress Tracking

### Week 1 (Current)
- [x] Sprint 2 code fully typed
- [x] Legacy shims in place
- [ ] First 3 modules migrated

### Week 2
- [ ] Hooks migrated (5 modules)
- [ ] Utils migrated (3 modules)

### Week 3
- [ ] Types migrated (2 modules)
- [ ] Constants migrated (1 module)

### Week 4
- [ ] Services migrated (1 module)
- [ ] UI Components migrated (2 modules)

### Week 5
- [ ] Store migrated (2 modules)
- [ ] SDK placeholder removed
- [ ] `ambient.d.ts` deleted 🎉

## 🎯 Priority Order

Migrate in this order for maximum impact:

1. **Types** (`types/*`) - Foundation for everything else
2. **Utils** (`utils/*`) - Widely used, small surface area
3. **Hooks** (`hooks/*`) - Core business logic
4. **Constants** (`constants/*`) - Easy wins
5. **Services** (`services/*`) - API layer
6. **UI Components** (`ui-component/*`) - Large but isolated
7. **Layouts** (`layouts/*`) - Structural components
8. **Store** (`store/*`) - Complex, do last
9. **SDK** (`@sdk-js/core`) - Remove when new SDK is fully wired

## 🚨 Common Pitfalls

### Circular Dependencies
If you get circular dependency errors, extract shared types to a separate file:
```typescript
// types/shared.ts
export interface User { ... }

// hooks/useAuth.ts
import type { User } from '../types/shared';
```

### Breaking Changes
If a migration breaks consuming code:
1. Fix the consuming code in the same commit
2. Or use a temporary compatibility layer:
```typescript
// Old API (deprecated)
export const oldFunction = (arg: any) => newFunction(arg);

// New API
export const newFunction = (arg: TypedArg): TypedResult => { ... };
```

### Type Inference Issues
If TypeScript can't infer types, add explicit annotations:
```typescript
// Before
const [state, setState] = useState(null);

// After
const [state, setState] = useState<MyType | null>(null);
```

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Sprint 2 Examples](./apps/frontend/src/pages/contacts/) - Reference implementation

## 🎉 Completion

When all checkboxes are checked and `grep -c "declare module" apps/frontend/src/legacy/ambient.d.ts` returns `0`:

1. Delete `apps/frontend/src/legacy/ambient.d.ts`
2. Remove `src/legacy/ambient.d.ts` from `apps/frontend/tsconfig.json`
3. Update `apps/frontend/package.json`:
   ```json
   {
     "scripts": {
       "typecheck": "tsc --noEmit",
       "typecheck:all": "tsc --noEmit"
     }
   }
   ```
4. Update `.husky/pre-push` to use default `tsconfig.json`
5. Celebrate! 🎊

---

**Last Updated:** October 24, 2025  
**Current Shims:** Run `grep -c "declare module" apps/frontend/src/legacy/ambient.d.ts` to check

