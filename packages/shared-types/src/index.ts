/**
 * Shared types package for Traffic CRM
 * Single source of truth for domain models across frontend and backend services
 */

// Base types
export * from './base';

// Domain models
export * from './contact';
export * from './lead';
export * from './deal';
export * from './company';
export * from './activity';

// Shared entities
export * from './comment';
export * from './attachment';
export * from './notification';
export * from './journey';

// Analytics
export * from './pnl';

// Utilities
export type EntityId = string;

/**
 * Helper to coerce backend IDs to UI string format
 */
export function asId(input: string | number | null | undefined): string {
  return input != null ? String(input) : '';
}

// Legacy compatibility
export type Paginated<T> = { 
  data: T[]; 
  total: number; 
  page: number; 
  pageSize: number; 
};
