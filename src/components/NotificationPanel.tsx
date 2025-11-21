import { useNotification } from '../contexts/NotificationContext';
import { X, Bell, Trash2 } from 'lucide-react';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const { notifications, showPanel, setShowPanel, markAsRead, removeNotification, clearAll } = useNotification();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Overlay */}
      {showPanel && (
        <div 
          className="notification-overlay" 
          onClick={() => setShowPanel(false)}
        />
      )}

      {/* Panel */}
      <div className={`notification-panel ${showPanel ? 'open' : ''}`}>
        {/* Header */}
        <div className="notification-panel-header">
          <div className="notification-panel-title">
            <Bell size={20} />
            <h3>Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <button 
            className="close-btn"
            onClick={() => setShowPanel(false)}
            title="Kapat"
            aria-label="Bildirim panelini kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="notification-panel-content">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} />
              <p>Bildirim yok</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.timestamp}</span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    title="Sil"
                    aria-label={`"${notification.title}" bildirimini sil`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="notification-panel-footer">
            <button 
              className="clear-all-btn"
              onClick={clearAll}
            >
              Tümünü Temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
