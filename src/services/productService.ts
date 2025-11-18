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
  // Liste - artık opsiyonel filtreleri (kategori, search) destekler
  getList: async (opts?: { category?: string; search?: string; }): Promise<Product[]> => {
    const category = opts?.category;
    const search = opts?.search;

    // Try several endpoints / param shapes so client is tolerant to backend differences
    const attempts: Array<{ url: string; params?: Record<string, any> }> = [
      { url: '/products/list', params: { ...(category ? { category } : {}), ...(search ? { q: search } : {}) } },
      { url: '/products', params: { ...(category ? { category } : {}), ...(search ? { q: search } : {}) } },
    ];

    // If category present, also try category-specific endpoint
    if (category) {
      attempts.push({ url: `/products/category/${encodeURIComponent(category)}` });
      attempts.push({ url: `/products/by-category`, params: { category } });
    }

    for (const attempt of attempts) {
      try {
        const res = await api.get(attempt.url, attempt.params ? { params: attempt.params } : undefined);
        const data = res.data;
        // Normalize shapes
        if (Array.isArray(data)) return normalizeList(data);
        if (data && Array.isArray(data.data)) return normalizeList(data.data);
        if (data && Array.isArray(data.products)) return normalizeList(data.products);
        if (data && Array.isArray(data.results)) return normalizeList(data.results);
        // Some APIs return object with items field
        if (data && Array.isArray(data.items)) return normalizeList(data.items);
      } catch (e) {
        // try next attempt
        continue;
      }
    }

    // Fallback: boş dizi
    return [];
  },

  // Kategoriler - çeşitli API şekillerine toleranslı şekilde dener
  getCategories: async (): Promise<string[]> => {
    const endpoints = ['/categories', '/products/categories', '/categories/list'];
    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res.data;
        let arr: any[] | null = null;
        if (Array.isArray(data)) arr = data;
        else if (data && Array.isArray(data.data)) arr = data.data;
        else if (data && Array.isArray(data.categories)) arr = data.categories;
        else if (data && Array.isArray(data.results)) arr = data.results;

        if (arr && arr.length > 0) {
          const names = arr.map((c: any) => {
            if (!c && c !== 0) return '';
            if (typeof c === 'string') return c;
            return c.name || c.title || c.label || c.category || String(c.id ?? c.value ?? '');
          }).filter(Boolean) as string[];
          if (names.length > 0) return names;
        }
      } catch (e) {
        // endpoint yoksa ya da hata dönüyorsa diğer endpointleri dene
        continue;
      }
    }
    // Fallback: boş dizi
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
