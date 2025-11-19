import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cacheService } from '../services/cacheService';
import { tableDefinitionService, TableDefinition } from '../services/tableDefinitionService';
import { useUser } from '../contexts/UserContext';
import './Settings.css';

interface SettingsProps {}

interface Table {
  id: number;
  name: string;
  capacity: number;
  type: 'round' | 'square' | 'rectangle';
  x: number;
  y: number;
  cafe_id?: number;
  table_number?: number;
  area?: string;
}

const Settings: React.FC<SettingsProps> = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState(false);
  const [activeMenu, setActiveMenu] = useState('sistem');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cacheInfo, setCacheInfo] = useState({
    lastUpdate: null as Date | null,
    productCount: 0,
    categoryCount: 0,
    hasCache: false,
  });

  // Masa yönetimi state'leri
  const [tables, setTables] = useState<Table[]>([]);
  const [draggingTable, setDraggingTable] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedArea, setSelectedArea] = useState<string>('all'); // Area filtresi

  useEffect(() => {
    loadCacheInfo();
    if (currentUser && activeMenu === 'masalar') {
      loadTables();
    }
  }, [currentUser, activeMenu]);

  const loadTables = async () => {
    if (!currentUser?.cafeId) {
      console.warn('Kafe seçilmedi');
      return;
    }

    setLoading(true);
    try {
      const apiTables = await tableDefinitionService.getTablesByCafe(currentUser.cafeId);
      
      // API'den gelen verileri local Table formatına çevir
      const formattedTables: Table[] = apiTables.map((apiTable: TableDefinition) => ({
        id: apiTable.id,
        name: apiTable.name,
        capacity: apiTable.capacity || 4,
        type: determineTableType(apiTable.capacity || 4),
        x: apiTable.position_x ? parseInt(apiTable.position_x) : 0,
        y: apiTable.position_y ? parseInt(apiTable.position_y) : 0,
        cafe_id: apiTable.cafe_id,
        table_number: apiTable.table_number,
        area: apiTable.area || undefined,
      }));

      setTables(formattedTables);
    } catch (error) {
      console.error('Masalar yüklenirken hata:', error);
      alert('Masalar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Kapasite ve masa tipini belirle
  const determineTableType = (capacity: number): 'round' | 'square' | 'rectangle' => {
    if (capacity <= 2) return 'square';
    if (capacity <= 4) return 'round';
    return 'rectangle';
  };

  const loadCacheInfo = () => {
    const info = cacheService.getCacheInfo();
    setCacheInfo(info);
  };

  // Benzersiz alanları al
  const getUniqueAreas = (): string[] => {
    const areas = tables
      .map(t => t.area)
      .filter((area): area is string => area !== undefined && area !== null && area !== '');
    return ['all', ...Array.from(new Set(areas))];
  };

  // Filtrelenmiş yerleştirilmemiş masalar
  const getUnplacedTables = () => {
    const unplaced = tables.filter(t => t.x === 0 && t.y === 0);
    if (selectedArea === 'all') {
      return unplaced;
    }
    return unplaced.filter(t => t.area === selectedArea);
  };

  // Yeni masa ekle
  const handleAddNewTable = async () => {
    if (!currentUser?.cafeId) {
      alert('Kafe bilgisi bulunamadı!');
      return;
    }

    const tableName = prompt('Masa adı:');
    if (!tableName) return;

    const area = prompt('Alan (örn: teras, bahçe, salon):', 'salon');
    if (!area) return;

    const capacityStr = prompt('Kapasite (kişi sayısı):', '4');
    if (!capacityStr) return;

    const capacity = parseInt(capacityStr);
    if (isNaN(capacity) || capacity < 1) {
      alert('Geçerli bir kapasite girin!');
      return;
    }

    const tableNumber = tables.length + 1;

    setLoading(true);
    try {
      const newTable = await tableDefinitionService.createTable({
        cafe_id: currentUser.cafeId,
        name: tableName,
        area: area,
        table_number: tableNumber,
        capacity: capacity,
        position_x: '0',
        position_y: '0',
        is_active: true,
      });

      // Yeni masayı listeye ekle
      const formattedTable: Table = {
        id: newTable.id,
        name: newTable.name,
        capacity: newTable.capacity || 4,
        type: determineTableType(newTable.capacity || 4),
        x: 0,
        y: 0,
        cafe_id: newTable.cafe_id,
        table_number: newTable.table_number,
        area: newTable.area || area,
      };

      setTables(prev => [...prev, formattedTable]);
      alert('Yeni masa başarıyla eklendi!');
    } catch (error) {
      console.error('Masa eklenirken hata:', error);
      alert('Masa eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Masa sil
  const handleDeleteTable = async (tableId: number) => {
    if (!window.confirm('Bu masayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    try {
      await tableDefinitionService.deleteTable(tableId);
      setTables(prev => prev.filter(t => t.id !== tableId));
      alert('Masa başarıyla silindi!');
    } catch (error) {
      console.error('Masa silinirken hata:', error);
      alert('Masa silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Masa sürükle-bırak fonksiyonları
  const handleTableMouseDown = (tableId: number, e: React.MouseEvent) => {
    e.preventDefault();
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const gridElement = (e.currentTarget as HTMLElement).parentElement;
    if (!gridElement) return;

    const rect = gridElement.getBoundingClientRect();
    const gridSize = 30; // 30px per unit
    const gridSizeY = 40; // 40px per unit for Y

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const tableX = table.x * gridSize;
    const tableY = table.y * gridSizeY;

    setDragOffset({
      x: clickX - tableX,
      y: clickY - tableY
    });
    setDraggingTable(tableId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingTable === null) return;

    const gridElement = e.currentTarget as HTMLElement;
    const rect = gridElement.getBoundingClientRect();
    const gridSize = 30;
    const gridSizeY = 40;

    let newX = Math.round((e.clientX - rect.left - dragOffset.x) / gridSize);
    let newY = Math.round((e.clientY - rect.top - dragOffset.y) / gridSizeY);

    // Sınırları kontrol et (0-30 X, 0-15 Y)
    newX = Math.max(0, Math.min(30, newX));
    newY = Math.max(0, Math.min(15, newY));

    setTables(prev => prev.map(table =>
      table.id === draggingTable
        ? { ...table, x: newX, y: newY }
        : table
    ));
  };

  const handleMouseUp = () => {
    if (draggingTable !== null) {
      console.log('Masa konumu güncellendi:', tables.find(t => t.id === draggingTable));
      setDraggingTable(null);
    }
  };

  const handleSaveLayout = async () => {
    if (!currentUser?.cafeId) {
      alert('Kafe bilgisi bulunamadı!');
      return;
    }

    setLoading(true);
    try {
      // Sadece pozisyonu değişmiş masaları güncelle
      const updates = tables
        .filter(table => table.x !== 0 || table.y !== 0) // Yerleştirilmiş masalar
        .map(table => ({
          id: table.id,
          x: table.x,
          y: table.y
        }));

      if (updates.length === 0) {
        alert('Yerleştirilmiş masa bulunamadı!');
        return;
      }

      await tableDefinitionService.updateMultiplePositions(updates);
      alert(`${updates.length} masanın konumu başarıyla kaydedildi!`);
      
      // Masaları yeniden yükle
      await loadTables();
    } catch (error) {
      console.error('Masa düzeni kaydedilirken hata:', error);
      alert('Masa düzeni kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
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
              className={`menu-item ${activeMenu === 'masalar' ? 'active' : ''}`}
              onClick={() => setActiveMenu('masalar')}
            >
              <span className="menu-icon">🪑</span>
              Masa Yönetimi
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

          {activeMenu === 'masalar' && (
            <>
              <div className="settings-section">
                <div className="section-header-with-actions">
                  <div className="section-title-group">
                    <h3>MASA YÖNETİMİ</h3>
                  </div>
                  <div className="section-actions">
                    <button 
                      className="add-table-btn" 
                      onClick={handleAddNewTable}
                      disabled={loading}
                    >
                      + Yeni Masa
                    </button>
                    <button 
                      className="save-layout-btn" 
                      onClick={handleSaveLayout}
                      disabled={loading}
                    >
                      {loading ? '⏳ Kaydediliyor...' : '💾 Düzeni Kaydet'}
                    </button>
                  </div>
                </div>
                
                <div className="table-management-full">
                  <div className="layout-panel-full">
                    <div className="layout-canvas">
                      {loading && (
                        <div className="loading-overlay">
                          <div className="loading-spinner">⏳ Yükleniyor...</div>
                        </div>
                      )}
                      
                      {/* Yerleştirilmemiş masalar listesi */}
                      <div className="unplaced-tables">
                        <div className="unplaced-header">
                          <h5>Yerleştirilmemiş Masalar</h5>
                          {getUniqueAreas().length > 1 && (
                            <div className="area-filter-buttons">
                              {getUniqueAreas().map(area => (
                                <button
                                  key={area}
                                  className={`area-filter-btn ${selectedArea === area ? 'active' : ''}`}
                                  onClick={() => setSelectedArea(area)}
                                >
                                  {area === 'all' ? '🏠 Tümü' : `📍 ${area.charAt(0).toUpperCase() + area.slice(1)}`}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="unplaced-tables-list">
                          {getUnplacedTables().map((table) => (
                            <div 
                              key={table.id}
                              className={`unplaced-table-item`}
                              onMouseDown={(e) => handleTableMouseDown(table.id, e)}
                              title={`${table.name} - Sürükleyerek yerleştirin`}
                            >
                              {/* Mini önizleme */}
                              <div className="mini-table-preview">
                                {table.type === 'round' && (
                                  <div className="table-realistic round-table">
                                    <div className="table-top">
                                      <span className="table-label">{table.capacity}</span>
                                    </div>
                                    <div className="chairs">
                                      {[...Array(Math.min(table.capacity, 6))].map((_, i) => (
                                        <div 
                                          key={i} 
                                          className="chair" 
                                          style={{
                                            transform: `rotate(${(360 / Math.min(table.capacity, 6)) * i}deg) translateY(-38px)`
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {table.type === 'square' && (
                                  <div className="table-realistic square-table">
                                    <div className="table-top">
                                      <span className="table-label">{table.capacity}</span>
                                    </div>
                                    <div className="chairs">
                                      {table.capacity === 2 ? (
                                        <>
                                          <div className="chair top" />
                                          <div className="chair bottom" />
                                        </>
                                      ) : (
                                        <>
                                          <div className="chair top" />
                                          <div className="chair right" />
                                          <div className="chair bottom" />
                                          <div className="chair left" />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {table.type === 'rectangle' && (
                                  <div className="table-realistic rectangle-table">
                                    <div className="table-top">
                                      <span className="table-label">{table.capacity}</span>
                                    </div>
                                    <div className="chairs">
                                      {[...Array(Math.floor(table.capacity / 2))].map((_, i) => (
                                        <div key={`top-${i}`} className="chair top" style={{ left: `${20 + i * 30}px` }} />
                                      ))}
                                      {[...Array(Math.ceil(table.capacity / 2))].map((_, i) => (
                                        <div key={`bottom-${i}`} className="chair bottom" style={{ left: `${20 + i * 30}px` }} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <span className="table-name">{table.name}</span>
                              <small className="table-capacity">{table.capacity} Kişi</small>
                              {table.area && (
                                <small className="table-area-badge">{table.area}</small>
                              )}
                              <button 
                                className="delete-table-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTable(table.id);
                                }}
                                title="Masayı Sil"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                          {getUnplacedTables().length === 0 && (
                            <p className="no-unplaced">
                              {selectedArea === 'all' 
                                ? 'Tüm masalar yerleştirildi ✓' 
                                : `${selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1)} alanında yerleştirilmemiş masa yok`
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        className="dotted-grid"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {tables.filter(t => t.x !== 0 || t.y !== 0).map((table) => (
                          <div 
                            key={table.id}
                            className={`table-marker table-${table.type} ${draggingTable === table.id ? 'dragging' : ''}`}
                            style={{
                              left: `${table.x * 30}px`,
                              top: `${table.y * 40}px`
                            }}
                            onMouseDown={(e) => handleTableMouseDown(table.id, e)}
                            title={`${table.name} (X:${table.x}, Y:${table.y})`}
                          >
                            {/* Yuvarlak Masa */}
                            {table.type === 'round' && (
                              <div className="table-realistic round-table">
                                <div className="table-top">
                                  <span className="table-label">{table.name}</span>
                                </div>
                                <div className="chairs">
                                  {[...Array(table.capacity)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className="chair" 
                                      style={{
                                        transform: `rotate(${(360 / table.capacity) * i}deg) translateY(-38px)`
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Kare Masa */}
                            {table.type === 'square' && (
                              <div className="table-realistic square-table">
                                <div className="table-top">
                                  <span className="table-label">{table.name}</span>
                                </div>
                                <div className="chairs">
                                  {table.capacity === 2 && (
                                    <>
                                      <div className="chair top" />
                                      <div className="chair bottom" />
                                    </>
                                  )}
                                  {table.capacity === 4 && (
                                    <>
                                      <div className="chair top" />
                                      <div className="chair right" />
                                      <div className="chair bottom" />
                                      <div className="chair left" />
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Dikdörtgen Masa */}
                            {table.type === 'rectangle' && (
                              <div className="table-realistic rectangle-table">
                                <div className="table-top">
                                  <span className="table-label">{table.name}</span>
                                </div>
                                <div className="chairs">
                                  {[...Array(Math.floor(table.capacity / 2))].map((_, i) => (
                                    <div key={`top-${i}`} className="chair top" style={{ left: `${20 + i * 30}px` }} />
                                  ))}
                                  {[...Array(Math.ceil(table.capacity / 2))].map((_, i) => (
                                    <div key={`bottom-${i}`} className="chair bottom" style={{ left: `${20 + i * 30}px` }} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="layout-info">
                        <p>💡 Masaları sürükleyerek harita üzerine yerleştirin</p>
                        <p>📍 Yerleştirilen masalar otomatik olarak koordinatlarına kaydedilir</p>
                        <p>🔵 Yuvarlak | 🟦 Kare | 🟩 Dikdörtgen masa tipleri</p>
                      </div>
                    </div>
                  </div>
                </div>
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