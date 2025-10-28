/**
 * Shared authentication utilities for provider-agnostic auth operations
 */

import { jwtDecode } from 'jwt-decode';
import axiosServices from 'utils/axios';
import type { UserProfile } from '../types/auth';
import type {
  Auth0User,
  AuthErrorResponse,
  CognitoUser,
  CognitoUserAttributes,
  FirebaseUser,
  GenericAuthUser,
  SupabaseUser
} from '../types/auth-providers';

// ==============================|| TOKEN MANAGEMENT ||============================== //

/**
 * Verify if a JWT token is valid and not expired
 * @param serviceToken - JWT token to verify
 * @returns boolean indicating if token is valid
 */
export function verifyToken(serviceToken: string | null): boolean {
  if (!serviceToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(serviceToken);

    // Ensure 'exp' exists and compare it to the current timestamp
    if (!decoded.exp) {
      throw new Error("Token does not contain 'exp' property.");
    }

    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

/**
 * Set or clear authentication session
 * @param serviceToken - JWT token to set, or null to clear
 */
export function setSession(serviceToken: string | null): void {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axiosServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axiosServices.defaults.headers.common.Authorization;
  }
}

/**
 * Clear all auth-related data from storage
 */
export function clearAuthStorage(): void {
  const authKeys = ['serviceToken', 'accessToken', 'refreshToken', 'users'];
  authKeys.forEach((key) => localStorage.removeItem(key));
}

// ==============================|| PROFILE MAPPING ||============================== //

/**
 * Map Auth0 user profile to standard UserProfile
 * Accepts any Auth0-compatible user object
 */
export function mapAuth0Profile(auth0User: Record<string, unknown>): UserProfile {
  const user = auth0User as Auth0User;
  return {
    id: user.sub || '',
    email: user.email,
    firstName: user.given_name || user.name?.split(' ')[0],
    lastName: user.family_name || user.name?.split(' ')[1],
    name: user.name,
    role: user['https://app.example.com/roles']?.[0] || 'user'
  };
}

/**
 * Map Firebase user profile to standard UserProfile
 * Accepts any Firebase-compatible user object
 */
export function mapFirebaseProfile(firebaseUser: Record<string, unknown>): UserProfile {
  const user = firebaseUser as FirebaseUser;
  return {
    id: user.uid,
    email: user.email || '',
    firstName: user.displayName?.split(' ')[0] || '',
    lastName: user.displayName?.split(' ')[1] || '',
    name: user.displayName || '',
    role: user.customClaims?.role || 'user'
  };
}

/**
 * Map AWS Cognito user profile to standard UserProfile
 * Accepts any Cognito-compatible user object
 */
export function mapCognitoProfile(
  cognitoUser: Record<string, unknown>,
  attributes: CognitoUserAttributes = {}
): UserProfile {
  const user = cognitoUser as CognitoUser;
  return {
    id: user.username || user.sub,
    email: attributes.email || user.attributes?.email,
    firstName: attributes.given_name || user.attributes?.given_name,
    lastName: attributes.family_name || user.attributes?.family_name,
    name:
      attributes.name ||
      user.attributes?.name ||
      `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
    role: attributes['custom:role'] || user.attributes?.['custom:role'] || 'user'
  };
}

/**
 * Map Supabase user profile to standard UserProfile
 * Accepts any Supabase-compatible user object
 */
export function mapSupabaseProfile(supabaseUser: Record<string, unknown>): UserProfile {
  const user = supabaseUser as SupabaseUser;
  return {
    id: user.id,
    email: user.email || '',
    firstName:
      user.user_metadata?.firstName ||
      user.user_metadata?.first_name ||
      user.user_metadata?.full_name?.split(' ')[0],
    lastName:
      user.user_metadata?.lastName ||
      user.user_metadata?.last_name ||
      user.user_metadata?.full_name?.split(' ')[1],
    name:
      user.user_metadata?.full_name ||
      `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim(),
    role: user.app_metadata?.role || 'user'
  };
}

/**
 * Generic profile mapper with fallbacks
 */
export function mapGenericProfile(user: GenericAuthUser, provider: string): UserProfile {
  console.warn(
    `Using generic profile mapper for ${provider}. Consider implementing specific mapper.`
  );

  return {
    id: user.id || user.sub || user.uid || user.username || 'unknown',
    email: user.email || '',
    firstName: user.firstName || user.given_name || user.first_name || '',
    lastName: user.lastName || user.family_name || user.last_name || '',
    name: user.name || user.displayName || user.full_name || '',
    role: user.role || 'user'
  };
}

// ==============================|| ERROR HANDLING ||============================== //

/**
 * Standardized auth error handling
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public provider: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Handle auth errors consistently across providers
 */
export function handleAuthError(error: unknown, provider: string, operation: string): never {
  console.error(`${provider} ${operation} error:`, error);

  let message = `${operation} failed`;

  // Type guard for error response objects
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as AuthErrorResponse;
    if (errorObj.message) {
      message = errorObj.message;
    } else if (errorObj.error_description) {
      message = errorObj.error_description;
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  throw new AuthError(message, provider, error);
}

// ==============================|| VALIDATION ||============================== //

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (basic)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
