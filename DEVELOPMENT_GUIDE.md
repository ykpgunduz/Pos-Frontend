# 🤖 AI DEVELOPMENT GUIDE - Cafe/Restoran POS Sistemi

> **ÖNEMLİ**: Bu dosyayı her AI oturumunun başında paylaşın ve her görev öncesi referans verin!

---

## 📋 HIZLI BAŞLANGIÇ

### Proje Hakkında Kısa Bilgi
- **Proje**: Cafe/Restoran Point of Sale (POS) ve Sipariş Yönetim Sistemi
- **Teknoloji**: React 18 + TypeScript + Vite
- **Stil**: Pure CSS (CSS Variables)
- **Durum**: Frontend geliştirme aşamasında - Backend API entegrasyonu bekliyor
- **Tema**: Pink/Rose gradient tasarım, Dark/Light mode destekli

### Kritik Bilgiler
✅ **Responsive**: Mobile-first, 3 breakpoint (320px, 768px, 1024px+)  
✅ **Renk Paleti**: Pink (#ec4899) primary, Violet (#8b5cf6) secondary  
✅ **Font**: Inter font family  
✅ **Icons**: Lucide React  
✅ **Router**: React Router DOM v6  
✅ **API**: Axios + TypeScript, Mock data ile çalışıyor  

### Dizin Yapısı
```
src/
├── components/         # Layout ve reusable components
├── contexts/          # React Context (Theme)
├── pages/             # 13 sayfa (Tables, Orders, Payment, vb.)
├── services/          # API servisleri (api.ts, tableService.ts)
├── types/             # TypeScript tipler
├── App.tsx            # Router config
└── index.css          # Global stiller + CSS variables
```

---

## 📋 PROJE GENELİ

### Proje Özeti
- **Proje Adı**: Cafe/Restoran Adisyon Yönetim Sistemi
- **Amaç**: Profesyonel, kullanımı kolay adisyon/sipariş yönetim platformu
- **Tech Stack**: React (Frontend) + Backend API (ayrı proje)
- **Mevcut Durum**: Frontend tasarım ve geliştirme aşaması - API entegrasyonu bekliyor
- **Hedef Kullanıcı**: Cafe ve restoran çalışanları (garsonlar, kasiyerler, yöneticiler)

### Proje Yapısı
```
Pos-Frontend/
  ├── src/
  │   ├── components/      # Layout ve reusable components
  │   │   ├── Layout.tsx   # Ana layout wrapper (Sidebar + Header)
  │   │   └── Layout.css   # Layout stilleri
  │   ├── contexts/        # React Context providers
  │   │   └── ThemeContext.tsx  # Dark/Light tema yönetimi
  │   ├── pages/           # Sayfa bileşenleri
  │   │   ├── Home.tsx     # Ana sayfa/Dashboard
  │   │   ├── Tables.tsx   # Masa yönetimi
  │   │   ├── TableDetail.tsx  # Masa detay sayfası
  │   │   ├── QuickSale.tsx    # Hızlı satış
  │   │   ├── TakeAway.tsx     # Paket servis
  │   │   ├── Kitchen.tsx      # Mutfak ekranı
  │   │   ├── Products.tsx     # Ürün yönetimi
  │   │   ├── Stock.tsx        # Stok yönetimi
  │   │   ├── Customers.tsx    # Müşteri yönetimi
  │   │   ├── Orders.tsx       # Sipariş listesi
  │   │   ├── Payment.tsx      # Ödeme ekranı
  │   │   ├── Reports.tsx      # Raporlar
  │   │   └── Settings.tsx     # Ayarlar
  │   ├── services/        # API service layer
  │   │   ├── api.ts       # Axios instance ve base config
  │   │   └── tableService.ts  # Masa işlemleri servisi
  │   ├── types/           # TypeScript tip tanımları
  │   │   └── index.ts     # Table, Order, Product vb. tipler
  │   ├── App.tsx          # Ana router yapılandırması
  │   ├── main.tsx         # React entry point
  │   ├── index.css        # Global stiller ve tema değişkenleri
  │   └── vite-env.d.ts    # Vite tip tanımları
  ├── public/              # Statik dosyalar
  ├── index.html           # HTML template
  ├── package.json         # Dependencies
  ├── tsconfig.json        # TypeScript config
  ├── vite.config.ts       # Vite config
  ├── Dockerfile           # Docker container config
  ├── docker-compose.yml   # Docker Compose config
  └── nginx.conf           # Nginx config (production)
```

### Tech Stack
- **Frontend Framework**: React 18.2 + TypeScript
- **Routing**: React Router DOM 6.20
- **HTTP Client**: Axios 1.6
- **Icons**: Lucide React 0.294
- **Build Tool**: Vite 5.0
- **Styling**: Pure CSS (CSS Variables için)
- **State Management**: React Context API (Theme)
- **Type Safety**: TypeScript 5.2

---

## 🎯 ZORUNLU TASARIM PRENSİPLERİ

### 1. RESPONSIVE TASARIM (MUTLAKA UYGULANACAK)

**Mobile First Yaklaşım - Her component mobilde başlamalı!**

**Breakpoints (Tailwind CSS sistemi):**
```css
Mobile:  < 640px   (sm)  - Varsayılan, tek kolon
Tablet:  640-1024px (md) - 2 kolon veya optimize düzen
Desktop: > 1024px   (lg) - 3+ kolon, geniş düzen
```

**Her Component İçin Zorunlu Testler:**
- ✅ iPhone SE (375px) - En küçük mobil
- ✅ iPad (768px) - Standart tablet
- ✅ Desktop (1440px) - Standart masaüstü

**Responsive Kurallar:**
```jsx
// ✅ DOĞRU
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  
// ❌ YANLIŞ
<div className="grid-cols-3"> // Mobilde bozulur!
```

**Touch-Friendly Boyutlar:**
- Minimum buton boyutu: 44x44px (Apple HIG standardı)
- Minimum tıklanabilir alan: 48x48px (Material Design)
- Kartlar arası minimum boşluk: 8px mobil, 16px desktop

### 2. KULLANICI DENEYİMİ (UX) - ZORUNLU KURALLAR

**Loading States (Her async işlemde MUTLAKA):**
```jsx
{isLoading ? (
  <Skeleton /> // veya Spinner
) : (
  <Content />
)}
```

**Error Handling (Her hata senaryosu için):**
```jsx
{error && (
  <ErrorMessage 
    message="İşlem başarısız oldu" 
    onRetry={handleRetry}
  />
)}
```

**Empty States (Veri yoksa göster):**
```jsx
{data.length === 0 && (
  <EmptyState 
    icon={<Icon />}
    title="Henüz sipariş yok"
    description="Yeni sipariş eklemek için + butonuna tıklayın"
  />
)}
```

**Confirmation Dialogs (Önemli işlemler öncesi):**
- Silme işlemleri
- Para ile ilgili işlemler
- Geri alınamayan aksiyonlar

**Maksimum 3 Tıklama Kuralı:**
- Ana işlemler (sipariş oluşturma, masa seçme) max 3 tıklamayla erişilebilir olmalı
- Sık kullanılan işlemler için shortcut'lar olmalı

**Feedback ve Bildirimler:**
```jsx
// Başarılı işlem
toast.success("Sipariş başarıyla oluşturuldu");

// Hata
toast.error("Bir hata oluştu, lütfen tekrar deneyin");

// Uyarı
toast.warning("Bu masada bekleyen sipariş var");
```

### 3. TASARIM SİSTEMİ

**Renk Paleti (Projenizin Gerçek Renkleri):**
```css
/* Primary Colors - Pink/Rose Gradient Theme */
--gradient-primary: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
--gradient-secondary: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
--gradient-bg: linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #f3e8ff 100%);

--primary: #ec4899;        /* Pink-500 */
--primary-dark: #db2777;   /* Pink-600 */
--primary-light: #f9a8d4;  /* Pink-300 */
--secondary: #8b5cf6;      /* Violet-500 */
--secondary-dark: #7c3aed; /* Violet-600 */
--accent: #f43f5e;         /* Rose-500 */

/* Semantic Colors */
--danger: #ef4444;         /* Red-500 */
--success: #10b981;        /* Green-500 */
--warning: #f59e0b;        /* Amber-500 */
--info: #3b82f6;           /* Blue-500 */

/* Background Colors - Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;   /* Slate-50 */
--bg-tertiary: #f1f5f9;    /* Slate-100 */

/* Sidebar & Cards */
--sidebar-bg: linear-gradient(180deg, #ec4899 0%, #f43f5e 100%);
--card-bg: #ffffff;
--card-hover: #fdf4ff;     /* Fuchsia-50 */
--card-border: #f0abfc;    /* Fuchsia-300 */

/* Text Colors */
--text-primary: #1e293b;   /* Slate-800 */
--text-secondary: #64748b; /* Slate-500 */
--text-tertiary: #94a3b8;  /* Slate-400 */
--text-inverse: #ffffff;

/* Border & Dividers */
--border-color: #e2e8f0;   /* Slate-200 */
--border-light: #f1f5f9;   /* Slate-100 */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
```

**Dark Mode Colors:**
```css
[data-theme='dark'] {
  --gradient-bg: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
  
  --bg-primary: #1e293b;     /* Slate-800 */
  --bg-secondary: #0f172a;   /* Slate-900 */
  --bg-tertiary: #1e293b;
  
  --sidebar-bg: linear-gradient(180deg, #be185d 0%, #dc2626 100%);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-hover: rgba(255, 255, 255, 0.08);
  --card-border: rgba(236, 72, 153, 0.3);
  
  --text-primary: #f1f5f9;   /* Slate-100 */
  --text-secondary: #cbd5e1; /* Slate-300 */
  --text-tertiary: #94a3b8;
  
  --border-color: rgba(255, 255, 255, 0.1);
  --border-light: rgba(255, 255, 255, 0.05);
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
}
```

**Typography:**
```css
/* Font Family */
--font-primary: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

**Spacing (8px Grid Sistemi):**
```css
/* Base: 8px */
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
padding/margin: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem
```

**Status Colors (Masa Durumları İçin):**
```css
/* Table Status Colors */
.available {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.occupied {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.reserved {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}
```

### 4. ERİŞİLEBİLİRLİK (A11y) - ZORUNLU

**ARIA Labels (Her interaktif element):**
```jsx
<button aria-label="Siparişi sil">
  <TrashIcon />
</button>
```

**Semantic HTML:**
```jsx
// ✅ DOĞRU
<button onClick={handleClick}>Tıkla</button>
<nav>...</nav>
<main>...</main>

// ❌ YANLIŞ
<div onClick={handleClick}>Tıkla</div> // Button kullan!
```

**Keyboard Navigation:**
```jsx
<div 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

**Renk Kontrastı:**
- Normal text: Minimum 4.5:1 kontrast oranı
- Büyük text: Minimum 3:1 kontrast oranı
- Test için: https://webaim.org/resources/contrastchecker/

**Focus Indicators:**
```css
/* Her focusable element için görünür outline */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

---

## 🏗️ LAYOUT YAPISI VE KULLANIMI

### Layout Component Yapısı

Projenizde merkezi bir `Layout` component'i vardır. Bu component tüm sayfalarda tutarlı bir görünüm sağlar.

**Layout Anatomisi:**
```
┌─────────────────────────────────────────┐
│         Sidebar (250px)                 │
│  ┌───────────────┐ ┌─────────────────┐ │
│  │   Logo/Brand  │ │    Header       │ │
│  ├───────────────┤ ├─────────────────┤ │
│  │               │ │                 │ │
│  │  Navigation   │ │   Main Content  │ │
│  │   Menu Items  │ │     (Pages)     │ │
│  │               │ │                 │ │
│  │               │ │                 │ │
│  │               │ │                 │ │
│  └───────────────┘ └─────────────────┘ │
└─────────────────────────────────────────┘
```

**Layout Component (src/components/Layout.tsx):**
```tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Table2, ShoppingCart, Settings } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tables', icon: Table2, label: 'Masalar' },
    { path: '/orders', icon: ShoppingCart, label: 'Siparişler' },
    { path: '/settings', icon: Settings, label: 'Ayarlar' },
  ];

  return (
    <div className="layout">
      {/* Sidebar - Sol navigasyon */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>☕ Kafe Panel</h1>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header - Üst bar */}
        <header className="header">
          <div className="header-content">
            <h2>Kafe Yönetim Sistemi</h2>
            <div className="user-info">
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Content - Sayfa içeriği buraya gelir */}
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
```

### Layout Kullanımı

**Sayfalarda Layout Kullanma:**

❌ **YANLIŞ - Her sayfada Layout import etmek:**
```tsx
// Dashboard.tsx
function Dashboard() {
  return (
    <Layout>
      <div>Dashboard içeriği</div>
    </Layout>
  );
}
```

✅ **DOĞRU - Router seviyesinde Layout kullanımı:**
```tsx
// App.tsx
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout olmayan sayfalar (Login, vb.) */}
        <Route path="/login" element={<Login />} />
        
        {/* Layout ile sarılı sayfalar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}
```

**NOT:** Şu anda projenizde her sayfa kendi Layout'unu yönetiyor. İleride daha temiz bir yapı için yukarıdaki yöntemi kullanabilirsiniz.

### Layout Responsive Davranışı

**Desktop (>1024px):**
- Sidebar: Sabit 250px genişlik, her zaman görünür
- Main content: Kalan alan

**Tablet (768px - 1024px):**
- Sidebar: Sabit 250px, toggle ile açılır/kapanır
- Main content: Full width

**Mobile (<768px):**
- Sidebar: Overlay olarak ekranın üstünden gelir
- Hamburger menu ile tetiklenir
- Main content: Full width

```css
/* Layout.css - Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -250px;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .sidebar.open {
    left: 0;
  }

  .content {
    padding: 1rem; /* Mobilde daha az padding */
  }
}
```

### Layout Alternatifleri

**Full-Screen Layout (Tables, Payment sayfaları için):**

Bazı sayfalar Layout kullanmaz ve full-screen çalışır:
```tsx
// Tables.tsx - Layout kullanmayan örnek
const Tables = () => {
  return (
    <div className="tables-page"> {/* Kendi container'ı */}
      <header className="tables-header">
        {/* Özel header */}
      </header>
      <div className="tables-content">
        {/* Sayfa içeriği */}
      </div>
    </div>
  );
};
```

**Kullanım Senaryoları:**
- ✅ Layout ile: Dashboard, Raporlar, Ayarlar, Stok yönetimi
- ❌ Layout olmadan: Masa yönetimi, Ödeme ekranı, Hızlı satış (POS ekranları)

---

## ⚡ PERFORMANS OPTİMİZASYONU

### Neden Önemli?

Projenizde **birçok sayfa benzer yapılar kullanıyor:**
- Masa kartları (Tables, TableDetail)
- Sipariş kartları (Orders, QuickSale)
- Ürün kartları (Products, Stock)
- Form yapıları (Settings, Payment)

Bu durum:
- ❌ Kod tekrarına yol açar
- ❌ Gereksiz re-render'lara sebep olur
- ❌ Bundle boyutunu arttırır
- ❌ Performans sorunları yaratır

### 1. Component Memoization

**React.memo() - Gereksiz Re-render'ları Önle:**

```tsx
// ❌ ÖNCE: Her parent render'da TableCard da render oluyor
const TableCard = ({ table, onClick }: TableCardProps) => {
  console.log('TableCard rendered'); // Her seferinde log!
  return (
    <div className="table-card" onClick={() => onClick(table.id)}>
      {table.tableNumber}
    </div>
  );
};

