/**
 * Provider-specific auth user types
 * These represent the shapes returned by various auth providers
 */

// Auth0 User structure
export interface Auth0User {
  readonly sub?: string; // Made optional to match @auth0/auth0-react User type
  readonly email?: string;
  readonly email_verified?: boolean;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly nickname?: string;
  readonly picture?: string;
  readonly updated_at?: string;
  readonly 'https://app.example.com/roles'?: readonly string[];
  readonly [key: string]: unknown;
}

// Firebase User structure
export interface FirebaseUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly emailVerified: boolean;
  readonly phoneNumber: string | null;
  readonly customClaims?: Record<string, unknown> & {
    readonly role?: string;
  };
  readonly metadata?: {
    readonly creationTime?: string;
    readonly lastSignInTime?: string;
  };
  readonly [key: string]: unknown;
}

// AWS Cognito User structure
export interface CognitoUser {
  readonly username?: string;
  readonly sub?: string;
  readonly attributes?: {
    readonly email?: string;
    readonly given_name?: string;
    readonly family_name?: string;
    readonly name?: string;
    readonly 'custom:role'?: string;
    readonly [key: string]: string | undefined;
  };
  readonly [key: string]: unknown;
}

export interface CognitoUserAttributes {
  readonly email?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly name?: string;
  readonly 'custom:role'?: string;
  readonly [key: string]: string | undefined;
}

// Supabase User structure
export interface SupabaseUser {
  readonly id: string;
  readonly email?: string;
  readonly phone?: string;
  readonly email_confirmed_at?: string;
  readonly phone_confirmed_at?: string;
  readonly user_metadata?: {
    readonly firstName?: string;
    readonly lastName?: string;
    readonly first_name?: string;
    readonly last_name?: string;
    readonly full_name?: string;
    readonly [key: string]: unknown;
  };
  readonly app_metadata?: {
    readonly provider?: string;
    readonly role?: string;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

// Generic auth user for fallback scenarios
export interface GenericAuthUser {
  readonly id?: string;
  readonly sub?: string;
  readonly uid?: string;
  readonly username?: string;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly first_name?: string;
  readonly last_name?: string;
  readonly name?: string;
  readonly displayName?: string;
  readonly full_name?: string;
  readonly role?: string;
  readonly [key: string]: unknown;
}

// Auth error types
export interface AuthErrorResponse {
  readonly message?: string;
  readonly error_description?: string;
  readonly code?: string;
  readonly statusCode?: number;
  readonly [key: string]: unknown;
}
