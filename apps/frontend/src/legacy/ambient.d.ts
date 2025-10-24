/**
 * Ambient type declarations for legacy modules
 * 
 * Temporary shims for legacy modules so full-repo `tsc` is quiet during migration.
 * Replace/remove entries as you modernize files. Everything is intentionally `any`.
 * 
 * When migrating a legacy module:
 * 1. Replace the import with the real implementation
 * 2. Delete the corresponding shim from this file
 * 
 * Track progress: grep "declare module" src/legacy/ambient.d.ts | wc -l
 */

// ============================================================================
// Hooks
// ============================================================================

declare module 'hooks/useJourneyEvents' {
  export const useJourneyEvents: any;
  const _default: any;
  export default _default;
}

declare module 'hooks/useNotifications' {
  export const useNotifications: any;
  export type NotificationFilter = any;
}

declare module 'hooks/useNotificationPreferences' {
  export const useNotificationPreferences: any;
  export type NotificationPreferences = any;
}

declare module 'hooks/useLocalStorage' {
  const useLocalStorage: any;
  export default useLocalStorage;
}

// ============================================================================
// Layouts
// ============================================================================

declare module 'layouts/AppPage' {
  const AppPage: any;
  export default AppPage;
}

// ============================================================================
// Utils
// ============================================================================

declare module 'utils/notifications' {
  export const isNewNotification: any;
}

declare module 'utils/analytics' {
  export const track: any;
}

// ============================================================================
// Services
// ============================================================================

// Reporting & metrics used by AnalyticsDashboard
declare module 'services/reporting' {
  export const getCohorts: any;
  export const getFunnel: any;
  export const getKpis: any;
  export const getTrends: any;
  export type TrendInterval = any;
}

// ============================================================================
// Constants
// ============================================================================

// Deals constants
declare module 'constants/deals' {
  export const DEAL_STAGES: any[];
  export const DEAL_STATUSES: any[];
}

// ============================================================================
// Types
// ============================================================================

// Common API types referenced around legacy screens
declare module 'types/api' {
  export type Deal = any;
  export type DealUpdateDto = any;
  export type Lead = any;
  export type LeadUpdateDto = any;
  export type Notification = any;
  export type ApiResponse = any;
  export type PaginatedResponse = any;
  export type LoginResponse = any;
  export type UserProfileResponse = any;
  const _default: any;
  export default _default;
}

declare module 'types/metrics' {
  export type CohortItem = any;
  export type FunnelStage = any;
  export type TimeSeriesPoint = any;
}

// ============================================================================
// Store & Redux
// ============================================================================

// Old "store" wiring used by legacy contexts
declare module 'store' {
  const store: any;
  export default store;
}

declare module 'store/slices/account' {
  export const setUser: any;
  export const logout: any;
}

declare module 'store/slices/snackbar' {
  export const openSnackbar: any;
}

// ============================================================================
// Config
// ============================================================================

// Other legacy conveniences
declare module 'config' {
  const cfg: any;
  export default cfg;
}

// ============================================================================
// SDK Clients
// ============================================================================

// Stray SDK placeholder seen in legacy client
declare module '@sdk-js/core' {
  const sdk: any;
  export default sdk;
}

// ============================================================================
// Wildcard shims for large legacy trees
// Broad wildcards for deep legacy trees (ui-component, routes, etc.)
// ============================================================================

declare module 'ui-component/*' {
  const Any: any;
  export default Any;
}

declare module 'hooks/*' {
  const Any: any;
  export default Any;
}

declare module 'layouts/*' {
  const Any: any;
  export default Any;
}

declare module 'services/*' {
  const Any: any;
  export default Any;
}

declare module 'utils/*' {
  const Any: any;
  export default Any;
}

declare module 'constants/*' {
  const Any: any;
  export default Any;
}

// Provide named-exports-friendly shape to avoid TS2614 complaints
declare module 'types/*' {
  export const anything: any;
  const _default: any;
  export default _default;
}
