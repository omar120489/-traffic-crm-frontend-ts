import type { ISODateString } from './base';
import type { EntityIdentifier } from './comment';

export interface Attachment {
  id: number | string;
  filename: string;
  fileSize?: number;
  contentType?: string | null;
  entityType?: string;
  entityId?: EntityIdentifier;
  path: string;
  createdAt: ISODateString;
}

export type AttachmentListResponse = Attachment[];

