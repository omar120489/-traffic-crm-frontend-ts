import type { BaseEntity, UUID, PaginationQuery, PaginatedResponse } from './base';

export interface Company extends BaseEntity {
  name: string;
  domain?: string | null;
  industry?: string | null;
  size?: string | null;
  ownerId: UUID;
}

export interface CompanyQuery extends PaginationQuery {
  ownerId?: UUID;
  industry?: string | null;
  companySize?: string | null;
}

export type CompanyCreateDto = Pick<Company, 'name' | 'ownerId'> &
  Partial<Pick<Company, 'domain' | 'industry' | 'size'>>;

export type CompanyUpdateDto = Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaginatedCompanies = PaginatedResponse<Company>;

