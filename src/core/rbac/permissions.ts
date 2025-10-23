/**
 * Core RBAC - Permission Definitions
 *
 * TODO: Implement comprehensive permission system
 */

export enum Permission {
  // Contacts
  CONTACTS_VIEW = 'contacts:view',
  CONTACTS_CREATE = 'contacts:create',
  CONTACTS_EDIT = 'contacts:edit',
  CONTACTS_DELETE = 'contacts:delete',
  CONTACTS_EXPORT = 'contacts:export',

  // Leads
  LEADS_VIEW = 'leads:view',
  LEADS_CREATE = 'leads:create',
  LEADS_EDIT = 'leads:edit',
  LEADS_DELETE = 'leads:delete',
  LEADS_CONVERT = 'leads:convert',
  LEADS_ASSIGN = 'leads:assign',
  LEADS_EXPORT = 'leads:export',

  // Deals
  DEALS_VIEW = 'deals:view',
  DEALS_CREATE = 'deals:create',
  DEALS_EDIT = 'deals:edit',
  DEALS_DELETE = 'deals:delete',
  DEALS_CLOSE = 'deals:close',
  DEALS_ASSIGN = 'deals:assign',
  DEALS_EXPORT = 'deals:export',

  // Companies
  COMPANIES_VIEW = 'companies:view',
  COMPANIES_CREATE = 'companies:create',
  COMPANIES_EDIT = 'companies:edit',
  COMPANIES_DELETE = 'companies:delete',
  COMPANIES_EXPORT = 'companies:export',

  // Analytics
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',

  // Admin
  SETTINGS_MANAGE = 'settings:manage',
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES_REP = 'sales_rep',
  VIEWER = 'viewer',
}

// TODO: Define role-permission mappings
export const RolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.ADMIN]: [
    // TODO: Define admin permissions
  ],
  [Role.MANAGER]: [
    // TODO: Define manager permissions
  ],
  [Role.SALES_REP]: [
    // TODO: Define sales rep permissions
  ],
  [Role.VIEWER]: [
    // TODO: Define viewer permissions
  ],
};
