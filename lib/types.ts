export type Role = 'customer' | 'carrier';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  createdAt: string;
}

export type OrderStatus = 'posted' | 'accepted' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  pickupCity: string;
  dropoffCity: string;
  miles: number;
  price: number;
  status: OrderStatus;
  createdByUserId: string;
  acceptedByUserId?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
}


