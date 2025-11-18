# Kimlik Doğrulama ve Güvenlik Sistemi

## 📋 Genel Bakış

Bu dokümantasyon, POS Frontend uygulamasında uygulanan kimlik doğrulama ve güvenlik mekanizmalarını açıklamaktadır.

## 🔐 Güvenlik Özellikleri

### 1. Protected Routes (Korumalı Rotalar)

Tüm uygulama sayfaları (login hariç) artık kimlik doğrulaması gerektirmektedir.

#### Dosya: `src/components/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

**Çalışma Prensibi:**
- Kullanıcı giriş yapmış mı kontrol edilir
- Giriş yapılmamışsa `/login` sayfasına yönlendirilir
- Giriş yapılmışsa sayfa içeriği gösterilir

### 2. Login Sayfası Koruması

Giriş yapmış kullanıcılar login sayfasına erişemez ve otomatik olarak ana sayfaya yönlendirilir.

#### Dosya: `src/pages/Login.tsx`

```tsx
useEffect(() => {
  if (authService.isAuthenticated()) {
    navigate('/', { replace: true });
  }
}, [navigate]);
```

**Çalışma Prensibi:**
- Sayfa yüklendiğinde kimlik doğrulama durumu kontrol edilir
- Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendirilir
- Bu, gereksiz login girişlerini önler

### 3. Logout Fonksiyonu

Header'a eklenen çıkış butonu ile kullanıcı güvenli şekilde oturumu kapatabilir.

#### Dosya: `src/components/Layout.tsx`

```tsx
const handleLogout = () => {
  authService.logout();
  navigate('/login', { replace: true });
};
```

**Çalışma Prensibi:**
- Token ve kullanıcı bilgileri localStorage'dan temizlenir
- Kullanıcı login sayfasına yönlendirilir
- Tarayıcı geçmişi manipüle edilir (geri tuşu ile korumalı sayfalara dönüş engellenir)

## 🛡️ Kimlik Doğrulama Servisi

### Dosya: `src/services/authService.ts`

#### Temel Fonksiyonlar:

1. **`login(credentials)`**
   - Kullanıcı giriş işlemini yapar
   - Token'ı localStorage'a kaydeder
   - Kullanıcı bilgilerini saklar

2. **`logout()`**
   - Token ve kullanıcı bilgilerini temizler
   - Oturumu sonlandırır

3. **`isAuthenticated()`**
   - Kullanıcının giriş yapıp yapmadığını kontrol eder
   - Token varlığını ve geçerliliğini kontrol eder

4. **`getCurrentUser()`**
   - Mevcut kullanıcı bilgilerini getirir

## 📁 Değiştirilen Dosyalar

### 1. `src/App.tsx`
- `ProtectedRoute` bileşeni import edildi
- Tüm rotalar (login hariç) `ProtectedRoute` ile sarmalandı

**Değişiklikler:**
```tsx
// Önceki
<Route path="/" element={<Home />} />

// Sonraki
<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
```

### 2. `src/components/ProtectedRoute.tsx` (YENİ)
- Korumalı rota bileşeni oluşturuldu
- Kimlik doğrulama kontrolü yapılıyor

### 3. `src/pages/Login.tsx`
- `useEffect` hook'u eklendi
- Giriş yapmış kullanıcıları yönlendirme eklendi

### 4. `src/components/Layout.tsx`
- Logout butonu eklendi
- `handleLogout` fonksiyonu eklendi
- `LogOut` ikonu import edildi

### 5. `src/components/Layout.css`
- `.logout-btn` stilleri eklendi
- Hover ve active durumları tanımlandı

## 🔄 Kullanıcı Akışı

### Giriş Yapmamış Kullanıcı:
1. Herhangi bir sayfaya erişmeye çalışır (örn: `/tables`)
2. `ProtectedRoute` kimlik doğrulamayı kontrol eder
3. Token bulunamaz
4. Kullanıcı `/login` sayfasına yönlendirilir
5. Başarılı giriş sonrası ana sayfaya yönlendirilir

