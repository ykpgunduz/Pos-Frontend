import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Moon, Sun, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import './QuickSale.css';
import { Product, OrderItem } from '../types';
import { productService } from '../services/productService';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface CartItem extends OrderItem {
  notes?: string;
}

const QuickSale = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, openUserSelect } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Ürünleri seçili kategoriye göre sunucudan yükle
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        // Eğer selectedCategory "Tümü" ise, category parametresini gönderme
        const categoryParam = selectedCategory === 'Tümü' ? undefined : selectedCategory;
        const list = await productService.getList({ 
          category: categoryParam, 
          search: searchQuery || undefined 
        });
        if (mounted) setProducts(list);
      } catch (err: any) {
        console.error('QuickSale ürün yükleme hatası', err);
        if (mounted) setProductsError(err?.message || 'Ürünler yüklenirken hata oluştu');
      } finally {
        if (mounted) setProductsLoading(false);
      }
    };

    // yüklemeyi yalnızca kategori seçildiğinde veya search değiştiğinde tetikle
    load();
    return () => { mounted = false; };
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    let mounted = true;
    const defaults = ['MENÜLER', 'ANA YEMEKLER', 'ÇORBALAR', 'MEZELER', 'SALATALAR', 'İÇECEKLER', 'TATLILAR'];
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();
        if (mounted) {
          if (cats && cats.length > 0) {
            // "Tümü" seçeneğini kategori listesinin başına ekle
            const categoriesWithAll = ['Tümü', ...cats.map(c => (typeof c === 'string' ? c : String(c)))];
            setCategories(categoriesWithAll);
            // İlk kategori yüklenmesinde "Tümü" seçili olsun
            if (!selectedCategory || selectedCategory === '') {
              setSelectedCategory('Tümü');
            }
          } else {
            const categoriesWithAll = ['Tümü', ...defaults];
            setCategories(categoriesWithAll);
            if (!selectedCategory || selectedCategory === '') {
              setSelectedCategory('Tümü');
            }
          }
        }
      } catch (err) {
        if (mounted) {
          const categoriesWithAll = ['Tümü', ...defaults];
          setCategories(categoriesWithAll);
          if (!selectedCategory || selectedCategory === '') {
            setSelectedCategory('Tümü');
          }
        }
        console.error('Kategori yükleme hatası', err);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    };
    loadCategories();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [cart]);

  // Sunucudan kategoriye göre filtrelenmiş ürünler geliyor; yine de arama kutusuna göre client-side filtre uygula
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        totalPrice: product.price
      };
      setCart([...cart, newItem]);
    }
  };

  // Her ürün için sepetteki miktarı hesapla
  const getProductQuantityInCart = (productId: number): number => {
    const item = cart.find(cartItem => cartItem.productId === productId);
    return item ? item.quantity : 0;
  };

  const updateQuantity = (itemId: number, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    
    setCart(updatedCart);
  };

  const handleProceedToPayment = () => {
    if (cart.length > 0) {
      localStorage.setItem('quickSaleCart', JSON.stringify({
        items: cart,
        totalAmount: totalAmount
      }));
      navigate('/payment');
    }
  };

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
            onClick={() => navigate('/')}
            title="Ana sayfaya dön"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="table-title">Hızlı Satış</h1>
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
                    <div className="item-price">{item.totalPrice.toFixed(2)}₺</div>
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
                <span className="total-amount">{totalAmount.toFixed(2)}₺</span>
              </div>
              <button 
                className="pay-button"
                onClick={handleProceedToPayment}
                disabled={cart.length === 0}
              >
                ÖDEME AL
              </button>
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
            {filteredProducts.map((product) => {
              const quantityInCart = getProductQuantityInCart(product.id);
              
              return (
                <div 
                  key={product.id} 
                  className={`product-card ${!product.available ? 'unavailable' : ''}`}
                  onClick={() => product.available && addToCart(product)}
                >
                  {quantityInCart > 0 && (
                    <div className="quantity-badge">{quantityInCart}</div>
                  )}
                  <div className="product-image">{product.image}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-footer">
                      <span className="product-price">{product.price}₺</span>
                      {!product.available && (
                        <span className="stock-badge">Stokta Yok</span>
                      )}
                      {product.available && (
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
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuickSale;
