import { apiDelete, apiGet, apiPatch, apiPost } from '@data/clients/axios';
import type {
  Contact,
  ContactCreateDto,
  ContactQuery,
  ContactUpdateDto,
  PaginatedContacts,
  UUID,
  ApiResponse,
} from '@shared-types';

const BASE_PATH = '/api/contacts';

export async function listContacts(query?: ContactQuery): Promise<PaginatedContacts> {
  return apiGet<PaginatedContacts>(BASE_PATH, { params: query });
}

export async function getContact(id: UUID): Promise<Contact> {
  return apiGet<Contact>(`${BASE_PATH}/${id}`);
}

export async function createContact(payload: ContactCreateDto): Promise<Contact> {
  return apiPost<ContactCreateDto, Contact>(BASE_PATH, payload);
}

export async function updateContact(id: UUID, payload: ContactUpdateDto): Promise<Contact> {
  return apiPatch<ContactUpdateDto, Contact>(`${BASE_PATH}/${id}`, payload);
}

export async function deleteContact(id: UUID): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

export const contactsApi = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
