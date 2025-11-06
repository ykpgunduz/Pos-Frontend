import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { OrderItem, Product } from '../types';
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
  const [selectedCategory, setSelectedCategory] = useState('ANA YEMEKLER');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  // Mock kategoriler
  const categories = [
    'MENÜLER',
    'ANA YEMEKLER',
    'ÇORBALAR',
    'MEZELER',
    'BALIKLAR',
    'SALATALAR',
    'ARA SICAKLAR',
    'İÇECEKLER',
    'TATLLAR'
  ];

  // Mock ürünler
  const mockProducts: Product[] = [
    { id: 1, name: 'Piso Steak', price: 370, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 2, name: 'Filet Mignon', price: 180, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 3, name: 'Ribeye Steak', price: 340, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 4, name: 'Dou Steak', price: 520, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 5, name: 'New York Steak', price: 240, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 6, name: 'Dou Filet Steak', price: 130, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 7, name: 'Rack Lamb', price: 180, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 8, name: 'Wagyu Tomahawk', price: 610, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 9, name: 'Golden 24 Wagyu Steak', price: 740, category: 'ANA YEMEKLER', image: '🥩', available: true },
    { id: 10, name: 'Canada Bacon', price: 119, category: 'ANA YEMEKLER', image: '🥓', available: true },
    { id: 11, name: 'Japanese Wagyu Rib Eye', price: 475, category: 'ANA YEMEKLER', image: '🥩', available: false },
    { id: 12, name: 'Turf & Surf', price: 105, category: 'ANA YEMEKLER', image: '🦞', available: true },
    { id: 13, name: 'Mercimek Çorbası', price: 45, category: 'ÇORBALAR', image: '🍲', available: true },
    { id: 14, name: 'Tavuk Suyu Çorbası', price: 40, category: 'ÇORBALAR', image: '🍲', available: true },
    { id: 15, name: 'Humus', price: 65, category: 'MEZELER', image: '🥙', available: true },
    { id: 16, name: 'Acuka', price: 55, category: 'MEZELER', image: '🌶️', available: true },
  ];

  useEffect(() => {
    setProducts(mockProducts);
    // Mock sepet verisi - masa dolu ise önceki siparişleri göster
    const mockCart: CartItem[] = [
      { id: 1, productId: 1, productName: 'İşkembe Çorbası', quantity: 2, price: 36, totalPrice: 72, notes: '' },
      { id: 2, productId: 2, productName: 'İstakoz Izgara', quantity: 1, price: 95, totalPrice: 95, notes: '' },
      { id: 3, productId: 3, productName: 'Adabeyi Buğulama', quantity: 1, price: 124.90, totalPrice: 124.90, notes: '' },
      { id: 4, productId: 4, productName: 'Peynirli Salata', quantity: 1, price: 55, totalPrice: 55, notes: '' },
      { id: 5, productId: 5, productName: 'Beylerbeyi Göbek 35', quantity: 1, price: 370, totalPrice: 370, notes: '' },
      { id: 6, productId: 6, productName: 'Fırında Sütlaç', quantity: 2, price: 35, totalPrice: 70, notes: '' },
    ];
    setCart(mockCart);
  }, []);

  const filteredProducts = products.filter(product => 
    product.category === selectedCategory &&
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
            {filteredProducts.map((product) => (
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TableDetail;
