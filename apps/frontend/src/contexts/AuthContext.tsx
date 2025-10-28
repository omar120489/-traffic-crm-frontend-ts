import { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * Standard JWT payload structure with custom claims
 */
export interface JWTPayload {
  sub?: string; // Subject (user ID)
  exp?: number; // Expiration timestamp
  iat?: number; // Issued at timestamp
  aud?: string; // Audience
  iss?: string; // Issuer
  orgId?: string; // Custom: Organization ID
  roles?: string[]; // Custom: User roles
  [key: string]: unknown; // Allow additional claims
}

export interface AuthState {
  userId: string;
  orgId: string;
  roles: string[];
  token?: string;
}

const DEV_DEFAULT: AuthState = {
  userId: 'dev-user',
  orgId: 'clx0d018d000008l701211234', // Matches dev guard seed data
  roles: ['admin']
};

const AuthContext = createContext<AuthState>(DEV_DEFAULT);

function safeDecodeJwt(token: string): JWTPayload | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isExpired(payload: JWTPayload): boolean {
  if (!payload?.exp) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const token =
    typeof window !== 'undefined' ? (localStorage.getItem('access_token') ?? undefined) : undefined;

  const state = useMemo<AuthState>(() => {
    if (!token) return DEV_DEFAULT;
    const payload = safeDecodeJwt(token);

    // Fallback if token is invalid or expired
    if (!payload || isExpired(payload)) {
      return DEV_DEFAULT;
    }

    return {
      userId: payload.sub ?? DEV_DEFAULT.userId,
      orgId:
        (typeof payload.orgId === 'string' ? payload.orgId : null) ??
        (typeof payload['org_id'] === 'string' ? payload['org_id'] : null) ??
        DEV_DEFAULT.orgId,
      roles: Array.isArray(payload.roles) ? payload.roles : DEV_DEFAULT.roles,
      token
    };
  }, [token]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
