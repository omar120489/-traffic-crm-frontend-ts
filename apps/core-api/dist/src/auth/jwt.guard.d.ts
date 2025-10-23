import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class JwtGuard implements CanActivate {
    private cfg;
    private audience;
    private issuer;
    private orgClaimKey;
    private publicKeyPem?;
    private jwks?;
    constructor(cfg: ConfigService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