// ✅ SONRA: Sadece props değiştiğinde render olur
const TableCard = React.memo(({ table, onClick }: TableCardProps) => {
  console.log('TableCard rendered'); // Sadece gerektiğinde!
  return (
    <div className="table-card" onClick={() => onClick(table.id)}>
      {table.tableNumber}
    </div>
  );
});
```

**Ne Zaman Kullanmalı:**
- Liste içindeki item component'leri (TableCard, OrderCard, ProductCard)
- Sık render olmayan ama pahalı hesaplama yapan component'ler
- Props'ları nadiren değişen component'ler

**Ne Zaman KULLANMAMALI:**
- Her render'da props'ı değişen component'ler (input field)
- Çok basit/ucuz component'ler (button, icon)

### 2. useCallback - Function Referanslarını Optimize Et

```tsx
// ❌ YANLIŞ: Her render'da yeni function oluşur
const Tables = () => {
  const [tables, setTables] = useState([]);
  
  // Her render'da yeni function!
  const handleTableClick = (id) => {
    navigate(`/tables/${id}`);
  };

  return (
    <>
      {tables.map(table => (
        <TableCard 
          table={table}
          onClick={handleTableClick} // Yeni referans = re-render!
        />
      ))}
    </>
  );
};

// ✅ DOĞRU: Function referansı sabit kalır
const Tables = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  
  // navigate değişmedikçe aynı function referansı
  const handleTableClick = useCallback((id: number) => {
    navigate(`/tables/${id}`);
  }, [navigate]);

  return (
    <>
      {tables.map(table => (
        <TableCard 
          table={table}
          onClick={handleTableClick} // Aynı referans = no re-render!
        />
      ))}
    </>
  );
};
```

**Dependency Array Kuralları:**
```tsx
// ✅ DOĞRU: Kullanılan her değişken dependencies'te
const handleClick = useCallback((id: number) => {
  console.log(selectedArea, id); // selectedArea kullanılıyor
  setSelected(id);
}, [selectedArea]); // selectedArea dependencies'te!

