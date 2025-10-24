import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  enabled: (process.env.AUTH_ENABLED ?? 'false') === 'true',
  publicKey: process.env.JWT_PUBLIC_KEY?.replaceAll('\\n', '\n') ?? '',
  audience: process.env.JWT_AUD ?? 'traffic-crm',
  issuer: process.env.JWT_ISS ?? 'traffic-crm-auth',
  orgClaimKey: process.env.JWT_ORG_CLAIM ?? 'orgId',
}));

