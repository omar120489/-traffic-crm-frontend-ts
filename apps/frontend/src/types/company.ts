export interface Company {
  readonly id: string;
  readonly name: string;
  readonly industry?: string;
  readonly website?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface CompanyStats {
  readonly contacts: number;
  readonly activeDeals: number;
  readonly wonRevenue: number; // cents
  readonly wonRevenueLast90d?: number;
}

export interface CompanyContact {
  readonly id: string;
  readonly name: string;
  readonly title?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly lastActivityAt?: string;
}

export interface CompanyDeal {
  readonly id: string;
  readonly name: string;
  readonly amount: number; // cents
  readonly stageId: string;
  readonly stageName?: string;
  readonly ownerName?: string;
  readonly updatedAt?: string;
}

export interface CompanySummary {
  readonly company: Company;
  readonly stats: CompanyStats;
  readonly recentDeals: readonly CompanyDeal[];
  readonly contacts: readonly CompanyContact[];
}

