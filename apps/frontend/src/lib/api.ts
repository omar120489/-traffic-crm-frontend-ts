/**
 * Centralized API client
 * Single source of truth for all API calls
 * 
 * Usage:
 *   import { api } from '@/lib/api';
 *   const contacts = await api.listContacts({ page: 1, size: 20 });
 */
import { createClient } from '@traffic-crm/sdk-js';

export const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  getToken: () => localStorage.getItem('access_token') ?? '',
});

// Re-export for convenience
// export type { ApiClient } from '@traffic-crm/sdk-js';


