import type { BaseEntity } from './base';
import type { EntityIdentifier } from './comment';

export interface Notification extends BaseEntity {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  userId?: EntityIdentifier;
  entityType?: string;
  entityId?: EntityIdentifier;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
}

export type NotificationCreateDto = Pick<
  Notification,
  'title' | 'message' | 'type' | 'entityType' | 'entityId'
>;

