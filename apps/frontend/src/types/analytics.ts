export type DateISO = string;

export interface AnalyticsFilters {
  readonly from: DateISO;
  readonly to: DateISO;
  readonly users?: readonly string[];
  readonly types?: readonly ('call' | 'email' | 'meeting' | 'note' | 'task')[];
}

export interface Kpis {
  readonly totalActivities: number;
  readonly activeUsers: number;
  readonly avgDailyActivities: number;
  readonly medianTimeToFirstResponseMs: number;
}

export interface TimeBucket {
  readonly date: DateISO; // yyyy-mm-dd
  readonly count: number;
}

export interface ActivityMix {
  readonly type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  readonly count: number;
  readonly percent: number;
}

export interface Contributor {
  readonly userId: string;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly count: number;
}

export interface AnalyticsResponse {
  readonly kpis: Kpis;
  readonly byDay: readonly TimeBucket[];
  readonly mix: readonly ActivityMix[];
  readonly topContributors: readonly Contributor[];
}
