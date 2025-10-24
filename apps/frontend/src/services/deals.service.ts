/**
 * Deals API service
 * Sprint 3: FE-KANBAN-01
 */

import { http } from '@/lib/http';
import type { Deal, Pipeline, MoveDealPayload, MoveDealResponse, DealFilters } from '@/types/deals';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get all pipelines for an organization
 */
export async function getPipelines(orgId: string): Promise<readonly Pipeline[]> {
  const url = new URL(`${API_BASE}/api/pipelines`);
  url.searchParams.set('orgId', orgId);
  return http<Pipeline[]>(url.toString());
}

/**
 * Get deals by pipeline ID with optional filters
 */
export async function getDealsByPipeline(
  pipelineId: string,
  filters?: DealFilters
): Promise<readonly Deal[]> {
  const url = new URL(`${API_BASE}/api/deals`);
  url.searchParams.set('pipelineId', pipelineId);
  
  // Add owner filters
  if (filters?.ownerIds && filters.ownerIds.length > 0) {
    filters.ownerIds.forEach((id) => url.searchParams.append('owner', id));
  }
  
  // Add tag filters
  if (filters?.tagIds && filters.tagIds.length > 0) {
    filters.tagIds.forEach((id) => url.searchParams.append('tag', id));
  }
  
  // Add search query
  if (filters?.q && filters.q.trim()) {
    url.searchParams.set('q', filters.q.trim());
  }
  
  return http<Deal[]>(url.toString());
}

/**
 * Move a deal to a different stage/position
 * Used for drag & drop reordering
 */
export async function moveDeal(
  dealId: string,
  payload: MoveDealPayload
): Promise<MoveDealResponse> {
  return http<MoveDealResponse>(`${API_BASE}/api/deals/${dealId}/move`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/**
 * Get a single deal by ID
 */
export async function getDealById(dealId: string): Promise<Deal> {
  return http<Deal>(`${API_BASE}/api/deals/${dealId}`);
}

/**
 * Create a new deal
 */
export async function createDeal(
  payload: Partial<Pick<Deal, 'name' | 'amountCents' | 'stageId' | 'companyId' | 'contactId' | 'ownerId'>>
): Promise<Deal> {
  return http<Deal>(`${API_BASE}/api/deals`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Update a deal
 */
export async function updateDeal(
  dealId: string,
  payload: Partial<Pick<Deal, 'name' | 'amountCents' | 'stageId' | 'companyId' | 'contactId' | 'ownerId'>>
): Promise<Deal> {
  return http<Deal>(`${API_BASE}/api/deals/${dealId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a deal
 */
export async function deleteDeal(dealId: string): Promise<void> {
  await http<void>(`${API_BASE}/api/deals/${dealId}`, {
    method: 'DELETE',
  });
}
