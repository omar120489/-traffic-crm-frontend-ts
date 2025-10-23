import ky from 'ky';
import type { paths } from './types.gen';

/**
 * Minimal typed client using ky.
 * - baseUrl: core API base (e.g., http://localhost:3000/api)
 * - getToken: async function returning a Bearer token for Authorization
 */
export function createClient(opts: {
  baseUrl: string;
  getToken?: () => Promise<string | null> | string | null;
}) {
  const { baseUrl, getToken } = opts;

  const http = ky.create({
    prefixUrl: baseUrl.replace(/\/+$/, ''),
    hooks: {
      beforeRequest: [
        async (req) => {
          const tok = typeof getToken === 'function' ? await getToken() : getToken;
          if (tok) req.headers.set('Authorization', `Bearer ${tok}`);
          req.headers.set('Content-Type', 'application/json');
        }
      ]
    }
  });

  return {
    // Contacts
    listContacts: async (query?: any) =>
      http.get('contacts', { searchParams: query }).json() as Promise<any>,
    getContact: async (id: string) =>
      http.get(`contacts/${id}`).json() as Promise<any>,
    createContact: async (body: any) =>
      http.post('contacts', { json: body }).json() as Promise<any>,
    updateContact: async (id: string, body: any) =>
      http.patch(`contacts/${id}`, { json: body }).json() as Promise<any>,
    deleteContact: async (id: string) =>
      http.delete(`contacts/${id}`).json() as Promise<any>,

    // Leads
    listLeads: async (query?: any) =>
      http.get('leads', { searchParams: query }).json() as Promise<any>,
    getLead: async (id: string) =>
      http.get(`leads/${id}`).json() as Promise<any>,
    createLead: async (body: any) =>
      http.post('leads', { json: body }).json() as Promise<any>,
    updateLead: async (id: string, body: any) =>
      http.patch(`leads/${id}`, { json: body }).json() as Promise<any>,
    deleteLead: async (id: string) =>
      http.delete(`leads/${id}`).json() as Promise<any>,

    // Deals
    listDeals: async (query?: any) =>
      http.get('deals', { searchParams: query }).json() as Promise<any>,
    getDeal: async (id: string) =>
      http.get(`deals/${id}`).json() as Promise<any>,
    createDeal: async (body: any) =>
      http.post('deals', { json: body }).json() as Promise<any>,
    updateDeal: async (id: string, body: any) =>
      http.patch(`deals/${id}`, { json: body }).json() as Promise<any>,
    deleteDeal: async (id: string) =>
      http.delete(`deals/${id}`).json() as Promise<any>,

    // Companies
    listCompanies: async (query?: any) =>
      http.get('companies', { searchParams: query }).json() as Promise<any>,
    getCompany: async (id: string) =>
      http.get(`companies/${id}`).json() as Promise<any>,
    createCompany: async (body: any) =>
      http.post('companies', { json: body }).json() as Promise<any>,
    updateCompany: async (id: string, body: any) =>
      http.patch(`companies/${id}`, { json: body }).json() as Promise<any>,
    deleteCompany: async (id: string) =>
      http.delete(`companies/${id}`).json() as Promise<any>,
  };
}
