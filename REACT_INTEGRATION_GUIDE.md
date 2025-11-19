# React Frontend Entegrasyon Rehberi

## 🎯 Hızlı Başlangıç

Bu döküman, POS Backend API'sini React projenize nasıl entegre edeceğinizi adım adım anlatır.

---

## 📦 1. Kurulum

### React Projesi Oluşturma
```bash
npx create-react-app pos-frontend
cd pos-frontend
```

### Gerekli Paketler
```bash
npm install axios react-router-dom
# veya
yarn add axios react-router-dom
```

---

## 🗂️ 2. Proje Yapısı

Aşağıdaki klasör yapısını oluşturun:

```
src/
├── api/
│   └── config.js
├── services/
│   ├── api.service.js
│   ├── cafe.service.js
│   ├── product.service.js
│   ├── category.service.js
│   ├── table.service.js
│   ├── order.service.js
│   └── index.js
├── hooks/
│   ├── useAuth.js
│   ├── useProducts.js
│   ├── useCategories.js
│   └── useTables.js
├── context/
│   └── AuthContext.js
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductForm.jsx
│   ├── categories/
│   │   └── CategoryList.jsx
│   ├── tables/
│   │   ├── TableLayout.jsx
│   │   └── TableCard.jsx
│   └── orders/
│       ├── OrderList.jsx
│       └── OrderForm.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── Dashboard.jsx
│   ├── ProductsPage.jsx
│   ├── CategoriesPage.jsx
│   ├── TablesPage.jsx
│   └── OrdersPage.jsx
└── App.js
```

---

## ⚙️ 3. Konfigürasyon Dosyaları

### .env Dosyası
React projenizin root dizininde `.env` dosyası oluşturun:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_APP_NAME=POS System
```

### API Config (src/api/config.js)
```javascript
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export const ENDPOINTS = {
  // Auth
  CAFE_REGISTER: '/cafe/register',
  CAFE_LOGIN: '/cafe/login',
  CAFE_LOGOUT: '/cafe/logout',
  CAFE_ME: '/cafe/me',
  
  // Cafes
  CAFES_LIST: '/cafes/list',
  CAFES_DETAIL: (id) => `/cafes/${id}`,
  CAFES_CREATE: '/cafes/create',
  CAFES_UPDATE: (id) => `/cafes/${id}/update`,
  CAFES_DELETE: (id) => `/cafes/${id}/delete`,
  
  // Products
  PRODUCTS_LIST: '/products/list',
  PRODUCTS_DETAIL: (id) => `/products/${id}`,
  PRODUCTS_CREATE: '/products/create',
  PRODUCTS_UPDATE: (id) => `/products/${id}/update`,
  PRODUCTS_DELETE: (id) => `/products/${id}/delete`,
  
  // Categories
  CATEGORIES_LIST: '/categories/list',
  CATEGORIES_DETAIL: (id) => `/categories/${id}`,
  CATEGORIES_CREATE: '/categories/create',
  CATEGORIES_UPDATE: (id) => `/categories/${id}/update`,
  CATEGORIES_DELETE: (id) => `/categories/${id}/delete`,
  
  // Table Definitions
  TABLE_DEFS_LIST: '/table-definitions/list',
  TABLE_DEFS_BY_CAFE: (cafeId) => `/table-definitions/cafe/${cafeId}`,
  TABLE_DEFS_DETAIL: (id) => `/table-definitions/${id}`,
  TABLE_DEFS_CREATE: '/table-definitions/create',
  TABLE_DEFS_UPDATE: (id) => `/table-definitions/${id}/update`,
  TABLE_DEFS_DELETE: (id) => `/table-definitions/${id}/delete`,
  
  // Orders
  ORDER_ITEMS_LIST: '/order-items/list',
  ORDER_ITEMS_CREATE: '/order-items/create',
  ORDER_ITEMS_UPDATE: (id) => `/order-items/${id}/update`,
  
  // Tables (Active Orders)
  TABLES_LIST: '/tables/list',
  TABLES_CREATE: '/tables/create',
  TABLES_UPDATE: (id) => `/tables/${id}/update`,
  
  // Past Orders
  PAST_ORDERS_LIST: '/past-orders/list',
  PAST_ORDERS_CREATE: '/past-orders/create',
  
  // Ratings
  RATINGS_LIST: '/ratings/list',
  RATINGS_CREATE: '/ratings/create',
  
  // Notifications
  NOTIFICATIONS_LIST: '/notifications/list',
  NOTIFICATIONS_CREATE: '/notifications/create',
  NOTIFICATIONS_UPDATE: (id) => `/notifications/${id}/update`,
};
```

---

## 🔧 4. Service Dosyaları

### Base API Service (src/services/api.service.js)
```javascript
import { API_CONFIG } from '../api/config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  getToken() {
    return localStorage.getItem('cafe_token');
  }

  getHeaders(authenticated = false) {
    const headers = { ...API_CONFIG.headers };
    
    if (authenticated) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.authenticated),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint, authenticated = false) {
    return this.request(endpoint, {
      method: 'GET',
      authenticated,
    });
  }

  async post(endpoint, data, authenticated = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      authenticated,
    });
  }

  async put(endpoint, data, authenticated = false) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      authenticated,
    });
  }

  async patch(endpoint, data, authenticated = false) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      authenticated,
    });
  }

  async delete(endpoint, authenticated = false) {
    return this.request(endpoint, {
      method: 'DELETE',
      authenticated,
    });
  }
}

