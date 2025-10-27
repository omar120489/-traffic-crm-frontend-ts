import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, importSPKI, type KeyLike, type JWTPayload } from 'jose';

@Injectable()
export class JwtGuard implements CanActivate {
  private jwksCache: ReturnType<typeof createRemoteJWKSet> | { key: KeyLike } | null = null;

  constructor(private readonly cfg: ConfigService) {}

  private async getVerifier() {
    const publicKey = this.cfg.get<string>('jwt.publicKey')?.trim();
    if (!publicKey) return null;

    if (publicKey.startsWith('http')) {
      if (!this.jwksCache || !('length' in this.jwksCache)) {
        this.jwksCache = createRemoteJWKSet(new URL(publicKey));
      }
      return this.jwksCache;
    }

    if (!this.jwksCache || !('key' in this.jwksCache)) {
      const key = await importSPKI(publicKey, 'RS256');
      this.jwksCache = { key };
    }
    return this.jwksCache;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    // Read config lazily, per-request
    const enabled = this.cfg.get<boolean>('jwt.enabled', false);
    const audience = this.cfg.get<string>('jwt.audience');
    const issuer = this.cfg.get<string>('jwt.issuer');
    const orgClaimKey = this.cfg.get<string>('jwt.orgClaimKey', 'orgId');

    // Dev-friendly bypass when disabled or not configured
    const verifier = await this.getVerifier();
    if (!enabled || !verifier) {
      req.user = {
        sub: 'dev-user',
        orgId: 'clx0d018d000008l701211234', // matches your seed data
        roles: ['admin'],
        role: 'admin', // for RBAC guard
      };
      return true;
    }

    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = auth.slice(7);
    try {
      let payload: JWTPayload;
      if ('length' in verifier) {
        // Remote JWKS
        payload = (await jwtVerify(token, verifier, { audience, issuer })).payload;
      } else {
        // Local PEM
        payload = (await jwtVerify(token, verifier.key, { audience, issuer })).payload;
      }

      const orgId = payload?.[orgClaimKey];
      if (!orgId) throw new UnauthorizedException('Missing org claim');

      req.user = {
        sub: payload.sub,
        orgId,
        roles: payload.roles ?? [],
        role: payload.role ?? 'user',
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
