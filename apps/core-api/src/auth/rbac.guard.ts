import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { can } from '../../../../packages/rbac/src';
import type { Permission } from '../../../../packages/rbac/src';

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (permission: Permission) => SetMetadata(PERMISSION_KEY, permission);

/**
 * RBAC Guard - checks if user's role has required permission
 * 
 * Usage:
 * @UseGuards(RbacGuard)
 * @RequirePermission('contacts:write')
 * async createContact() { ... }
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<Permission>(PERMISSION_KEY, context.getHandler());
    if (!requiredPermission) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes auth middleware sets req.user

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    if (!can(user.role, requiredPermission)) {
      throw new ForbiddenException(`Insufficient permissions: ${requiredPermission} required`);
    }

    return true;
  }
}

