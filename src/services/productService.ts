import { api } from './api';
import { Product } from '../types';

// Helper to normalize various API response shapes into Product[]
const normalizeList = (payload: any[]): Product[] => {
  return payload.map((p: any, idx: number) => ({
    id: typeof p.id === 'number' ? p.id : (p.id ? Number(p.id) : Date.now() + idx),
    name: p.name || p.title || 'İsimsiz Ürün',
    price: Number(p.price ?? p.unit_price ?? 0) || 0,
    category: p.category || p.category_id || 'diğer',
    image: p.image || p.icon || '📦',
    available: p.available ?? p.is_active ?? true,
    stock: p.stock ?? p.quantity ?? 0,
    description: p.description ?? p.desc ?? '',
    createdAt: p.created_at || p.createdAt,
    updatedAt: p.updated_at || p.updatedAt,
  }));
};

export const productService = {
  // Liste
  getList: async (): Promise<Product[]> => {
    const res = await api.get('/products/list');
    const data = res.data;
    // Normalize shapes
    if (Array.isArray(data)) return normalizeList(data);
    if (data && Array.isArray(data.data)) return normalizeList(data.data);
    if (data && Array.isArray(data.products)) return normalizeList(data.products);
    // Fallback: try to return empty
    return [];
  },

  // Tek ürün
  getById: async (id: number): Promise<Product | null> => {
    const res = await api.get(`/products/${id}`);
    const data = res.data?.data ?? res.data;
    if (!data) return null;
    const [p] = normalizeList([data]);
    return p;
  },

  // Oluştur
  create: async (payload: Partial<Product>): Promise<Product> => {
    const res = await api.post('/products/create', payload);
    const data = res.data?.data ?? res.data;
    const [p] = normalizeList(Array.isArray(data) ? data : [data]);
    return p;
  },

  // Güncelle (put/patch destekli)
  update: async (id: number, payload: Partial<Product>): Promise<Product> => {
    const res = await api.put(`/products/${id}/update`, payload);
    const data = res.data?.data ?? res.data;
    const [p] = normalizeList(Array.isArray(data) ? data : [data]);
    return p;
  },

  // Sil
  remove: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/delete`);
  }
};
