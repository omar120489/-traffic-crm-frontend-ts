import { http } from '../lib/http';
import type { Company, CompanySummary, CompanyContact, CompanyDeal } from '../types/company';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getCompanySummary(companyId: string): Promise<CompanySummary> {
  return http<CompanySummary>(`${API_BASE}/api/companies/${companyId}/summary`);
}

export async function getCompany(companyId: string): Promise<Company> {
  return http<Company>(`${API_BASE}/api/companies/${companyId}`);
}

export async function getCompanyContacts(companyId: string): Promise<readonly CompanyContact[]> {
  return http<readonly CompanyContact[]>(`${API_BASE}/api/companies/${companyId}/contacts`);
}

export async function getCompanyDeals(companyId: string): Promise<readonly CompanyDeal[]> {
  return http<readonly CompanyDeal[]>(`${API_BASE}/api/companies/${companyId}/deals`);
}
