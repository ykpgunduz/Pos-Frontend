import { api } from './api';
import { Table, ApiResponse } from '../types';

export const tableService = {
  // Tüm masaları getir
  getAllTables: async (): Promise<Table[]> => {
    const response = await api.get<ApiResponse<Table[]>>('/tables/list');
    return response.data.data;
  },

  // Mevcut cafe'nin masalarını getir (table-definitions endpoint kullanarak)
  getCurrentCafeTables: async (cafeId: number): Promise<any[]> => {
    try {
      // Cafe'ye ait masa tanımlarını getir
      const response = await api.get(`/table-definitions/cafe/${cafeId}`);
      return response.data || [];
    } catch (error) {
      console.error('Cafe masaları yüklenemedi:', error);
      return [];
    }
  },

  // Belirli bir cafe'nin masalarını getir
  getCafeTables: async (cafeId: number): Promise<Table[]> => {
    try {
      const response = await api.get<ApiResponse<Table[]>>(`/tables/cafe/${cafeId}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Cafe ${cafeId} masaları yüklenemedi:`, error);
      return [];
    }
  },

  // Belirli bir masayı getir
  getTableById: async (id: number): Promise<Table> => {
    const response = await api.get<ApiResponse<Table>>(`/tables/${id}`);
    return response.data.data;
  },

  // Yeni masa oluştur (cafe için)
  createTable: async (table: Omit<Table, 'id'>): Promise<Table> => {
    const response = await api.post<ApiResponse<Table>>('/tables/create', table);
    return response.data.data;
  },

  // Toplu masa oluştur (cafe için)
  createTablesForCafe: async (cafeId: number, tableCount: number): Promise<Table[]> => {
    try {
      const response = await api.post<ApiResponse<Table[]>>('/tables/bulk-create', {
        cafe_id: cafeId,
        table_count: tableCount
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Toplu masa oluşturulamadı:', error);
      throw error;
    }
  },

  // Masa güncelle
  updateTable: async (id: number, table: Partial<Table>): Promise<Table> => {
    const response = await api.patch<ApiResponse<Table>>(`/tables/${id}/update`, table);
    return response.data.data;
  },

  // Masa sil
  deleteTable: async (id: number): Promise<void> => {
    await api.delete(`/tables/${id}/delete`);
  },

  // Masa durumunu güncelle
  updateTableStatus: async (id: number, status: Table['status']): Promise<Table> => {
    const response = await api.patch<ApiResponse<Table>>(`/tables/${id}/update`, { status });
    return response.data.data;
  },
};