// ❌ YANLIŞ: Eksik dependency
const handleClick = useCallback((id: number) => {
  console.log(selectedArea, id); // selectedArea kullanılıyor
  setSelected(id);
}, []); // selectedArea yok! Eski değeri görecek!
```

### 3. useMemo - Pahalı Hesaplamaları Cache'le

```tsx
// ❌ YANLIŞ: Her render'da filtreleme yapılır
const Tables = () => {
  const [tables, setTables] = useState([]);
  const [selectedArea, setSelectedArea] = useState('salon');
  const [searchQuery, setSearchQuery] = useState('');

  // Her render'da yeniden hesaplama (pahalı!)
  const filteredTables = tables
    .filter(t => selectedArea === 'tumu' || t.area === selectedArea)
    .filter(t => t.tableNumber.includes(searchQuery))
    .sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));

  return <TableGrid tables={filteredTables} />;
};

// ✅ DOĞRU: Sadece dependencies değiştiğinde hesapla
const Tables = () => {
  const [tables, setTables] = useState([]);
  const [selectedArea, setSelectedArea] = useState('salon');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = useMemo(() => {
    return tables
      .filter(t => selectedArea === 'tumu' || t.area === selectedArea)
      .filter(t => t.tableNumber.includes(searchQuery))
      .sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));
  }, [tables, selectedArea, searchQuery]); // Sadece bunlar değişince yeniden hesapla

  return <TableGrid tables={filteredTables} />;
};
```

**Ne Zaman Kullanmalı:**
- Filter, map, reduce gibi array işlemleri
- Kompleks matematik hesaplamaları
- Obje/array oluşturma işlemleri

### 4. Code Splitting - Lazy Loading

```tsx
// ❌ ÖNCE: Tüm sayfalar başlangıçta yüklenir
import Tables from './pages/Tables';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/tables" element={<Tables />} />
      <Route path="/products" element={<Products />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

// ✅ SONRA: Her sayfa kendi chunk'ında, ihtiyaç olunca yüklenir
import { lazy, Suspense } from 'react';

const Tables = lazy(() => import('./pages/Tables'));
const Products = lazy(() => import('./pages/Products'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/tables" element={<Tables />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Bundle Boyutu Karşılaştırması:**
```
❌ Önce: main.js (850 KB)
✅ Sonra: 
  - main.js (250 KB)
  - tables.chunk.js (150 KB) - İlk ziyarette yüklenir
  - products.chunk.js (120 KB) - İhtiyaç olunca yüklenir
  - reports.chunk.js (180 KB) - İhtiyaç olunca yüklenir
  - settings.chunk.js (150 KB) - İhtiyaç olunca yüklenir
```

### 5. Reusable Components - Kod Tekrarını Önle

**Önce: Her sayfada aynı card yapısı:**
```tsx
// Tables.tsx
<div className="table-card">
  <div className="card-header">{table.number}</div>
  <div className="card-body">{table.status}</div>
</div>

// Products.tsx
<div className="product-card">
  <div className="card-header">{product.name}</div>
  <div className="card-body">{product.price}</div>
</div>

// Orders.tsx
<div className="order-card">
  <div className="card-header">{order.id}</div>
  <div className="card-body">{order.total}</div>
</div>
```

**Sonra: Tek bir Card component:**
```tsx
// components/Card.tsx
interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const Card = ({ 
  children, 
  onClick, 
  className = '', 
  hoverable = false 
}: CardProps) => {
  return (
    <div 
      className={`card ${hoverable ? 'hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card alt bileşenleri
Card.Header = ({ children }: { children: ReactNode }) => (
  <div className="card-header">{children}</div>
);

Card.Body = ({ children }: { children: ReactNode }) => (
  <div className="card-body">{children}</div>
);

Card.Footer = ({ children }: { children: ReactNode }) => (
  <div className="card-footer">{children}</div>
);
```

**Kullanım:**
```tsx
// Tables.tsx
<Card hoverable onClick={() => navigate(`/tables/${table.id}`)}>
  <Card.Header>{table.tableNumber}</Card.Header>
  <Card.Body>{table.status}</Card.Body>
</Card>

// Products.tsx
<Card hoverable onClick={() => addToCart(product)}>
  <Card.Header>{product.name}</Card.Header>
  <Card.Body>₺{product.price}</Card.Body>
</Card>
```

### 6. Virtualization - Büyük Listeler İçin

```tsx
// ❌ SORUN: 1000 masa kartı DOM'da = Yavaş!
<div className="tables-grid">
  {tables.map(table => (
    <TableCard key={table.id} table={table} />
  ))}
</div>

// ✅ ÇÖZÜM: Sadece görünür olanlar render edilir
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={4}
  columnWidth={200}
  height={600}
  rowCount={Math.ceil(tables.length / 4)}
  rowHeight={150}
  width={900}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex;
    const table = tables[index];
    return table ? (
      <div style={style}>
        <TableCard table={table} />
      </div>
    ) : null;
  }}
</FixedSizeGrid>
```

**Ne Zaman Kullanmalı:**
- 100+ item içeren listeler
- Infinite scroll senaryoları
- Performans kritik sayfalar

### 7. Debouncing - Arama İşlemleri İçin

```tsx
// ❌ YANLIŞ: Her tuş vuruşunda API çağrısı
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
  // Her karakter için API çağrısı! (100 ms'de 5 karakter = 5 istek)
  fetchTables(e.target.value);
};

// ✅ DOĞRU: 300ms bekle, sonra çağır
import { debounce } from 'lodash-es'; // veya kendi implementation'ınız

const [searchQuery, setSearchQuery] = useState('');

const debouncedFetch = useMemo(
  () => debounce((query: string) => {
    fetchTables(query);
  }, 300),
  []
);

const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchQuery(value);
  debouncedFetch(value); // 300ms'den fazla bekleme olursa çağrılır
};
```

### 8. Image Optimization

```tsx
// ❌ YANLIŞ: Büyük görseller yavaşlatır
<img src="/products/coffee.jpg" /> // 2.5 MB!

