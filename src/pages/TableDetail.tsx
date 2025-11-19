import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { OrderItem, Product } from '../types';
import { cartService } from '../services/cartService';
import { cacheService } from '../services/cacheService';
import './TableDetail.css';

interface CartItem extends OrderItem {
  notes?: string;
}

const TableDetail = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, openUserSelect } = useUser();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        
        // Kategorileri cache'den yükle (ilk parametre false = cache kullan)
        const categoryList = await cacheService.getCategoryNames(false);
        if (mounted) {
          setCategories(categoryList);
          // İlk kategoriyi seç
          if (categoryList.length > 0 && !selectedCategory) {
            setSelectedCategory(categoryList[0]);
          }
        }

        // Ürünleri cache'den yükle
        const list = await cacheService.getProducts(false);
        if (mounted) setProducts(list);

        // Try to load cart by table id if provided
        if (tableId) {
          try {
            const cartId = Number(tableId);
            const cartData = await cartService.getById(cartId);
            if (mounted && cartData && Array.isArray(cartData.items)) {
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
        console.error('TableDetail yükleme hatası', err);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [tableId]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
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

  if (loading) {
    return (
      <div className="table-detail-page">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="table-detail-page">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

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

        <div className="header-actions">
          <span className="user-badge">👤 {currentUser?.name || 'Kullanıcı Seçin'}</span>
          <button 
            className="change-user-btn"
            onClick={() => openUserSelect()}
          >
            DEĞİŞTİR
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
                    <div className="item-price">₺{item.totalPrice.toFixed(2)}</div>
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
                <span className="total-amount">₺{totalAmount.toFixed(2)}</span>
              </div>
              <button className="pay-button">GÖNDER</button>
            </div>
          </div>
        </aside>

        {/* Right Panel - Ürünler */}
        <main className="products-panel">
          {/* Kategori Menüsü - Sağ Sidebar */}
          <div className="category-sidebar">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Ürün Grid */}
          <div className="products-grid">
            {loading ? (
              <div className="loading">Ürünler yükleniyor...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                {searchQuery ? 'Arama sonucu bulunamadı' : 'Bu kategoride ürün bulunmamaktadır'}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`product-card ${!product.available ? 'unavailable' : ''}`}
                  onClick={() => product.available && addToCart(product)}
                >
                  <div className="product-image">{product.image}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-footer">
                      <span className="product-price">₺{product.price}</span>
                      {!product.available && (
                        <span className="stock-badge">Stokta Yok</span>
                      )}
                      {product.available && (
                        <button 
                          className="add-btn"
                          aria-label={`${product.name} ürününü sepete ekle`}
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TableDetail;
