/**
 * Lightweight HTTP client with auth header injection
 * Used by SDK and direct API calls
 */

export function authHeader(): Record<string, string> {
  const token = localStorage.getItem('access_token');
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
  localStorage.removeItem('access_token');
  window.location.assign('/login');
}

