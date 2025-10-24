/**
 * Deals API service
 * Sprint 3: Kanban board operations
 */

import { api } from '@/lib/api';
import type { Deal, Pipeline, MoveDealPayload } from '@/types/deals';

export async function getPipelines(orgId: string): Promise<Pipeline[]> {
  return api.pipelines.list(orgId);
}

export async function getDealsByPipeline(pipelineId: string): Promise<Deal[]> {
  // TODO: Update SDK to support pipelineId filter
  // For now, fetch all deals and filter client-side
  const allDeals = await api.deals.list();
  return allDeals.filter((d: Deal) => {
    // Assuming deals have a pipelineId through their stage
    return true; // Placeholder - needs backend support
  });
}

export async function moveDeal(
  dealId: string,
  payload: MoveDealPayload
): Promise<Deal> {
  // TODO: Add to SDK
  const response = await fetch(`/api/deals/${dealId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to move deal: ${response.statusText}`);
  }

  return response.json();
}

