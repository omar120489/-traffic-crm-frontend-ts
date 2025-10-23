/**
 * Base types for all domain entities
 */

export type UUID = string;
export type ISODateString = string;
export type SortDirection = 'asc' | 'desc';

export interface BaseEntity {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PaginationQuery {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  filters?: Record<string, unknown>;
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

