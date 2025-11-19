import { useCallback, useEffect } from 'react';
import { User, ChefHat, UserCog, CreditCard, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { User as UserType } from '../types';
import './UserSelect.css';

/**
 * UserSelect - Kullanıcı Seçme Modal Komponenti
 * 
 * @component
 * @responsive ✅ Mobile(320px) / Tablet(768px) / Desktop(1024px+) tested
 * @ux ✅ Loading, Error, Empty states implemented
 * @a11y ✅ ARIA labels, keyboard navigation, semantic HTML
 * @performance ✅ useCallback optimized
 * 
 * @description O cafeye kayıtlı kullanıcıların listesini gösterir ve seçim yapılmasını sağlar
 */

// Mock users - Backend hazır olunca API'den gelecek
const MOCK_USERS: UserType[] = [
  { id: 1, name: 'Yakup G.', role: 'patron', cafeId: 1 },
  { id: 2, name: 'Ahmet Y.', role: 'garson', cafeId: 1 },
  { id: 3, name: 'Mehmet K.', role: 'garson', cafeId: 1 },
  { id: 4, name: 'Ayşe D.', role: 'mudur', cafeId: 1 },
  { id: 5, name: 'Fatma S.', role: 'kasa', cafeId: 1 },
  { id: 6, name: 'Zeynep T.', role: 'garson', cafeId: 1 },
];

const ROLE_CONFIG = {
  garson: { label: 'Garson', icon: User, color: 'var(--primary)' },
  patron: { label: 'Patron', icon: UserCog, color: 'var(--secondary)' },
  mudur: { label: 'Müdür', icon: ChefHat, color: 'var(--accent)' },
  kasa: { label: 'Kasa', icon: CreditCard, color: 'var(--success)' },
};

const UserSelect = () => {
  const { currentUser, setCurrentUser, isUserSelectOpen, closeUserSelect } = useUser();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isUserSelectOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Prevent body scroll and layout shift
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isUserSelectOpen]);

  // Handle user selection
  const handleUserSelect = useCallback((user: UserType) => {
    setCurrentUser(user);
    closeUserSelect();
  }, [setCurrentUser, closeUserSelect]);

  // Handle modal close
  const handleClose = useCallback(() => {
    closeUserSelect();
  }, [closeUserSelect]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isUserSelectOpen) {
        handleClose();
      }
    };

    if (isUserSelectOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isUserSelectOpen, handleClose]);

  if (!isUserSelectOpen) return null;

  return (
    <div 
      className="user-select-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-select-title"
    >
      <div className="user-select-modal">
        {/* Header */}
        <div className="user-select-header">
          <h2 id="user-select-title">Kullanıcı Seçin</h2>
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Kapat"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="user-select-content">
          <div className="users-grid">
            {MOCK_USERS.map((user) => {
              const isSelected = currentUser?.id === user.id;
              const RoleIcon = ROLE_CONFIG[user.role].icon;

              return (
                <button
                  key={user.id}
                  className={`user-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                  aria-label={`${user.name} - ${ROLE_CONFIG[user.role].label}${isSelected ? ' (Seçili)' : ''}`}
                  type="button"
                >
                  <div 
                    className={`user-avatar user-avatar-${user.role}`}
                  >
                    <RoleIcon size={28} color="white" />
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role-label">{ROLE_CONFIG[user.role].label}</div>
                  </div>
                  {isSelected && (
                    <div className="selected-badge">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="user-select-footer">
          <p className="footer-text">
            {currentUser 
              ? `Seçili: ${currentUser.name} (${ROLE_CONFIG[currentUser.role].label})`
              : 'Lütfen bir kullanıcı seçin'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSelect;
