import { Order, Session, User } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'cd_users_v1';
const ORDERS_KEY = 'cd_orders_v1';
const SESSION_KEY = 'cd_session_v1';
const THEME_KEY = 'cd_theme_pref_v1';

async function getJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function setJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getUsers(): Promise<User[]> {
  return getJson<User[]>(USERS_KEY, []);
}

export async function saveUsers(users: User[]): Promise<void> {
  return setJson<User[]>(USERS_KEY, users);
}

export async function getOrders(): Promise<Order[]> {
  return getJson<Order[]>(ORDERS_KEY, []);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  return setJson<Order[]>(ORDERS_KEY, orders);
}

export async function getSession(): Promise<Session | null> {
  return getJson<Session | null>(SESSION_KEY, null);
}

export async function saveSession(session: Session | null): Promise<void> {
  if (session === null) {
    await AsyncStorage.removeItem(SESSION_KEY);
  } else {
    await setJson(SESSION_KEY, session);
  }
}

export type ThemePreference = 'system' | 'light' | 'dark';

export async function getThemePreference(): Promise<ThemePreference> {
  return getJson<ThemePreference>(THEME_KEY, 'system');
}

export async function saveThemePreference(pref: ThemePreference): Promise<void> {
  await setJson<ThemePreference>(THEME_KEY, pref);
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}


