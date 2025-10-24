import { createContext, useContext, type ReactNode } from 'react';

export interface AuthState {
  userId: string;
  orgId: string;
  roles: string[];
}

const defaultAuthState: AuthState = {
  userId: 'dev-user',
  orgId: 'clx0d018d000008l701211234', // Matches dev guard seed data
  roles: ['admin'],
};

const AuthContext = createContext<AuthState>(defaultAuthState);

export interface AuthProviderProps {
  children: ReactNode;
  value?: AuthState;
}

export function AuthProvider({ children, value }: AuthProviderProps) {
  // NOTE: Later hydrate from JWT/localStorage when auth is enabled
  const authState = value || defaultAuthState;
  
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

