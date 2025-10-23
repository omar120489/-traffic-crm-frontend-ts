"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jose_1 = require("jose");
const jwt_config_1 = __importDefault(require("./jwt.config"));
let JwtGuard = class JwtGuard {
    cfg;
    audience;
    issuer;
    orgClaimKey;
    publicKeyPem;
    jwks;
    constructor(cfg) {
        this.cfg = cfg;
        const cfgObj = cfg.get(jwt_config_1.default.KEY);
        this.audience = cfgObj.audience;
        this.issuer = cfgObj.issuer;
        this.orgClaimKey = cfgObj.orgClaimKey;
        const pk = cfgObj.publicKey?.trim();
        if (pk?.startsWith('http')) {
            this.jwks = (0, jose_1.createRemoteJWKSet)(new URL(pk));
        }
        else {
            this.publicKeyPem = pk;
        }
    }
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const header = req.headers['authorization'] ?? '';
        const token = Array.isArray(header) ? header[0] : header;
        if (!token?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        const jwt = token.slice(7);
        const options = {
            audience: this.audience,
            issuer: this.issuer
        };
        let payload;
        if (this.jwks) {
            const res = await (0, jose_1.jwtVerify)(jwt, this.jwks, options);
            payload = res.payload;
        }
        else if (this.publicKeyPem) {
            const key = await (0, jose_1.importSPKI)(this.publicKeyPem, 'RS256');
            const res = await (0, jose_1.jwtVerify)(jwt, key, options);
            payload = res.payload;
        }
        else {
            throw new common_1.UnauthorizedException('JWT verifier not configured');
        }
        const orgId = payload[this.orgClaimKey];
        if (!orgId) {
            throw new common_1.UnauthorizedException('Missing org claim');
        }
        // Attach to request for controllers/services
        req.user = {
            sub: payload.sub,
            orgId,
            roles: payload.roles ?? []
        };
        return true;
    }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtGuard);
//# sourceMappingURL=jwt.guard.js.map