// ✅ DOĞRU: Responsive images + lazy loading
<img 
  src="/products/coffee-small.webp"
  srcSet="
    /products/coffee-small.webp 300w,
    /products/coffee-medium.webp 600w,
    /products/coffee-large.webp 1200w
  "
  sizes="(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
  loading="lazy"
  alt="Kahve"
/>
```

### Performance Checklist

Her component için kontrol edin:

- [ ] **React.memo**: Liste item component'leri memo'landı mı?
- [ ] **useCallback**: Event handler'lar callback'lenmiş mi?
- [ ] **useMemo**: Pahalı hesaplamalar memo'landı mı?
- [ ] **Key Prop**: Liste render'larında unique key var mı?
- [ ] **Lazy Loading**: Büyük component'ler lazy yükleniyor mu?
- [ ] **Debouncing**: Arama/filter işlemleri debounce edilmiş mi?
- [ ] **Image Optimization**: Görseller optimize edilmiş mi?
- [ ] **Bundle Size**: Gereksiz kütüphane import edilmiş mi?

### Performans Ölçümü

```tsx
// React DevTools Profiler ile ölçüm
import { Profiler } from 'react';

<Profiler 
  id="Tables" 
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} rendered in ${actualDuration}ms`);
  }}
>
  <Tables />
</Profiler>
```

**Hedefler:**
- First Contentful Paint (FCP): < 1.8s
- Time to Interactive (TTI): < 3.8s
- Component render time: < 16ms (60 FPS için)

---

## 🔌 API ENTEGRASYONU HAZIRLIĞI

### Mevcut API Yapısı

Projenizde zaten bir API servisi yapısı var:

```
src/services/
  ├── api.ts           # Axios instance, base configuration
  └── tableService.ts  # Masa işlemleri servisi (örnek)
```

**Base API Service (src/services/api.ts):**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Base URL - environment variable'dan gelir
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Axios instance oluştur
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekleme
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, login'e yönlendir
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Endpoints

**Constants Dosyası Oluşturun (src/constants/api.ts):**
```typescript
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',
  
  // Tables
  GET_TABLES: '/tables',
  GET_TABLE: (id: number) => `/tables/${id}`,
  CREATE_TABLE: '/tables',
  UPDATE_TABLE: (id: number) => `/tables/${id}`,
  DELETE_TABLE: (id: number) => `/tables/${id}`,
  GET_TABLE_ORDERS: (id: number) => `/tables/${id}/orders`,
  
  // Orders
  GET_ORDERS: '/orders',
  GET_ORDER: (id: number) => `/orders/${id}`,
  CREATE_ORDER: '/orders',
  UPDATE_ORDER: (id: number) => `/orders/${id}`,
  DELETE_ORDER: (id: number) => `/orders/${id}`,
  ADD_ORDER_ITEM: (orderId: number) => `/orders/${orderId}/items`,
  REMOVE_ORDER_ITEM: (orderId: number, itemId: number) => `/orders/${orderId}/items/${itemId}`,
  
  // Products
  GET_PRODUCTS: '/products',
  GET_PRODUCT: (id: number) => `/products/${id}`,
  GET_CATEGORIES: '/products/categories',
  
  // Payment
  PROCESS_PAYMENT: '/payments/process',
  GET_PAYMENT_METHODS: '/payments/methods',
  GET_PAYMENT_HISTORY: '/payments/history',
  
  // Reports
  GET_DAILY_REPORT: '/reports/daily',
  GET_MONTHLY_REPORT: '/reports/monthly',
  GET_PRODUCT_STATS: '/reports/products',
  
  // Customers
  GET_CUSTOMERS: '/customers',
  CREATE_CUSTOMER: '/customers',
  UPDATE_CUSTOMER: (id: number) => `/customers/${id}`,
  
  // Stock
  GET_STOCK: '/stock',
  UPDATE_STOCK: (id: number) => `/stock/${id}`,
  
  // Settings
  GET_SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',
};
```

### Service Layer Pattern

**Table Service Örneği (src/services/tableService.ts):**
```typescript
import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import { Table, Order } from '../types';

export const tableService = {
  // Tüm masaları getir
  async getAllTables(): Promise<Table[]> {
    const response = await apiClient.get(API_ENDPOINTS.GET_TABLES);
    return response.data;
  },

  // Tek masa detayı
  async getTableById(id: number): Promise<Table> {
    const response = await apiClient.get(API_ENDPOINTS.GET_TABLE(id));
    return response.data;
  },

  // Masa siparişlerini getir
  async getTableOrders(tableId: number): Promise<Order[]> {
    const response = await apiClient.get(API_ENDPOINTS.GET_TABLE_ORDERS(tableId));
    return response.data;
  },

  // Masa durumunu güncelle
  async updateTableStatus(id: number, status: Table['status']): Promise<Table> {
    const response = await apiClient.patch(API_ENDPOINTS.UPDATE_TABLE(id), { status });
    return response.data;
  },
};
```

**Order Service (src/services/orderService.ts):**
```typescript
import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import { Order, OrderItem } from '../types';

export const orderService = {
  async createOrder(tableId: number, items: OrderItem[]): Promise<Order> {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_ORDER, {
      tableId,
      items,
    });
    return response.data;
  },

  async updateOrder(orderId: number, data: Partial<Order>): Promise<Order> {
    const response = await apiClient.patch(API_ENDPOINTS.UPDATE_ORDER(orderId), data);
    return response.data;
  },

  async addOrderItem(orderId: number, item: OrderItem): Promise<Order> {
    const response = await apiClient.post(API_ENDPOINTS.ADD_ORDER_ITEM(orderId), item);
    return response.data;
  },

  async removeOrderItem(orderId: number, itemId: number): Promise<Order> {
    const response = await apiClient.delete(API_ENDPOINTS.REMOVE_ORDER_ITEM(orderId, itemId));
    return response.data;
  },
};
```

### Custom Hooks ile API Kullanımı

**useApi Hook (src/hooks/useApi.ts):**
```typescript
import { useState, useEffect } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  immediate = true
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData };
}
```

