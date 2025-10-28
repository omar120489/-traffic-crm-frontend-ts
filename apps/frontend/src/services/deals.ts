import { apiDelete, apiGet, apiPatch, apiPost } from '@data/clients/axios';
import type {
  Deal,
  DealCreateDto,
  DealQuery,
  DealUpdateDto,
  PaginatedDeals,
  UUID,
  ApiResponse
} from '@traffic-crm/shared-types';

const BASE_PATH = '/api/deals';

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

type DealDto = Partial<{
  id: UUID;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  name: string;
  amount: number;
  stage: string;
  status: string;
  ownerId: UUID;
  owner_id: UUID;
  companyId: UUID;
  company_id: UUID;
  contactId: UUID;
  contact_id: UUID;
  closeDate: string | null;
  close_date: string | null;
  probability: number;
  description: string | null;
  grossRevenue: number | null;
  gross_revenue: number | null;
  directCost: number | null;
  direct_cost: number | null;
  netProfit: number | null;
  net_profit: number | null;
  lossReason: string | null;
  loss_reason: string | null;
  lossNotes: string | null;
  loss_notes: string | null;
}>;

function fromDealDto(dto: DealDto): Deal {
  return {
    id: dto.id as UUID,
    createdAt: (dto.createdAt || dto.created_at) as string,
    updatedAt: (dto.updatedAt || dto.updated_at) as string,
    name: dto.name as string,
    amount: dto.amount as number,
    stage: dto.stage as string,
    status: dto.status as string,
    ownerId: (dto.ownerId || dto.owner_id) as UUID,
    companyId: (dto.companyId || dto.company_id) as UUID,
    contactId: (dto.contactId || dto.contact_id) as UUID,
    closeDate: (dto.closeDate || dto.close_date) as string | null,
    probability: dto.probability as number,
    description: (dto.description ?? null) as string | null,
    grossRevenue: (dto.grossRevenue ?? dto.gross_revenue ?? null) as number | null,
    directCost: (dto.directCost ?? dto.direct_cost ?? null) as number | null,
    netProfit: (dto.netProfit ?? dto.net_profit ?? null) as number | null,
    lossReason: (dto.lossReason ?? dto.loss_reason ?? null) as string | null,
    lossNotes: (dto.lossNotes ?? dto.loss_notes ?? null) as string | null
  };
}

export async function listDeals(query?: DealQuery): Promise<PaginatedDeals> {
  const response = await apiGet<PaginatedDeals>(BASE_PATH, { params: query });
  return {
    ...response,
    items: response.items.map(fromDealDto)
  };
}

export async function getDeal(id: UUID): Promise<Deal> {
  const response = await apiGet<DealDto>(`${BASE_PATH}/${id}`);
  return fromDealDto(response);
}

export async function createDeal(payload: DealCreateDto): Promise<Deal> {
  const response = await apiPost<DealCreateDto, DealDto>(BASE_PATH, payload);
  return fromDealDto(response);
}

export async function updateDeal(id: UUID, payload: DealUpdateDto): Promise<Deal> {
  const mappedPayload = toDealUpdateDto(payload);
  const response = await apiPatch<Record<string, unknown>, DealDto>(
    `${BASE_PATH}/${id}`,
    mappedPayload
  );
  return fromDealDto(response);
}

export async function deleteDeal(id: UUID): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

export const dealsApi = {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal
};
