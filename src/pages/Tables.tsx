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
  const [selectedArea, setSelectedArea] = useState('tumu');
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const [selectedTableRef, setSelectedTableRef] = useState<HTMLDivElement | null>(null);
  const [tableCount, setTableCount] = useState<number>(0);
  const [cafeId, setCafeId] = useState<number | null>(null);
  const [areas, setAreas] = useState<string[]>(['tumu']); // Dinamik area listesi

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
    const initPage = async () => {
      setLoading(true);
      await loadCafeInfo();
      loadOrders();
    };
    
    initPage();
  }, []);

  useEffect(() => {
    // cafeId yüklendikten sonra masaları getir
    if (cafeId) {
      loadTables();
    } else {
      // Cafe ID yoksa loading'i kapat
      setLoading(false);
    }
  }, [cafeId]);

  useEffect(() => {
    const handleResize = () => {
      // Pencere boyutu değiştiğinde ekranı yeniden render et
      // Masaları tekrar yüklemek gerekmez
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadCafeInfo = async () => {
    try {
      const cafe = await cafeService.getCurrentCafe();
      setCafeId(cafe.id);
      setTableCount(cafe.table_count);
      console.log('✅ Cafe bilgisi yüklendi:', { cafeId: cafe.id, cafeName: cafe.name, tableCount: cafe.table_count });
    } catch (err) {
      console.error('❌ Cafe bilgisi yüklenemedi:', err);
      setTableCount(0);
      setCafeId(null);
    }
  };

  const loadTables = async () => {
    if (!cafeId) {
      console.warn('⚠️ Cafe ID yok, masalar yüklenemiyor');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // API çağrılarını paralel yap (daha hızlı)
      const [apiTables, activeCarts] = await Promise.all([
        tableService.getCurrentCafeTables(cafeId).catch(err => {
          console.error('❌ Masalar yüklenemedi:', err);
          return [];
        }),
        cartService.getList().catch(err => {
          console.warn('⚠️ Aktif sepetler yüklenemedi:', err);
          return [];
        })
      ]);

      console.log('📋 API\'den gelen masalar:', apiTables);
      console.log('🛒 Aktif sepetler:', activeCarts);

      // Masaları detaylı listele
      if (apiTables.length > 0) {
        console.log('📋 Masa Listesi:');
        console.table(apiTables.map((table: any) => ({
          ID: table.id,
          İsim: table.name || table.tableNumber || `Masa ${table.table_number}`,
          Alan: table.area || 'tanımsız',
          Kapasite: table.capacity || 0,
          CafeID: table.cafe_id
        })));
      }

      // API'den gelen verileri frontend formatına çevir
      const formattedTables: Table[] = apiTables.map((table: any) => {
        // Bu masa için aktif bir sepet var mı?
        const tableCart = activeCarts.find((cart: any) => {
          // Cart'ta table_id veya tableId olabilir
          const cartTableId = cart.table_id || cart.tableId;
          return cartTableId === table.id;
        });

        return {
          id: table.id,
          tableNumber: table.name || table.tableNumber || `Masa ${table.table_number}`,
          capacity: table.capacity || 4,
          status: tableCart ? 'occupied' : 'available', // Sepeti varsa dolu, yoksa boş
          area: (table.area || 'salon') as 'bahce' | 'salon' | 'kat',
          currentGuests: tableCart ? (tableCart.guest_count || 0) : 0,
          cafe_id: table.cafe_id,
          currentOrder: tableCart ? {
            id: tableCart.id,
            tableId: table.id,
            items: tableCart.items || [],
            totalAmount: Number(tableCart.total_amount || tableCart.totalAmount || 0),
            status: 'active',
            createdAt: tableCart.created_at || tableCart.createdAt || '',
            updatedAt: tableCart.updated_at || tableCart.updatedAt || ''
          } : undefined
        };
      });

      setTables(formattedTables);
      console.log('✅ Masalar yüklendi:', formattedTables.length);
      
      // Dinamik olarak areaları oluştur
      const uniqueAreas = Array.from(new Set(formattedTables.map(t => t.area).filter(Boolean)));
      const areaList = ['tumu', ...uniqueAreas];
      setAreas(areaList);
      console.log('📍 Bulunan arealar:', areaList);
      
    } catch (err) {
      console.error('❌ Beklenmeyen hata:', err);
      setTables([]);
      setAreas(['tumu']);
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

  const getAreaDisplayName = (area: string): string => {
    if (area === 'tumu') return 'Tümü';
    
    // Area ismini capitalize et (ilk harf büyük)
    return area.charAt(0).toUpperCase() + area.slice(1).toLowerCase();
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
                  {getAreaDisplayName(area)}
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
          {tables.length === 0 && !loading ? (
            <div className="empty-state">
              <div>🪑</div>
              <h3>Henüz masa tanımlanmamış</h3>
              <p>Lütfen Settings sayfasından masa ekleyin veya yöneticinizle iletişime geçin.</p>
            </div>
          ) : (
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
                      
                      {table.status === 'occupied' && table.currentOrder && (
                        <div className="table-occupied-info">
                          <div className="table-amount">
                            ₺{table.currentOrder.totalAmount.toFixed(2)}
                          </div>
                          <div className="table-meta">
                            <div className="table-time">
                              {table.currentOrder.createdAt ? 
                                new Date(table.currentOrder.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) 
                                : '--:--'}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Tables;
