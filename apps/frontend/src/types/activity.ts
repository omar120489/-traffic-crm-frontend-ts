// Activity Types
// Sprint 4: Activity Timeline

export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'task';

export interface Activity {
  readonly id: string;
  readonly type: ActivityType;
  readonly content: string;
  readonly entityType: 'contact' | 'deal' | 'company';
  readonly entityId: string;
  readonly userId: string;
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar?: string;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateActivityInput {
  readonly type: ActivityType;
  readonly content: string;
  readonly entityType: 'contact' | 'deal' | 'company';
  readonly entityId: string;
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

