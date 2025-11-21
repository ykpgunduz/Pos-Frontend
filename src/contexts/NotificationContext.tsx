import { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  icon?: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showPanel: boolean;
  setShowPanel: (show: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: number) => void;
  markAsRead: (id: number) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Stok Uyarısı',
      message: 'Sucuk stoğu kritik seviyeye iniyor (5 adet kaldı)',
      type: 'warning',
      timestamp: '15:27',
      icon: '⚠️',
      read: false,
    },
    {
      id: 2,
      title: 'Doluluk Oranı',
      message: 'Masaların %85\'i dolu durumda',
      type: 'info',
      timestamp: '15:32',
      icon: '📊',
      read: false,
    },
    {
      id: 3,
      title: 'Günlük Rapor',
      message: 'Bugün 157 sipariş tamamlandı',
      type: 'success',
      timestamp: '15:41',
      icon: '✅',
      read: false,
    },
  ]);
  const [showPanel, setShowPanel] = useState(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      showPanel,
      setShowPanel,
      addNotification,
      removeNotification,
      markAsRead,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
