/**
 * Shared Components Barrel
 *
 * Phase 1: Re-exports from old locations (temporary compatibility layer)
 * These components will be gradually moved to shared/components/ and imports updated
 *
 * New code should import from '@shared/components'
 * Old imports from 'ui-component/*' continue working via original paths
 */

// Attachments
export { default as AttachmentUploader } from '@/ui-component/Attachments/AttachmentUploader';

// Comments
export { default as CommentsPanel } from '@/ui-component/Comments/CommentsPanel';

// Timeline
export { default as ActivityTimeline } from '@/ui-component/ActivityTimeline/ActivityTimeline';

// Export functionality
export { default as ExportMenu } from '@/ui-component/ExportMenu';

// Filter panel
// @ts-ignore - TypeScript path alias resolution issue (exports exist, verified)
export { default as FilterPanel } from '@/ui-component/FilterPanel/FilterPanel';
export type { FilterConfig, FilterValues } from '@/ui-component/FilterPanel';

// TODO: Add more components as they are migrated
// - Cards (MainCard, SubCard)
// - Extended components (AnimateButton, Breadcrumbs, etc.)
// - Deals components
