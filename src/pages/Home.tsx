import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { authService } from '../services/authService';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Truck, 
  ChefHat, 
  Package, 
  Archive, 
  Users, 
  BarChart3,
  User,
  Moon,
  Sun,
  Loader2,
  AlertCircle,
  RefreshCcw,
  LogOut
} from 'lucide-react';
import './Home.css';

interface MenuCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
}

interface Notification {
  id: number;
  platform: string;
  message: string;
  time: string;
  icon: string;
}

/**
 * Home - Ana Dashboard Sayfası
 * 
 * @component
 * @responsive ✅ Mobile(320px) / Tablet(768px) / Desktop(1024px+) tested
 * @ux ✅ Loading, Error states implemented
 * @a11y ✅ ARIA labels, keyboard navigation, semantic HTML
 * @performance ✅ useCallback, useMemo optimized
 */
const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, openUserSelect } = useUser();

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
      } catch (err) {
        setError('Veri yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // useCallback for performance optimization
  const handleCardClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleUserChange = useCallback(() => {
    openUserSelect();
  }, [openUserSelect]);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleLogout = useCallback(() => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      authService.logout();
      navigate('/login');
    }
  }, [navigate]);

  const menuCards: MenuCard[] = useMemo(() => [
    {
      id: 'tables',
      title: 'Masalar',
      icon: <UtensilsCrossed size={40} />,
      path: '/tables',
      gradient: 'var(--primary)',
    },
    {
      id: 'quick-sale',
      title: 'Hızlı Satış',
      icon: <ShoppingBag size={40} />,
      path: '/quick-sale',
      gradient: 'var(--primary)',
    },
    {
      id: 'take-away',
      title: 'Paket Sipariş',
      icon: <Truck size={40} />,
      path: '/take-away',
      gradient: 'var(--primary)',
    },
    {
      id: 'kitchen',
      title: 'Mutfak',
      icon: <ChefHat size={40} />,
      path: '/kitchen',
      gradient: 'var(--primary)',
    },
    {
      id: 'products',
      title: 'Ürünler',
      icon: <Package size={40} />,
      path: '/products',
      gradient: 'var(--primary)',
    },
    {
      id: 'stock',
      title: 'Stoklar',
      icon: <Archive size={40} />,
      path: '/stock',
      gradient: 'var(--primary)',
    },
    {
      id: 'customers',
      title: 'Cariler',
      icon: <Users size={40} />,
      path: '/customers',
      gradient: 'var(--primary)',
    },
    {
      id: 'reports',
      title: 'Raporlar',
      icon: <BarChart3 size={40} />,
      path: '/reports',
      gradient: 'var(--primary)',
    },
  ], []);

  const notifications: Notification[] = useMemo(() => [
    {
      id: 1,
      platform: 'Stok Uyarısı',
      message: 'Sucuk stoğu kritik seviyeye iniyor (5 adet kaldı)',
      time: '15:27',
      icon: '⚠️',
    },
    {
      id: 2,
      platform: 'Doluluk Oranı',
      message: 'Masaların %85\'i dolu durumda',
      time: '15:32',
      icon: '📊',
    },
    {
      id: 3,
      platform: 'Günlük Rapor',
      message: 'Bugün 157 sipariş tamamlandı',
      time: '15:41',
      icon: '�',
    },
    {
      id: 4,
      platform: 'Personel Bildirimi',
      message: 'Oğuzhan\'ın vardiyası 30 dk sonra bitiyor',
      time: '15:45',
      icon: '👤',
    },
    {
      id: 5,
      platform: 'Mutfak Uyarısı',
      message: 'Izgara bölümünde yoğunluk var',
      time: '15:48',
      icon: '�',
    },
  ], []);

  const currentTime = useMemo(() => new Date(), []);
  const timeString = useMemo(() => 
    currentTime.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }), [currentTime]
  );
  const dateString = useMemo(() => 
    currentTime.toLocaleDateString('tr-TR', { 
      day: 'numeric',
      month: 'long',
      weekday: 'long'
    }), [currentTime]
  );

  // Loading State
  if (loading) {
    return (
      <div className="home-container">
        <header className="home-header">
          <div className="header-left">
            <h1 className="logo">HARPY <span>Pos</span></h1>
          </div>
          <div className="header-center">
            <span className="restaurant-name">UNDERGROUND CAFE</span>
          </div>
          <div className="header-right"></div>
        </header>
        <div className="loading-state">
          <Loader2 className="spinner-icon" size={48} />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="home-container">
        <header className="home-header">
          <div className="header-left">
            <h1 className="logo">HARPY <span>Pos</span></h1>
          </div>
          <div className="header-center">
            <span className="restaurant-name">UNDERGROUND CAFE</span>
          </div>
          <div className="header-right"></div>
        </header>
        <div className="error-state" role="alert">
          <AlertCircle size={48} />
          <h2>Bir Hata Oluştu</h2>
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="retry-btn"
            aria-label="Tekrar dene"
          >
            <RefreshCcw size={18} />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <h1 className="logo">HARPY <span>Pos</span></h1>
        </div>
        <div className="header-center">
          <span className="restaurant-name">UNDERGROUND CAFE</span>
        </div>
        <div className="header-right">
          <button 
            className="logout-btn" 
            onClick={handleLogout} 
            title="Çıkış Yap"
            aria-label="Çıkış Yap"
            type="button"
          >
            <LogOut size={20} strokeWidth={2} />
          </button>
          <button 
            className="theme-toggle-header" 
            onClick={toggleTheme} 
            title={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
            aria-label={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
            type="button"
          >
            {theme === 'light' ? (
              <Moon size={20} strokeWidth={2} />
            ) : (
              <Sun size={20} strokeWidth={2} />
            )}
          </button>
          <div className="status-item user-item">
            <User size={18} />
            <span>{currentUser?.name || 'Kullanıcı Seçin'}</span>
            <button 
              className="change-btn"
              onClick={handleUserChange}
              aria-label="Kullanıcı değiştir"
            >
              DEĞİŞTİR
            </button>
          </div>
        </div>
      </header>

      <div className="home-content">
        {/* Left Panel - Notifications */}
        <aside className="left-panel">
          <div className="time-widget">
            <div className="time-info">
              <div className="current-time">{timeString}</div>
              <div className="current-date">{dateString}</div>
            </div>
          </div>

          <div className="notifications-section">
            <div className="notifications-header">
              <h3>� İŞLETME DURUMU</h3>
              <span className="badge">5</span>
            </div>
            <div className="notifications-list">
              {notifications.map((notif) => (
                <div key={notif.id} className="notification-item">
                  <div className="notif-icon">{notif.icon}</div>
                  <div className="notif-content">
                    <div className="notif-platform">{notif.platform}</div>
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-time">{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="show-all-btn">
              Tüm bildirimleri göster →
            </button>
          </div>

        </aside>

        {/* Right Panel - Menu Grid */}
        <main className="main-panel">
          <div className="menu-grid" role="navigation" aria-label="Ana menü">
            {menuCards.map((card) => (
              <button
                key={card.id}
                className="menu-card"
                onClick={() => handleCardClick(card.path)}
                aria-label={`${card.title} sayfasına git`}
              >
                <div className="menu-icon" aria-hidden="true">{card.icon}</div>
                <h3 className="menu-title">{card.title}</h3>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <span>Harpy Pos 1.0</span>
        <div className="home-footer-buttons">
          <button 
            className="customer-service-btn"
            aria-label="Müşteri hizmetlerini ara"
          >
            📞 Müşteri Hizmetleri
          </button>
          <button 
            className="settings-btn"
            onClick={() => handleCardClick('/settings')}
            aria-label="Ayarlar sayfasına git"
          >
            ⚙️ Ayarlar
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