export default new ApiService();
```

### Cafe Service (src/services/cafe.service.js)
```javascript
import api from './api.service';
import { ENDPOINTS } from '../api/config';

export const cafeService = {
  // Authentication
  async register(data) {
    const response = await api.post(ENDPOINTS.CAFE_REGISTER, data);
    if (response.token) {
      localStorage.setItem('cafe_token', response.token);
      localStorage.setItem('cafe_data', JSON.stringify(response.cafe));
    }
    return response;
  },

  async login(email, password) {
    const response = await api.post(ENDPOINTS.CAFE_LOGIN, { email, password });
    if (response.token) {
      localStorage.setItem('cafe_token', response.token);
      localStorage.setItem('cafe_data', JSON.stringify(response.cafe));
    }
    return response;
  },

  async logout() {
    await api.post(ENDPOINTS.CAFE_LOGOUT, {}, true);
    localStorage.removeItem('cafe_token');
    localStorage.removeItem('cafe_data');
  },

  async getMe() {
    return api.get(ENDPOINTS.CAFE_ME, true);
  },

  // CRUD Operations
  list: (page = 1) => api.get(`${ENDPOINTS.CAFES_LIST}?page=${page}`),
  get: (id) => api.get(ENDPOINTS.CAFES_DETAIL(id)),
  create: (data) => api.post(ENDPOINTS.CAFES_CREATE, data, true),
  update: (id, data) => api.patch(ENDPOINTS.CAFES_UPDATE(id), data, true),
  delete: (id) => api.delete(ENDPOINTS.CAFES_DELETE(id), true),

  // Helpers
  getCurrentCafe() {
    const data = localStorage.getItem('cafe_data');
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('cafe_token');
  },
};
```

### Product Service (src/services/product.service.js)
```javascript
import api from './api.service';
import { ENDPOINTS } from '../api/config';

export const productService = {
  list: (page = 1) => api.get(`${ENDPOINTS.PRODUCTS_LIST}?page=${page}`),
  get: (id) => api.get(ENDPOINTS.PRODUCTS_DETAIL(id)),
  create: (data) => api.post(ENDPOINTS.PRODUCTS_CREATE, data, true),
  update: (id, data) => api.patch(ENDPOINTS.PRODUCTS_UPDATE(id), data, true),
  delete: (id) => api.delete(ENDPOINTS.PRODUCTS_DELETE(id), true),

  // Custom methods
  async getByCafe(cafeId, page = 1) {
    const response = await api.get(`${ENDPOINTS.PRODUCTS_LIST}?page=${page}`);
    return {
      ...response,
      data: response.data.filter(p => p.cafe_id === cafeId)
    };
  },

  async getByCategory(categoryId, page = 1) {
    const response = await api.get(`${ENDPOINTS.PRODUCTS_LIST}?page=${page}`);
    return {
      ...response,
      data: response.data.filter(p => p.category_id === categoryId)
    };
  },

  async getActiveProducts(page = 1) {
    const response = await api.get(`${ENDPOINTS.PRODUCTS_LIST}?page=${page}`);
    return {
      ...response,
      data: response.data.filter(p => p.active)
    };
  },
};
```

### Category Service (src/services/category.service.js)
```javascript
import api from './api.service';
import { ENDPOINTS } from '../api/config';

