// Activities Service
// Sprint 4: Activity Timeline

import { http } from '@/lib/http';
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
  DeleteActivityInput,
  ActivityFilters,
  ActivityListResponse,
} from '@/types/activity';

// Mock data import for development
import mockData from '@/mock/activities.json';

// Feature flag for mock data (set to false when backend is ready)
const USE_MOCK_DATA = true;

/**
 * Get activities for an entity with optional filters
 */
export async function getActivities(
  entityType: string,
  entityId: string,
  filters?: ActivityFilters,
  cursor?: string
): Promise<ActivityListResponse> {
  // Use mock data during development
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Filter mock data based on filters
    let filtered = mockData.activities;
    
    if (filters?.types && filters.types.length > 0) {
      filtered = filtered.filter((act) => filters.types!.includes(act.type));
    }
    
    if (filters?.userId) {
      filtered = filtered.filter((act) => act.userId === filters.userId);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((act) =>
        act.content.toLowerCase().includes(search) ||
        act.user.name.toLowerCase().includes(search)
      );
    }
    
    if (filters?.dateFrom) {
      filtered = filtered.filter((act) => act.createdAt >= filters.dateFrom!);
    }
    
    if (filters?.dateTo) {
      filtered = filtered.filter((act) => act.createdAt <= filters.dateTo!);
    }
    
    return {
      activities: filtered as readonly Activity[],
      total: filtered.length,
      hasMore: false,
    };
  }
  
  // Real API call (when backend is ready)
  const params = new URLSearchParams({
    entityType,
    entityId,
    ...(filters?.types && { types: filters.types.join(',') }),
    ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters?.dateTo && { dateTo: filters.dateTo }),
    ...(filters?.userId && { userId: filters.userId }),
    ...(filters?.search && { search: filters.search }),
    ...(cursor && { cursor }),
  });

  const { data } = await http.get<ActivityListResponse>(
    `/api/activities?${params}`
  );
  return data;
}

/**
 * Create a new activity
 */
export async function createActivity(
  input: CreateActivityInput
): Promise<Activity> {
  // Mock implementation
  if (USE_MOCK_DATA) {
    // emulate latency
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    const act: Activity = {
      id: `a_${Date.now()}`,
      type: input.type,
      title: input.title,
      content: input.content,
      notes: input.notes,
      dueAt: input.dueAt,
      entityType: (input.entityType ?? input.entity ?? 'contact') as 'contact' | 'deal' | 'company',
      entityId: input.entityId ?? '',
      createdAt: new Date().toISOString(),
      createdBy: { id: "me", name: "You" },
      participants: (input.participants || []).map((p, i) => ({
        id: `${i}_${p}`,
        name: p,
        email: p.includes("@") ? p : undefined,
      })),
      entity: input.entity ?? input.entityType,
    };
    
    return act;
  }
  
  // Real API
  const { data } = await http.post<Activity>('/api/activities', input);
  return data;
}

/**
 * Update an existing activity
 */
export async function updateActivity(
  input: UpdateActivityInput
): Promise<Activity> {
  // Mock implementation
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    // Return merged object
    return {
      id: input.id,
      type: input.type ?? 'note',
      title: input.title ?? 'Updated activity',
      content: input.content,
      notes: input.notes,
      dueAt: input.dueAt,
      entityType: 'company',
      entityId: 'company-1',
      createdAt: new Date().toISOString(),
      createdBy: { id: 'me', name: 'You' },
      participants: (input.participants || []).map((p, i) => ({
        id: `${i}_${p}`,
        name: p,
        email: p.includes('@') ? p : undefined,
      })),
      entity: 'company',
    };
  }
  
  const res = await fetch(`/api/activities/${encodeURIComponent(input.id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update activity');
  return (await res.json()) as Activity;
}

/**
 * Delete an activity
 */
export async function deleteActivity(
  input: DeleteActivityInput
): Promise<{ readonly ok: true }> {
  // Mock implementation
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return { ok: true };
  }
  
  const res = await fetch(`/api/activities/${encodeURIComponent(input.id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete activity');
  return { ok: true };
}

/**
 * Get activity type options for filters
 */
export function getActivityTypeOptions() {
  return [
    { value: 'note', label: 'Note', icon: '📝' },
    { value: 'call', label: 'Call', icon: '📞' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'meeting', label: 'Meeting', icon: '🤝' },
    { value: 'task', label: 'Task', icon: '✅' },
  ] as const;
}

