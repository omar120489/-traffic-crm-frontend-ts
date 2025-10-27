export type Role = 'admin' | 'manager' | 'user' | 'viewer';
export type Permission = 'contacts:read' | 'contacts:write' | 'contacts:delete' | 'leads:read' | 'leads:write' | 'leads:assign' | 'deals:read' | 'deals:write' | 'deals:delete' | 'companies:read' | 'companies:write' | 'settings:read' | 'settings:write' | 'users:read' | 'users:write';
export interface Policy {
    role: Role;
    permissions: Permission[];
}
