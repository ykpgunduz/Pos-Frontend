export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: Order;
  currentGuests?: number;
  area: 'bahce' | 'salon' | 'kat';
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
  name: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  stock?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
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
