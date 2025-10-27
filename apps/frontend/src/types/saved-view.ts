export type AnalyticsFilters = {
  from?: string; // ISO date
  to?: string; // ISO date
  users?: string[];
  types?: Array<'call' | 'email' | 'meeting' | 'note' | 'task'>;
};

export interface SavedView {
  readonly id: string;
  readonly orgId: string;
  readonly userId: string | null;
  readonly name: string;
  readonly filters: AnalyticsFilters;
  readonly isDefault: boolean;
  readonly isShared: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