**Sayfada Kullanım:**
```typescript
// Tables.tsx
import { useApi } from '../hooks/useApi';
import { tableService } from '../services/tableService';

const Tables = () => {
  const { data: tables, loading, error, refetch } = useApi(
    () => tableService.getAllTables()
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <div className="tables-grid">
      {tables?.map(table => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );
};
```

### Mock Data Strategy (API hazır olana kadar)

**Mock Service (src/services/mockService.ts):**
```typescript
import { Table, Order } from '../types';

// Mock data
const MOCK_TABLES: Table[] = [
  { 
    id: 1, 
    tableNumber: 'Salon 1', 
    capacity: 4, 
    status: 'available',
    area: 'salon' 
  },
  { 
    id: 2, 
    tableNumber: 'Salon 2', 
    capacity: 2, 
    status: 'occupied',
    currentGuests: 2,
    area: 'salon' 
  },
  // ...
];

// Mock servis - gerçek API gibi Promise döner
export const mockTableService = {
  async getAllTables(): Promise<Table[]> {
    // Gerçek API gibi 500ms gecikme ekle
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TABLES;
  },

  async getTableById(id: number): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const table = MOCK_TABLES.find(t => t.id === id);
    if (!table) throw new Error('Masa bulunamadı');
    return table;
  },
};
```

**Environment Değişkenleriyle Geçiş:**
```typescript
// src/services/tableService.ts
import { realTableService } from './api/tableService';
import { mockTableService } from './mockService';

// .env dosyasında: VITE_USE_MOCK_API=true
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const tableService = USE_MOCK ? mockTableService : realTableService;
```

### Type Definitions

**TypeScript Tipleri (src/types/index.ts):**
```typescript
export type TableStatus = 'available' | 'occupied' | 'reserved';
export type TableArea = 'salon' | 'bahce' | 'kat';

export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  area: TableArea;
  currentGuests?: number;
  currentOrder?: Order;
}

export interface Order {
  id: number;
  tableId: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  waiter?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image?: string;
  available: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface PaymentRequest {
  orderId: number;
  amount: number;
  method: string;
  tip?: number;
}
```

---

## 📝 COMPONENT STANDARTLARI

### Standard Component Template

```tsx
import { useState, useCallback, useMemo } from 'react';
import './ComponentName.css';

/**
 * ComponentName - Kısa açıklama
 * 
 * @component
 * @responsive ✅ Mobile(320px) / Tablet(768px) / Desktop(1024px+) tested
 * @ux ✅ Loading, Error, Empty states implemented
 * @a11y ✅ ARIA labels, keyboard navigation, semantic HTML
 * @performance ✅ React.memo, useCallback, useMemo optimized
 * 
 * @example
 * ```tsx
 * <ComponentName 
 *   data={tables}
 *   onSelect={handleSelect}
 *   loading={false}
 * />
 * ```
 */

interface ComponentNameProps {
  data: any[];
  onSelect: (id: number) => void;
  loading?: boolean;
  className?: string;
}

const ComponentName = ({ 
  data, 
  onSelect, 
  loading = false,
  className = '' 
}: ComponentNameProps) => {
  const [error, setError] = useState<Error | null>(null);

  // useCallback - Event handler'lar için
  const handleClick = useCallback((id: number) => {
    onSelect(id);
  }, [onSelect]);

  // useMemo - Pahalı hesaplamalar için
  const filteredData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);

  // Loading state
  if (loading) {
    return (
      <div className="component-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="component-error" role="alert">
        <p>❌ {error.message}</p>
        <button onClick={() => setError(null)}>
          🔄 Tekrar Dene
        </button>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="component-empty">
        <p>📭 Henüz veri yok</p>
      </div>
    );
  }

  // Success state
  return (
    <div 
      className={`component-name ${className}`}
      role="region"
      aria-label="Component açıklaması"
    >
      {filteredData.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className="component-item"
          aria-label={`${item.name} seç`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

// React.memo ile gereksiz re-render'ları önle
export default ComponentName;
```

### Component CSS Template

```css
/* ComponentName.css */

/* Mobile First - Base styles (320px+) */
.component-name {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.component-item {
  padding: 0.75rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Touch-friendly boyut */
  min-height: 48px;
}

.component-item:hover {
  background: var(--card-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.component-item:active {
  transform: translateY(0);
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .component-name {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .component-item {
    font-size: 1rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component-name {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 2rem;
  }
}

/* Loading State */
.component-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.component-error {
  padding: 2rem;
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger);
  border-radius: var(--radius-md);
  color: var(--danger);
}

/* Empty State */
.component-empty {
  padding: 3rem;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 1.1rem;
}

/* Dark mode specific adjustments */
[data-theme='dark'] .component-item {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme='dark'] .component-item:hover {
  background: var(--card-hover);
}
```

### Component Checklist (Her component için kontrol et!)

**Kod Kalitesi:**
- [ ] **TypeScript**: Props interface tanımlı
- [ ] **PropTypes/Types**: Tip kontrolü yapılmış
- [ ] **Default Props**: Varsayılan değerler var
- [ ] **JSDoc Comment**: Dokümantasyon yazılmış
- [ ] **No Inline Styles**: CSS dosyası kullanılmış
- [ ] **CSS Variables**: Renk/boyut için variable kullanılmış
- [ ] **No Magic Numbers**: Sabit sayılar constant olarak tanımlı
- [ ] **No Console.log**: Production'da console.log yok

**Responsive:**
- [ ] **Mobile (320px)**: iPhone SE'de test edildi
- [ ] **Tablet (768px)**: iPad'de test edildi
- [ ] **Desktop (1024px+)**: Geniş ekranda test edildi
- [ ] **Touch Friendly**: Butonlar min 48x48px

**UX:**
- [ ] **Loading State**: Yükleme durumu var
- [ ] **Error State**: Hata durumu handle ediliyor
- [ ] **Empty State**: Veri yoksa gösteriliyor
- [ ] **Success State**: Normal durum çalışıyor
- [ ] **Feedback**: Kullanıcıya geri bildirim veriliyor
- [ ] **Transitions**: Smooth geçişler var

**Accessibility:**
- [ ] **ARIA Labels**: Açıklayıcı label'lar var
- [ ] **Semantic HTML**: `<button>`, `<nav>`, `<main>` kullanılmış
- [ ] **Keyboard Nav**: Tab/Enter ile erişilebilir
- [ ] **Focus Indicators**: Focus görünür
- [ ] **Color Contrast**: WCAG 2.1 AA uyumlu (4.5:1)
- [ ] **Screen Reader**: Ekran okuyucu uyumlu

**Performance:**
- [ ] **React.memo**: Gereksiz re-render yok
- [ ] **useCallback**: Event handler'lar optimize
- [ ] **useMemo**: Pahalı hesaplamalar cache'li
- [ ] **Lazy Loading**: Büyük component'ler lazy
- [ ] **Image Optimization**: Görseller optimize
- [ ] **Bundle Size**: Gereksiz import yok

---

## 🚫 YAPILMAMASI GEREKENLER

### Kesinlikle Yapılmayacaklar

❌ **Inline Styles Kullanma**
```jsx
// YANLIŞ
<div style={{ color: 'red', padding: '10px' }}>

// DOĞRU
<div className="text-red-500 p-2">
```

❌ **Magic Numbers**
```jsx
// YANLIŞ
<div style={{ width: 234 }}>

// DOĞRU
const SIDEBAR_WIDTH = 234;
<div style={{ width: SIDEBAR_WIDTH }}>
```

