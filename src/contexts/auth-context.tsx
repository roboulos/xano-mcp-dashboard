'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { xanoClient } from '@/services/xano-client';
import { authStorage } from '@/utils/auth-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  api_key?: string;
  created_at?: number;
  authToken?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  avatar_url?: string;
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
      const authToken = authStorage.getToken();

      if (!authToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const data = await xanoClient.auth.me();
      const userData = data as User;
      setUser({
        ...userData,
        authToken, // Include the auth token in the user object
      });
    } catch {
      // Invalid token, clear it
      authStorage.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clear auth token
    authStorage.removeToken();
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
