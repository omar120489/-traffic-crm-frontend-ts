// Activities Service
// Sprint 4: Activity Timeline

import { http } from '@/lib/http';
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
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
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      ...input,
      userId: 'user-1',
      user: {
        id: 'user-1',
        name: 'Current User',
        email: 'current@traffic-crm.example.com',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newActivity;
  }
  
  const { data } = await http.post<Activity>('/api/activities', input);
  return data;
}

/**
 * Update an existing activity
 */
export async function updateActivity(
  id: string,
  input: UpdateActivityInput
): Promise<Activity> {
  // Mock implementation
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const activity = mockData.activities.find((act) => act.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    return {
      ...activity,
      ...input,
      updatedAt: new Date().toISOString(),
    } as Activity;
  }
  
  const { data } = await http.patch<Activity>(`/api/activities/${id}`, input);
  return data;
}

/**
 * Delete an activity
 */
export async function deleteActivity(id: string): Promise<void> {
  // Mock implementation
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }
  
  await http.delete(`/api/activities/${id}`);
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

