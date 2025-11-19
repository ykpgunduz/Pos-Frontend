import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Moon, Sun, Search, UserCircle2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import './QuickSale.css';
import { Product, OrderItem, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // null = "Tümü"
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Ürünleri API'den yükle
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        // Tüm ürünleri çek, filtreleme client-side yapılacak
        const response = await productService.getList(1);
        if (mounted) {
          setProducts(response.data);
          // Debug: Ürünleri konsola yazdır
          console.log('Yüklenen ürünler:', response.data);
          if (response.data.length > 0) {
            console.log('İlk ürün örneği:', response.data[0]);
          }
        }
      } catch (err: any) {
        console.error('QuickSale ürün yükleme hatası', err);
        if (mounted) setProductsError(err?.message || 'Ürünler yüklenirken hata oluştu');
      } finally {
        if (mounted) setProductsLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      try {
        const response = await categoryService.getList(1);
        if (mounted) {
          if (response.data && response.data.length > 0) {
            setCategories(response.data);
            // İlk yüklemede "Tümü" seçili (null = tümü)
            if (selectedCategoryId === undefined) {
              setSelectedCategoryId(null);
            }
          } else {
            setCategories([]);
          }
        }
      } catch (err) {
        if (mounted) {
          setCategories([]);
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

  // Fiyat formatlama: kuruş yoksa tam sayı, varsa virgüllü göster
  const formatPrice = (amount: number): string => {
    const hasDecimals = amount % 1 !== 0;
    if (hasDecimals) {
      return amount.toFixed(2).replace('.', ',');
    }
    return amount.toFixed(0);
  };

  // Ürünleri kategoriye ve arama sorgusuna göre filtrele
  const filteredProducts = products.filter(product => {
    try {
      // Arama filtresi
      const matchesSearch = !searchQuery || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Kategori filtresi - category_id'ye göre
      let matchesCategory = true;
      if (selectedCategoryId !== null && selectedCategoryId !== undefined) {
        // Belirli bir kategori seçilmiş
        matchesCategory = product.category_id === selectedCategoryId;
      }
      // selectedCategoryId === null ise tümünü göster
      
      return matchesSearch && matchesCategory;
    } catch (error) {
      console.error('Filtreleme hatası:', error, product);
      return false;
    }
  });

  // Debug: Filtrelenmiş ürünleri logla
  useEffect(() => {
    console.log('Seçili kategori ID:', selectedCategoryId);
    console.log('Filtrelenmiş ürün sayısı:', filteredProducts.length);
  }, [selectedCategoryId, filteredProducts.length]);

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

        <div className="header-right-controls">
          <button className="theme-toggle-payment" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
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
            {/* Tümü butonu */}
            <button
              className={`category-btn ${selectedCategoryId === null ? 'active' : ''}`}
              onClick={() => {
                console.log('Kategori seçildi: Tümü');
                setSelectedCategoryId(null);
              }}
            >
              Tümü
            </button>
            
            {/* Kategoriler */}
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategoryId === category.id ? 'active' : ''}`}
                onClick={() => {
                  console.log('Kategori seçildi:', category.name, 'ID:', category.id);
                  setSelectedCategoryId(category.id);
                }}
              >
                {category.name}
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
