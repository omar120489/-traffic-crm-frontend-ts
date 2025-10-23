import type { UUID, ISODateString } from './base';

/**
 * Unified ID type for UI layer
 * Backend may send number or string; UI normalizes to string for consistency
 */
export type EntityIdentifier = string;

export interface Comment {
  id: number | string;
  entityType: string;
  entityId: EntityIdentifier;
  content: string;
  mentions?: UUID[];
  authorId?: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CommentCreateDto {
  entityType: string;
  entityId: EntityIdentifier;
  content: string;
  mentions?: UUID[];
}

export interface CommentUpdateDto {
  content?: string;
  mentions?: UUID[];
}

export interface CommentListResponse {
  items: Comment[];
  total: number;
}

