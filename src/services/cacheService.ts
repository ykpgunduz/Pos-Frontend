import { Product } from '../types';
import { Category } from './categoryService';
import { productService } from './productService';
import { categoryService } from './categoryService';

const CACHE_KEYS = {
  PRODUCTS: 'pos_cache_products',
  CATEGORIES: 'pos_cache_categories',
  LAST_UPDATE: 'pos_cache_last_update',
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat (millisaniye)

export const cacheService = {
  // Kategorileri cache'den al veya API'den çek
  getCategories: async (forceRefresh: boolean = false): Promise<Category[]> => {
    if (!forceRefresh) {
      const cached = localStorage.getItem(CACHE_KEYS.CATEGORIES);
      const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
      
      if (cached && lastUpdate) {
        const cacheAge = Date.now() - parseInt(lastUpdate);
        if (cacheAge < CACHE_DURATION) {
          console.log('Kategoriler cache\'den yüklendi');
          return JSON.parse(cached);
        }
      }
    }

    console.log('Kategoriler API\'den yükleniyor...');
    const categories = await categoryService.getList();
    localStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(categories));
    localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
    return categories;
  },

  // Kategori isimlerini cache'den al
  getCategoryNames: async (forceRefresh: boolean = false): Promise<string[]> => {
    const categories = await cacheService.getCategories(forceRefresh);
    return categories.map(c => c.name);
  },

  // Ürünleri cache'den al veya API'den çek
  getProducts: async (forceRefresh: boolean = false): Promise<Product[]> => {
    if (!forceRefresh) {
      const cached = localStorage.getItem(CACHE_KEYS.PRODUCTS);
      const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
      
      if (cached && lastUpdate) {
        const cacheAge = Date.now() - parseInt(lastUpdate);
        if (cacheAge < CACHE_DURATION) {
          console.log('Ürünler cache\'den yüklendi');
          return JSON.parse(cached);
        }
      }
    }

    console.log('Ürünler API\'den yükleniyor...');
    const products = await productService.getList();
    localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
    return products;
  },

  // Tüm cache'i temizle ve yeniden yükle
  refreshCache: async (): Promise<{ 
    products: Product[], 
    categories: Category[],
    timestamp: number 
  }> => {
    console.log('Cache yenileniyor...');
    
    const [products, categories] = await Promise.all([
      productService.getList(),
      categoryService.getList(),
    ]);

    const timestamp = Date.now();
    
    localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(categories));
    localStorage.setItem(CACHE_KEYS.LAST_UPDATE, timestamp.toString());

    console.log(`Cache güncellendi: ${products.length} ürün, ${categories.length} kategori`);

    return { products, categories, timestamp };
  },

  // Cache bilgilerini al
  getCacheInfo: () => {
    const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
    const productsCache = localStorage.getItem(CACHE_KEYS.PRODUCTS);
    const categoriesCache = localStorage.getItem(CACHE_KEYS.CATEGORIES);

    let productCount = 0;
    let categoryCount = 0;

    try {
      if (productsCache) productCount = JSON.parse(productsCache).length;
      if (categoriesCache) categoryCount = JSON.parse(categoriesCache).length;
    } catch (e) {
      console.error('Cache okuma hatası:', e);
    }

    return {
      lastUpdate: lastUpdate ? new Date(parseInt(lastUpdate)) : null,
      productCount,
      categoryCount,
      hasCache: !!(productsCache && categoriesCache),
    };
  },

  // Cache'i temizle
  clearCache: () => {
    localStorage.removeItem(CACHE_KEYS.PRODUCTS);
    localStorage.removeItem(CACHE_KEYS.CATEGORIES);
    localStorage.removeItem(CACHE_KEYS.LAST_UPDATE);
    console.log('Cache temizlendi');
  },
};