export const categoryService = {
  list: (page = 1) => api.get(`${ENDPOINTS.CATEGORIES_LIST}?page=${page}`),
  get: (id) => api.get(ENDPOINTS.CATEGORIES_DETAIL(id)),
  create: (data) => api.post(ENDPOINTS.CATEGORIES_CREATE, data, true),
  update: (id, data) => api.patch(ENDPOINTS.CATEGORIES_UPDATE(id), data, true),
  delete: (id) => api.delete(ENDPOINTS.CATEGORIES_DELETE(id), true),

  async getByCafe(cafeId) {
    const response = await api.get(ENDPOINTS.CATEGORIES_LIST);
    return response.data.filter(cat => cat.cafe_id === cafeId && cat.active);
  },
};
```

### Table Service (src/services/table.service.js)
```javascript
import api from './api.service';
import { ENDPOINTS } from '../api/config';

export const tableService = {
  list: (page = 1) => api.get(`${ENDPOINTS.TABLE_DEFS_LIST}?page=${page}`),
  get: (id) => api.get(ENDPOINTS.TABLE_DEFS_DETAIL(id)),
  getByCafe: (cafeId) => api.get(ENDPOINTS.TABLE_DEFS_BY_CAFE(cafeId)),
  create: (data) => api.post(ENDPOINTS.TABLE_DEFS_CREATE, data, true),
  update: (id, data) => api.patch(ENDPOINTS.TABLE_DEFS_UPDATE(id), data, true),
  delete: (id) => api.delete(ENDPOINTS.TABLE_DEFS_DELETE(id), true),

  async groupByArea(cafeId) {
    const tables = await api.get(ENDPOINTS.TABLE_DEFS_BY_CAFE(cafeId));
    return tables.reduce((groups, table) => {
      const area = table.area || 'Diğer';
      if (!groups[area]) groups[area] = [];
      groups[area].push(table);
      return groups;
    }, {});
  },

  async getActiveTables(cafeId) {
    const tables = await api.get(ENDPOINTS.TABLE_DEFS_BY_CAFE(cafeId));
    return tables.filter(t => t.is_active);
  },
};
```

### Order Service (src/services/order.service.js)
```javascript
import api from './api.service';
import { ENDPOINTS } from '../api/config';

