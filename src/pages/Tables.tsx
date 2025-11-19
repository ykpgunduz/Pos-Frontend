import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Grid3x3, LayoutGrid, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Table } from '../types';
import { tableService } from '../services/tableService';
import { cartService } from '../services/cartService';
import { cafeService } from '../services/cafeService';
import { createPortal } from 'react-dom';
import './Tables.css';

interface TableOrder {
  id: number;
  tableNumber: string;
  time: string;
  amount: number;
  waiter?: string;
}

const Tables = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, openUserSelect } = useUser();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'bird'>('grid');
  const [selectedArea, setSelectedArea] = useState('salon');
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const [selectedTableRef, setSelectedTableRef] = useState<HTMLDivElement | null>(null);
  const [tableCount, setTableCount] = useState<number>(0);
  const [cafeId, setCafeId] = useState<number | null>(null);
  const areas = ['tumu', 'bahce', 'salon', 'kat'];

  const handleTableContextMenu = (e: React.MouseEvent, tableId: number) => {
    e.preventDefault();
    const tableElement = e.currentTarget as HTMLDivElement;
    setSelectedTable(tableId);
    setSelectedTableRef(tableElement);
    setShowActions(true);
  };

  const handleTableLongPress = (e: React.TouchEvent, tableId: number) => {
    e.preventDefault();
    const tableElement = e.currentTarget as HTMLDivElement;
    setSelectedTable(tableId);
    setSelectedTableRef(tableElement);
    setShowActions(true);
  };

  const handleCloseActions = () => {
    setSelectedTable(null);
    setSelectedTableRef(null);
    setShowActions(false);
  };

  const handleTableAction = (action: string) => {
    switch (action) {
      case 'move':
        alert('Masa taşıma özelliği eklenecek');
        break;
      case 'merge':
        alert('Masa birleştirme özelliği eklenecek');
        break;
      case 'revise':
        alert('Masa revize etme özelliği eklenecek');
        break;
    }
    handleCloseActions();
  };

  useEffect(() => {
    loadCafeInfo();
    loadOrders();
  }, []);

  useEffect(() => {
    // tableCount ve cafeId yüklendikten sonra masaları getir
    if (tableCount > 0 && cafeId) {
      loadTables();
    }
  }, [tableCount, cafeId]);

  useEffect(() => {
    const handleResize = () => {
      // Pencere boyutu değiştiğinde tabloları yeniden yükle
      if (tableCount > 0 && cafeId) {
        loadTables();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tableCount, cafeId]);

  const loadCafeInfo = async () => {
    try {
      const cafe = await cafeService.getCurrentCafe();
      setCafeId(cafe.id);
      // Masa sayısını maksimum 50 ile sınırla (daha gerçekçi)
      const maxTables = Math.min(cafe.table_count, 50);
      setTableCount(maxTables);
      console.log('✅ Cafe bilgisi yüklendi:', { cafeId: cafe.id, cafeName: cafe.name, tableCount: maxTables });
    } catch (err) {
      console.error('❌ Cafe bilgisi yüklenemedi:', err);
      // Hata durumunda varsayılan olarak 10 masa göster
      setTableCount(10);
      setCafeId(null);
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      
      // Önce cafe'nin masalarını API'den al
      const apiTables = await tableService.getCurrentCafeTables();
      console.log('📋 API\'den gelen masalar:', apiTables.length);

      // Eğer cafe'nin table_count'ı varsa ve API'den gelen masa sayısı az ise
      if (cafeId && tableCount > 0) {
        if (apiTables.length === 0) {
          // Hiç masa yoksa, cafe için masalar oluştur
          console.log('🔨 Masalar oluşturuluyor... Cafe ID:', cafeId, 'Masa Sayısı:', tableCount);
          
          const generatedTables: Table[] = [];
          const areas: Array<'bahce' | 'salon' | 'kat'> = ['bahce', 'salon', 'kat'];
          
          for (let i = 1; i <= tableCount; i++) {
            const areaIndex = Math.floor((i - 1) / Math.ceil(tableCount / 3));
            const newTable: Omit<Table, 'id'> = {
              tableNumber: `M${i}`,
              capacity: 4,
              status: 'available',
              area: areas[Math.min(areaIndex, 2)],
              currentGuests: 0,
              cafe_id: cafeId
            };
            
            try {
              // Backend'e masa oluştur
              const createdTable = await tableService.createTable(newTable);
              generatedTables.push(createdTable);
              console.log(`✅ Masa ${i} oluşturuldu:`, createdTable);
            } catch (err) {
              console.error(`❌ Masa ${i} oluşturulamadı:`, err);
              // Hata olursa frontend'de göster
              generatedTables.push({
                id: i,
                ...newTable
              } as Table);
            }
          }
          
          setTables(generatedTables);
          console.log('✅ Toplam oluşturulan masa sayısı:', generatedTables.length);
        } else if (apiTables.length < tableCount) {
          // Eksik masalar varsa tamamla
          console.log('⚠️ Eksik masalar var. Tamamlanıyor...');
          const generatedTables: Table[] = [...apiTables];
          const existingIds = new Set(apiTables.map(t => t.id));
          const areas: Array<'bahce' | 'salon' | 'kat'> = ['bahce', 'salon', 'kat'];
          
          for (let i = 1; i <= tableCount; i++) {
            if (!existingIds.has(i)) {
              const areaIndex = Math.floor((i - 1) / Math.ceil(tableCount / 3));
              const newTable: Omit<Table, 'id'> = {
                tableNumber: `M${i}`,
                capacity: 4,
                status: 'available',
                area: areas[Math.min(areaIndex, 2)],
                currentGuests: 0,
                cafe_id: cafeId
              };
              
              try {
                const createdTable = await tableService.createTable(newTable);
                generatedTables.push(createdTable);
                console.log(`✅ Eksik masa ${i} oluşturuldu`);
              } catch (err) {
                console.error(`❌ Eksik masa ${i} oluşturulamadı:`, err);
                generatedTables.push({
                  id: i,
                  ...newTable
                } as Table);
              }
            }
          }
          
          setTables(generatedTables.sort((a, b) => a.id - b.id));
          console.log('✅ Masalar tamamlandı:', generatedTables.length);
        } else {
          // Tüm masalar mevcut
          setTables(apiTables);
          console.log('✅ Masalar yüklendi:', apiTables.length);
        }
      } else {
        // Cafe bilgisi yoksa sadece API'den gelen masaları göster
        setTables(apiTables);
        console.log('⚠️ Cafe bilgisi yok, sadece API masaları gösteriliyor');
      }
    } catch (err) {
      console.error('❌ Masalar yüklenemedi:', err);
      
      // Hata durumunda frontend'de masalar oluştur
      if (cafeId && tableCount > 0) {
        const generatedTables: Table[] = [];
        const areas: Array<'bahce' | 'salon' | 'kat'> = ['bahce', 'salon', 'kat'];
        
        for (let i = 1; i <= tableCount; i++) {
          const areaIndex = Math.floor((i - 1) / Math.ceil(tableCount / 3));
          generatedTables.push({
            id: i,
            tableNumber: `M${i}`,
            capacity: 4,
            status: 'available',
            area: areas[Math.min(areaIndex, 2)],
            currentGuests: 0,
            cafe_id: cafeId
          });
        }
        
        setTables(generatedTables);
        console.log('⚠️ API hatası - Frontend masaları gösteriliyor:', generatedTables.length);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = () => {
    // Try to load recent carts (treat them as orders)
    (async () => {
      try {
        const carts = await cartService.getList();
        const mapped = (carts || []).map((c: any) => ({
          id: c.id,
          tableNumber: c.tableNumber || `Masa ${c.tableId ?? c.id}`,
          time: (c.created_at || c.createdAt || '').slice(11,16) || '',
          amount: Number(c.totalAmount ?? c.total_amount ?? 0),
          waiter: c.waiter_name || c.waiter || currentUser?.name
        }));
        setOrders(mapped);
      } catch (err) {
        console.warn('Orders yüklenemedi, fallback mock kullanılıyor', err);
        setOrders([]);
      }
    })();
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'available';
      case 'occupied': return 'occupied';
      case 'reserved': return 'reserved';
      default: return 'available';
    }
  };

  const getStatusText = (status: Table['status'], guests?: number) => {
    const isMobile = window.innerWidth <= 480;
    
    switch (status) {
      case 'available': return 'Boş';
      case 'occupied': return guests ? `${guests} Kişi` : 'Dolu';
      case 'reserved': return isMobile ? 'Rez' : 'Rezerve';
      default: return 'Bilinmiyor';
    }
  };

  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  if (loading) {
    return <div className="tables-page"><div className="loading">Yükleniyor...</div></div>;
  }

  return (
    <div className="tables-page">
      {/* Header */}
      <header className="tables-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span className="back-btn-text">Ana Sayfa</span>
          </button>
          <div className="order-count-badge">
            {orders.length} ADİSYON
          </div>
        </div>
        
        <div className="header-content">
          <div className="title-area">
            <h1 className="page-title">MASALAR</h1>
            <div className="floor-tabs-header">
              {areas.map((area) => (
                <button 
                  key={area}
                  className={`floor-tab ${selectedArea === area ? 'active' : ''}`}
                  onClick={() => setSelectedArea(area)}
                >
                  {area === 'tumu' && 'Tümü'}
                  {area === 'bahce' && 'Bahçe'}
                  {area === 'salon' && 'Salon'}
                  {area === 'kat' && 'Kat'}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="view-toggle" 
            onClick={() => setViewMode(viewMode === 'grid' ? 'bird' : 'grid')}
            title={viewMode === 'grid' ? 'Kuş Bakışı' : 'Grid Görünüm'}
          >
            {viewMode === 'grid' ? <Grid3x3 size={20} /> : <LayoutGrid size={20} />}
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          <div className="waiter-info">
            <span className="waiter-name">👤 {currentUser?.name || 'Kullanıcı Seçin'}</span>
            <button 
              className="change-waiter-btn" 
              onClick={() => openUserSelect()}
            >
              <span className="waiter-btn-text">Değiştir</span>
              <LogOut size={18} className="waiter-btn-icon" />
            </button>
          </div>
        </div>
      </header>

      {/* İşlem Menüsü Overlay */}
      {showActions && selectedTableRef && (
        <>
          <div className="table-actions-overlay active" onClick={handleCloseActions} />
          {createPortal(
            <div className="table-actions-menu" onClick={e => e.stopPropagation()}>
              <button className="table-action-btn" onClick={() => handleTableAction('move')}>
                🔄 Masayı Taşı
              </button>
              <button className="table-action-btn" onClick={() => handleTableAction('merge')}>
                🔗 Masa Birleştir
              </button>
              <button className="table-action-btn" onClick={() => handleTableAction('revise')}>
                ✏️ Masayı Revize Et
              </button>
            </div>,
            selectedTableRef
          )}
        </>
      )}

      <div className="tables-content">
        {/* Left Sidebar - Orders */}
        <aside className="orders-sidebar">
          <div className="orders-list">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="order-card"
                onClick={() => navigate(`/payment/${order.id}`)}
              >
                <div className="order-info">
                  <div className="order-number">{order.id}</div>
                  <div className="order-details">
                    <div className="order-table">{order.tableNumber}</div>
                    {order.waiter && (
                      <div className="order-waiter">👤 {order.waiter}</div>
                    )}
                  </div>
                </div>
                <div className="order-meta">
                  <div className="order-time">{order.time}</div>
                  <div className="order-amount">₺{order.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="total-label">TOPLAM</div>
            <div className="total-amount">₺{totalAmount.toFixed(2)}</div>
          </div>
        </aside>

        {/* Main Content - Tables Grid */}
        <main className="tables-main">
          <div 
            className={`tables-grid ${viewMode === 'bird' ? 'bird-view' : ''}`}
            data-area={selectedArea}
          >
            {tables
              .filter(table => selectedArea === 'tumu' ? true : table.area === selectedArea)
              .map((table) => {
              const statusClass = getStatusColor(table.status);
              const statusText = getStatusText(table.status, table.currentGuests);
              
              return (
                <div 
                  key={table.id} 
                  className={`table-card ${statusClass} ${viewMode === 'bird' ? 'bird-card' : ''} ${selectedTable === table.id ? 'selected' : ''}`}
                  onClick={() => navigate(`/tables/${table.id}`)}
                  onContextMenu={(e) => handleTableContextMenu(e, table.id)}
                  onTouchStart={(e) => handleTableLongPress(e, table.id)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="table-header">
                        <div className="table-number">{table.tableNumber}</div>
                        <div className={`table-status ${statusClass}`}>
                          {statusText}
                        </div>
                      </div>
                      
                      {table.status === 'occupied' && (
                        <div className="table-occupied-info">
                          <div className="table-amount">
                            ₺{(Math.random() * 300 + 50).toFixed(2)}
                          </div>
                          <div className="table-meta">
                            <div className="table-time">
                              {Math.floor(Math.random() * 2) + 16}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                            </div>
                            <div className="table-waiter">{currentUser?.name || 'Garson'}</div>
                          </div>
                        </div>
                      )}
                      
                      {table.status === 'reserved' && (
                        <div className="table-reserved-info">
                          <div className="reserved-label">Rezerve</div>
                          <div className="table-time">
                            {Math.floor(Math.random() * 24)}:00
                          </div>
                        </div>
                      )}
                      
                      {table.status === 'available' && (
                        <div className="table-empty-info">
                          <div className="table-capacity">👥 {table.capacity} Kişi</div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Kuş bakışı görünüm - sadece masa numarası
                    <div className="table-bird-info">
                      {table.tableNumber}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tables;
