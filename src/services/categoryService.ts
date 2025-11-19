import { api } from './api';
import { Category } from '../types';

/**
 * Category Service - API Documentation'a uygun
 * 
 * Endpoints:
 * - GET /api/categories/list (paginated)
 * - GET /api/categories/{id}
 * - POST /api/categories/create
 * - PUT/PATCH /api/categories/{id}/update
 * - DELETE /api/categories/{id}/delete
 */

// Helper to normalize API response into Category type
const normalizeCategory = (c: any): Category => {
  return {
    id: c.id,
    cafe_id: c.cafe_id,
    name: c.name || 'Kategori',
    description: c.description || '',
    active: c.active !== undefined ? c.active : true,
    icon: c.icon || '📦',
    created_at: c.created_at,
    updated_at: c.updated_at,
  };
};

export const categoryService = {
  /**
   * Tüm kategorileri listele (paginated)
   * GET /api/categories/list?page=1
   */
  getList: async (page: number = 1, cafeId?: number): Promise<{ data: Category[]; total: number }> => {
    try {
      const response = await api.get(`/categories/list?page=${page}`);
      const apiData = response.data;
      
      console.log('Category API Response:', apiData);
      
      const categories = Array.isArray(apiData.data) ? apiData.data : [];
      
      console.log('Categories from API:', categories);
      console.log('Filtering by cafeId:', cafeId);
      
      // Eğer cafeId verilmişse filtrele (active kontrolünü kaldırdık)
      const filteredCategories = cafeId 
        ? categories.filter((c: any) => c.cafe_id === cafeId)
        : categories;
      
      console.log('Filtered categories:', filteredCategories);
      
      return {
        data: filteredCategories.map(normalizeCategory),
        total: apiData.total || filteredCategories.length,
      };
    } catch (error) {
      console.error('Category list error:', error);
      return { data: [], total: 0 };
    }
  },

  /**
   * Cafe'ye göre kategorileri getir
   * GET /api/categories/list (frontend'de filtreleniyor)
   */
  getByCafe: async (cafeId: number): Promise<Category[]> => {
    const response = await categoryService.getList(1, cafeId);
    return response.data;
  },

  /**
   * Kategori adlarını string array olarak getir
   */
  getCategoryNames: async (cafeId?: number): Promise<string[]> => {
    const response = await categoryService.getList(1, cafeId);
    return response.data.map(c => c.name);
  },

  /**
   * Tek kategori getir
   * GET /api/categories/{id}
   */
  getById: async (id: number): Promise<Category | null> => {
    try {
      const response = await api.get(`/categories/${id}`);
      const category = response.data?.data || response.data;
      return normalizeCategory(category);
    } catch (error) {
      console.error('Category get by id error:', error);
      return null;
    }
  },

  /**
   * Yeni kategori oluştur
   * POST /api/categories/create
   * 
   * Required fields:
   * - cafe_id: number
   * - name: string
   * 
   * Optional fields:
   * - description: string
   * - active: boolean
   */
  create: async (payload: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.post('/categories/create', {
        cafe_id: payload.cafe_id,
        name: payload.name,
        description: payload.description || '',
        active: payload.active !== undefined ? payload.active : true,
      });
      
      const category = response.data?.data || response.data;
      return normalizeCategory(category);
    } catch (error) {
      console.error('Category create error:', error);
      throw error;
    }
  },

  /**
   * Kategoriyi güncelle
   * PUT/PATCH /api/categories/{id}/update
   */
  update: async (id: number, payload: Partial<Category>): Promise<Category> => {
    try {
      const updateData: any = {};
      
      if (payload.name !== undefined) updateData.name = payload.name;
      if (payload.description !== undefined) updateData.description = payload.description;
      if (payload.active !== undefined) updateData.active = payload.active;
      
      const response = await api.patch(`/categories/${id}/update`, updateData);
      const category = response.data?.data || response.data;
      return normalizeCategory(category);
    } catch (error) {
      console.error('Category update error:', error);
      throw error;
    }
  },

  /**
   * Kategoriyi sil
   * DELETE /api/categories/{id}/delete
   */
  remove: async (id: number): Promise<void> => {
    try {
      await api.delete(`/categories/${id}/delete`);
    } catch (error) {
      console.error('Category delete error:', error);
      throw error;
    }
  },
};