export const orderService = {
  // Order Items
  listOrderItems: (page = 1) => api.get(`${ENDPOINTS.ORDER_ITEMS_LIST}?page=${page}`, true),
  createOrderItem: (data) => api.post(ENDPOINTS.ORDER_ITEMS_CREATE, data, true),
  updateOrderItem: (id, data) => api.patch(ENDPOINTS.ORDER_ITEMS_UPDATE(id), data, true),

  // Active Tables
  listTables: (page = 1) => api.get(`${ENDPOINTS.TABLES_LIST}?page=${page}`, true),
  createTable: (data) => api.post(ENDPOINTS.TABLES_CREATE, data, true),
  updateTable: (id, data) => api.patch(ENDPOINTS.TABLES_UPDATE(id), data, true),

  // Past Orders
  listPastOrders: (page = 1) => api.get(`${ENDPOINTS.PAST_ORDERS_LIST}?page=${page}`, true),
  createPastOrder: (data) => api.post(ENDPOINTS.PAST_ORDERS_CREATE, data, true),

  // Helpers
  async getOrdersByTable(tableNumber) {
    const response = await api.get(ENDPOINTS.ORDER_ITEMS_LIST, true);
    return response.data.filter(item => item.table_number === tableNumber);
  },

  async getPendingOrders(cafeId) {
    const response = await api.get(ENDPOINTS.ORDER_ITEMS_LIST, true);
    return response.data.filter(item => 
      item.cafe_id === cafeId && item.status === 'pending'
    );
  },
};
```

### Index (src/services/index.js)
```javascript
export { cafeService } from './cafe.service';
export { productService } from './product.service';
export { categoryService } from './category.service';
export { tableService } from './table.service';
export { orderService } from './order.service';
```

---

## 🎣 5. Custom Hooks

### useAuth Hook (src/hooks/useAuth.js)
```javascript
import { useState, useEffect, createContext, useContext } from 'react';
import { cafeService } from '../services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (cafeService.isAuthenticated()) {
        const response = await cafeService.getMe();
        setUser(response.cafe);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await cafeService.login(email, password);
    setUser(response.cafe);
    return response;
  };

  const register = async (data) => {
    const response = await cafeService.register(data);
    setUser(response.cafe);
    return response;
  };

  const logout = async () => {
    try {
      await cafeService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### useProducts Hook (src/hooks/useProducts.js)
```javascript
import { useState, useEffect } from 'react';
import { productService } from '../services';

export const useProducts = (page = 1, cafeId = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [page, cafeId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = cafeId 
        ? await productService.getByCafe(cafeId, page)
        : await productService.list(page);
      
      setProducts(data.data);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        perPage: data.per_page,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    const newProduct = await productService.create(productData);
    setProducts([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = async (id, productData) => {
    const updated = await productService.update(id, productData);
    setProducts(products.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id) => {
    await productService.delete(id);
    setProducts(products.filter(p => p.id !== id));
  };

  return {
    products,
    loading,
    error,
    pagination,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
```

---

## 🖼️ 6. Component Örnekleri

### Login Component (src/components/auth/Login.jsx)
```javascript
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Giriş başarısız');
    }
  };

  return (
    <div className="login-container">
      <h2>Kafe Girişi</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
```

### Product List Component (src/components/products/ProductList.jsx)
```javascript
import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';

const ProductList = ({ categoryId, cafeId }) => {
  const { products, loading, error, pagination } = useProducts(1, cafeId);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  const filteredProducts = categoryId
    ? products.filter(p => p.category_id === categoryId)
    : products;

  return (
    <div className="product-list">
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {pagination && (
        <div className="pagination">
          <span>
            Sayfa {pagination.currentPage} / {pagination.lastPage}
          </span>
          <span>Toplam: {pagination.total} ürün</span>
        </div>
      )}
    </div>
  );
};

export default ProductList;
```

---

## 🚀 7. App.js Konfigürasyonu

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import TablesPage from './pages/TablesPage';
import OrdersPage from './pages/OrdersPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Yükleniyor...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/products" element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          } />
          <Route path="/categories" element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          } />
          <Route path="/tables" element={
            <PrivateRoute>
              <TablesPage />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## ✅ 8. Test Etme

### API Bağlantısını Test Etme
```javascript
// Test.jsx
import { useEffect } from 'react';
import { productService } from './services';

const Test = () => {
  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      const products = await productService.list();
      console.log('Products:', products);
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  return <div>API Test - Console'u kontrol edin</div>;
};
```

---

## 🔒 9. Güvenlik İpuçları

1. **Token Yönetimi**: Token'ları güvenli şekilde saklayın
2. **HTTPS**: Production'da mutlaka HTTPS kullanın
3. **CORS**: Backend'de CORS ayarlarını doğru yapılandırın
4. **Validation**: Her zaman frontend validasyonu yapın
5. **Error Handling**: Kullanıcıya anlamlı hata mesajları gösterin

---

## 🎨 10. Stil Önerileri

- Tailwind CSS
- Material-UI
- Ant Design
- Bootstrap

---

## 📚 Ek Kaynaklar

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

**Başarılar! 🚀**
