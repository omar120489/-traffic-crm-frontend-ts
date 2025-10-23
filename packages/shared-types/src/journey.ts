import type { BaseEntity, ISODateString } from './base';
import type { EntityIdentifier } from './comment';

export type JourneyEventType =
  | 'status_change'
  | 'first_quote_sent'
  | 'message_sent'
  | 'agent_handoff'
  | 'deal_created'
  | 'deal_won'
  | 'deal_lost'
  | 'lead_created'
  | 'lead_converted'
  | (string & {});

export interface JourneyEvent extends BaseEntity {
  entityType: 'deal' | 'lead';
  entityId: EntityIdentifier;
  type: JourneyEventType;
  payload?: Record<string, unknown>;
  occurredAt: ISODateString;
}

export interface JourneyEventCreateDto {
  entityType: 'deal' | 'lead';
  entityId: EntityIdentifier;
  type: JourneyEventType;
  payload?: Record<string, unknown>;
  occurredAt?: ISODateString;
}

export interface JourneyEventListResponse {
  items: JourneyEvent[];
  total: number;
}

