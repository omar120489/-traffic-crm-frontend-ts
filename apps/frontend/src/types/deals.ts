/**
 * Deal/Pipeline type definitions for Kanban board
 * Sprint 3: FE-KANBAN-01
 */

export interface Deal {
  readonly id: string;
  readonly name: string;
  readonly amountCents: number;
  readonly stageId: string;
  readonly position: number; // 0-based within stage
  readonly companyId?: string;
  readonly companyName?: string;
  readonly contactId?: string;
  readonly contactName?: string;
  readonly ownerId?: string;
  readonly ownerName?: string;
  readonly tags?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Stage {
  readonly id: string;
  readonly name: string;
  readonly pipelineId: string;
  readonly order: number; // column ordering
  readonly color?: string;
}

export interface Pipeline {
  readonly id: string;
  readonly name: string;
  readonly stages: readonly Stage[];
  readonly orgId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MoveDealPayload {
  readonly stageId: string;
  readonly position: number;
}

export interface MoveDealResponse extends Deal {}
