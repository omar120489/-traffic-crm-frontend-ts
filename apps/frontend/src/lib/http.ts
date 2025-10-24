/**
 * Lightweight HTTP client with auth header injection
 * Used by SDK and direct API calls
 */

export function authHeader(): Record<string, string> {
  if (typeof globalThis.window === 'undefined') return {};
  const token = globalThis.localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export function logout() {
  if (typeof globalThis.window !== 'undefined') {
    globalThis.localStorage.removeItem('access_token');
    globalThis.window.location.assign('/login');
  }
}

