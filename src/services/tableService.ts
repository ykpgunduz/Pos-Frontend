import { api } from './api';
import { Table, ApiResponse } from '../types';

export const tableService = {
  // Tüm masaları getir
  getAllTables: async (): Promise<Table[]> => {
    const response = await api.get<ApiResponse<Table[]>>('/tables');
    return response.data.data;
  },

  // Belirli bir masayı getir
  getTableById: async (id: number): Promise<Table> => {
    const response = await api.get<ApiResponse<Table>>(`/tables/${id}`);
    return response.data.data;
  },

  // Yeni masa oluştur
  createTable: async (table: Omit<Table, 'id'>): Promise<Table> => {
    const response = await api.post<ApiResponse<Table>>('/tables', table);
    return response.data.data;
  },

  // Masa güncelle
  updateTable: async (id: number, table: Partial<Table>): Promise<Table> => {
    const response = await api.put<ApiResponse<Table>>(`/tables/${id}`, table);
    return response.data.data;
  },

  // Masa sil
  deleteTable: async (id: number): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },

  // Masa durumunu güncelle
  updateTableStatus: async (id: number, status: Table['status']): Promise<Table> => {
    const response = await api.patch<ApiResponse<Table>>(`/tables/${id}/status`, { status });
    return response.data.data;
  },
};