❌ **Console.log Production'da**
```jsx
// YANLIŞ - Production'da kalmasın
console.log(data);

// DOĞRU - Development only
if (process.env.NODE_ENV === 'development') {
  console.log('[DEBUG]', data);
}
```

❌ **Hardcoded Strings**
```jsx
// YANLIŞ
<button>Siparişi Onayla</button>

// DOĞRU - i18n hazırlığı
<button>{t('orders.confirm')}</button>
```

❌ **Any Type (TypeScript kullanıyorsa)**
```typescript
// YANLIŞ
const data: any = fetchData();

// DOĞRU
interface Order {
  id: number;
  total: number;
}
const data: Order = fetchData();
```

❌ **Gereksiz Dependencies**
```jsx
// YANLIŞ - Her render'da yeni function
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData her render'da yeni!

// DOĞRU
const fetchData = useCallback(() => {
  // ...
}, []);
```

---

## 🎨 COMPONENT KÜTÜPHANESİ

### Common Components (Hazır olması gerekenler)

**Button Component:**
```jsx
<Button 
  variant="primary" // primary, secondary, outline, ghost, danger
  size="md" // sm, md, lg
  loading={isLoading}
  disabled={isDisabled}
  onClick={handleClick}
>
  Button Text
</Button>
```

**Input Component:**
```jsx
<Input
  label="Masa Numarası"
  placeholder="Örn: 5"
  error={errors.tableNumber}
  required
  type="number"
  value={tableNumber}
  onChange={(e) => setTableNumber(e.target.value)}
/>
```

**Modal Component:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Sipariş Detayı"
  size="lg" // sm, md, lg, xl
>
  <Modal.Body>
    {/* Content */}
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Kapat</Button>
  </Modal.Footer>
</Modal>
```

**Card Component:**
```jsx
<Card
  hoverable
  onClick={handleClick}
  className="cursor-pointer"
>
  <Card.Header>Başlık</Card.Header>
  <Card.Body>İçerik</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

---

## 🔄 GIT WORKFLOW & COMMIT STANDARTLARI

### Commit Message Format

```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `style`: Kod formatı (işlevsellik değişmiyor)
- `refactor`: Kod iyileştirme (bug fix veya feat değil)
- `test`: Test ekleme/düzenleme
- `docs`: Dokümantasyon
- `chore`: Build, config değişiklikleri

**Örnek Commit:**
```bash
feat(orders): Add responsive order creation modal

- ✅ Mobile/tablet/desktop tested
- ✅ Loading, error states implemented
- ✅ Form validation with Yup
- ✅ Touch-friendly buttons (48px)
- 🔄 API integration pending

Closes #123
```

---

## 💬 AI İLE ÇALIŞMA ŞABLONLARı

### Her Oturum Başlangıcı İçin Template

```
🎯 PROJE: Cafe/Restoran POS Sistemi - React + TypeScript + Vite

� REHBER: AI_DEVELOPMENT_GUIDE.md'deki TÜM kurallara uyacağım

✅ ZORUNLU KURALLAR:
1. Responsive: Mobile-first (320px, 768px, 1024px+)
2. UX: Loading/Error/Empty/Success states
3. Performance: React.memo, useCallback, useMemo
4. Accessibility: ARIA, semantic HTML, keyboard nav
5. Renk: CSS variables kullan (--primary, --bg-primary, vb.)
6. Touch-friendly: Min 48x48px butonlar
7. TypeScript: Proper typing, interface definitions
8. NO inline styles, NO console.log, NO magic numbers

🎨 RENK PALETİ:
- Primary: #ec4899 (Pink)
- Secondary: #8b5cf6 (Violet)
- Success: #10b981 (Green)
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Orange)

🛠️ TECH STACK:
- React 18 + TypeScript
- React Router DOM v6
- Axios
- Lucide React (icons)
- Pure CSS (CSS Variables)

🎯 GÖREV: [Yapılacak işi buraya yaz]

Component tamamlandığında checklist göstereceğim!
```

### Yeni Component Oluşturma Template

```
[AI_DEVELOPMENT_GUIDE.md kurallarına göre yeni component]

Component Adı: TableCard
Lokasyon: src/components/TableCard.tsx + TableCard.css

📋 GEREKSİNİMLER:
- Masa numarası, durum (boş/dolu/rezerve), kapasite göster
- Duruma göre renk: available (yeşil), occupied (kırmızı), reserved (turuncu)
- Tıklanabilir, onClick prop'u callback
- Hover effect: transform + shadow
- TypeScript: Table interface kullan

📱 RESPONSIVE:
- Mobile (320px): 1 kolon, padding 0.75rem
- Tablet (768px): 2 kolon, padding 1rem
- Desktop (1024px+): 4 kolon, padding 1.5rem

🎨 TASARIM:
- Background: var(--card-bg)
- Border: 1px solid var(--border-color)
- Border radius: var(--radius-md)
- Shadow: var(--shadow-md)
- Hover shadow: var(--shadow-lg)
- Min height: 120px
- Touch target: min 48px

♿ ACCESSIBILITY:
- aria-label: "Masa {number}, {status}"
- role: "button"
- tabIndex: 0
- Keyboard: Enter/Space ile tıklama

⚡ PERFORMANCE:
- React.memo ile wrap
- onClick useCallback ile
- Props shallow compare

🧪 STATES:
- Loading: Skeleton veya spinner
- Error: Hata mesajı + retry button
- Empty: Boş durum mesajı
- Success: Normal render

✅ KONTROL:
Tamamlandığında component checklist'i göster!
```

### Hata Düzeltme Template

```
[AI_DEVELOPMENT_GUIDE.md kurallarını koruyarak]

🐛 SORUN: Tables sayfasında mobilde grid bozuluyor

📍 COMPONENT: Tables.tsx + Tables.css
📍 SATIR: CSS line 45-60

🎯 BEKLENEN: 
- Mobile'da 1 kolon
- Tablet'te 2 kolon
- Desktop'ta 4 kolon

❌ GERÇEKLEŞEN:
- Her ekranda 4 kolon görünüyor
- Mobilde kartlar çok küçük

📋 DÜZELTME KURALLARI:
- Mobile-first yaklaşım kullan
- CSS media queries: 768px, 1024px
- CSS variables kullanmaya devam et
- Loading/Error states'i bozma
- Performance optimizasyonlarını koru
- Mevcut component checklist'e uygun kal

Lütfen düzelt ve test et:
✅ iPhone SE (320px)
✅ iPad (768px)
✅ Desktop (1440px)
```

### API Entegrasyonu Template

```
[API entegrasyonu - Mock'tan Real API'ye geçiş]

📍 SERVICE: src/services/tableService.ts

🎯 GÖREV: Mock data'dan gerçek API'ye geçiş

📋 YAPILACAKLAR:
1. API endpoint kullan: GET /api/tables
2. Error handling ekle (401, 404, 500)
3. Loading state yönet
4. Response type tanımla: Table[]
5. Try-catch ile error yakala
6. Token authorization ekle

✅ TİP GÜVENLİĞİ:
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

async getAllTables(): Promise<Table[]> {
  const response = await apiClient.get<ApiResponse<Table[]>>(
    API_ENDPOINTS.GET_TABLES
  );
  return response.data.data;
}
```

⚠️ ERROR HANDLING:
- Network error: "Bağlantı hatası"
- 401: "Oturum süresi doldu"
- 404: "Kaynak bulunamadı"
- 500: "Sunucu hatası"

📊 CONSOLE LOG:
- Development: console.log('[API]', ...)
- Production: Remove all logs
```

