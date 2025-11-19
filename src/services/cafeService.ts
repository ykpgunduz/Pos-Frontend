import { api } from './api';

export interface Cafe {
  id: number;
  name: string;
  email: string;
  table_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CafeResponse {
  success?: boolean;
  data?: Cafe;
  message?: string;
}

export const cafeService = {
  // Mevcut cafe bilgilerini getir (giriş yapan cafe)
  getCurrentCafe: async (): Promise<Cafe> => {
    const response = await api.get<CafeResponse>('/cafe/me');
    return response.data.data!;
  },

  // Belirli bir cafe'yi getir
  getCafeById: async (id: number): Promise<Cafe> => {
    const response = await api.get<CafeResponse>(`/cafes/${id}`);
    return response.data.data!;
  },

  // Tüm cafeleri listele
  getAllCafes: async (): Promise<Cafe[]> => {
    const response = await api.get<{ success: boolean; data: Cafe[] }>('/cafes/list');
    return response.data.data;
  },
};
