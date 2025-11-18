import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Table2, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { authService } from '../services/authService';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tables', icon: Table2, label: 'Masalar' },
    { path: '/orders', icon: ShoppingCart, label: 'Siparişler' },
    { path: '/settings', icon: Settings, label: 'Ayarlar' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>☕ Kafe Panel</h1>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <h2>Kafe Yönetim Sistemi</h2>
            <div className="user-info">
              <span>Admin</span>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                title="Çıkış Yap"
                aria-label="Çıkış Yap"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
