import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, type LoginRequest, type LoginResponse } from '@/services/auth.service';

export interface AuthState {
  userId: string;
  orgId: string;
  roles: string[];
  token?: string;
  userEmail?: string;
}

export interface AuthContextValue extends AuthState {
  login: (req: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEV_DEFAULT: AuthState = {
  userId: 'dev-user',
  orgId: 'clx0d018d000008l701211234', // Matches dev guard seed data
  roles: ['admin'],
};

const AuthContext = createContext<AuthContextValue>({
  ...DEV_DEFAULT,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

function safeDecodeJwt(token: string): any | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isExpired(payload: any): boolean {
  if (!payload?.exp) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return;
    const t = globalThis.localStorage.getItem('auth.token');
    const e = globalThis.localStorage.getItem('auth.email');
    if (t) setToken(t);
    if (e) setUserEmail(e);
  }, []);

  const doLogin = async (req: LoginRequest) => {
    const res: LoginResponse = await apiLogin(req);
    setToken(res.accessToken);
    setUserEmail(req.email);
    if (typeof globalThis.window !== 'undefined') {
      globalThis.localStorage.setItem('auth.token', res.accessToken);
      globalThis.localStorage.setItem('auth.email', req.email);
    }
  };

  const doLogout = () => {
    setToken(null);
    setUserEmail(null);
    if (typeof globalThis.window !== 'undefined') {
      globalThis.localStorage.removeItem('auth.token');
      globalThis.localStorage.removeItem('auth.email');
    }
  };

  const state = useMemo<AuthState>(() => {
    if (!token) return DEV_DEFAULT;
    const payload = safeDecodeJwt(token);
    
    // Fallback if token is invalid or expired
    if (!payload || isExpired(payload)) {
      return DEV_DEFAULT;
    }

    return {
      userId: payload.sub ?? DEV_DEFAULT.userId,
      orgId: payload.orgId ?? payload['org_id'] ?? DEV_DEFAULT.orgId,
      roles: Array.isArray(payload.roles) ? payload.roles : DEV_DEFAULT.roles,
      token,
      userEmail: userEmail ?? undefined,
    };
  }, [token, userEmail]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: doLogin,
      logout: doLogout,
      isAuthenticated: !!token,
    }),
    [state, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

