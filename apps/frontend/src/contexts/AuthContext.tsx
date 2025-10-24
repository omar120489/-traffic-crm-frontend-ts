import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface AuthState {
  userId: string;
  orgId: string;
  roles: string[];
  token?: string;
}

const DEV_DEFAULT: AuthState = {
  userId: 'dev-user',
  orgId: 'clx0d018d000008l701211234', // Matches dev guard seed data
  roles: ['admin'],
};

const AuthContext = createContext<AuthState>(DEV_DEFAULT);

function safeDecodeJwt(token: string): any | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? undefined : undefined;

  const state = useMemo<AuthState>(() => {
    if (!token) return DEV_DEFAULT;
    const payload = safeDecodeJwt(token);
    if (!payload) return { ...DEV_DEFAULT, token }; // fallback

    return {
      userId: payload.sub ?? DEV_DEFAULT.userId,
      orgId: payload.orgId ?? payload['org_id'] ?? DEV_DEFAULT.orgId,
      roles: Array.isArray(payload.roles) ? payload.roles : DEV_DEFAULT.roles,
      token,
    };
  }, [token]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

