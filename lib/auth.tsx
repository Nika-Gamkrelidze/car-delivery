import { getSupabase } from '@/lib/supabase';
import { Role, User } from '@/lib/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (params: { email: string; password: string; name: string; role: Role }) => Promise<void>;
  login: (params: { email: string; password: string; expectedRole?: Role }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      const supabase = await getSupabase();
      const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(setUser).finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
      });
      unsub = () => authListener.subscription.unsubscribe();
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await fetchProfile(data.session.user.id).then(setUser);
      }
      setLoading(false);
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  const signup = useCallback(async (params: { email: string; password: string; name: string; role: Role }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({ email: params.email, password: params.password });
    if (error) throw error;
    const authUser = data.user;
    if (!authUser) throw new Error('No user returned');
    const profile: User = { id: authUser.id, email: params.email.trim(), password: '***', name: params.name.trim(), role: params.role, createdAt: new Date().toISOString() };
    const { error: upsertErr } = await (await getSupabase()).from('profiles').upsert({ id: profile.id, email: profile.email, name: profile.name, role: profile.role, created_at: profile.createdAt });
    if (upsertErr) throw upsertErr;
    setUser(profile);
  }, []);

  const login = useCallback(async (params: { email: string; password: string; expectedRole?: Role }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: params.email, password: params.password });
    if (error) throw error;
    const authUser = data.user;
    if (!authUser) throw new Error('Invalid credentials');
    const profile = await fetchProfile(authUser.id);
    if (!profile) throw new Error('Profile not found');
    if (params.expectedRole && profile.role !== params.expectedRole) throw new Error(`Account is not a ${params.expectedRole}`);
    setUser(profile);
  }, []);

  const logout = useCallback(async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
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

async function fetchProfile(id: string): Promise<User | null> {
  const { data, error } = await (await getSupabase()).from('profiles').select('id, email, name, role, created_at').eq('id', id).single();
  if (error) return null;
  return { id: data.id, email: data.email, name: data.name, role: data.role as Role, createdAt: data.created_at, password: '***' };
}


