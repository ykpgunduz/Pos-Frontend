# POS Backend API Documentation

## 📋 İçindekiler
- [Genel Bilgiler](#genel-bilgiler)
- [Kimlik Doğrulama](#kimlik-doğrulama)
- [API Endpoints](#api-endpoints)
  - [Cafe Authentication](#cafe-authentication)
  - [Cafes](#cafes)
  - [Categories](#categories)
  - [Products](#products)
  - [Table Definitions](#table-definitions)
  - [Tables (Order Management)](#tables-order-management)
  - [Carts](#carts)
  - [Order Items](#order-items)
  - [Past Orders](#past-orders)
  - [Past Items](#past-items)
  - [Notifications](#notifications)
  - [Cancels](#cancels)
  - [Ratings](#ratings)
  - [Users](#users)

---

## 🌐 Genel Bilgiler

### Base URL
```
http://localhost:8000/api
```
veya production ortamınızın URL'i

### Response Format
Tüm API yanıtları JSON formatındadır.

### HTTP Status Codes
- `200 OK` - İstek başarılı
- `201 Created` - Kaynak başarıyla oluşturuldu
- `400 Bad Request` - Geçersiz istek
- `401 Unauthorized` - Kimlik doğrulama gerekli
- `404 Not Found` - Kaynak bulunamadı
- `422 Unprocessable Entity` - Validation hatası
- `500 Internal Server Error` - Sunucu hatası

### Pagination
Liste endpoint'leri pagination destekler:
```json
{
  "current_page": 1,
  "data": [...],
  "first_page_url": "http://localhost:8000/api/products/list?page=1",
  "from": 1,
  "last_page": 5,
  "last_page_url": "http://localhost:8000/api/products/list?page=5",
  "next_page_url": "http://localhost:8000/api/products/list?page=2",
  "path": "http://localhost:8000/api/products/list",
  "per_page": 20,
  "prev_page_url": null,
  "to": 20,
  "total": 100
}
```

---

## 🔐 Kimlik Doğrulama

API, Laravel Sanctum kullanarak token-based authentication sağlar.

### Authentication Header
Korumalı endpoint'ler için:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

---

## 📡 API Endpoints

## Cafe Authentication

### 1. Cafe Register (Kafe Kaydı)
**Endpoint:** `POST /api/cafe/register`

**Request Body:**
```json
{
  "name": "Kahve Dükkanı",
  "email": "cafe@example.com",
  "password": "12345678",
  "password_confirmation": "12345678",
  "phone": "05551234567",
  "address": "İstanbul, Türkiye",
  "description": "En iyi kahve",
  "table_count": 15
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique
- `password`: required, min:8, confirmed
- `phone`: nullable, string
- `address`: nullable, string
- `description`: nullable, string
- `table_count`: required, integer, min:1

**Response (201):**
```json
{
  "message": "Kafe başarıyla oluşturuldu",
  "cafe": {
    "id": 1,
    "name": "Kahve Dükkanı",
    "email": "cafe@example.com",
    "phone": "05551234567",
    "address": "İstanbul, Türkiye",
    "description": "En iyi kahve",
    "table_count": 15,
    "created_at": "2025-11-19T10:00:00.000000Z",
    "updated_at": "2025-11-19T10:00:00.000000Z"
  },
  "token": "1|laravel_sanctum_token_here"
}
```

**React Örnek:**
```javascript
const registerCafe = async (cafeData) => {
  try {
    const response = await fetch('http://localhost:8000/api/cafe/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cafeData)
    });
    const data = await response.json();
    
    if (response.ok) {
      // Token'ı localStorage'a kaydet
      localStorage.setItem('cafe_token', data.token);
      localStorage.setItem('cafe_data', JSON.stringify(data.cafe));
      return data;
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

### 2. Cafe Login (Kafe Girişi)
**Endpoint:** `POST /api/cafe/login`

**Request Body:**
```json
{
  "email": "cafe@example.com",
  "password": "12345678"
}
```

**Response (200):**
```json
{
  "message": "Giriş başarılı",
  "cafe": { ... },
  "token": "2|laravel_sanctum_token_here"
}
```

**React Örnek:**
```javascript
const loginCafe = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/cafe/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('cafe_token', data.token);
    localStorage.setItem('cafe_data', JSON.stringify(data.cafe));
  }
  
  return data;
};
```

---

### 3. Cafe Logout (Çıkış)
**Endpoint:** `POST /api/cafe/logout`

**Headers:** Authorization required

**Response (200):**
```json
{
  "message": "Çıkış başarılı"
}
```

**React Örnek:**
```javascript
const logoutCafe = async () => {
  const token = localStorage.getItem('cafe_token');
  
  const response = await fetch('http://localhost:8000/api/cafe/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  if (response.ok) {
    localStorage.removeItem('cafe_token');
    localStorage.removeItem('cafe_data');
  }
};
```

---

### 4. Get Current Cafe (Mevcut Kafe Bilgisi)
**Endpoint:** `GET /api/cafe/me`

**Headers:** Authorization required

**Response (200):**
```json
{
  "cafe": {
    "id": 1,
    "name": "Kahve Dükkanı",
    "email": "cafe@example.com",
    ...
  }
}
```

---

## Cafes

### 1. List All Cafes
**Endpoint:** `GET /api/cafes/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Kahve Dükkanı",
      "description": "En iyi kahve",
      "phone": "05551234567",
      "address": "İstanbul, Türkiye",
      "address_link": null,
      "insta_name": "@kahvedukkani",
      "insta_link": "https://instagram.com/kahvedukkani",
      "opening_time": 8,
      "closing_time": 22,
      "table_count": 15,
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

**React Örnek:**
```javascript
const fetchCafes = async (page = 1) => {
  const response = await fetch(`http://localhost:8000/api/cafes/list?page=${page}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return await response.json();
};
```

---

### 2. Get Single Cafe
**Endpoint:** `GET /api/cafes/{id}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Kahve Dükkanı",
  ...
}
```

---

### 3. Create Cafe
**Endpoint:** `POST /api/cafes/create`

**Request Body:**
```json
{
  "name": "Yeni Kafe",
  "description": "Kafe açıklaması",
  "phone": "05551234567",
  "address": "Adres",
  "address_link": "https://maps.google.com/...",
  "insta_name": "@yeniKafe",
  "insta_link": "https://instagram.com/yenikafe",
  "opening_time": 9,
  "closing_time": 23,
  "table_count": 20
}
```

**Validation:**
- `name`: required, string
- `table_count`: required, integer, min:1
- Diğer alanlar: nullable

---

### 4. Update Cafe
**Endpoint:** `PUT /api/cafes/{id}/update` veya `PATCH /api/cafes/{id}/update`

**Request Body:**
```json
{
  "name": "Güncellenmiş Kafe Adı",
  "description": "Yeni açıklama"
}
```

---

### 5. Delete Cafe
**Endpoint:** `DELETE /api/cafes/{id}/delete`

**Response (200):**
```json
{
  "deleted": true
}
```

---

## Categories

### 1. List All Categories
**Endpoint:** `GET /api/categories/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "name": "Sıcak İçecekler",
      "description": "Kahve, çay ve sıcak içecekler",
      "active": true,
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

**React Örnek:**
```javascript
const fetchCategories = async (cafeId = null) => {
  const response = await fetch('http://localhost:8000/api/categories/list', {
    headers: { 'Accept': 'application/json' }
  });
  const data = await response.json();
  
  // Eğer belirli bir kafeye ait kategorileri istiyorsanız:
  if (cafeId) {
    return {
      ...data,
      data: data.data.filter(cat => cat.cafe_id === cafeId)
    };
  }
  
  return data;
};
```

---

### 2. Create Category
**Endpoint:** `POST /api/categories/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "name": "Tatlılar",
  "description": "Tatlı çeşitleri",
  "active": true
}
```

**Validation:**
- `cafe_id`: required, integer
- `name`: required, string
- `description`: nullable, string
- `active`: nullable, boolean

---

## Products

### 1. List All Products
**Endpoint:** `GET /api/products/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "category_id": 1,
      "image": "https://example.com/image.jpg",
      "name": "Türk Kahvesi",
      "description": "Geleneksel Türk kahvesi",
      "price": 35,
      "stock": 100,
      "active": true,
      "star": 5,
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

**React Örnek:**
```javascript
const fetchProducts = async (page = 1) => {
  const response = await fetch(`http://localhost:8000/api/products/list?page=${page}`, {
    headers: { 'Accept': 'application/json' }
  });
  return await response.json();
};

// Kategoriye göre filtreleme (frontend tarafında)
const getProductsByCategory = (products, categoryId) => {
  return products.filter(p => p.category_id === categoryId);
};
```

---

### 2. Get Single Product
**Endpoint:** `GET /api/products/{id}`

**Response (200):**
```json
{
  "id": 1,
  "cafe_id": 1,
  "category_id": 1,
  "name": "Türk Kahvesi",
  "price": 35,
  "category": {
    "id": 1,
    "name": "Sıcak İçecekler"
  },
  "cafe": {
    "id": 1,
    "name": "Kahve Dükkanı"
  },
  ...
}
```

---

### 3. Create Product
**Endpoint:** `POST /api/products/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "category_id": 1,
  "image": "https://example.com/image.jpg",
  "name": "Espresso",
  "description": "İtalyan usulü espresso",
  "price": 30,
  "stock": 50,
  "active": true,
  "star": 5
}
```

**Validation:**
- `cafe_id`: required, integer
- `category_id`: required, integer
- `name`: required, string
- `image`: nullable, string
- `price`: nullable, integer
- `stock`: nullable, integer
- `active`: nullable, boolean
- `star`: nullable, integer

**React Örnek:**
```javascript
const createProduct = async (productData) => {
  const token = localStorage.getItem('cafe_token');
  
  const response = await fetch('http://localhost:8000/api/products/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  
  return await response.json();
};
```

---

### 4. Update Product
**Endpoint:** `PUT /api/products/{id}/update` veya `PATCH /api/products/{id}/update`

---

### 5. Delete Product
**Endpoint:** `DELETE /api/products/{id}/delete`

---

## Table Definitions (Masa Tanımları)

### 1. List All Table Definitions
**Endpoint:** `GET /api/table-definitions/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "name": "Bahçe 1",
      "area": "Bahçe",
      "table_number": 1,
      "capacity": 4,
      "position_x": "100",
      "position_y": "200",
      "is_active": true,
      "notes": "Pencere kenarı",
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z",
      "cafe": {
        "id": 1,
        "name": "Kahve Dükkanı"
      }
    }
  ],
  "per_page": 20,
  "total": 1
}
```

---

### 2. Get Tables by Cafe
**Endpoint:** `GET /api/table-definitions/cafe/{cafeId}`

**Response (200):**
```json
[
  {
    "id": 1,
    "cafe_id": 1,
    "name": "Bahçe 1",
    "area": "Bahçe",
    "table_number": 1,
    "capacity": 4,
    "position_x": "100",
    "position_y": "200",
    "is_active": true,
    "notes": null
  },
  {
    "id": 2,
    "cafe_id": 1,
    "name": "Salon 1",
    "area": "Salon",
    "table_number": 2,
    "capacity": 6,
    "position_x": "200",
    "position_y": "300",
    "is_active": true,
    "notes": null
  }
]
```

**React Örnek:**
```javascript
const fetchCafeTables = async (cafeId) => {
  const response = await fetch(`http://localhost:8000/api/table-definitions/cafe/${cafeId}`, {
    headers: { 'Accept': 'application/json' }
  });
  return await response.json();
};

// Bölgeye göre gruplama
const groupTablesByArea = (tables) => {
  return tables.reduce((groups, table) => {
    const area = table.area || 'Diğer';
    if (!groups[area]) {
      groups[area] = [];
    }
    groups[area].push(table);
    return groups;
  }, {});
};

// Kullanım:
const tables = await fetchCafeTables(1);
const grouped = groupTablesByArea(tables);
// Sonuç: { "Bahçe": [...], "Salon": [...] }
```

---

### 3. Create Table Definition
**Endpoint:** `POST /api/table-definitions/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "name": "Teras 3",
  "area": "Teras",
  "table_number": 3,
  "capacity": 2,
  "position_x": "150",
  "position_y": "250",
  "is_active": true,
  "notes": "Deniz manzaralı"
}
```

**Validation:**
- `cafe_id`: required, integer, exists:cafes,id
- `name`: required, string, max:255
- `area`: nullable, string, max:255
- `table_number`: required, integer
- `capacity`: nullable, integer, min:1
- `position_x`: nullable, string
- `position_y`: nullable, string
- `is_active`: nullable, boolean
- `notes`: nullable, string

---

### 4. Update Table Definition
**Endpoint:** `PUT /api/table-definitions/{id}/update`

---

### 5. Delete Table Definition
**Endpoint:** `DELETE /api/table-definitions/{id}/delete`

---

## Tables (Order Management - Sipariş Yönetimi)

### 1. List All Tables
**Endpoint:** `GET /api/tables/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "table_number": 5,
      "order_number": "ORD-2025-001",
      "customer": 3,
      "status": "active",
      "treat": 0,
      "total_amount": 150,
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

---

### 2. Create Table Order
**Endpoint:** `POST /api/tables/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "table_number": 5,
  "order_number": "ORD-2025-002",
  "customer": 4,
  "status": "active",
  "treat": 0,
  "total_amount": 200
}
```

---

## Carts

### 1. List Carts
**Endpoint:** `GET /api/carts/list`

---

### 2. Create Cart Item
**Endpoint:** `POST /api/carts/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "product_id": 5,
  "quantity": 2,
  "price": 70
}
```

---

## Order Items

### 1. List Order Items
**Endpoint:** `GET /api/order-items/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "table_number": 5,
      "order_number": "ORD-2025-001",
      "product_id": 3,
      "product_price": 35,
      "note": "Az şekerli",
      "quantity": 2,
      "status": "pending",
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

---

### 2. Create Order Item
**Endpoint:** `POST /api/order-items/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "table_number": 5,
  "order_number": "ORD-2025-001",
  "product_id": 3,
  "product_price": 35,
  "note": "Çok sıcak olsun",
  "quantity": 1,
  "status": "pending"
}
```

**React Örnek:**
```javascript
const createOrderItem = async (orderData) => {
  const token = localStorage.getItem('cafe_token');
  
  const response = await fetch('http://localhost:8000/api/order-items/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  
  return await response.json();
};
```

---

### 3. Update Order Item Status
**Endpoint:** `PATCH /api/order-items/{id}/update`

**Request Body:**
```json
{
  "status": "completed"
}
```

---

## Past Orders

### 1. List Past Orders
**Endpoint:** `GET /api/past-orders/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "order_number": "ORD-2025-001",
      "table_number": 5,
      "customer": 3,
      "total_amount": 150,
      "payment_method": "cash",
      "completed_at": "2025-11-19T15:30:00.000000Z",
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T15:30:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

---

### 2. Create Past Order
**Endpoint:** `POST /api/past-orders/create`

---

## Past Items

### 1. List Past Items
**Endpoint:** `GET /api/past-items/list`

---

### 2. Create Past Item
**Endpoint:** `POST /api/past-items/create`

---

## Notifications

### 1. List Notifications
**Endpoint:** `GET /api/notifications/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "user_id": 2,
      "type": 1,
      "data": "{\"message\": \"Yeni sipariş\"}",
      "read_at": null,
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

---

### 2. Create Notification
**Endpoint:** `POST /api/notifications/create`

---

### 3. Mark as Read
**Endpoint:** `PATCH /api/notifications/{id}/update`

**Request Body:**
```json
{
  "read_at": "2025-11-19T10:00:00.000000Z"
}
```

---

## Cancels

### 1. List Cancellations
**Endpoint:** `GET /api/cancels/list`

---

### 2. Create Cancellation
**Endpoint:** `POST /api/cancels/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "status": "cancelled",
  "product_info": "Türk Kahvesi x2",
  "description": "Müşteri fikir değiştirdi"
}
```

---

## Ratings

### 1. List Ratings
**Endpoint:** `GET /api/ratings/list`

**Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "cafe_id": 1,
      "order_number": "ORD-2025-001",
      "service_rating": 5,
      "product_rating": 4,
      "ambiance_rating": 5,
      "return_response": true,
      "comment": "Çok güzeldi, teşekkürler",
      "created_at": "2025-11-19T10:00:00.000000Z",
      "updated_at": "2025-11-19T10:00:00.000000Z"
    }
  ],
  "per_page": 20,
  "total": 1
}
```

---

### 2. Create Rating
**Endpoint:** `POST /api/ratings/create`

**Request Body:**
```json
{
  "cafe_id": 1,
  "order_number": "ORD-2025-001",
  "service_rating": 5,
  "product_rating": 4,
  "ambiance_rating": 5,
  "return_response": true,
  "comment": "Harika bir deneyimdi"
}
```

---

## Users

### 1. List Users
**Endpoint:** `GET /api/users/list`

---

### 2. Create User
**Endpoint:** `POST /api/users/create`

---

### 3. Update User
**Endpoint:** `PATCH /api/users/{id}/update`

---

### 4. Delete User
**Endpoint:** `DELETE /api/users/{id}/delete`

---

## 🎯 React Frontend Entegrasyon Örnekleri

### API Service (api.js)

```javascript
// src/services/api.js

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('cafe_token');
  }

  getHeaders(authenticated = false) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (authenticated) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.authenticated),
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, authenticated = false) {
    return this.request(endpoint, {
      method: 'GET',
      authenticated
    });
  }

  // POST request
  async post(endpoint, data, authenticated = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      authenticated
    });
  }

  // PUT request
  async put(endpoint, data, authenticated = false) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      authenticated
    });
  }

  // PATCH request
  async patch(endpoint, data, authenticated = false) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      authenticated
    });
  }

  // DELETE request
  async delete(endpoint, authenticated = false) {
    return this.request(endpoint, {
      method: 'DELETE',
      authenticated
    });
  }
}

export default new ApiService();
```

---

### Cafe Service (cafeService.js)

```javascript
// src/services/cafeService.js
import api from './api';

export const cafeService = {
  // Authentication
  register: (data) => api.post('/cafe/register', data),
  login: (email, password) => api.post('/cafe/login', { email, password }),
  logout: () => api.post('/cafe/logout', {}, true),
  getMe: () => api.get('/cafe/me', true),

  // Cafes CRUD
  list: (page = 1) => api.get(`/cafes/list?page=${page}`),
  get: (id) => api.get(`/cafes/${id}`),
  create: (data) => api.post('/cafes/create', data),
  update: (id, data) => api.patch(`/cafes/${id}/update`, data),
  delete: (id) => api.delete(`/cafes/${id}/delete`),
};
```

---

### Product Service (productService.js)

```javascript
// src/services/productService.js
import api from './api';

export const productService = {
  list: (page = 1) => api.get(`/products/list?page=${page}`),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products/create', data, true),
  update: (id, data) => api.patch(`/products/${id}/update`, data, true),
  delete: (id) => api.delete(`/products/${id}/delete`, true),
  
  // Helper functions
  getByCategory: async (categoryId, page = 1) => {
    const response = await api.get(`/products/list?page=${page}`);
    return {
      ...response,
      data: response.data.filter(p => p.category_id === categoryId)
    };
  }
};
```

---

### Category Service (categoryService.js)

```javascript
// src/services/categoryService.js
import api from './api';

export const categoryService = {
  list: (page = 1) => api.get(`/categories/list?page=${page}`),
  get: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories/create', data, true),
  update: (id, data) => api.patch(`/categories/${id}/update`, data, true),
  delete: (id) => api.delete(`/categories/${id}/delete`, true),
  
  getByCafe: async (cafeId) => {
    const response = await api.get('/categories/list');
    return response.data.filter(cat => cat.cafe_id === cafeId);
  }
};
```

---

### Table Definition Service (tableDefinitionService.js)

```javascript
// src/services/tableDefinitionService.js
import api from './api';

export const tableDefinitionService = {
  list: (page = 1) => api.get(`/table-definitions/list?page=${page}`),
  get: (id) => api.get(`/table-definitions/${id}`),
  getByCafe: (cafeId) => api.get(`/table-definitions/cafe/${cafeId}`),
  create: (data) => api.post('/table-definitions/create', data, true),
  update: (id, data) => api.patch(`/table-definitions/${id}/update`, data, true),
  delete: (id) => api.delete(`/table-definitions/${id}/delete`, true),
  
  // Helper: Group tables by area
  groupByArea: async (cafeId) => {
    const tables = await api.get(`/table-definitions/cafe/${cafeId}`);
    return tables.reduce((groups, table) => {
      const area = table.area || 'Diğer';
      if (!groups[area]) groups[area] = [];
      groups[area].push(table);
      return groups;
    }, {});
  }
};
```

---

### Order Service (orderService.js)

```javascript
// src/services/orderService.js
import api from './api';

export const orderService = {
  // Order Items
  listOrderItems: (page = 1) => api.get(`/order-items/list?page=${page}`),
  getOrderItem: (id) => api.get(`/order-items/${id}`),
  createOrderItem: (data) => api.post('/order-items/create', data, true),
  updateOrderItem: (id, data) => api.patch(`/order-items/${id}/update`, data, true),
  deleteOrderItem: (id) => api.delete(`/order-items/${id}/delete`, true),
  
  // Tables (Active Orders)
  listTables: (page = 1) => api.get(`/tables/list?page=${page}`),
  getTable: (id) => api.get(`/tables/${id}`),
  createTable: (data) => api.post('/tables/create', data, true),
  updateTable: (id, data) => api.patch(`/tables/${id}/update`, data, true),
  deleteTable: (id) => api.delete(`/tables/${id}/delete`, true),
  
  // Past Orders
  listPastOrders: (page = 1) => api.get(`/past-orders/list?page=${page}`),
  createPastOrder: (data) => api.post('/past-orders/create', data, true),
};
```

---

### React Hook Example (useProducts.js)

```javascript
// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = (page = 1) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.list(page);
      setProducts(data.data);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        perPage: data.per_page
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updated = await productService.update(id, productData);
      setProducts(products.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
```

---

### React Component Example (ProductList.jsx)

```javascript
// src/components/ProductList.jsx
import React from 'react';
import { useProducts } from '../hooks/useProducts';

const ProductList = ({ categoryId }) => {
  const { products, loading, error, pagination } = useProducts();

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  const filteredProducts = categoryId 
    ? products.filter(p => p.category_id === categoryId)
    : products;

  return (
    <div className="product-list">
      <h2>Ürünler</h2>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img src={product.image} alt={product.name} />
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">{product.price} ₺</p>
            <p className="stock">Stok: {product.stock}</p>
            {product.star && (
              <p className="rating">⭐ {product.star}/5</p>
            )}
          </div>
        ))}
      </div>
      
      {pagination && (
        <div className="pagination">
          <p>
            Sayfa {pagination.currentPage} / {pagination.lastPage}
            (Toplam {pagination.total} ürün)
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
```

---

### Complete React App Structure

```
src/
├── services/
│   ├── api.js                    # Base API service
│   ├── cafeService.js            # Cafe endpoints
│   ├── productService.js         # Product endpoints
│   ├── categoryService.js        # Category endpoints
│   ├── tableDefinitionService.js # Table Definition endpoints
│   ├── orderService.js           # Order endpoints
│   ├── ratingService.js          # Rating endpoints
│   └── notificationService.js    # Notification endpoints
│
├── hooks/
│   ├── useProducts.js
│   ├── useCategories.js
│   ├── useTables.js
│   ├── useOrders.js
│   └── useAuth.js
│
├── components/
│   ├── ProductList.jsx
│   ├── CategoryList.jsx
│   ├── TableLayout.jsx
│   ├── OrderManagement.jsx
│   └── Dashboard.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Products.jsx
│   ├── Categories.jsx
│   ├── Tables.jsx
│   └── Orders.jsx
│
├── contexts/
│   └── AuthContext.jsx
│
├── utils/
│   ├── constants.js
│   └── helpers.js
│
└── App.jsx
```

---

## 🔧 Environment Variables (.env)

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=30000
```

---

## 📝 Notlar

1. **CORS**: Backend'de CORS ayarlarının doğru yapılandırıldığından emin olun
2. **Token Yönetimi**: Token'ları güvenli şekilde saklayın (localStorage veya httpOnly cookies)
3. **Error Handling**: Tüm API isteklerinde hata yönetimi yapın
4. **Loading States**: Kullanıcıya feedback için loading state'leri kullanın
5. **Pagination**: Büyük veri setleri için pagination kullanın
6. **Validation**: Frontend'de de validation yaparak API isteklerini azaltın

---

## 🚀 Başlangıç

1. Backend'i çalıştırın: `php artisan serve`
2. React projenizi oluşturun: `npx create-react-app pos-frontend`
3. Services dosyalarını oluşturun
4. API entegrasyonunu test edin
5. Bileşenlerinizi geliştirin

---

## 📞 Destek

API ile ilgili sorunlar için backend loglarını kontrol edin:
```bash
tail -f storage/logs/laravel.log
```

---

**Son Güncelleme:** 19 Kasım 2025
