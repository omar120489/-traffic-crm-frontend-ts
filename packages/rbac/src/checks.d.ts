import { Role, Permission } from './types';
export declare function can(role: Role, permission: Permission): boolean;
export declare const canAny: (role: Role, permissions: Permission[]) => boolean;
export declare const canAll: (role: Role, permissions: Permission[]) => boolean;
