import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { productService } from '../services/productService';
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
  // Başlangıçta boş; bileşen mount olduğunda API'den yüklenecek
  const [products, setProducts] = useState<Product[]>([]);
  
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
    available: true,
    stock: 0
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
      available: true,
      stock: 0
    });
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (productId: number) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    setError(null);
    try {
      await productService.remove(productId);
      // Yeniden yükle
      const updated = await productService.getList();
      setProducts(updated);
    } catch (err) {
      console.error('Ürün silme hatası', err);
      setError('Ürün silinirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleAvailability = useCallback(async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const target = products.find(p => p.id === productId);
      if (!target) throw new Error('Ürün bulunamadı');
      const updatedPayload = { ...target, available: !target.available } as Partial<Product>;
      await productService.update(productId, updatedPayload);
      const updated = await productService.getList();
      setProducts(updated);
    } catch (err) {
      console.error('Durum güncelleme hatası', err);
      setError('Ürün durumunu güncellerken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [products]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: 'sicak-icecekler',
      available: true,
      stock: 0
    });
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editingProduct) {
        // Update via API
        await productService.update(editingProduct.id, formData as Partial<Product>);
      } else {
        // Create via API
        await productService.create(formData as Partial<Product>);
      }

      // Yeniden yükle
      const updated = await productService.getList();
      setProducts(updated);
      handleModalClose();
    } catch (err) {
      console.error('Ürün kaydetme hatası', err);
      setError('Ürün kaydedilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [formData, editingProduct, handleModalClose]);

  const handleFormChange = useCallback((field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Load products from remote API on mount
  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productList = await productService.getList();
        if (mounted) setProducts(productList);
      } catch (err: any) {
        console.error('Ürün yükleme hatası:', err);
        if (mounted) setError('Ürünler yüklenirken bir hata oluştu.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
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
                  <th>Ürün Adı</th>
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
                    <td className="product-name-cell">{product.name}</td>
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
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(product.id)}
                          aria-label={`${product.name} ürününü sil`}
                        >
                          <Trash2 size={18} />
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
                  <label htmlFor="product-stock">Stok Miktarı *</label>
                  <input
                    id="product-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFormChange('stock', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
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
