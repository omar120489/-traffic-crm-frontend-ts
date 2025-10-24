/**
 * HTTP client with auth header injection
 * Sprint 3: Enhanced with axios and auth token interceptor
 */

import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to all requests
http.interceptors.request.use((config) => {
  if (typeof globalThis.window === 'undefined') return config;
  
  const token = globalThis.localStorage.getItem('auth.token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor: Handle 401 errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof globalThis.window !== 'undefined') {
        globalThis.localStorage.removeItem('auth.token');
        globalThis.localStorage.removeItem('auth.email');
        globalThis.window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export function logout() {
  if (typeof globalThis.window !== 'undefined') {
    globalThis.localStorage.removeItem('auth.token');
    globalThis.localStorage.removeItem('auth.email');
    globalThis.window.location.assign('/login');
  }
}

