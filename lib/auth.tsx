import { generateId, getSession, getUsers, saveSession, saveUsers } from '@/lib/storage';
import { Role, User } from '@/lib/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (params: { email: string; password: string; name: string; role: Role }) => Promise<void>;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      const users = await getUsers();
      if (session) {
        const u = users.find((x) => x.id === session.userId) ?? null;
        setUser(u);
      }
      setLoading(false);
    })();
  }, []);

  const signup = useCallback(async (params: { email: string; password: string; name: string; role: Role }) => {
    const users = await getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (exists) throw new Error('Email already registered');
    const newUser: User = {
      id: generateId('user'),
      email: params.email.trim(),
      password: params.password,
      name: params.name.trim(),
      role: params.role,
      createdAt: new Date().toISOString(),
    };
    const next = [...users, newUser];
    await saveUsers(next);
    await saveSession({ userId: newUser.id });
    setUser(newUser);
  }, []);

  const login = useCallback(async (params: { email: string; password: string }) => {
    const users = await getUsers();
    const u = users.find((x) => x.email.toLowerCase() === params.email.toLowerCase() && x.password === params.password);
    if (!u) throw new Error('Invalid credentials');
    await saveSession({ userId: u.id });
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await saveSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signup, login, logout }), [user, loading, signup, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


