"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n') ?? '',
    audience: process.env.JWT_AUD ?? 'traffic-crm',
    issuer: process.env.JWT_ISS ?? 'traffic-crm-auth',
    orgClaimKey: process.env.JWT_ORG_CLAIM ?? 'orgId'
}));
//# sourceMappingURL=jwt.config.js.map