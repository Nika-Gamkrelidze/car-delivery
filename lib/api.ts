import { Platform } from 'react-native';

const DEFAULT_BASE_URL = Platform.select({
  web: 'http://localhost:4000/api',
  ios: 'http://localhost:4000/api',
  android: 'http://10.0.2.2:4000/api',
}) as string;

function getBaseUrl(): string {
  // You can customize via app config in the future
  return DEFAULT_BASE_URL;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg || `Request failed: ${resp.status}`);
  }
  return (await resp.json()) as T;
}

export const api = {
  // Users
  listUsers: () => request<any[]>('/users'),
  createUser: (user: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: (id: string | number, user: any) => request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  // Orders
  listOrders: () => request<any[]>('/orders?_sort=createdAt&_order=desc'),
  createOrder: (order: any) => request<any>('/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrder: (id: string | number, order: any) => request<any>(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(order) }),
};


