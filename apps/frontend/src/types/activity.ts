// Activity Types
// Sprint 4: Activity Timeline

export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'task';

export interface Activity {
  readonly id: string;
  readonly type: ActivityType;
  readonly content?: string;
  readonly title?: string;
  readonly notes?: string;
  readonly dueAt?: string;
  readonly entityType: 'contact' | 'deal' | 'company';
  readonly entityId: string;
  readonly userId?: string;
  readonly user?: {
    readonly id: string;
    readonly name: string;
    readonly email?: string;
    readonly avatar?: string;
  };
  readonly createdBy?: {
    readonly id: string;
    readonly name: string;
    readonly avatarUrl?: string;
  };
  readonly participants?: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email?: string;
  }>;
  readonly entity?: 'contact' | 'deal' | 'company';
  readonly createdAt: string;
  readonly updatedAt?: string;
}

export interface CreateActivityInput {
  readonly type: ActivityType;
  readonly content?: string;
  readonly title?: string;
  readonly notes?: string;
  readonly dueAt?: string;
  readonly participants?: readonly string[];
  readonly entityType?: 'contact' | 'deal' | 'company';
  readonly entityId?: string;
  readonly entity?: 'contact' | 'deal' | 'company';
}

export interface UpdateActivityInput {
  readonly content?: string;
  readonly type?: ActivityType;
}

export interface ActivityFilters {
  readonly types?: readonly ActivityType[];
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly userId?: string;
  readonly search?: string;
}

export interface ActivityListResponse {
  readonly activities: readonly Activity[];
  readonly total: number;
  readonly hasMore: boolean;
  readonly cursor?: string;
}

