import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Moon, Sun, Search, UserCircle2, RefreshCw, Loader2, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { OrderItem, Product, Category } from '../types';
import { cartService } from '../services/cartService';
import { cacheService } from '../services/cacheService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import NotificationPanel from '../components/NotificationPanel';
import './TableDetail.css';

interface CartItem extends OrderItem {
  notes?: string;
}

const TableDetail = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, openUserSelect } = useUser();
  const { showPanel, setShowPanel, notifications } = useNotification();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setProductsLoading(true);
        setProductsError(null);
        
        // Tüm ürünleri ve kategorileri paralel yükle
        const [productList, categoryList] = await Promise.all([
          (async () => {
            try {
              console.log('📦 Ürünler yükleniyor...');
              const response = await productService.getList(1);
              console.log('✅ Ürün API yanıtı:', response);
              return response.data || [];
            } catch (err: any) {
              console.error('❌ Ürün yükleme hatası:', err);
              setProductsError(err?.message || 'Ürünler yüklenirken hata oluştu');
              return [];
            }
          })(),
          (async () => {
            try {
              console.log('📂 Kategoriler yükleniyor...');
              const response = await categoryService.getList(1);
              console.log('✅ Kategori API yanıtı:', response);
              return response.data || [];
            } catch (err: any) {
              console.error('❌ Kategori yükleme hatası:', err);
              return [];
            }
          })()
        ]);

        if (mounted) {
          console.log('📊 Yüklenen ürün sayısı:', productList.length);
          console.log('📊 Yüklenen kategori sayısı:', categoryList.length);
          
          setProducts(productList);
          setCategories(categoryList);
          
          // selectedCategory'yi null olarak bırak (tüm ürünleri göster)
          setSelectedCategory(null);
          
          if (productList.length === 0) {
            console.warn('⚠️ Hiç ürün yüklenemedi!');
            setProductsError('Ürünler yüklenemedi. Lütfen yeniden deneyin.');
          } else {
            console.log('📦 İlk ürün örneği:', productList[0]);
          }
        }

        // Masa için sepet yükle
        if (tableId && mounted) {
          try {
            const cartId = Number(tableId);
            const cartData = await cartService.getById(cartId);
            if (cartData && Array.isArray(cartData.items)) {
              const items = cartData.items.map((it: any, idx: number) => ({
                id: it.id ?? Date.now() + idx,
                productId: it.product_id ?? it.productId,
                productName: it.product_name ?? it.productName ?? it.name,
                quantity: it.quantity ?? 1,
                price: it.price ?? it.unit_price ?? 0,
                totalPrice: (it.quantity ?? 1) * (it.price ?? it.unit_price ?? 0),
                notes: it.notes ?? ''
              }));
              setCart(items);
            }
          } catch (err) {
            console.warn('Masa için sepet yüklenemedi', err);
          }
        }
      } catch (err) {
        console.error('❌ TableDetail yükleme hatası', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setProductsLoading(false);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [tableId]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        totalPrice: product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: number, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null; // Bu öğe filtrelenecek
        }
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    }).filter(Boolean) as CartItem[]; // null değerleri filtrele ve tip dönüşümünü yap
    
    setCart(updatedCart);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Fiyat formatlama: kuruş yoksa tam sayı, varsa virgüllü göster
  const formatPrice = (amount: number): string => {
    const hasDecimals = amount % 1 !== 0;
    if (hasDecimals) {
      return amount.toFixed(2).replace('.', ',');
    }
    return amount.toFixed(0);
  };

  // Her ürün için sepetteki miktarı hesapla
  const getProductQuantityInCart = (productId: number): number => {
    const item = cart.find(cartItem => cartItem.productId === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="table-detail-page">
        <div className="loading-state">
          <Loader2 className="spinner-icon" size={48} />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-detail-page">
      {/* Header */}
      <header className="detail-header">
        <div className="header-left">
          <button 
            className="back-btn" 
            onClick={() => navigate('/tables')}
            title="Masalar sayfasına dön"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="table-title">Salon {tableId}</h1>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Ara" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-right-controls">
          <button className="theme-toggle-payment" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button 
            className="notification-btn"
            onClick={() => setShowPanel(!showPanel)}
            title="Bildirimler"
            aria-label="Bildirim panelini aç"
          >
            <Bell size={24} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button className="user-info-btn" onClick={openUserSelect}>
            <UserCircle2 size={22} />
            <span>{currentUser?.name || 'Garson Seç'}</span>
            <RefreshCw size={16} className="change-icon" />
          </button>
        </div>
      </header>

      <div className="detail-content">
        {/* Left Panel - Sepet/Cart */}
        <aside className="cart-panel">
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Adisyon Boş</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span className="quantity">{item.quantity}×</span>
                  <div 
                    className="item-details"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <div className="item-name">{item.productName}</div>
                    <div className="item-price">{formatPrice(item.totalPrice)}₺</div>
                  </div>
                  
                  <button 
                    className="qty-btn minus"
                    onClick={() => updateQuantity(item.id, -1)}
                    aria-label={`${item.productName} ürününün miktarını azalt`}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="cart-actions">
              <div className="cart-total">
                <span className="total-amount">{formatPrice(totalAmount)}₺</span>
              </div>
              <button className="pay-button" disabled={cart.length === 0}>GÖNDER</button>
            </div>
          </div>
        </aside>

        {/* Right Panel - Ürünler */}
        <main className="products-panel">
          {/* Kategori Menüsü - Sağ Sidebar */}
          <div className="category-sidebar">
            <button
              className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Ürün Grid */}
          <div className="products-grid">
            {productsLoading || loading ? (
              <div className="loading">
                <Loader2 className="spinner-icon" size={32} />
                Ürünler yükleniyor...
              </div>
            ) : productsError ? (
              <div className="no-products error">
                <p>❌ {productsError}</p>
                <button 
                  className="retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Yeniden Yükle
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                {searchQuery ? '🔍 Arama sonucu bulunamadı' : '📦 Bu kategoride ürün bulunmamaktadır'}
              </div>
            ) : (
              filteredProducts.map((product) => {
                const quantityInCart = getProductQuantityInCart(product.id);
                
                return (
                  <div 
                    key={product.id} 
                    className={`product-card ${!(product.available ?? product.active) ? 'unavailable' : ''}`}
                    onClick={() => (product.available ?? product.active) && addToCart(product)}
                  >
                    {quantityInCart > 0 && (
                      <div className="quantity-badge">{quantityInCart}</div>
                    )}
                    <div className="product-image">
                      {product.image && (
                        <img src={product.image} alt={product.name} />
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-footer">
                        <span className="product-price">{product.price}₺</span>
                        {!(product.available ?? product.active) && (
                          <span className="stock-badge">Stokta Yok</span>
                        )}
                        {(product.available ?? product.active) && (
                          <button 
                            className="add-btn-quick"
                            aria-label={`${product.name} ürününü sepete ekle`}
                          >
                            <Plus size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

export default TableDetail;
