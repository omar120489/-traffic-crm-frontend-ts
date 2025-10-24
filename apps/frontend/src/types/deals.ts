/**
 * Deal types for Kanban board and deal management
 * Sprint 3: Auth-in, Kanban, Company 360
 */

export type DealStatus = 'OPEN' | 'WON' | 'LOST';

export interface Deal {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
  readonly stageId: string;
  readonly position: number; // 0-based within a stage
  readonly status: DealStatus;
  readonly companyId?: string;
  readonly ownerId?: string;
  readonly tags?: readonly string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
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
  readonly isDefault: boolean;
  readonly stages: readonly Stage[];
}

export interface MoveDealPayload {
  readonly stageId: string;
  readonly position: number;
}

