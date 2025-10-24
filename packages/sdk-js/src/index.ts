import ky from 'ky';

/**
 * Minimal typed client using ky with:
 * - JWT header (when provided)
 * - Centralized retry/timeout
 * - Normalized errors via beforeError
 */
export function createClient(opts:{
  baseUrl:string;
  getToken?:()=>Promise<string|null>|string|null;
}) {
  const { baseUrl, getToken } = opts;

  const http = ky.create({
    prefixUrl: baseUrl.replace(/\/+$/, ''),
    timeout: 10000,
    retry: { limit: 2, methods: ['get'], statusCodes: [408,413,429,500,502,503,504] },
    hooks: {
      beforeRequest: [async (req) => {
        const tok = typeof getToken === 'function' ? await getToken() : getToken;
        if (tok) req.headers.set('Authorization', `Bearer ${tok}`);
        req.headers.set('Content-Type', 'application/json');
      }],
      beforeError: [async (error) => {
        const { response } = error;
        if (response) {
          let body:any=null; try { body = await response.clone().json(); } catch {}
          const msg = (body?.message||body?.error||body?.detail) ?? response.statusText ?? error.message;
          error.message = msg;
          (error as any).status = response.status;
          (error as any).body = body;
        }
        return error;
      }]
    }
  });

  return {
    // Contacts
    listContacts:(q?:any)=>http.get('contacts',{searchParams:q}).json<any>(),
    getContact:(id:string)=>http.get(`contacts/${id}`).json<any>(),
    createContact:(b:any)=>http.post('contacts',{json:b}).json<any>(),
    updateContact:(id:string,b:any)=>http.patch(`contacts/${id}`,{json:b}).json<any>(),
    deleteContact:(id:string)=>http.delete(`contacts/${id}`).json<any>(),

    // Leads
    listLeads:(q?:any)=>http.get('leads',{searchParams:q}).json<any>(),
    getLead:(id:string)=>http.get(`leads/${id}`).json<any>(),
    createLead:(b:any)=>http.post('leads',{json:b}).json<any>(),
    updateLead:(id:string,b:any)=>http.patch(`leads/${id}`,{json:b}).json<any>(),
    deleteLead:(id:string)=>http.delete(`leads/${id}`).json<any>(),

    // Deals
    listDeals:(q?:any)=>http.get('deals',{searchParams:q}).json<any>(),
    getDeal:(id:string)=>http.get(`deals/${id}`).json<any>(),
    createDeal:(b:any)=>http.post('deals',{json:b}).json<any>(),
    updateDeal:(id:string,b:any)=>http.patch(`deals/${id}`,{json:b}).json<any>(),
    deleteDeal:(id:string)=>http.delete(`deals/${id}`).json<any>(),

    // Companies
    listCompanies:(q?:any)=>http.get('companies',{searchParams:q}).json<any>(),
    getCompany:(id:string)=>http.get(`companies/${id}`).json<any>(),
    createCompany:(b:any)=>http.post('companies',{json:b}).json<any>(),
    updateCompany:(id:string,b:any)=>http.patch(`companies/${id}`,{json:b}).json<any>(),
    deleteCompany:(id:string)=>http.delete(`companies/${id}`).json<any>(),

    // Pipelines
    listPipelines:(orgId:string)=>http.get('pipelines',{searchParams:{orgId}}).json<any>(),
    getPipeline:(id:string)=>http.get(`pipelines/${id}`).json<any>(),
    createPipeline:(b:any)=>http.post('pipelines',{json:b}).json<any>(),
    updatePipeline:(id:string,b:any)=>http.patch(`pipelines/${id}`,{json:b}).json<any>(),
    deletePipeline:(id:string)=>http.delete(`pipelines/${id}`).json<any>(),

    // Stages
    listStages:(pipelineId:string)=>http.get('stages',{searchParams:{pipelineId}}).json<any>(),
    createStage:(b:any)=>http.post('stages',{json:b}).json<any>(),
    updateStage:(id:string,b:any)=>http.patch(`stages/${id}`,{json:b}).json<any>(),
    deleteStage:(id:string)=>http.delete(`stages/${id}`).json<any>(),
    reorderStages:(pipelineId:string,stageIds:string[])=>http.put('stages/reorder',{json:{pipelineId,stageIds}}).json<any>(),

    // Activities
    listActivities:(entityType:string,entityId:string)=>http.get('activities',{searchParams:{entityType,entityId}}).json<any>(),
    getActivity:(id:string)=>http.get(`activities/${id}`).json<any>(),
    createActivity:(b:any)=>http.post('activities',{json:b}).json<any>(),
    updateActivity:(id:string,b:any)=>http.patch(`activities/${id}`,{json:b}).json<any>(),
    deleteActivity:(id:string)=>http.delete(`activities/${id}`).json<any>(),

    // Tags
    listTags:(orgId:string)=>http.get('tags',{searchParams:{orgId}}).json<any>(),
    createTag:(b:any)=>http.post('tags',{json:b}).json<any>(),
    updateTag:(id:string,b:any)=>http.patch(`tags/${id}`,{json:b}).json<any>(),
    deleteTag:(id:string)=>http.delete(`tags/${id}`).json<any>(),
    assignTag:(b:{tagId:string;entityType:string;entityId:string})=>http.post('tags/assign',{json:b}).json<any>(),
    unassignTag:(assignmentId:string)=>http.delete(`tags/assign/${assignmentId}`).json<any>(),
    getEntityTags:(entityType:string,entityId:string)=>http.get('tags/entity',{searchParams:{entityType,entityId}}).json<any>(),
  };
}

// Re-export types if generated
export type * from './types.gen';
