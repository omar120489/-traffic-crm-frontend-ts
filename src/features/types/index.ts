/**
 * Shared types for feature modules
 * Temporary unifying barrel - refactor to domain-specific modules over time
 */

export type Json = Record<string, unknown> | any[];
export type ID = string;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface SearchQuery {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Chat types
export interface Room {
  id: ID;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: ID;
  roomId: ID;
  userId: ID;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

// Re-export commonly used types
export type { EntityId } from '../../types/ids';
