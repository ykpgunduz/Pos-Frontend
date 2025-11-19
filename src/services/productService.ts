import { api } from './api';
import { Product } from '../types';

/**
 * Product Service - API Documentation'a uygun
 * 
 * Endpoints:
 * - GET /api/products/list (paginated)
 * - GET /api/products/{id}
 * - POST /api/products/create
 * - PUT/PATCH /api/products/{id}/update
 * - DELETE /api/products/{id}/delete
 */

// Helper to normalize API response into Product type
const normalizeProduct = (p: any): Product => {
  return {
    id: p.id,
    cafe_id: p.cafe_id,
    category_id: p.category_id,
    name: p.name || 'İsimsiz Ürün',
    price: Number(p.price) || 0,
    image: p.image || undefined,
    available: p.active !== undefined ? p.active : (p.available !== undefined ? p.available : true),
    active: p.active !== undefined ? p.active : (p.available !== undefined ? p.available : true),
    stock: p.stock || 0,
    description: p.description || '',
    star: p.star || 0,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
};

export const productService = {
  /**
   * Tüm ürünleri listele (paginated)
   * GET /api/products/list?page=1
   */
  getList: async (page: number = 1, cafeId?: number): Promise<{ data: Product[]; total: number; currentPage: number; lastPage: number }> => {
    try {
      const response = await api.get(`/products/list?page=${page}`);
      const apiData = response.data;
      
      // Pagination bilgilerini çıkar
      const products = Array.isArray(apiData.data) ? apiData.data : [];
      
      // Eğer cafeId verilmişse filtrele
      const filteredProducts = cafeId 
        ? products.filter((p: any) => p.cafe_id === cafeId)
        : products;
      
      return {
        data: filteredProducts.map(normalizeProduct),
        total: apiData.total || filteredProducts.length,
        currentPage: apiData.current_page || page,
        lastPage: apiData.last_page || 1,
      };
    } catch (error) {
      console.error('Product list error:', error);
      return { data: [], total: 0, currentPage: 1, lastPage: 1 };
    }
  },

  /**
   * Kategoriye göre ürünleri filtrele (frontend tarafında)
   */
  getByCategory: async (categoryId: number, page: number = 1): Promise<Product[]> => {
    const response = await productService.getList(page);
    return response.data.filter(p => p.category_id === categoryId);
  },

  /**
   * Cafe'ye göre ürünleri getir
   */
  getByCafe: async (cafeId: number, page: number = 1): Promise<Product[]> => {
    const response = await productService.getList(page, cafeId);
    return response.data;
  },

  /**
   * Tek bir ürünü getir
   * GET /api/products/{id}
   */
  getById: async (id: number): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      return normalizeProduct(product);
    } catch (error) {
      console.error('Product get by id error:', error);
      return null;
    }
  },

  /**
   * Yeni ürün oluştur
   * POST /api/products/create
   * 
   * Required fields:
   * - cafe_id: number
   * - category_id: number
   * - name: string
   * 
   * Optional fields:
   * - image: string
   * - price: number
   * - stock: number
   * - active: boolean
   * - star: number
   * - description: string
   */
  create: async (payload: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.post('/products/create', {
        cafe_id: payload.cafe_id,
        category_id: payload.category_id,
        name: payload.name,
        image: payload.image,
        description: payload.description,
        price: payload.price || 0,
        stock: payload.stock || 0,
        active: payload.available !== undefined ? payload.available : true,
        star: payload.star || 0,
      });
      
      const product = response.data?.data || response.data;
      return normalizeProduct(product);
    } catch (error) {
      console.error('Product create error:', error);
      throw error;
    }
  },

  /**
   * Ürünü güncelle
   * PUT/PATCH /api/products/{id}/update
   */
  update: async (id: number, payload: Partial<Product>): Promise<Product> => {
    try {
      const updateData: any = {};
      
      if (payload.name !== undefined) updateData.name = payload.name;
      if (payload.price !== undefined) updateData.price = payload.price;
      if (payload.category_id !== undefined) updateData.category_id = payload.category_id;
      if (payload.image !== undefined) updateData.image = payload.image;
      if (payload.description !== undefined) updateData.description = payload.description;
      if (payload.stock !== undefined) updateData.stock = payload.stock;
      if (payload.available !== undefined) updateData.active = payload.available;
      if (payload.star !== undefined) updateData.star = payload.star;
      
      const response = await api.patch(`/products/${id}/update`, updateData);
      const product = response.data?.data || response.data;
      return normalizeProduct(product);
    } catch (error) {
      console.error('Product update error:', error);
      throw error;
    }
  },

  /**
   * Ürünü sil
   * DELETE /api/products/{id}/delete
   */
  remove: async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}/delete`);
    } catch (error) {
      console.error('Product delete error:', error);
      throw error;
    }
  },
};