### Performans İyileştirme Template

```
[Performans optimizasyonu]

📍 COMPONENT: Tables.tsx

🎯 SORUN: 100+ masa render edilince yavaşlıyor

📋 OPTİMİZASYON PLANI:

1. **TableCard'ı React.memo'la:**
```tsx
const TableCard = React.memo(({ table, onClick }: Props) => {
  // ...
});
```

2. **Event handler'ları useCallback:**
```tsx
const handleTableClick = useCallback((id: number) => {
  navigate(`/tables/${id}`);
}, [navigate]);
```

3. **Filtrelemeyi useMemo:**
```tsx
const filteredTables = useMemo(() => {
  return tables.filter(t => 
    selectedArea === 'tumu' || t.area === selectedArea
  );
}, [tables, selectedArea]);
```

4. **Lazy loading için react-window:**
```tsx
import { FixedSizeGrid } from 'react-window';
// Sadece görünür kartlar render edilir
```

✅ HEDEFLER:
- İlk render: < 100ms
- Re-render: < 16ms (60 FPS)
- Interaction: < 100ms

📊 ÖLÇÜM:
- React DevTools Profiler kullan
- Render count takip et
- Performance API ile ölç
```

### Code Review Template

```
[Component review - Checklist kontrolü]

📍 COMPONENT: TableCard.tsx + TableCard.css

✅ RESPONSIVE:
- [x] Mobile 320px - Tek kolon ✓
- [x] Tablet 768px - İki kolon ✓
- [x] Desktop 1024px - Dört kolon ✓

✅ UX:
- [x] Loading state ✓
- [x] Error state ✓
- [x] Empty state ✓
- [x] Hover effect ✓
- [x] Touch-friendly (48px+) ✓

✅ CODE QUALITY:
- [x] TypeScript types ✓
- [x] JSDoc comment ✓
- [x] No inline styles ✓
- [x] CSS variables ✓
- [x] No console.log ✓
- [x] No magic numbers ✓

✅ ACCESSIBILITY:
- [x] ARIA labels ✓
- [x] Semantic HTML ✓
- [x] Keyboard navigation ✓
- [x] Focus indicators ✓
- [x] Color contrast OK ✓

✅ PERFORMANCE:
- [x] React.memo ✓
- [x] useCallback ✓
- [x] useMemo ✓
- [x] No unnecessary re-renders ✓

✅ API:
- [x] Service layer kullanılmış ✓
- [x] Error handling yapılmış ✓
- [x] Loading state yönetilmiş ✓

🎉 COMPONENT HAZIR! Tüm checklist maddeleri tamamlandı.

📝 NOTES:
- Dark mode test edilmeli
- Unit test yazılabilir
- E2E test eklenebilir
```

---

## 🚀 HIZLI BAŞLANGIÇ KOMUTU

Her AI oturumunda bunu kullan:

```
📖 AI_DEVELOPMENT_GUIDE.md okudum
🎯 GÖREV: [Spesifik görev]
✅ KURALLARA UYGUN: Responsive, UX, A11y, Performance, TypeScript
🔍 KONTROL: Bitince checklist göstereceğim
🎨 RENK: CSS variables (#ec4899, #8b5cf6)
⚡ PERFORMANS: React.memo, useCallback, useMemo

Başlıyorum...
```

---

## 🎯 PROJE ÖZELİ KULLANIM ÖRNEKLERİ

### 1. Tema Değiştirme (Dark/Light Mode)

Projenizde zaten bir ThemeContext var. İşte kullanımı:

