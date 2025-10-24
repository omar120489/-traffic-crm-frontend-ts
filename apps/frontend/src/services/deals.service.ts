/**
 * Deals API service
 * Sprint 3: FE-KANBAN-01
 */

import { http } from '@/lib/http';
import type { Deal, Pipeline, MoveDealPayload, MoveDealResponse } from '@/types/deals';

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
 * Get deals by pipeline ID
 */
export async function getDealsByPipeline(
  pipelineId: string,
  filters?: {
    readonly ownerId?: string;
    readonly tags?: readonly string[];
    readonly search?: string;
  }
): Promise<readonly Deal[]> {
  const url = new URL(`${API_BASE}/api/deals`);
  url.searchParams.set('pipelineId', pipelineId);
  
  if (filters?.ownerId) {
    url.searchParams.set('ownerId', filters.ownerId);
  }
  if (filters?.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag) => url.searchParams.append('tags', tag));
  }
  if (filters?.search) {
    url.searchParams.set('search', filters.search);
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
