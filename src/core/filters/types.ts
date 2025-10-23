/**
 * Core Filters - Type Definitions
 *
 * TODO: Implement comprehensive filter types
 */

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterConfig {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'multi-select';
  options?: FilterOption[];
  defaultValue?: unknown;
}

export type FilterValues = Record<string, string | number | string[] | undefined>;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: FilterValues;
  sort?: SortParams;
}