### Giriş Yapmış Kullanıcı:
1. Login sayfasına gitmeye çalışır
2. `useEffect` hook'u kimlik doğrulamayı kontrol eder
3. Token bulunur
4. Kullanıcı otomatik olarak ana sayfaya yönlendirilir

### Çıkış Yapan Kullanıcı:
1. Header'daki çıkış butonuna tıklar
2. `handleLogout` fonksiyonu çağrılır
3. Token ve kullanıcı bilgileri temizlenir
4. Login sayfasına yönlendirilir
5. Protected sayfalara erişim engellenir

## 🎯 Korunan Sayfalar

Aşağıdaki tüm sayfalar artık kimlik doğrulaması gerektirmektedir:

- ✅ Ana Sayfa (`/`)
- ✅ Masalar (`/tables`)
- ✅ Masa Detay (`/tables/:tableId`)
- ✅ Hızlı Satış (`/quick-sale`)
- ✅ Paket Servis (`/take-away`)
- ✅ Mutfak (`/kitchen`)
- ✅ Ürünler (`/products`)
- ✅ Stok (`/stock`)
- ✅ Müşteriler (`/customers`)
- ✅ Raporlar (`/reports`)
- ✅ Ayarlar (`/settings`)
- ✅ Ödeme (`/payment` ve `/payment/:orderId`)

## 🔑 LocalStorage Yapısı

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "isAuthenticated": "true",
  "user": "{\"id\":1,\"name\":\"Admin\",\"email\":\"admin@example.com\"}"
}
```

## 🚀 Kullanım

### Yeni Bir Protected Route Eklemek:

```tsx
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/new-page" 
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### Kimlik Doğrulama Kontrolü:

```tsx
import { authService } from './services/authService';

// Kullanıcı giriş yapmış mı?
const isLoggedIn = authService.isAuthenticated();

// Mevcut kullanıcı bilgisi
const currentUser = authService.getCurrentUser();
```

## 🎨 UI Değişiklikleri

### Header'a Eklenen Çıkış Butonu:

- Kırmızı renk hover efekti
- LogOut ikonu
- Tooltip: "Çıkış Yap"
- Responsive tasarım

## ⚠️ Önemli Notlar

1. **Token Yönetimi**: Token'lar localStorage'da saklanır. Daha güvenli bir çözüm için httpOnly cookies kullanılabilir.

2. **Token Süresi**: Şu anda token süre kontrolü yapılmamaktadır. İleride JWT token süre kontrolü eklenebilir.

3. **API Interceptor**: API isteklerinde token otomatik olarak header'a eklenmektedir (`src/services/api.ts`).

4. **Tarayıcı Geçmişi**: `replace: true` kullanılarak, kullanıcının geri tuşu ile korumalı sayfalara dönmesi engellenir.

## 🧪 Test Senaryoları

### 1. Giriş Yapmamış Kullanıcı Testi:
```
1. Token'ları temizle (localStorage.clear())
2. /tables adresine git
3. Otomatik olarak /login'e yönlendirilmeli
```

### 2. Giriş Yapmış Kullanıcı Testi:
```
1. Başarılı giriş yap
2. /login adresine git
3. Otomatik olarak / (ana sayfa) yönlendirilmeli
```

### 3. Çıkış Testi:
```
1. Giriş yap
2. Header'daki çıkış butonuna tıkla
3. /login sayfasına yönlendirilmeli
4. /tables gibi bir sayfaya gitmeye çalış
5. Tekrar /login'e yönlendirilmeli
```

## 📝 Gelecek Geliştirmeler

- [ ] JWT token expiration kontrolü
- [ ] Refresh token mekanizması
- [ ] httpOnly cookies kullanımı
- [ ] Role-based access control (RBAC)
- [ ] Two-factor authentication (2FA)
- [ ] Session timeout
- [ ] Remember me özelliği

## 🔗 İlgili Dosyalar

- `src/components/ProtectedRoute.tsx`
- `src/pages/Login.tsx`
- `src/services/authService.ts`
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/components/Layout.css`

---

**Tarih:** 14 Kasım 2025  
**Versiyon:** 1.0.0  
**Geliştirici:** POS Frontend Team
