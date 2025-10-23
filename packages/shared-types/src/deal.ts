import type { BaseEntity, UUID, ISODateString, PaginationQuery, PaginatedResponse } from './base';

export type DealStage =
  | 'Prospecting'
  | 'Qualification'
  | 'Discovery'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost'
  | (string & {});

export type DealStatus = 'Open' | 'Won' | 'Lost' | 'On Hold' | (string & {});

export interface Deal extends BaseEntity {
  name: string;
  amount: number;
  stage: DealStage;
  status: DealStatus;
  ownerId: UUID;
  companyId?: UUID | null;
  contactId?: UUID | null;
  closeDate?: ISODateString | null;
  probability?: number | null;
  description?: string | null;
  grossRevenue?: number | null;
  directCost?: number | null;
  netProfit?: number | null;
  lossReason?: string | null;
  lossNotes?: string | null;
}

export interface DealQuery extends PaginationQuery {
  stage?: DealStage;
  status?: DealStatus;
  ownerId?: UUID;
  companyId?: UUID;
  search?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  statuses?: string;
  stages?: string;
}

export type DealCreateDto = Pick<Deal, 'name' | 'amount' | 'stage' | 'status' | 'ownerId'> &
  Partial<Pick<Deal, 'companyId' | 'contactId' | 'closeDate' | 'probability' | 'description'>>;

export type DealUpdateDto = Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaginatedDeals = PaginatedResponse<Deal>;