```tsx
// contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // LocalStorage'dan tema tercihini al
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    // HTML elementine tema attribute'ü ekle
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

**Kullanım:**
```tsx
// Her sayfada/component'te
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
    </button>
  );
};
```

### 2. Masa Durumu Yönetimi

```tsx
// Tables.tsx'ten örnek pattern
const Tables = () => {
  const [tables, setTables] = useState<Table[]>([]);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'available';  // Yeşil
      case 'occupied': return 'occupied';    // Kırmızı
      case 'reserved': return 'reserved';    // Turuncu
    }
  };

  const getStatusText = (status: Table['status'], guests?: number) => {
    switch (status) {
      case 'available': return 'Boş';
      case 'occupied': return guests ? `${guests} Kişi` : 'Dolu';
      case 'reserved': return 'Rezerve';
    }
  };

  return (
    <div className="tables-grid">
      {tables.map(table => (
        <div 
          key={table.id}
          className={`table-card ${getStatusColor(table.status)}`}
        >
          <div className="table-number">{table.tableNumber}</div>
          <div className="table-status">
            {getStatusText(table.status, table.currentGuests)}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 3. Context Menu / Long Press Actions

```tsx
// Mobil için long press, desktop için sağ tık
const Tables = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);

  // Desktop - Right click
  const handleContextMenu = (e: React.MouseEvent, tableId: number) => {
    e.preventDefault();
    setSelectedTable(tableId);
    setShowActions(true);
  };

  // Mobile - Long press
  let pressTimer: NodeJS.Timeout;
  
  const handleTouchStart = (tableId: number) => {
    pressTimer = setTimeout(() => {
      setSelectedTable(tableId);
      setShowActions(true);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <>
      <div 
        className="table-card"
        onContextMenu={(e) => handleContextMenu(e, table.id)}
        onTouchStart={() => handleTouchStart(table.id)}
        onTouchEnd={handleTouchEnd}
      >
        {/* Table content */}
      </div>

      {showActions && (
        <div className="action-menu">
          <button onClick={() => handleAction('move')}>Masayı Taşı</button>
          <button onClick={() => handleAction('merge')}>Masa Birleştir</button>
          <button onClick={() => handleAction('cancel')}>İptal</button>
        </div>
      )}
    </>
  );
};
```

### 4. Modal/Portal Kullanımı

```tsx
import { createPortal } from 'react-dom';

const Tables = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Yeni Sipariş
      </button>

      {showModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Yeni Sipariş</h2>
            {/* Modal içeriği */}
            <button onClick={() => setShowModal(false)}>Kapat</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
```

### 5. Responsive Grid Sistemi

```css
/* Pure CSS Grid - Projenizde kullanılan pattern */
.tables-grid {
  display: grid;
  gap: 1rem;
  
  /* Mobile: 1 kolon */
  grid-template-columns: 1fr;
}

/* Tablet: 2 kolon */
@media (min-width: 768px) {
  .tables-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 4 kolon */
@media (min-width: 1024px) {
  .tables-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Large Desktop: 6 kolon */
@media (min-width: 1440px) {
  .tables-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

### 6. Filter ve Search Pattern

```tsx
const Tables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedArea, setSelectedArea] = useState<'tumu' | 'salon' | 'bahce' | 'kat'>('tumu');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtered data
  const filteredTables = useMemo(() => {
    return tables
      .filter(t => selectedArea === 'tumu' || t.area === selectedArea)
      .filter(t => t.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tables, selectedArea, searchQuery]);

  return (
    <>
      {/* Area filter tabs */}
      <div className="filter-tabs">
        {['tumu', 'salon', 'bahce', 'kat'].map(area => (
          <button
            key={area}
            className={selectedArea === area ? 'active' : ''}
            onClick={() => setSelectedArea(area as any)}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Masa ara..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Results */}
      <div className="tables-grid">
        {filteredTables.map(table => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </>
  );
};
```

### 7. Navigation Pattern

```tsx
// App.tsx - Router yapısı
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Ana sayfa */}
          <Route path="/" element={<Home />} />
          
          {/* Liste sayfaları */}
          <Route path="/tables" element={<Tables />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          
          {/* Detay sayfaları - :id parametreli */}
          <Route path="/tables/:tableId" element={<TableDetail />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          
          {/* Diğer sayfalar */}
          <Route path="/quick-sale" element={<QuickSale />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
```

**Sayfa içinde navigation:**
```tsx
import { useNavigate, useParams } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  const { tableId } = useParams(); // URL parametresi

  return (
    <>
      {/* Geri butonu */}
      <button onClick={() => navigate(-1)}>
        <ArrowLeft /> Geri
      </button>

      {/* Başka sayfaya git */}
      <button onClick={() => navigate('/tables')}>
        Masalara Dön
      </button>

      {/* Parametreli sayfa */}
      <button onClick={() => navigate(`/tables/${tableId}`)}>
        Detay
      </button>
    </>
  );
};
```

### 8. Loading States Pattern

```tsx
const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>❌ Bir hata oluştu: {error.message}</p>
        <button onClick={loadData}>🔄 Tekrar Dene</button>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="empty-container">
        <p>📭 Henüz veri yok</p>
        <button onClick={() => navigate('/create')}>➕ Yeni Ekle</button>
      </div>
    );
  }

  // Success state
  return (
    <div className="data-grid">
      {data.map(item => (
        <DataCard key={item.id} data={item} />
      ))}
    </div>
  );
};
```

### 9. Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=true

# .env.production
VITE_API_URL=https://api.yourapp.com/v1
VITE_USE_MOCK_API=false
```

**Kullanım:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

console.log('API URL:', API_URL);
console.log('Mock mode:', USE_MOCK);
```

### 10. CSS Variables Kullanımı

```css
/* Component'te CSS variable kullanımı */
.table-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.table-card:hover {
  background: var(--card-hover);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

/* Status colors */
.table-card.available {
  background: var(--success);
  color: white;
}

.table-card.occupied {
  background: var(--danger);
  color: white;
}

.table-card.reserved {
  background: var(--warning);
  color: white;
}
```

---

## 📊 PROJE DURUMU TAKİBİ

### Mevcut Durum (Son Güncelleme: Kasım 2024)

**✅ Tamamlanan Sayfalar:**
- [x] Home.tsx - Dashboard/Ana sayfa
- [x] Tables.tsx - Masa listesi ve yönetimi
- [x] TableDetail.tsx - Masa detay sayfası
- [x] QuickSale.tsx - Hızlı satış ekranı
- [x] TakeAway.tsx - Paket servis
- [x] Kitchen.tsx - Mutfak ekranı
- [x] Products.tsx - Ürün yönetimi
- [x] Stock.tsx - Stok yönetimi
- [x] Customers.tsx - Müşteri yönetimi
- [x] Orders.tsx - Sipariş listesi
- [x] Payment.tsx - Ödeme ekranı
- [x] Reports.tsx - Raporlar
- [x] Settings.tsx - Ayarlar

**✅ Tamamlanan Component'ler:**
- [x] Layout.tsx - Ana layout (Sidebar + Header)
- [x] ThemeContext.tsx - Dark/Light tema yönetimi

**✅ Tamamlanan Servisler:**
- [x] api.ts - Axios base configuration
- [x] tableService.ts - Masa işlemleri servisi

**✅ Tamamlanan Tipler:**
- [x] types/index.ts - Table, Order, Product tipleri

**🔄 Devam Eden:**
- [ ] Common component library oluşturma
  - [ ] Button component
  - [ ] Input component
  - [ ] Modal component
  - [ ] Card component
  - [ ] LoadingSpinner component
  - [ ] ErrorMessage component
- [ ] API entegrasyonu (Backend hazır olunca)
- [ ] Performans optimizasyonları (React.memo, useMemo, useCallback)
- [ ] E2E testler

**📋 Bekleyen:**
- [ ] Authentication (Login/Logout)
- [ ] User authorization (Roller: Admin, Garson, Kasiyer)
- [ ] Offline mode (PWA)
- [ ] Print (Adisyon yazdırma)
- [ ] Bildirimler (Toast notifications)
- [ ] i18n (Çoklu dil desteği)
- [ ] Unit testler

**🐛 Bilinen Sorunlar:**
- [ ] Mobil menü toggle eksik
- [ ] Bazı sayfalarda responsive sorunlar olabilir
- [ ] Loading/Error states bazı sayfalarda eksik

**🎯 Öncelikli Görevler:**
1. Common component library oluştur (Button, Input, Modal, Card)
2. Tüm sayfalarda Loading/Error/Empty states ekle
3. Performans optimizasyonu (React.memo, useCallback, useMemo)
4. Responsive test (320px, 768px, 1440px)
5. API servisleri tamamla
6. Toast notification sistemi ekle

---

## 🔍 PERFORMANS OPTİMİZASYONU

### Zorunlu Optimizasyonlar

**React.memo (Gereksiz re-render önle):**
```jsx
export const MasaKarti = React.memo(({ masa }) => {
  // Component
});
```

**useCallback (Function referansı sabit tut):**
```jsx
const handleClick = useCallback(() => {
  // Handler
}, [dependencies]);
```

**useMemo (Expensive hesaplamalar için):**
```jsx
const filteredOrders = useMemo(() => {
  return orders.filter(order => order.status === 'pending');
}, [orders]);
```

**Lazy Loading (Code splitting):**
```jsx
const SiparisPage = lazy(() => import('./pages/SiparisPage'));

<Suspense fallback={<Loading />}>
  <SiparisPage />
</Suspense>
```

---

## 🎓 ÖĞRENME KAYNAKLARI

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
- React Patterns: https://kentcdodds.com/blog

---

## ✅ SON KONTROL LİSTESİ (Her component için)

Bir component bittiğinde AI'ya şunu sor:

```
Bu component aşağıdaki kriterleri karşılıyor mu?

RESPONSIVE:
- [ ] 320px (iPhone SE) ✓
- [ ] 768px (iPad) ✓
- [ ] 1440px (Desktop) ✓

UX:
- [ ] Loading state ✓
- [ ] Error state ✓
- [ ] Empty state ✓
- [ ] Touch-friendly (44px+) ✓

CODE QUALITY:
- [ ] PropTypes ✓
- [ ] Default props ✓
- [ ] JSDoc comment ✓
- [ ] No inline styles ✓
- [ ] No console.log ✓
- [ ] No magic numbers ✓

A11y:
- [ ] ARIA labels ✓
- [ ] Semantic HTML ✓
- [ ] Keyboard navigation ✓
- [ ] Color contrast OK ✓

API:
- [ ] Mock data hazır ✓
- [ ] API endpoints tanımlı ✓
- [ ] Loading/error handling ✓

PERFORMANCE:
- [ ] Gereksiz re-render yok ✓
- [ ] useMemo/useCallback kullanıldı ✓
```

---

## 🚀 HIZLI BAŞLANGIÇ KOMUTU

Her AI oturumunda bunu kullan:

```
📖 OKUDUM: AI_DEVELOPMENT_GUIDE.md
🎯 GÖREV: [Spesifik görev]
✅ KURALLARA UYACAĞIM: Responsive, UX, A11y, API-ready
🔍 KONTROL: Bitince checklist göstereceğim

Başlıyorum...
```

---

**Bu dosyayı her AI oturumunda paylaş ve "AI_DEVELOPMENT_GUIDE.md kurallarına göre..." diyerek görevleri başlat!**