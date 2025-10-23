import { api } from '@/data/clients/sdk';
import type {
  Company,
  CompanyCreateDto,
  CompanyQuery,
  CompanyUpdateDto,
  PaginatedCompanies,
  UUID,
  ApiResponse,
} from '@shared-types';

export async function listCompanies(query?: CompanyQuery): Promise<PaginatedCompanies> {
  return api.listCompanies(query);
}

export async function getCompany(id: UUID): Promise<Company> {
  return api.getCompany(id);
}

export async function createCompany(payload: CompanyCreateDto): Promise<Company> {
  return api.createCompany(payload);
}

export async function updateCompany(id: UUID, payload: CompanyUpdateDto): Promise<Company> {
  return api.updateCompany(id, payload);
}

export async function deleteCompany(id: UUID): Promise<ApiResponse<void>> {
  return api.deleteCompany(id);
}

export const companiesApi = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};

