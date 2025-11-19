export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: Order;
  currentGuests?: number;
  area: 'bahce' | 'salon' | 'kat';
  cafe_id?: number;
}

export interface Cafe {
  id: number;
  name: string;
  email: string;
  table_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  tableId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Product {
  id: number;
  cafe_id: number;
  category_id: number;
  name: string;
  price: number;
  cost?: number;
  category?: string; // Frontend için opsiyonel, backend'den category_id gelir
  image?: string;
  available?: boolean;
  active?: boolean; // API'de active olarak dönüyor
  stock?: number;
  description?: string;
  star?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  cafe_id: number;
  name: string;
  description?: string;
  active: boolean;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  role: 'garson' | 'patron' | 'mudur' | 'kasa';
  avatar?: string;
  cafeId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
