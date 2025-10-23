import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n') ?? '',
  audience: process.env.JWT_AUD ?? 'traffic-crm',
  issuer: process.env.JWT_ISS ?? 'traffic-crm-auth',
  orgClaimKey: process.env.JWT_ORG_CLAIM ?? 'orgId'
}));

