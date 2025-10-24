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
          ensureProfile(session.user).then(setUser).finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
      });
      unsub = () => authListener.subscription.unsubscribe();
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await ensureProfile(data.session.user).then(setUser);
      }
      setLoading(false);
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  const signup = useCallback(async (params: { email: string; password: string; name: string; role: Role }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({ email: params.email, password: params.password, options: { data: { name: params.name, role: params.role } } });
    if (error) throw error;
    // Profile will be created on first authenticated session by ensureProfile
  }, []);

  const login = useCallback(async (params: { email: string; password: string; expectedRole?: Role }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: params.email, password: params.password });
    if (error) throw error;
    const authUser = data.user;
    if (!authUser) throw new Error('Invalid credentials');
    const profile = await ensureProfile(authUser);
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

async function ensureProfile(authUser: any): Promise<User | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('profiles').select('id, email, name, role, created_at').eq('id', authUser.id).maybeSingle();
  if (data) {
    return { id: data.id, email: data.email, name: data.name, role: data.role as Role, createdAt: data.created_at, password: '***' };
  }
  // If not found, create using user metadata
  const name = authUser.user_metadata?.name ?? authUser.email?.split('@')[0] ?? 'User';
  const role = (authUser.user_metadata?.role as Role) ?? 'customer';
  const insert = { id: authUser.id, email: authUser.email, name, role, created_at: new Date().toISOString() };
  const { error: upsertErr } = await supabase.from('profiles').insert(insert);
  if (upsertErr) return null;
  return { id: insert.id, email: insert.email, name: insert.name, role: insert.role as Role, createdAt: insert.created_at, password: '***' };
}


