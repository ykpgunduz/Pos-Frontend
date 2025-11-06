import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Payment.css';

interface PaymentProps {
  orderId?: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [amount, setAmount] = useState("50.30");
  const [paymentMethod, setPaymentMethod] = useState<'nakit' | 'kart' | 'cari' | 'odenmez' | 'ticket' | null>(null);

  const quickAmounts = [5, 10, 20, 50, 100, 200];
  const savedPayments = [
    { type: 'Nakit', amount: 25 },
    { type: 'Kart', amount: 25 },
    { type: 'Kart', amount: 25 },
  ];

  const handleQuickAmount = (value: number) => {
    const newAmount = (parseFloat(amount) - value).toFixed(2);
    if (parseFloat(newAmount) >= 0) {
      setAmount(newAmount);
    }
  };

  const handleNumPadInput = (value: string) => {
    switch (value) {
      case 'backspace':
        setAmount(prev => prev.slice(0, -1) || "0");
        break;
      case 'C':
        setAmount("0");
        break;
      case '.':
        if (!amount.includes('.')) {
          setAmount(prev => prev + value);
        }
        break;
      default:
        setAmount(prev => (prev === "0" ? value : prev + value));
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="payment-amounts">
          <div className="amount-item">
            <span>ÖDENEN TUTAR</span>
            <span className="amount">₺75.00</span>
          </div>
          <div className="amount-item">
            <span>KALAN TUTAR</span>
            <span className="amount">₺{amount}</span>
          </div>
        </div>

        <div className="quick-amount-buttons">
          {quickAmounts.map(amount => (
            <button 
              key={amount} 
              className="quick-amount-btn"
              onClick={() => handleQuickAmount(amount)}
            >
              ₺{amount}
            </button>
          ))}
        </div>

        <div className="saved-payments">
          {savedPayments.map((payment, index) => (
            <div key={index} className="saved-payment">
              <span>{payment.type}</span>
              <span>₺{payment.amount}</span>
              <button className="remove-payment">×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="payment-grid">
        <div className="payment-methods">
          <button 
            className={`payment-btn ${paymentMethod === 'nakit' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('nakit')}
          >
            NAKİT
          </button>
          <button 
            className={`payment-btn ${paymentMethod === 'kart' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('kart')}
          >
            KART
          </button>
          <button 
            className={`payment-btn ${paymentMethod === 'cari' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('cari')}
          >
            CARİ
          </button>
          <button 
            className={`payment-btn ${paymentMethod === 'odenmez' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('odenmez')}
          >
            ÖDENMEZ
          </button>
          <button 
            className={`payment-btn ${paymentMethod === 'ticket' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('ticket')}
          >
            TICKET
          </button>
          <button className="payment-btn indirim">
            İNDİRİM
          </button>
        </div>

        <div className="numpad-grid">
          {['7', '8', '9', '⌫', 
            '4', '5', '6', 'C',
            '1', '2', '3', 'enter',
            '00', '0', '.', 'enter'].map((btn, index) => (
            <button
              key={index}
              className={`numpad-btn ${btn === 'enter' ? 'enter-btn' : ''}`}
              onClick={() => handleNumPadInput(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button className="action-btn">ODA HESABI</button>
          <button className="action-btn">ESLAB</button>
          <button className="action-btn">EFT-POS</button>
          <button className="action-btn">KUPON</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;