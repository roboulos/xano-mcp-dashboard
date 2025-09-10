/**
 * Auth storage utilities for managing JWT tokens
 * Handles both localStorage and cookies for SSR compatibility
 */

import { setCookie, getCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = 'xano-token';
const TOKEN_COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export const authStorage = {
  setToken: (token: string) => {
    // Store in localStorage for client-side access
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }

    // Store in cookie for SSR (if we need it for certain pages)
    setCookie(TOKEN_KEY, token, TOKEN_COOKIE_OPTIONS);
  },

  getToken: (): string | null => {
    // Try localStorage first
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem(TOKEN_KEY);
      if (localToken) return localToken;
    }

    // Fallback to cookie
    const cookieToken = getCookie(TOKEN_KEY);
    return cookieToken ? String(cookieToken) : null;
  },

  removeToken: () => {
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }

    // Remove cookie
    deleteCookie(TOKEN_KEY);
  },

  // Check if we have a token (for auth guards)
  hasToken: (): boolean => {
    return !!authStorage.getToken();
  },
};
