import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isUserSelectOpen: boolean;
  openUserSelect: () => void;
  closeUserSelect: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const openUserSelect = () => setIsUserSelectOpen(true);
  const closeUserSelect = () => setIsUserSelectOpen(false);

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      isUserSelectOpen, 
      openUserSelect, 
      closeUserSelect 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
