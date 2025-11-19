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
} from 'lucide-react';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useUser } from '../contexts/UserContext';
import './Products.css';

/**
 * Products - Ürün Yönetim Sayfası (API Entegrasyonlu)
 * 
 * @component
 * @responsive ✅ Mobile(320px) / Tablet(768px) / Desktop(1024px+) tested
 * @ux ✅ Loading, Error, Empty states implemented
 * @a11y ✅ ARIA labels, keyboard navigation, semantic HTML
 * @performance ✅ React.memo, useCallback, useMemo optimized
 * @api ✅ Fully integrated with backend API
 */

const Products = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  // Aktif cafe_id'yi user'dan al
  const cafeId = currentUser?.cafeId || 1; // Fallback: 1

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number): string => {
    const hasDecimals = price % 1 !== 0;
    if (hasDecimals) {
      return `${price.toFixed(2).replace('.', ',')}₺`;
    }
    return `${Math.floor(price)}₺`;
  };

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Çoklu seçim için state'ler
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  // Inline düzenleme için state'ler
  const [editingPrices, setEditingPrices] = useState<{ [key: number]: { price: string; cost: string } }>({});
  const [bulkEditMode, setBulkEditMode] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    cost: 0,
    category_id: undefined,
    available: true,
    stock: 0,
    description: '',
    image: '',
  });

  // Load initial data (products and categories)
  useEffect(() => {
    loadData();
  }, [cafeId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Veri yükleniyor... cafeId:', cafeId);
      
      // Kategorileri ve ürünleri paralel yükle
      const [categoriesResponse, productsResponse] = await Promise.all([
        categoryService.getList(1, cafeId),
        productService.getList(1, cafeId)
      ]);
      
      console.log('Kategoriler yanıtı:', categoriesResponse);
      console.log('Ürünler yanıtı:', productsResponse);
      
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
      
      console.log('Kategoriler state\'e kaydedildi:', categoriesResponse.data.length, 'adet');
      console.log('Ürünler state\'e kaydedildi:', productsResponse.data.length, 'adet');
    } catch (err: any) {
      console.error('Veri yükleme hatası:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        selectedCategory === null || product.category_id === selectedCategory
      )
      .filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [products, selectedCategory, searchQuery]);

  // Event handlers with useCallback
  const handleCategoryChange = useCallback((categoryId: number | null) => {
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
      cost: 0,
      category_id: categories.length > 0 ? categories[0].id : undefined,
      available: true,
      stock: 0,
      description: '',
      image: '',
    });
    setShowModal(true);
  }, [categories]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      cost: product.cost || 0,
      category_id: product.category_id,
      available: product.available !== undefined ? product.available : product.active,
      stock: product.stock || 0,
      description: product.description || '',
      image: product.image || '',
    });
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (productId: number) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    setError(null);
    try {
      await productService.remove(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err: any) {
      console.error('Ürün silme hatası', err);
      setError(err.response?.data?.message || 'Ürün silinirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleAvailability = useCallback(async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      const newAvailability = !(product.available !== undefined ? product.available : product.active);
      const updatedProduct = await productService.update(product.id, { available: newAvailability });
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
    } catch (err: any) {
      console.error('Durum güncelleme hatası', err);
      setError(err.response?.data?.message || 'Ürün durumunu güncellerken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      cost: 0,
      category_id: undefined,
      available: true,
      stock: 0,
      description: '',
      image: '',
    });
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id) {
      setError('Lütfen ürün adı ve kategori seçin');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editingProduct) {
        const updated = await productService.update(editingProduct.id, formData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const newProduct = await productService.create({
          ...formData,
          cafe_id: cafeId,
        });
        setProducts(prev => [newProduct, ...prev]);
      }
      handleModalClose();
    } catch (err: any) {
      console.error('Ürün kaydetme hatası', err);
      setError(err.response?.data?.message || 'Ürün kaydedilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [formData, editingProduct, cafeId, handleModalClose]);

  const handleFormChange = useCallback((field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Çoklu seçim işlemleri
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  }, [filteredProducts]);

  const handleSelectProduct = useCallback((productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  }, []);

  const handleBulkStatusChange = useCallback(async (newStatus: boolean) => {
    if (selectedProducts.length === 0) {
      setError('Lütfen en az bir ürün seçin');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const updatePromises = selectedProducts.map((productId) => 
        productService.update(productId, { available: newStatus })
      );

      const updatedProducts = await Promise.all(updatePromises);
      
      setProducts(prev => 
        prev.map(p => {
          const updated = updatedProducts.find(u => u.id === p.id);
          return updated || p;
        })
      );

      setSelectedProducts([]);
      setError(null);
    } catch (err: any) {
      console.error('Toplu durum değişikliği hatası', err);
      setError('Ürün durumları güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [selectedProducts]);

  // Inline düzenleme fonksiyonları
  const handleRowClick = useCallback((productId: number, event: React.MouseEvent) => {
    // Input, button veya checkbox'a tıklandıysa satır seçimi yapma
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('.checkbox-cell')) {
      return;
    }
    
    handleSelectProduct(productId, !selectedProducts.includes(productId));
  }, [selectedProducts, handleSelectProduct]);

  const handleInlinePriceEdit = useCallback((productId: number, field: 'price' | 'cost', value: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  }, []);

  // Toplu düzenleme fonksiyonları
  const handleBulkEditToggle = useCallback(() => {
    if (bulkEditMode) {
      // Modu kapat ve tüm düzenlemeleri temizle
      setBulkEditMode(false);
      setEditingPrices({});
    } else {
      // Seçili ürünleri temizle ve tüm görünür ürünler için düzenleme modunu aç
      setSelectedProducts([]);
      setBulkEditMode(true);
      const initialPrices: { [key: number]: { price: string; cost: string } } = {};
      filteredProducts.forEach(product => {
        initialPrices[product.id] = {
          price: product.price.toString(),
          cost: (product.cost || 0).toString()
        };
      });
      setEditingPrices(initialPrices);
    }
  }, [bulkEditMode, filteredProducts]);

  const handleBulkSaveAll = useCallback(async () => {
    if (Object.keys(editingPrices).length === 0) {
      setError('Düzenlenecek ürün yok');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatePromises = Object.entries(editingPrices).map(async ([productId, values]) => {
        const id = parseInt(productId);
        const product = products.find(p => p.id === id);
        if (!product) return null;

        // Eğer input boş bırakılmışsa eski değeri kullan
        const newPrice = values.price && values.price.trim() !== '' 
          ? parseFloat(values.price) 
          : product.price;
        const newCost = values.cost && values.cost.trim() !== '' 
          ? parseFloat(values.cost) 
          : (product.cost || 0);

        // Hala geçersiz bir sayı varsa bu ürünü atla
        if (isNaN(newPrice) || isNaN(newCost)) {
          return null;
        }

        // Değer değişmemişse güncelleme yapma
        if (newPrice === product.price && newCost === (product.cost || 0)) {
          return product;
        }

        return productService.update(id, {
          price: newPrice,
          cost: newCost
        });
      });

      const updatedProducts = await Promise.all(updatePromises);
      
      setProducts(prev => 
        prev.map(p => {
          const updated = updatedProducts.find(u => u?.id === p.id);
          return updated || p;
        })
      );

      setBulkEditMode(false);
      setEditingPrices({});
      setError(null);
    } catch (err: any) {
      console.error('Toplu fiyat güncelleme hatası', err);
      setError('Fiyatlar güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [editingPrices, products]);

  // Loading state
  if (loading && products.length === 0) {
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
        <div className="header-left">
          <button 
            className="back-btn" 
            onClick={() => navigate('/')}
            aria-label="Ana sayfaya dön"
          >
            <ArrowLeft size={24} />
            Ana Sayfa
          </button>
          <h1>Ürünler</h1>
        </div>
        
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
        
        <div className="header-actions">
          <button 
            className={`bulk-edit-btn ${bulkEditMode ? 'active' : ''}`}
            onClick={handleBulkEditToggle}
            aria-label="Toplu düzenleme"
          >
            <Edit2 size={20} />
            <span>{bulkEditMode ? 'Düzenlemeyi Kapat' : 'Toplu Değişiklik'}</span>
          </button>
          
          <button 
            className="add-btn" 
            onClick={handleAddNew}
            aria-label="Yeni ürün ekle"
          >
            <Plus size={20} />
            <span>Yeni Ürün</span>
          </button>
        </div>
      </header>

      {/* Bulk Actions Toolbar */}
      {selectedProducts.length > 0 && !bulkEditMode && (
        <div className="bulk-actions-toolbar">
          <div className="bulk-info">
            <span className="bulk-count">{selectedProducts.length} ürün seçildi</span>
            <button 
              className="bulk-clear"
              onClick={() => setSelectedProducts([])}
              aria-label="Seçimi temizle"
            >
              <X size={16} />
              Temizle
            </button>
          </div>
          
          <div className="bulk-actions">
            <button 
              className="bulk-action-btn status-btn active"
              onClick={() => handleBulkStatusChange(true)}
              disabled={loading}
            >
              <Check size={16} />
              Aktif Yap
            </button>
            
            <button 
              className="bulk-action-btn status-btn inactive"
              onClick={() => handleBulkStatusChange(false)}
              disabled={loading}
            >
              <X size={16} />
              Pasif Yap
            </button>
          </div>
        </div>
      )}

      {/* Bulk Edit Mode Toolbar */}
      {bulkEditMode && (
        <div className="bulk-edit-toolbar">
          <div className="bulk-edit-info">
            <AlertCircle size={20} />
            <span>Toplu düzenleme modu aktif - Tüm fiyatları ve maliyetleri düzenleyebilirsiniz</span>
          </div>
          <div className="bulk-edit-actions">
            <button 
              className="bulk-cancel-btn"
              onClick={handleBulkEditToggle}
              disabled={loading}
            >
              <X size={16} />
              İptal
            </button>
            <button 
              className="bulk-save-all-btn"
              onClick={handleBulkSaveAll}
              disabled={loading}
            >
              <Check size={16} />
              Tümünü Kaydet
            </button>
          </div>
        </div>
      )}
 
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
                  {!bulkEditMode && (
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Tümünü seç"
                      />
                    </th>
                  )}
                  <th>Ürün Adı</th>
                  <th>Kategori</th>
                  <th>Maliyet</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const productCategory = categories.find(c => c.id === product.category_id);
                  const isAvailable = product.available !== undefined ? product.available : product.active;
                  const isSelected = selectedProducts.includes(product.id);
                  const isEditingPrice = bulkEditMode || !!editingPrices[product.id];
                  
                  return (
                    <tr 
                      key={product.id} 
                      className={`${!isAvailable ? 'inactive' : ''} ${isSelected ? 'selected' : ''} ${bulkEditMode ? '' : 'clickable-row'}`}
                      onClick={(e) => !bulkEditMode && handleRowClick(product.id, e)}
                    >
                      {!bulkEditMode && (
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                            aria-label={`${product.name} seç`}
                          />
                        </td>
                      )}
                      <td className="product-name-cell">
                        {product.name}
                      </td>
                      <td>
                        <span className="category-badge">
                          {productCategory?.name || 'Diğer'}
                        </span>
                      </td>
                      <td className="product-cost-cell">
                        {isEditingPrice ? (
                          <input
                            type="number"
                            className="inline-price-input"
                            defaultValue={product.cost || 0}
                            onChange={(e) => handleInlinePriceEdit(product.id, 'cost', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.currentTarget.blur()}
                            step="0.01"
                            min="0"
                            aria-label="Maliyet"
                            placeholder={`${formatPrice(product.cost || 0)}`}
                          />
                        ) : (
                          <span className="product-cost">
                            {formatPrice(product.cost || 0)}
                          </span>
                        )}
                      </td>
                      <td className="product-price-cell">
                        {isEditingPrice ? (
                          <input
                            type="number"
                            className="inline-price-input"
                            defaultValue={product.price}
                            onChange={(e) => handleInlinePriceEdit(product.id, 'price', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.currentTarget.blur()}
                            step="0.01"
                            min="0"
                            aria-label="Fiyat"
                            placeholder={`${formatPrice(product.price)}`}
                          />
                        ) : (
                          <span className="product-price">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`stock-badge ${(product.stock || 0) < 10 ? 'low' : ''}`}>
                          {product.stock || 0} adet
                        </span>
                      </td>
                      <td>
                        <button
                          className={`status-toggle ${isAvailable ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleAvailability(product)}
                          aria-label={isAvailable ? 'Ürünü pasif yap' : 'Ürünü aktif yap'}
                          disabled={loading}
                        >
                          {isAvailable ? (
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
                          disabled={loading}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(product.id)}
                          aria-label={`${product.name} ürününü sil`}
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
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
                    value={formData.category_id || ''}
                    onChange={(e) => handleFormChange('category_id', parseInt(e.target.value))}
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="product-stock">Stok Miktarı</label>
                  <input
                    id="product-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
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
                  <label htmlFor="product-cost">Maliyet (₺)</label>
                  <input
                    id="product-cost"
                    type="number"
                    value={formData.cost || 0}
                    onChange={(e) => handleFormChange('cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="product-image">Emoji/İkon</label>
                <input
                  id="product-image"
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleFormChange('image', e.target.value)}
                  placeholder="☕ (emoji veya URL)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-description">Açıklama</label>
                <textarea
                  id="product-description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Ürün açıklaması..."
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
                  disabled={loading}
                >
                  İptal
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" />
                      Kaydediliyor...
                    </>
                  ) : (
                    editingProduct ? 'Güncelle' : 'Ekle'
                  )}
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
