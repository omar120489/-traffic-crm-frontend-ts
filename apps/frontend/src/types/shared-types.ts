/**
 * Temporary shim for the removed `@traffic-crm/shared-types` package.
 * Re-export the active frontend types so existing imports keep working.
 */
export type {
  PaginatedResponse,
  PaginatedCompanies,
  PaginatedContacts,
  PaginatedDeals,
  PaginatedLeads,
  Company,
  CompanyQuery,
  Contact,
  ContactQuery,
  Deal,
  DealQuery,
  Lead,
  LeadQuery,
  CompanyCreateDto,
  CompanyUpdateDto,
  ContactCreateDto,
  ContactUpdateDto,
  DealCreateDto,
  DealUpdateDto,
  LeadCreateDto,
  LeadUpdateDto,
  ApiResponse,
  UUID
} from './api';

export type { CompanyStats, CompanyContact, CompanyDeal, CompanySummary } from './company';
