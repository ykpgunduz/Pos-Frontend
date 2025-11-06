import { useEffect, useState } from 'react';
import './Dashboard.css';

interface Stats {
  totalTables: number;
  occupiedTables: number;
  activeOrders: number;
  todayRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalTables: 0,
    occupiedTables: 0,
    activeOrders: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    // Mock data - API bağlantısı yapıldığında buradan çekilecek
    setStats({
      totalTables: 20,
      occupiedTables: 12,
      activeOrders: 15,
      todayRevenue: 4567.50,
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <span>🪑</span>
          </div>
          <div className="stat-info">
            <h3>Toplam Masa</h3>
            <p className="stat-value">{stats.totalTables}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <span>✓</span>
          </div>
          <div className="stat-info">
            <h3>Dolu Masa</h3>
            <p className="stat-value">{stats.occupiedTables}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <span>🛒</span>
          </div>
          <div className="stat-info">
            <h3>Aktif Sipariş</h3>
            <p className="stat-value">{stats.activeOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <span>💰</span>
          </div>
          <div className="stat-info">
            <h3>Bugünün Cirosu</h3>
            <p className="stat-value">₺{stats.todayRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Hoş Geldiniz</h2>
          <p>Kafe yönetim panelinize hoş geldiniz. Sol menüden istediğiniz bölüme geçebilirsiniz.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
