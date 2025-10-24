import { roles } from './roles';
import { Role, Permission } from './types';

export function can(role: Role, permission: Permission): boolean {
  return roles[role]?.includes(permission) ?? false;
}

export const canAny = (role: Role, permissions: Permission[]) =>
  permissions.some((p) => can(role, p));

export const canAll = (role: Role, permissions: Permission[]) =>
  permissions.every((p) => can(role, p));

