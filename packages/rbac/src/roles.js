"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = void 0;
exports.roles = {
    admin: [
        'contacts:read',
        'contacts:write',
        'contacts:delete',
        'leads:read',
        'leads:write',
        'leads:assign',
        'deals:read',
        'deals:write',
        'deals:delete',
        'companies:read',
        'companies:write',
        'settings:read',
        'settings:write',
        'users:read',
        'users:write',
    ],
    manager: [
        'contacts:read',
        'contacts:write',
        'leads:read',
        'leads:write',
        'leads:assign',
        'deals:read',
        'deals:write',
        'companies:read',
        'companies:write',
        'settings:read',
        'users:read',
    ],
    user: [
        'contacts:read',
        'contacts:write',
        'leads:read',
        'leads:write',
        'deals:read',
        'deals:write',
        'companies:read',
    ],
    viewer: ['contacts:read', 'leads:read', 'deals:read', 'companies:read'],
};
//# sourceMappingURL=roles.js.map