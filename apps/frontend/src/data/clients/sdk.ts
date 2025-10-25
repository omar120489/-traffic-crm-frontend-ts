import { createClient } from '@traffic-crm/sdk-js';

const baseUrl = import.meta.env.VITE_APP_API_URL ?? 'http://localhost:3000/api';

// read token from context/localStorage; fall back to dev var
async function getToken() {
  // Dev override from .env.local
  const dev = import.meta.env.VITE_DEV_JWT;
  if (dev) {
    // console.log('[SDK] Using dev JWT from env');
    return dev as string;
  }

  // Check localStorage for JWT (from Auth0 or manual login)
  try {
    const raw = localStorage.getItem('jwt');
    if (raw) return raw;
  } catch (err) {
    console.warn('[SDK] Failed to read JWT from localStorage:', err);
  }

  return null;
}

export const api = createClient({ baseUrl, getToken });

// Export for use in services
export { createClient };

