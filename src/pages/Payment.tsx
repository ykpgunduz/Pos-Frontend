import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Moon, Sun, UserCircle2, RefreshCw } from 'lucide-react';
import './Payment.css';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import UserSelect from '../components/UserSelect';

interface PaymentItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface QuickSaleData {
  items: PaymentItem[];
  totalAmount: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, openUserSelect } = useUser();
  const [orderItems, setOrderItems] = useState<PaymentItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [inputValue, setInputValue] = useState("0");
  const [selectedPaymentType, setSelectedPaymentType] = useState<'nakit' | 'kart' | 'cari' | 'odenmez' | 'ticket' | 'yemek-karti' | null>(null);
  const [savedPayments, setSavedPayments] = useState<Array<{ type: string; amount: number }>>([]);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountType, setDiscountType] = useState<'amount' | 'percent' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [productClickCounts, setProductClickCounts] = useState<Record<number, number>>({});

  // Notification gösterme fonksiyonu
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // 3 saniye sonra kaybolur
  };

  // Tutar formatlama fonksiyonu
  const formatAmount = (amount: number): string => {
    const hasDecimals = amount % 1 !== 0;
    if (hasDecimals) {
      return amount.toFixed(2).replace('.', ',');
    }
    return amount.toFixed(0);
  };

  const handleOpenDrawer = () => {
    alert('Çekmece açılıyor...');
  };

  useEffect(() => {
    // localStorage'dan hızlı satış verilerini al
    const quickSaleData = localStorage.getItem('quickSaleCart');
    
    if (quickSaleData) {
      try {
        const data: QuickSaleData = JSON.parse(quickSaleData);
        setOrderItems(data.items);
        setTotalAmount(data.totalAmount);
        setRemainingAmount(data.totalAmount);
        setTableNumber('Hızlı Satış');
      } catch (error) {
        console.error('Veri parse hatası:', error);
        // Hata durumunda örnek veri göster
        loadSampleData();
      }
    } else {
      // localStorage'da veri yoksa örnek veri göster
      loadSampleData();
    }
  }, []);

  const loadSampleData = () => {
    const sampleItems: PaymentItem[] = [
      { id: 1, productName: "Kinder Chocolate 4'lü 50gr", quantity: 2, price: 15.50, totalPrice: 31.00 },
      { id: 2, productName: "Ruffles Originals Super", quantity: 1, price: 16.50, totalPrice: 16.50 },
      { id: 3, productName: "Oreo Bisküvi 220gr", quantity: 1, price: 36.00, totalPrice: 36.00 },
      { id: 4, productName: "Haribo Altın Ayıcık Maxi", quantity: 2, price: 20.90, totalPrice: 41.80 },
    ];
    const total = sampleItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setOrderItems(sampleItems);
    setTotalAmount(total);
    setRemainingAmount(total);
    setTableNumber('MASA 12');
  };

  useEffect(() => {
    setRemainingAmount(totalAmount - paidAmount);
  }, [paidAmount, totalAmount]);

  useEffect(() => {
    setRemainingAmount(totalAmount - paidAmount);
  }, [paidAmount, totalAmount]);

  const quickAmounts = [5, 10, 20, 50, 100, 200];

  const handleNumPadClick = (value: string) => {
    if (value === 'C') {
      setInputValue('0');
    } else if (value === '⌫') {
      setInputValue(prev => prev.slice(0, -1) || '0');
    } else if (value === '.' || value === ',') {
      if (!inputValue.includes('.') && !inputValue.includes(',')) {
        setInputValue(prev => prev + ',');
      }
    } else {
      setInputValue(prev => prev === '0' ? value : prev + value);
    }
  };

  const handleQuickAmount = (value: number) => {
    setInputValue(value.toString());
  };

  const handleProductClick = (productId: number, productPrice: number, maxQuantity: number) => {
    const currentClickCount = productClickCounts[productId] || 0;
    
    // Ürünün maksimum adedini kontrol et
    if (currentClickCount >= maxQuantity) {
      showNotification(`Bu üründen en fazla ${maxQuantity} adet ekleyebilirsiniz!`);
      return;
    }
    
    const currentValue = parseFloat(inputValue.replace(',', '.')) || 0;
    const newValue = currentValue + productPrice;
    
    // Toplam tutarı geçmemesi için kontrol
    if (newValue <= remainingAmount) {
      setInputValue(newValue.toString().replace('.', ','));
      // Tıklama sayısını artır
      setProductClickCounts(prev => ({
        ...prev,
        [productId]: currentClickCount + 1
      }));
    } else {
      showNotification('Girilen tutar kalan tutarı geçemez!');
    }
  };

  const handleAddPayment = () => {
    if (!selectedPaymentType || parseFloat(inputValue.replace(',', '.')) <= 0) {
      showNotification('Lütfen ödeme türü seçin ve geçerli bir tutar girin');
      return;
    }

    const amount = parseFloat(inputValue.replace(',', '.'));
    const paymentTypeNames: Record<string, string> = {
      'nakit': 'Nakit',
      'kart': 'Kart',
      'cari': 'Cari',
      'odenmez': 'Ödenmez',
      'ticket': 'Ticket',
      'yemek-karti': 'Yemek Kartı'
    };

    setSavedPayments([...savedPayments, { 
      type: paymentTypeNames[selectedPaymentType], 
      amount 
    }]);
    setPaidAmount(prev => prev + amount);
    setInputValue('0');
    setSelectedPaymentType(null);
  };

  const handleRemovePayment = (index: number) => {
    const payment = savedPayments[index];
    setPaidAmount(prev => prev - payment.amount);
    setSavedPayments(savedPayments.filter((_, i) => i !== index));
  };

  const handleCompletePayment = () => {
    if (remainingAmount <= 0) {
      // Ödeme tamamlandı
      localStorage.removeItem('quickSaleCart');
      showNotification('Ödeme başarıyla tamamlandı!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      showNotification(`Kalan tutar: ${formatAmount(remainingAmount)} ₺`);
    }
  };

  const handleUndoLastPayment = () => {
    if (savedPayments.length > 0) {
      const confirmUndo = window.confirm('En son ödeme işlemini geri almak istediğinizden emin misiniz?');
      if (confirmUndo) {
        const lastPayment = savedPayments[savedPayments.length - 1];
        setPaidAmount(prev => prev - lastPayment.amount);
        setSavedPayments(savedPayments.slice(0, -1));
      }
    }
  };

  return (
    <div className="payment-container">
      {/* Notification */}
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      {/* Başlık ve Navigasyon */}
      <div className="payment-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Geri
        </button>
        <h1>Ödeme Ekranı</h1>
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
      </div>

      <div className="payment-layout">
        {/* Sol taraf - Adisyon */}
        <div className="adisyon-section">
          <div className="adisyon-header">
            <h2>Sipariş Detayları</h2>
          </div>
          
          {/* Tablo Başlıkları */}
          <div className="adisyon-table-header">
            <span className="header-quantity">Adet</span>
            <span className="header-name">Ürün İsmi</span>
            <span className="header-unit-price">Birim Fiyatı</span>
            <span className="header-total-price">Toplam Fiyat</span>
          </div>
          
          <div className="adisyon-items">
            {orderItems.map((item) => (
              <div 
                key={item.id} 
                className="adisyon-item clickable"
                onClick={() => handleProductClick(item.id, item.price, item.quantity)}
              >
                <span className="item-quantity">{item.quantity} x</span>
                <span className="item-name">{item.productName}</span>
                <span className="item-unit-price">{formatAmount(item.price)} ₺</span>
                <span className="item-total-price">{formatAmount(item.totalPrice)} ₺</span>
              </div>
            ))}
          </div>
          
          {/* Toplam Tutar En Altta */}
          <div className="adisyon-footer">
            <div className="adisyon-total">
              <span className="total-label">TOPLAM TUTAR:</span>
              <span className="total-amount">{formatAmount(totalAmount)} ₺</span>
            </div>
          </div>
        </div>

        {/* Sağ taraf - Ödeme */}
        <div className="payment-section">
      {/* Amount summary section */}
      <div className="amount-summary">
        <div className="total-amount-box">
          <span className="total-label">TOPLAM TUTAR</span>
          <span className="total-value">{formatAmount(totalAmount)} ₺</span>
        </div>
        
        <div className="paid-amount-box">
          <div className="paid-amount-header">
            <span className="paid-label">ÖDENEN TUTAR</span>
            <span className="paid-value">{formatAmount(paidAmount)} ₺</span>
          </div>
          <div className="payment-details">
            {savedPayments.map((payment, index) => (
              <div key={index} className="payment-detail-item">
                <span>{payment.type}</span>
                <span>{formatAmount(payment.amount)} ₺</span>
                <button 
                  className="remove-detail-btn"
                  onClick={() => handleRemovePayment(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="remaining-amount-box">
          <span className="remaining-label">KALAN TUTAR</span>
          <span className="remaining-value">{formatAmount(remainingAmount)} ₺</span>
        </div>
      </div>

      {/* Main payment grid */}
      <div className="payment-grid">
        {/* Left side with payment types and action buttons */}
        <div className="payment-left">
          <h3 className="payment-types-title">ÖDEME YÖNTEMLERİ</h3>
          
          {/* Payment type buttons */}
          <div className="payment-types">
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'nakit' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPaymentType('nakit');
                setDiscountType(null);
              }}
            >
              NAKİT
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'kart' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPaymentType('kart');
                setDiscountType(null);
              }}
            >
              KART
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'cari' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPaymentType('cari');
                setDiscountType(null);
              }}
            >
              CARİ
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'odenmez' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPaymentType('odenmez');
                setDiscountType(null);
              }}
            >
              ÖDENMEZ
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'ticket' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPaymentType('ticket');
                setDiscountType(null);
              }}
            >
              TICKET
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'yemek-karti' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPaymentType('yemek-karti');
                setDiscountType(null);
              }}
            >
              YEMEK KARTI
            </button>
          </div>

          {/* Action buttons */}
          <div className="action-buttons-wrapper">
            <h3 className="discount-types-title">İNDİRİM ÇEŞİTLERİ</h3>
            
            <div className="discount-buttons">
              <button 
                className={`action-btn indirim-btn ${discountType === 'amount' ? 'active-discount' : ''}`}
                onClick={() => {
                  setDiscountType('amount');
                  setSelectedPaymentType(null);
                }}
              >
                İNDİRİM ₺
              </button>
              <button 
                className={`action-btn indirim-btn ${discountType === 'percent' ? 'active-discount' : ''}`}
                onClick={() => {
                  setDiscountType('percent');
                  setSelectedPaymentType(null);
                }}
              >
                İNDİRİM %
              </button>
            </div>
            
            <div className="button-divider"></div>
            
            <button className="action-btn drawer-btn-full" onClick={handleOpenDrawer}>ÇEKMECE AÇ</button>
          </div>
        </div>

        {/* Right side with numpad */}
        <div className="numpad-section">
          {/* Amount display */}
          <div className="amount-display">
            {discountType === 'percent' ? `% ${inputValue}` : `${inputValue} ₺`}
          </div>
          
          {/* Numpad grid */}
          <div className="numpad-grid">
            <button onClick={() => handleNumPadClick('7')}>7</button>
            <button onClick={() => handleNumPadClick('8')}>8</button>
            <button onClick={() => handleNumPadClick('9')}>9</button>
            <button onClick={() => handleNumPadClick('⌫')}>⌫</button>
            
            <button onClick={() => handleNumPadClick('4')}>4</button>
            <button onClick={() => handleNumPadClick('5')}>5</button>
            <button onClick={() => handleNumPadClick('6')}>6</button>
            <button className="undo-btn" onClick={handleUndoLastPayment}>GERİ AL</button>
            
            <button onClick={() => handleNumPadClick('1')}>1</button>
            <button onClick={() => handleNumPadClick('2')}>2</button>
            <button onClick={() => handleNumPadClick('3')}>3</button>
            <button 
              className={`enter-btn ${discountType ? 'discount-mode' : ''} ${!selectedPaymentType && !discountType ? 'disabled' : ''}`}
              onClick={handleCompletePayment}
              disabled={!selectedPaymentType && !discountType}
            >
              {discountType ? '↵ İNDİRİM' : '↵ TAMAMLA'}
            </button>
            
            <button onClick={() => handleNumPadClick('C')}>C</button>
            <button onClick={() => handleNumPadClick('0')}>0</button>
            <button onClick={() => handleNumPadClick(',')}>,</button>
          </div>
        </div>
      </div>
      </div>
    </div>
    
    {/* User Select Modal */}
    <UserSelect />
    </div>
  );
};

export default Payment;