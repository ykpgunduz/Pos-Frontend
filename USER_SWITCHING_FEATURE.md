# Kullanıcı Değiştirme Özelliği

## 📝 Genel Bakış

Bu özellik, cafeye kayıtlı kullanıcılar (garson, patron, müdür, kasa) arasında geçiş yapmanızı sağlar. Tüm sayfalarda aktif kullanıcıyı görebilir ve değiştirebilirsiniz.

## ✨ Özellikler

### 1. **Kullanıcı Rolleri**
- 🍽️ **Garson**: Sipariş alma ve masa yönetimi
- 👔 **Patron**: Tüm yetkilere sahip
- 🎯 **Müdür**: Yönetim ve raporlama
- 💰 **Kasa**: Ödeme işlemleri

### 2. **Kullanıcı Seçme Modalı**
- Rol bazlı gruplama
- Görsel kullanıcı kartları
- Seçili kullanıcı göstergesi
- Responsive tasarım (Mobile, Tablet, Desktop)

### 3. **Kullanım Alanları**
- ✅ Ana Sayfa (Home)
- ✅ Masalar (Tables)
- ✅ Masa Detay (TableDetail)
- ✅ Hızlı Satış (QuickSale)
- ✅ Diğer tüm sayfalar (gerektiğinde eklenebilir)

## 🚀 Nasıl Kullanılır?

### 1. Kullanıcı Değiştirme
```tsx
// Herhangi bir sayfada "DEĞİŞTİR" butonuna tıklayın
<button onClick={() => openUserSelect()}>
  DEĞİŞTİR
</button>
```

### 2. Aktif Kullanıcıyı Görüntüleme
```tsx
// useUser hook'u ile aktif kullanıcıya erişin
const { currentUser } = useUser();

<span>{currentUser?.name || 'Kullanıcı Seçin'}</span>
<span>{currentUser?.role}</span>
```

### 3. Yeni Sayfalara Ekleme
```tsx
// 1. Import edin
import { useUser } from '../contexts/UserContext';

// 2. Hook'u kullanın
const YourPage = () => {
  const { currentUser, openUserSelect } = useUser();
  
  return (
    <div>
      <span>👤 {currentUser?.name || 'Kullanıcı Seçin'}</span>
      <button onClick={openUserSelect}>DEĞİŞTİR</button>
    </div>
  );
};
```

## 📁 Dosya Yapısı

```
src/
├── contexts/
│   ├── UserContext.tsx          # Kullanıcı state yönetimi
│   └── ThemeContext.tsx         # Tema yönetimi
├── components/
│   ├── UserSelect.tsx           # Kullanıcı seçme modalı
│   └── UserSelect.css           # Modal stilleri
├── types/
│   └── index.ts                 # User interface tanımı
└── pages/
    ├── Home.tsx                 # ✅ Kullanıcı değiştirme eklendi
    ├── Tables.tsx               # ✅ Kullanıcı değiştirme eklendi
    ├── TableDetail.tsx          # ✅ Kullanıcı değiştirme eklendi
    ├── QuickSale.tsx            # ✅ Kullanıcı değiştirme eklendi
    └── ...
```

## 🔧 Teknik Detaylar

### UserContext API

```typescript
interface UserContextType {
  currentUser: User | null;        // Aktif kullanıcı
  setCurrentUser: (user: User | null) => void;  // Kullanıcı değiştir
  isUserSelectOpen: boolean;       // Modal açık mı?
  openUserSelect: () => void;      // Modalı aç
  closeUserSelect: () => void;     // Modalı kapat
}
```

### User Interface

```typescript
interface User {
  id: number;
  name: string;
  role: 'garson' | 'patron' | 'mudur' | 'kasa';
  avatar?: string;
  cafeId: number;
}
```

## 🎨 Tasarım Özellikleri

### Responsive Breakpoints
- **Mobile (< 768px)**: 1 kolon, tam genişlik
- **Tablet (768px - 1024px)**: 2 kolon
- **Desktop (> 1024px)**: 3 kolon

### Renk Kodları
- **Garson**: `var(--primary)` - Pink (#ec4899)
- **Patron**: `var(--secondary)` - Violet (#8b5cf6)
- **Müdür**: `var(--accent)` - Rose (#f43f5e)
- **Kasa**: `var(--success)` - Green (#10b981)

### Animasyonlar
- ✅ Modal fade-in (0.2s)
- ✅ Modal slide-up (0.3s)
- ✅ Card hover effects
- ✅ Selected badge scale-in

## 🔐 LocalStorage

Seçilen kullanıcı `localStorage`'da saklanır:

```javascript
// Kaydetme
localStorage.setItem('currentUser', JSON.stringify(user));

// Okuma
const savedUser = localStorage.getItem('currentUser');
const user = savedUser ? JSON.parse(savedUser) : null;
```

## 🌙 Dark Mode Desteği

Tüm renkler ve stiller dark mode'da otomatik olarak uyarlanır:

```css
[data-theme='dark'] .user-select-modal {
  background: var(--bg-primary);
}

[data-theme='dark'] .user-card {
  background: rgba(255, 255, 255, 0.05);
}
```

## ♿ Erişilebilirlik

- ✅ ARIA labels tüm butonlarda
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Focus indicators
- ✅ Screen reader uyumlu
- ✅ Semantic HTML

## 🐛 Bilinen Sorunlar

Şu anda bilinen bir sorun bulunmamaktadır.

## 📝 Gelecek Geliştirmeler

- [ ] Backend API entegrasyonu
- [ ] Kullanıcı yetkileri kontrolü
- [ ] Kullanıcı profil sayfası
- [ ] Avatar görselleri
- [ ] Çoklu cafe desteği
- [ ] Kullanıcı arama özelliği
- [ ] Son kullanılan kullanıcılar listesi

## 🤝 Katkıda Bulunma

Yeni özellikler eklerken:

1. **useUser** hook'unu import edin
2. **currentUser**'ı görüntüleyin
3. **openUserSelect**'i "DEĞİŞTİR" butonuna bağlayın
4. Responsive tasarıma dikkat edin
5. Dark mode desteğini test edin

## 📚 Daha Fazla Bilgi

- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Genel geliştirme kuralları
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

**Son Güncelleme**: 4 Kasım 2025  
**Versiyon**: 1.0.0  
**Geliştirici**: Harpy Pos Team
