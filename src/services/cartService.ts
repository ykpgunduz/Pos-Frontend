import { api } from './api';
import { ApiResponse } from '../types';
import { Product } from '../types';

interface CartPayload {
  id?: number;
  items?: any[];
  totalAmount?: number;
  tableId?: number;
  customerName?: string;
}

export const cartService = {
  getList: async (): Promise<any[]> => {
    const res = await api.get('/carts/list');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  },

  getById: async (id: number): Promise<any | null> => {
    const res = await api.get(`/carts/${id}`);
    return res.data?.data ?? res.data ?? null;
  },

  create: async (payload: CartPayload): Promise<any> => {
    const res = await api.post('/carts/create', payload);
    return res.data?.data ?? res.data;
  },

  update: async (id: number, payload: Partial<CartPayload>): Promise<any> => {
    const res = await api.put(`/carts/${id}/update`, payload);
    return res.data?.data ?? res.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/carts/${id}/delete`);
  }
};
