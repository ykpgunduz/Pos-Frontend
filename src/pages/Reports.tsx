import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PageLayout.css';

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
          Ana Sayfa
        </button>
        <h1>Raporlar</h1>
      </header>
      <div className="page-content">
        <div className="placeholder-card">
          <h2>📈 Raporlar Ekranı</h2>
          <p>Bu ekran yakında geliştirilecek...</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
