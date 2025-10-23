import type { ISODateString } from './base';

export interface PnLRow {
  utm_source?: string | null;
  utm_campaign?: string | null;
  ad_id?: string | null;
  leads_count: number;
  deals_count: number;
  gross_revenue: number;
  direct_cost: number;
  net_profit: number;
  roas: number; // Return on Ad Spend
  cpa: number; // Cost Per Acquisition
}

export interface PnLSummary {
  total_leads: number;
  total_deals: number;
  total_gross_revenue: number;
  total_direct_cost: number;
  total_net_profit: number;
  average_roas: number;
  average_cpa: number;
}

export interface PnLResponse {
  summary: PnLSummary;
  rows: PnLRow[];
  filters_applied: {
    utm_source?: string;
    utm_campaign?: string;
    ad_id?: string;
    date_from?: ISODateString;
    date_to?: ISODateString;
  };
}

export interface PnLQuery {
  utm_source?: string;
  utm_campaign?: string;
  ad_id?: string;
  date_from?: ISODateString;
  date_to?: ISODateString;
  group_by?: 'utm_source' | 'utm_campaign' | 'ad_id';
}

