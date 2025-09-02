'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  api_key?: string;
  created_at?: number;
  authToken?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // Check both localStorage and cookies for auth token
      const authToken =
        localStorage.getItem('authToken') ||
        document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='))
          ?.split('=')[1];

      if (!authToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.user,
          authToken, // Include the auth token in the user object
        });
      } else {
        // Invalid token, clear it
        localStorage.removeItem('authToken');
        // Clear cookie
        document.cookie =
          'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continue with logout even if API call fails
    }

    // Clear client-side storage
    localStorage.removeItem('authToken');
    // Clear cookie on client side as backup
    document.cookie =
      'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);

    // Redirect to login
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
