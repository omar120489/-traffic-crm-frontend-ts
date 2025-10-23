/**
 * Unified ID type for UI layer
 * Backend may send number or string; UI normalizes to string for consistency
 */
export type EntityId = string;

/**
 * Helper to coerce backend IDs to UI string format
 */
export function asId(input: string | number | null | undefined): string {
  return input != null ? String(input) : '';
}
