import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cacheService } from '../services/cacheService';
import './Settings.css';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(false);
  const [activeMenu, setActiveMenu] = useState('sistem');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState({
    lastUpdate: null as Date | null,
    productCount: 0,
    categoryCount: 0,
    hasCache: false,
  });

  useEffect(() => {
    loadCacheInfo();
  }, []);

  const loadCacheInfo = () => {
    const info = cacheService.getCacheInfo();
    setCacheInfo(info);
  };

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    try {
      await cacheService.refreshCache();
      loadCacheInfo();
      alert('Veriler başarıyla yenilendi!');
    } catch (error) {
      console.error('Cache yenileme hatası:', error);
      alert('Veriler yenilenirken bir hata oluştu.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Tüm önbelleği temizlemek istediğinizden emin misiniz?')) {
      cacheService.clearCache();
      loadCacheInfo();
      alert('Önbellek temizlendi!');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            <span className="back-btn-text">Geri Dön</span>
          </button>
          <h2>AYARLAR</h2>
        </div>
        <div className="header-right">
          <button 
            className="theme-toggle-header" 
            onClick={toggleTheme} 
            title="Tema Değiştir"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeMenu === 'sistem' ? 'active' : ''}`}
              onClick={() => setActiveMenu('sistem')}
            >
              <span className="menu-icon">⚙️</span>
              Sistem
            </button>
            <button 
              className={`menu-item ${activeMenu === 'uygulama' ? 'active' : ''}`}
              onClick={() => setActiveMenu('uygulama')}
            >
              <span className="menu-icon">📱</span>
              Uygulama
            </button>
            <button 
              className={`menu-item ${activeMenu === 'yazarkasa' ? 'active' : ''}`}
              onClick={() => setActiveMenu('yazarkasa')}
            >
              <span className="menu-icon">💰</span>
              Yazarkasa
            </button>
            <button 
              className={`menu-item ${activeMenu === 'cihazlar' ? 'active' : ''}`}
              onClick={() => setActiveMenu('cihazlar')}
            >
              <span className="menu-icon">🖥️</span>
              Cihazlar
            </button>
            <button 
              className={`menu-item ${activeMenu === 'yazicilar' ? 'active' : ''}`}
              onClick={() => setActiveMenu('yazicilar')}
            >
              <span className="menu-icon">🖨️</span>
              Yazıcılar
            </button>
            <button 
              className={`menu-item ${activeMenu === 'kullanicilar' ? 'active' : ''}`}
              onClick={() => setActiveMenu('kullanicilar')}
            >
              <span className="menu-icon">👥</span>
              Kullanıcılar
            </button>
            <button 
              className={`menu-item ${activeMenu === 'baglanti' ? 'active' : ''}`}
              onClick={() => setActiveMenu('baglanti')}
            >
              <span className="menu-icon">📡</span>
              Bağlantı
            </button>
            <button 
              className={`menu-item ${activeMenu === 'bakim' ? 'active' : ''}`}
              onClick={() => setActiveMenu('bakim')}
            >
              <span className="menu-icon">🛠️</span>
              Bakım
            </button>
            <button 
              className={`menu-item ${activeMenu === 'veri' ? 'active' : ''}`}
              onClick={() => setActiveMenu('veri')}
            >
              <span className="menu-icon">💾</span>
              Veri Yönetimi
            </button>
            <button 
              className={`menu-item ${activeMenu === 'hakkinda' ? 'active' : ''}`}
              onClick={() => setActiveMenu('hakkinda')}
            >
              <span className="menu-icon">ℹ️</span>
              Hakkında
            </button>
          </div>
        </aside>

        <div className="settings-content">
          {activeMenu === 'sistem' && (
            <>
              <div className="settings-section">
                <h3>SİSTEM AYARLARI</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Kullanıcı</h4>
                    <p className="setting-description">İşletme e-posta adresi</p>
                  </div>
                  <label className="sr-only" htmlFor="email">İşletme e-posta adresi</label>
                  <input 
                    id="email"
                    type="email" 
                    name="email"
                    value="info@chocolatepalace.com" 
                    readOnly 
                    aria-label="Kullanıcı email"
                    title="İşletme e-posta adresi"
                    placeholder="İşletme e-posta adresi"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Dil</h4>
                    <p className="setting-description">Tüm sistem ekranları için varsayılan dil seçimi</p>
                  </div>
                  <label className="sr-only" htmlFor="language">Sistem dili</label>
                  <select 
                    id="language"
                    defaultValue="tr"
                    aria-label="Sistem dili"
                    title="Sistem dili seçimi"
                    name="language"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Menü</h4>
                    <p className="setting-description">İşletme adı</p>
                  </div>
                  <label className="sr-only" htmlFor="businessName">İşletme adı</label>
                  <input 
                    id="businessName"
                    type="text" 
                    value="Chocolate Palace" 
                    readOnly 
                    aria-label="İşletme adı"
                    title="İşletme adı"
                    placeholder="İşletme adı"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Gün Sonu Saati</h4>
                    <p className="setting-description">Sistemin gün sonu raporu alacağı saat</p>
                  </div>
                  <label className="sr-only" htmlFor="endTime">Gün sonu saati</label>
                  <input 
                    id="endTime"
                    type="time" 
                    defaultValue="00:00" 
                    aria-label="Gün sonu saati"
                    title="Gün sonu raporu saati"
                    placeholder="00:00"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Zaman Dilimi(UTC)</h4>
                    <p className="setting-description">İşletme lokasyonu saat dilimi</p>
                  </div>
                  <label className="sr-only" htmlFor="timezone">Zaman dilimi</label>
                  <select 
                    id="timezone"
                    defaultValue="+03:00"
                    aria-label="Zaman dilimi"
                    title="İşletme zaman dilimi"
                    name="timezone"
                  >
                    <option value="+03:00">+03:00 Istanbul</option>
                    <option value="+02:00">+02:00 Athens</option>
                    <option value="+01:00">+01:00 Berlin</option>
                  </select>
                </div>
                </form>
              </div>

              <div className="settings-section">
                <h3>ÇALIŞMA AYARLARI</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Sunucu Modu</h4>
                    <p className="setting-description">Sistemin çalışma modu</p>
                  </div>
                  <div className="toggle-switch">
                    <label className="switch" htmlFor="serverMode">
                      <input
                        id="serverMode"
                        name="serverMode"
                        type="checkbox"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                        aria-label="Sunucu modu"
                        title="Sistemin çalışma modunu değiştir"
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="toggle-label">{theme === 'dark' ? 'Açık' : 'Kapalı'}</span>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Bildirimler</h4>
                    <p className="setting-description">Siparişler, garson çağrıları, online siparişler için bildirimler</p>
                  </div>
                  <div className="toggle-switch">
                    <label className="switch" htmlFor="notifications">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        aria-label="Bildirimler"
                        title="Bildirimleri aç/kapat"
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="toggle-label">{notifications ? 'Açık' : 'Kapalı'}</span>
                  </div>
                </div>
                </form>
              </div>

              <div className="web-portal-link">
                <button onClick={() => window.open('https://portal.example.com', '_blank')}>
                  Web Portal'a Git <span>↗</span>
                </button>
              </div>
            </>
          )}

          {activeMenu === 'veri' && (
            <>
              <div className="settings-section">
                <h3>VERİ YÖNETİMİ</h3>
                
                <div className="cache-info-card">
                  <div className="cache-stats">
                    <div className="stat-item">
                      <span className="stat-label">Önbellekteki Ürünler:</span>
                      <span className="stat-value">{cacheInfo.productCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Önbellekteki Kategoriler:</span>
                      <span className="stat-value">{cacheInfo.categoryCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Son Güncelleme:</span>
                      <span className="stat-value">
                        {cacheInfo.lastUpdate 
                          ? cacheInfo.lastUpdate.toLocaleString('tr-TR')
                          : 'Henüz yüklenmedi'}
                      </span>
                    </div>
                  </div>

                  <div className="cache-actions">
                    <button 
                      className="refresh-btn"
                      onClick={handleRefreshCache}
                      disabled={isRefreshing}
                    >
                      <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
                      {isRefreshing ? 'Yenileniyor...' : 'Verileri Yenile'}
                    </button>
                    
                    <button 
                      className="clear-cache-btn"
                      onClick={handleClearCache}
                      disabled={!cacheInfo.hasCache}
                    >
                      🗑️ Önbelleği Temizle
                    </button>
                  </div>

                  <div className="cache-description">
                    <p>
                      <strong>ℹ️ Bilgi:</strong> Ürün ve kategori verileri performans için önbellekte saklanır. 
                      Yeni ürün eklediyseniz veya değişiklik yaptıysanız "Verileri Yenile" butonuna basın.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;