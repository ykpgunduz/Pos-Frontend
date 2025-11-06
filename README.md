# Kafe Yönetim Paneli

Modern bir kafe yönetim paneli uygulaması. React, TypeScript ve Vite ile geliştirilmiştir.

## Özellikler

- 🍽️ Masa yönetimi
- 📊 Dashboard ve raporlama
- 🎨 Modern ve kullanıcı dostu arayüz
- 🐳 Docker desteği
- 📱 Responsive tasarım

## Gereksinimler

- Node.js 18+
- npm veya yarn
- Docker (opsiyonel)

## Kurulum

### NPM ile Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Docker ile Çalıştırma

```bash
# Docker container'ı oluştur ve başlat
docker-compose up -d

# Container'ı durdur
docker-compose down
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Proje Yapısı

```
├── src/
│   ├── components/     # Reusable bileşenler
│   ├── pages/          # Sayfa bileşenleri
│   ├── services/       # API servisleri
│   ├── types/          # TypeScript tip tanımlamaları
│   ├── utils/          # Yardımcı fonksiyonlar
│   ├── App.tsx         # Ana uygulama bileşeni
│   └── main.tsx        # Giriş noktası
├── public/             # Statik dosyalar
└── docker-compose.yml  # Docker yapılandırması
```

## API Entegrasyonu

API endpoint'leri `src/services/api.ts` dosyasında yapılandırılabilir.

## Teknolojiler

- React 18
- TypeScript
- Vite
- React Router
- Axios
- Lucide React (iconlar için)

## Lisans

MIT
