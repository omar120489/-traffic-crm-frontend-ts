import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, importSPKI } from 'jose';
import jwtCfg from './jwt.config';

@Injectable()
export class JwtGuard implements CanActivate {
  private audience: string;
  private issuer: string;
  private orgClaimKey: string;
  private publicKeyPem?: string;
  private jwks?: ReturnType<typeof createRemoteJWKSet>;

  constructor(private cfg: ConfigService) {
    const cfgObj = cfg.get(jwtCfg.KEY)!;
    this.audience = cfgObj.audience;
    this.issuer = cfgObj.issuer;
    this.orgClaimKey = cfgObj.orgClaimKey;
    const pk = cfgObj.publicKey?.trim();
    if (pk?.startsWith('http')) {
      this.jwks = createRemoteJWKSet(new URL(pk));
    } else {
      this.publicKeyPem = pk;
    }
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header = req.headers['authorization'] ?? '';
    const token = Array.isArray(header) ? header[0] : header;
    
    if (!token?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const jwt = token.slice(7);
    const options = {
      audience: this.audience,
      issuer: this.issuer
    } as const;

    let payload: any;
    
    if (this.jwks) {
      const res = await jwtVerify(jwt, this.jwks, options);
      payload = res.payload;
    } else if (this.publicKeyPem) {
      const key = await importSPKI(this.publicKeyPem, 'RS256');
      const res = await jwtVerify(jwt, key, options);
      payload = res.payload;
    } else {
      throw new UnauthorizedException('JWT verifier not configured');
    }

    const orgId = payload[this.orgClaimKey];
    if (!orgId) {
      throw new UnauthorizedException('Missing org claim');
    }

    // Attach to request for controllers/services
    req.user = {
      sub: payload.sub,
      orgId,
      roles: payload.roles ?? []
    };
    
    return true;
  }
}

