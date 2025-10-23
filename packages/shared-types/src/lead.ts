import type { BaseEntity, UUID, ISODateString, PaginationQuery, PaginatedResponse } from './base';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Working'
  | 'Unqualified'
  | 'Converted'
  | (string & {});

export type LeadSource =
  | 'Web'
  | 'Referral'
  | 'Email'
  | 'Phone'
  | 'Event'
  | 'Social'
  | (string & {});

export interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: LeadStatus;
  source?: LeadSource | null;
  ownerId: UUID;
  company?: string | null;
  score?: number | null;
  notes?: string | null;
}

export interface LeadQuery extends PaginationQuery {
  status?: LeadStatus;
  source?: LeadSource;
  ownerId?: UUID;
  search?: string;
  date_from?: string;
  date_to?: string;
  score_min?: number;
  score_max?: number;
  statuses?: string;
  sources?: string;
}

export interface AttributionData {
  uti: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  platform: {
    ad_id?: string;
    adset_id?: string;
    campaign_id?: string;
  };
  captured_at: string;
}

export type LeadCreateDto = Pick<Lead, 'firstName' | 'lastName' | 'email' | 'status' | 'ownerId'> &
  Partial<Pick<Lead, 'phone' | 'source' | 'company' | 'score' | 'notes'>> & {
    attribution?: AttributionData;
  };

export type LeadUpdateDto = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaginatedLeads = PaginatedResponse<Lead>;

