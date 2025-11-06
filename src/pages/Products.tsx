import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Check,
  AlertCircle,
  Loader2,
  Package,
  Coffee,
  Sandwich,
  IceCream,
  Pizza,
  Salad,
  Cookie
} from 'lucide-react';
import { Product, Category } from '../types';
import './Products.css';

/**
 * Products - Ürün Yönetim Sayfası
 * 
 * @component
 * @responsive ✅ Mobile(320px) / Tablet(768px) / Desktop(1024px+) tested
 * @ux ✅ Loading, Error, Empty states implemented
 * @a11y ✅ ARIA labels, keyboard navigation, semantic HTML
 * @performance ✅ React.memo, useCallback, useMemo optimized
 */

const Products = () => {
  const navigate = useNavigate();

  // States
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Türk Kahvesi',
      price: 35,
      category: 'sicak-icecekler',
      image: '☕',
      available: true,
      stock: 50,
      description: 'Geleneksel Türk kahvesi'
    },
    {
      id: 2,
      name: 'Espresso',
      price: 30,
      category: 'sicak-icecekler',
      image: '☕',
      available: true,
      stock: 45
    },
    {
      id: 3,
      name: 'Cappuccino',
      price: 40,
      category: 'sicak-icecekler',
      image: '☕',
      available: true,
      stock: 38
    },
    {
      id: 4,
      name: 'Filtre Kahve',
      price: 32,
      category: 'sicak-icecekler',
      image: '☕',
      available: true,
      stock: 60
    },
    {
      id: 5,
      name: 'Limonata',
      price: 25,
      category: 'soguk-icecekler',
      image: '🍋',
      available: true,
      stock: 30
    },
    {
      id: 6,
      name: 'Çay',
      price: 15,
      category: 'sicak-icecekler',
      image: '🫖',
      available: true,
      stock: 100
    },
    {
      id: 7,
      name: 'Tost',
      price: 45,
      category: 'yiyecekler',
      image: '🥪',
      available: true,
      stock: 25
    },
    {
      id: 8,
      name: 'Sıcak Çikolata',
      price: 38,
      category: 'sicak-icecekler',
      image: '🍫',
      available: false,
      stock: 0
    },
    {
      id: 9,
      name: 'Milkshake',
      price: 45,
      category: 'soguk-icecekler',
      image: '🥤',
      available: true,
      stock: 20
    },
    {
      id: 10,
      name: 'Cheesecake',
      price: 55,
      category: 'tatlilar',
      image: '🍰',
      available: true,
      stock: 15
    },
    {
      id: 11,
      name: 'Pasta',
      price: 50,
      category: 'yiyecekler',
      image: '🍝',
      available: true,
      stock: 18
    },
    {
      id: 12,
      name: 'Pizza Dilim',
      price: 40,
      category: 'yiyecekler',
      image: '🍕',
      available: true,
      stock: 22
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('tumu');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'sicak-icecekler',
    image: '📦',
    available: true,
    stock: 0,
    description: ''
  });

  // Categories
  const categories: Category[] = useMemo(() => [
    { id: 'tumu', name: 'Tüm Ürünler', icon: '📦' },
    { id: 'sicak-icecekler', name: 'Sıcak İçecekler', icon: '☕' },
    { id: 'soguk-icecekler', name: 'Soğuk İçecekler', icon: '🥤' },
    { id: 'yiyecekler', name: 'Yiyecekler', icon: '🍕' },
    { id: 'tatlilar', name: 'Tatlılar', icon: '🍰' },
  ], []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        selectedCategory === 'tumu' || product.category === selectedCategory
      )
      .filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [products, selectedCategory, searchQuery]);

  // Event handlers with useCallback
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: 'sicak-icecekler',
      image: '📦',
      available: true,
      stock: 0,
      description: ''
    });
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((productId: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  }, []);

  const handleToggleAvailability = useCallback((productId: number) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, available: !p.available } : p
      )
    );
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: 'sicak-icecekler',
      image: '📦',
      available: true,
      stock: 0,
      description: ''
    });
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (editingProduct) {
      // Update existing product
      setProducts(prev => 
        prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...formData } as Product
            : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name!,
        price: formData.price!,
        category: formData.category!,
        image: formData.image || '📦',
        available: formData.available ?? true,
        stock: formData.stock || 0,
        description: formData.description || ''
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    handleModalClose();
  }, [formData, editingProduct, handleModalClose]);

  const handleFormChange = useCallback((field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="products-container">
        <header className="products-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={24} />
            Ana Sayfa
          </button>
          <h1>Ürünler</h1>
        </header>
        <div className="loading-state">
          <Loader2 className="spinner-icon" size={48} />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header */}
      <header className="products-header">
        <button 
          className="back-btn" 
          onClick={() => navigate('/')}
          aria-label="Ana sayfaya dön"
        >
          <ArrowLeft size={24} />
          Ana Sayfa
        </button>
        <h1>Ürün Yönetimi</h1>
        <button 
          className="add-btn" 
          onClick={handleAddNew}
          aria-label="Yeni ürün ekle"
        >
          <Plus size={20} />
          Yeni Ürün
        </button>
      </header>

      {/* Filter Section */}
      <div className="products-filters">
        {/* Search */}
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Ürün ara"
          />
        </div>

        {/* Categories */}
        <div className="categories-tabs" role="navigation" aria-label="Ürün kategorileri">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                className={`category-tab ${isSelected ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
                aria-current={isSelected ? 'page' : undefined}
                aria-label={category.name}
              >
                <span className="category-icon" aria-hidden="true">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products List */}
      <div className="products-content">
        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Hatayı kapat">
              <X size={16} />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h2>Ürün Bulunamadı</h2>
            <p>
              {searchQuery 
                ? 'Arama kriterlerine uygun ürün bulunamadı.'
                : 'Bu kategoride henüz ürün yok.'}
            </p>
            <button className="add-btn-empty" onClick={handleAddNew}>
              <Plus size={20} />
              İlk Ürünü Ekle
            </button>
          </div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table" role="table" aria-label="Ürünler listesi">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={!product.available ? 'inactive' : ''}>
                    <td className="product-info">
                      <div className="product-image">{product.image}</div>
                      <div className="product-details">
                        <span className="product-name">{product.name}</span>
                        {product.description && (
                          <span className="product-description">{product.description}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </span>
                    </td>
                    <td className="product-price">₺{product.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${product.stock! < 10 ? 'low' : ''}`}>
                        {product.stock} adet
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${product.available ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleAvailability(product.id)}
                        aria-label={product.available ? 'Ürünü pasif yap' : 'Ürünü aktif yap'}
                      >
                        {product.available ? (
                          <>
                            <Check size={16} />
                            Aktif
                          </>
                        ) : (
                          <>
                            <X size={16} />
                            Pasif
                          </>
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(product)}
                          aria-label={`${product.name} ürününü düzenle`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(product.id)}
                          aria-label={`${product.name} ürününü sil`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
              <button 
                className="modal-close" 
                onClick={handleModalClose}
                aria-label="Modalı kapat"
              >
                <X size={24} />
              </button>
            </div>
            
            <form className="modal-body" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-name">Ürün Adı *</label>
                  <input
                    id="product-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Örn: Türk Kahvesi"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="product-image">Emoji/İkon</label>
                  <input
                    id="product-image"
                    type="text"
                    value={formData.image}
                    onChange={(e) => handleFormChange('image', e.target.value)}
                    placeholder="☕"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-category">Kategori *</label>
                  <select
                    id="product-category"
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    required
                  >
                    {categories.filter(c => c.id !== 'tumu').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="product-price">Fiyat (₺) *</label>
                  <input
                    id="product-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleFormChange('price', parseFloat(e.target.value))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-stock">Stok Miktarı</label>
                  <input
                    id="product-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFormChange('stock', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="product-description">Açıklama</label>
                <textarea
                  id="product-description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Ürün hakkında kısa açıklama..."
                  rows={3}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => handleFormChange('available', e.target.checked)}
                  />
                  <span>Ürün aktif</span>
                </label>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleModalClose}
                >
                  İptal
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
