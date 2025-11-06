import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Payment.css';

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
  const [orderItems, setOrderItems] = useState<PaymentItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [inputValue, setInputValue] = useState("0");
  const [selectedPaymentType, setSelectedPaymentType] = useState<'nakit' | 'kart' | 'cari' | 'odenmez' | 'ticket' | 'yemek-karti' | null>(null);
  const [savedPayments, setSavedPayments] = useState<Array<{ type: string; amount: number }>>([]);
  const [tableNumber, setTableNumber] = useState<string>('');

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
    } else if (value === '.') {
      if (!inputValue.includes('.')) {
        setInputValue(prev => prev + '.');
      }
    } else {
      setInputValue(prev => prev === '0' ? value : prev + value);
    }
  };

  const handleQuickAmount = (value: number) => {
    setInputValue(value.toString());
  };

  const handleAddPayment = () => {
    if (!selectedPaymentType || parseFloat(inputValue) <= 0) {
      alert('Lütfen ödeme türü seçin ve geçerli bir tutar girin');
      return;
    }

    const amount = parseFloat(inputValue);
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
      alert('Ödeme başarıyla tamamlandı!');
      navigate('/');
    } else {
      alert(`Kalan tutar: ₺${remainingAmount.toFixed(2)}`);
    }
  };

  return (
    <div className="payment-container">
      {/* Başlık ve Navigasyon */}
      <div className="payment-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Geri
        </button>
        <h1>Ödeme Ekranı</h1>
        <div className="header-amounts">
          <div className="header-amount-item">
            <span>ÖDENEN TUTAR ₺{paidAmount.toFixed(2)}</span>
          </div>
          <div className="header-amount-item">
            <span>KALAN TUTAR ₺{remainingAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="payment-layout">
        {/* Sol taraf - Adisyon */}
        <div className="adisyon-section">
          <div className="adisyon-header">
            <h2>{tableNumber} - ADİSYON</h2>
            <div className="adisyon-total">
              <span>TOPLAM:</span>
              <span className="amount">₺{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="adisyon-items">
            {orderItems.map((item) => (
              <div key={item.id} className="adisyon-item">
                <div className="item-details">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.productName}</span>
                </div>
                <span className="item-price">₺{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ taraf - Ödeme */}
        <div className="payment-section">
          {/* Quick amount buttons */}
      <div className="quick-amounts">
        {quickAmounts.map(value => (
          <button 
            key={value} 
            className="quick-amount-btn"
            onClick={() => handleQuickAmount(value)}
          >
            ₺{value}
          </button>
        ))}
      </div>

      {/* Saved payments */}
      <div className="saved-payments">
        {savedPayments.map((payment, index) => (
          <div key={index} className="saved-payment">
            <div className="payment-info">
              <span>{payment.type}</span>
              <span>₺{payment.amount.toFixed(2)}</span>
            </div>
            <button 
              className="remove-btn"
              onClick={() => handleRemovePayment(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Main payment grid */}
      <div className="payment-grid">
        {/* Left side with payment types and action buttons */}
        <div className="payment-left">
          {/* Payment type buttons */}
          <div className="payment-types">
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'nakit' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentType('nakit')}
            >
              NAKİT
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'kart' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentType('kart')}
            >
              KART
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'cari' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentType('cari')}
            >
              CARİ
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'odenmez' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentType('odenmez')}
            >
              ÖDENMEZ
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'ticket' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentType('ticket')}
            >
              TICKET
            </button>
            <button 
              className={`payment-type-btn ${selectedPaymentType === 'yemek-karti' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentType('yemek-karti')}
            >
              YEMEK KARTI
            </button>
            <button className="indirim-btn">
              İNDİRİM
            </button>
          </div>

          {/* Action buttons */}
          <div className="action-buttons">
            <button 
              className="action-btn add-payment-btn"
              onClick={handleAddPayment}
              disabled={!selectedPaymentType || parseFloat(inputValue) <= 0}
            >
              ÖDEME EKLE
            </button>
            <button className="action-btn drawer-btn">ÇEKMECE AÇ</button>
          </div>
        </div>

        {/* Right side with numpad */}
        <div className="numpad-section">
          {/* Amount display */}
          <div className="amount-display">₺{inputValue}</div>
          
          {/* Numpad grid */}
          <div className="numpad-grid">
            <button onClick={() => handleNumPadClick('7')}>7</button>
            <button onClick={() => handleNumPadClick('8')}>8</button>
            <button onClick={() => handleNumPadClick('9')}>9</button>
            <button onClick={() => handleNumPadClick('⌫')}>⌫</button>
            
            <button onClick={() => handleNumPadClick('4')}>4</button>
            <button onClick={() => handleNumPadClick('5')}>5</button>
            <button onClick={() => handleNumPadClick('6')}>6</button>
            <button onClick={() => handleNumPadClick('C')}>C</button>
            
            <button onClick={() => handleNumPadClick('1')}>1</button>
            <button onClick={() => handleNumPadClick('2')}>2</button>
            <button onClick={() => handleNumPadClick('3')}>3</button>
            <button 
              className="enter-btn"
              onClick={handleCompletePayment}
            >
              ↵ TAMAMLA
            </button>
            
            <button onClick={() => handleNumPadClick('00')}>00</button>
            <button onClick={() => handleNumPadClick('0')}>0</button>
            <button onClick={() => handleNumPadClick('.')}>.</button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default Payment;