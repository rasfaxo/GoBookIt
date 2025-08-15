'use client';
import type { ReactNode } from 'react';

import { createContext, useContext, useState, useEffect } from 'react';

// Client-side auth status fetch via API route (instead of direct server cookies access)
async function fetchAuthStatus() {
  try {
    const res = await fetch('/api/auth/status', { cache: 'no-store' });
    if (!res.ok) return { isAuthenticated: false };
    return res.json();
  } catch {
    return { isAuthenticated: false };
  }
}
import type { AuthUser } from '@/types/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  refreshAuth: () => Promise<void>;
  setIsAuthenticated: (v: boolean) => void;
  setCurrentUser: (u: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    refreshAuth();
  }, []);

  const refreshAuth = async () => {
    try {
      const { isAuthenticated, user } = await fetchAuthStatus();
      setIsAuthenticated(!!isAuthenticated);
      setCurrentUser(user || null);
    } catch {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, refreshAuth, setIsAuthenticated, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
