import ky from 'ky';
import type { paths } from './types.gen';

/**
 * Type-safe API client generated from OpenAPI spec
 * 
 * Usage:
 *   const api = createApiClient({ baseUrl: 'http://localhost:3000', token: 'xxx' });
 *   const contacts = await api.get('/contacts', { searchParams: { page: 1, size: 20 } });
 */

export interface ApiClientConfig {
  baseUrl: string;
  token?: string;
  onError?: (error: Error) => void;
}

export function createApiClient(config: ApiClientConfig) {
  const client = ky.create({
    prefixUrl: config.baseUrl,
    headers: config.token ? { Authorization: `Bearer ${config.token}` } : {},
    hooks: {
      afterResponse: [
        async (_request, _options, response) => {
          if (!response.ok && config.onError) {
            const error = new Error(`API Error: ${response.status} ${response.statusText}`);
            config.onError(error);
          }
        },
      ],
    },
  });

  return {
    // Contacts
    contacts: {
      list: (params?: { page?: number; size?: number; q?: string }) =>
        client.get('contacts', { searchParams: params as any }).json<any>(),
      get: (id: string) => client.get(`contacts/${id}`).json<any>(),
      create: (data: any) => client.post('contacts', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`contacts/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`contacts/${id}`).json<any>(),
    },

    // Companies
    companies: {
      list: (params?: { page?: number; size?: number; q?: string }) =>
        client.get('companies', { searchParams: params as any }).json<any>(),
      get: (id: string) => client.get(`companies/${id}`).json<any>(),
      create: (data: any) => client.post('companies', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`companies/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`companies/${id}`).json<any>(),
    },

    // Leads
    leads: {
      list: (params?: { page?: number; size?: number; status?: string }) =>
        client.get('leads', { searchParams: params as any }).json<any>(),
      get: (id: string) => client.get(`leads/${id}`).json<any>(),
      create: (data: any) => client.post('leads', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`leads/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`leads/${id}`).json<any>(),
    },

    // Deals
    deals: {
      list: (params?: { page?: number; size?: number; stageId?: string }) =>
        client.get('deals', { searchParams: params as any }).json<any>(),
      get: (id: string) => client.get(`deals/${id}`).json<any>(),
      create: (data: any) => client.post('deals', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`deals/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`deals/${id}`).json<any>(),
    },

    // Pipelines
    pipelines: {
      list: (orgId: string) => client.get('pipelines', { searchParams: { orgId } }).json<any>(),
      get: (id: string) => client.get(`pipelines/${id}`).json<any>(),
      create: (data: any) => client.post('pipelines', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`pipelines/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`pipelines/${id}`).json<any>(),
    },

    // Stages
    stages: {
      list: (pipelineId: string) => client.get('stages', { searchParams: { pipelineId } }).json<any>(),
      create: (data: any) => client.post('stages', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`stages/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`stages/${id}`).json<any>(),
      reorder: (pipelineId: string, stageIds: string[]) =>
        client.put('stages/reorder', { json: { pipelineId, stageIds } }).json<any>(),
    },

    // Activities
    activities: {
      list: (entityType: string, entityId: string) =>
        client.get('activities', { searchParams: { entityType, entityId } }).json<any>(),
      get: (id: string) => client.get(`activities/${id}`).json<any>(),
      create: (data: any) => client.post('activities', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`activities/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`activities/${id}`).json<any>(),
    },

    // Tags
    tags: {
      list: (orgId: string) => client.get('tags', { searchParams: { orgId } }).json<any>(),
      create: (data: any) => client.post('tags', { json: data }).json<any>(),
      update: (id: string, data: any) => client.put(`tags/${id}`, { json: data }).json<any>(),
      delete: (id: string) => client.delete(`tags/${id}`).json<any>(),
      assign: (data: { tagId: string; entityType: string; entityId: string }) =>
        client.post('tags/assign', { json: data }).json<any>(),
      unassign: (assignmentId: string) => client.delete(`tags/assign/${assignmentId}`).json<any>(),
      getEntityTags: (entityType: string, entityId: string) =>
        client.get('tags/entity', { searchParams: { entityType, entityId } }).json<any>(),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;


