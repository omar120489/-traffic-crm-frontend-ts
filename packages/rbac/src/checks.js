"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAll = exports.canAny = void 0;
exports.can = can;
const roles_1 = require("./roles");
function can(role, permission) {
    return roles_1.roles[role]?.includes(permission) ?? false;
}
const canAny = (role, permissions) => permissions.some((p) => can(role, p));
exports.canAny = canAny;
const canAll = (role, permissions) => permissions.every((p) => can(role, p));
exports.canAll = canAll;
//# sourceMappingURL=checks.js.map