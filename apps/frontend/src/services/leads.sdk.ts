import { api } from '@/data/clients/sdk';
import { getAttributionPayload, markAttributionSent } from '@/utils/attribution';
import type {
  Lead,
  LeadCreateDto,
  LeadQuery,
  LeadUpdateDto,
  PaginatedLeads,
  UUID,
  ApiResponse
} from '@traffic-crm/shared-types';

export async function listLeads(query?: LeadQuery): Promise<PaginatedLeads> {
  return api.listLeads(query);
}

export async function getLead(id: UUID): Promise<Lead> {
  return api.getLead(id);
}

export async function createLead(payload: LeadCreateDto): Promise<Lead> {
  // Preserve attribution tracking logic
  const attribution = getAttributionPayload();
  const finalPayload = attribution ? { ...payload, attribution } : payload;

  const response = await api.createLead(finalPayload);

  if (attribution) {
    markAttributionSent();
    // Intentionally silent in production and development to avoid noisy logs
  }

  return response;
}

export async function updateLead(id: UUID, payload: LeadUpdateDto): Promise<Lead> {
  return api.updateLead(id, payload);
}

export async function deleteLead(id: UUID): Promise<ApiResponse<void>> {
  return api.deleteLead(id);
}

export const leadsApi = {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
};
