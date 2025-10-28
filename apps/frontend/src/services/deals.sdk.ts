import { api } from '@/data/clients/sdk';
import type {
  Deal,
  DealCreateDto,
  DealQuery,
  DealUpdateDto,
  PaginatedDeals,
  UUID,
  ApiResponse
} from '@traffic-crm/shared-types';

// Helper to map camelCase to snake_case for backend compatibility
function toDealUpdateDto(payload: DealUpdateDto): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (payload.name !== undefined) out.name = payload.name;
  if (payload.amount !== undefined) out.amount = payload.amount;
  if (payload.stage !== undefined) out.stage = payload.stage;
  if (payload.status !== undefined) out.status = payload.status;
  if (payload.ownerId !== undefined) out.ownerId = payload.ownerId;
  if (payload.companyId !== undefined) out.companyId = payload.companyId;
  if (payload.contactId !== undefined) out.contactId = payload.contactId;
  if (payload.closeDate !== undefined) out.closeDate = payload.closeDate;
  if (payload.probability !== undefined) out.probability = payload.probability;
  if (payload.description !== undefined) out.description = payload.description;
  if (payload.grossRevenue !== undefined) out.gross_revenue = payload.grossRevenue;
  if (payload.directCost !== undefined) out.direct_cost = payload.directCost;
  if (payload.lossReason !== undefined) out.loss_reason = payload.lossReason;
  if (payload.lossNotes !== undefined) out.loss_notes = payload.lossNotes;
  return out;
}

// Helper to normalize backend response to frontend format
function fromDealDto(dto: Record<string, unknown>): Deal {
  const get = <T>(key: string): T | undefined => dto[key] as T | undefined;
  return {
    id: get<string>('id')!,
    createdAt: get<string>('createdAt') ?? get<string>('created_at')!,
    updatedAt: get<string>('updatedAt') ?? get<string>('updated_at')!,
    name: get<string>('name')!,
    amount: get<number>('amount')!,
    stage: get<string>('stage')!,
    status: get<string>('status')!,
    ownerId: get<string>('ownerId') ?? get<string>('owner_id')!,
    companyId: get<string>('companyId') ?? get<string>('company_id') ?? null,
    contactId: get<string>('contactId') ?? get<string>('contact_id') ?? null,
    closeDate: get<string>('closeDate') ?? get<string>('close_date') ?? null,
    probability: get<number>('probability') ?? null,
    description: get<string>('description') ?? null,
    grossRevenue: get<number>('grossRevenue') ?? get<number>('gross_revenue') ?? null,
    directCost: get<number>('directCost') ?? get<number>('direct_cost') ?? null,
    netProfit: get<number>('netProfit') ?? get<number>('net_profit') ?? null,
    lossReason: get<string>('lossReason') ?? get<string>('loss_reason') ?? null,
    lossNotes: get<string>('lossNotes') ?? get<string>('loss_notes') ?? null
  };
}

export async function listDeals(query?: DealQuery): Promise<PaginatedDeals> {
  const response = await api.listDeals(query);
  return {
    ...response,
    items: response.items.map(fromDealDto)
  };
}

export async function getDeal(id: UUID): Promise<Deal> {
  const response = await api.getDeal(id);
  return fromDealDto(response);
}

export async function createDeal(payload: DealCreateDto): Promise<Deal> {
  const response = await api.createDeal(payload);
  return fromDealDto(response);
}

export async function updateDeal(id: UUID, payload: DealUpdateDto): Promise<Deal> {
  const mappedPayload = toDealUpdateDto(payload);
  const response = await api.updateDeal(id, mappedPayload);
  return fromDealDto(response);
}

export async function deleteDeal(id: UUID): Promise<ApiResponse<void>> {
  return api.deleteDeal(id);
}

export const dealsApi = {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal
};
