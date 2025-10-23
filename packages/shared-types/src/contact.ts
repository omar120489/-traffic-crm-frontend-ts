import type { BaseEntity, UUID, PaginationQuery, PaginatedResponse } from './base';

export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  title?: string | null;
  companyId?: UUID | null;
  ownerId: UUID;
}

export interface ContactQuery extends PaginationQuery {
  ownerId?: UUID;
  companyId?: UUID;
}

export type ContactCreateDto = Pick<Contact, 'firstName' | 'lastName' | 'email' | 'ownerId'> &
  Partial<Pick<Contact, 'phone' | 'title' | 'companyId'>>;

export type ContactUpdateDto = Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaginatedContacts = PaginatedResponse<Contact>;

