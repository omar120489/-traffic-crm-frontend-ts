import { SavedView, AnalyticsFilters } from '../types/saved-view';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const BASE = `${API}/api/saved-views`;

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const resp = await fetch(input, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return resp.json() as Promise<T>;
}

export type SavedViewList = {
  personal: SavedView[];
  default: SavedView[];
};

export const SavedViewsService = {
  list(): Promise<SavedViewList> {
    return http<SavedViewList>(BASE);
  },
  get(id: string): Promise<SavedView> {
    return http<SavedView>(`${BASE}/${id}`);
  },
  create(payload: {
    name: string;
    filters: AnalyticsFilters;
    isDefault?: boolean;
    isShared?: boolean;
  }): Promise<SavedView> {
    return http<SavedView>(BASE, { method: 'POST', body: JSON.stringify(payload) });
  },
  update(
    id: string,
    payload: Partial<Pick<SavedView, 'name' | 'filters' | 'isDefault' | 'isShared'>>
  ): Promise<SavedView> {
    return http<SavedView>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  remove(id: string): Promise<{ success: boolean }> {
    return http<{ success: boolean }>(`${BASE}/${id}`, { method: 'DELETE' });
  }
};
