#!/usr/bin/env node
import { SignJWT, importJWK } from 'jose';

// HS256 (shared secret) for local only.
// In prod, use RS256 + JWKS from Auth0/Keycloak/etc.
const secret = process.env.DEV_JWT_SECRET || 'dev-secret-change-me';
const orgId = process.env.DEV_JWT_ORG_ID || 'demo-org';
const userId = process.env.DEV_JWT_USER_ID || 'user-1';

const alg = 'HS256';

// create a JWK from the secret
const jwk = { kty: 'oct', k: Buffer.from(secret).toString('base64url') };
const key = await importJWK(jwk, alg);

const token = await new SignJWT({ orgId, sub: userId, roles: ['admin'] })
  .setProtectedHeader({ alg })
  .setIssuedAt()
  .setExpirationTime('24h')
  .setIssuer('traffic-crm')
  .sign(key);

console.log('');
console.log('🔐 Dev JWT Token (valid for 24h):');
console.log('');
console.log(token);
console.log('');
console.log('📋 To use in frontend:');
console.log(`   echo "VITE_DEV_JWT=${token}" >> apps/frontend/.env.local`);
console.log('');
console.log('📋 To use in Postman/curl:');
console.log(`   Authorization: Bearer ${token}`);
console.log('');
console.log('⚙️  Token contains:');
console.log(`   - orgId: ${orgId}`);
console.log(`   - sub (userId): ${userId}`);
console.log(`   - roles: ["admin"]`);
console.log('');

