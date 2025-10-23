import type { BaseEntity, UUID, ISODateString } from './base';

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note' | (string & {});

export interface Activity extends BaseEntity {
  type: ActivityType;
  subject: string;
  description?: string | null;
  dueDate?: ISODateString | null;
  completedAt?: ISODateString | null;
  ownerId: UUID;
  leadId?: UUID | null;
  dealId?: UUID | null;
  contactId?: UUID | null;
}

