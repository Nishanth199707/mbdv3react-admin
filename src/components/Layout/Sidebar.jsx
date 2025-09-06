import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose, activeMenuItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Memoize menu items to prevent recreation on every render
  const menuItems = useMemo(() => [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Companies', path: '/companies', icon: '🏢' },
    { name: 'Plans', path: '/plans', icon: '📋' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ], []);

  // Navigation handler
  const handleMenuClick = useCallback((item) => {
    console.log('Menu click:', item.name, item.path);
    
    // Navigate to the new route
    navigate(item.path);
    
    // Close sidebar after navigation
    if (onClose) {
      onClose();
    }
  }, [navigate, onClose]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;
    
    setIsLoggingOut(true);
    
    try {
      await logout();
      // Close sidebar after logout
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout
      localStorage.clear();
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, onClose, isLoggingOut]);

  // Handle overlay click
  const handleOverlayClick = useCallback(() => {
    console.log('Overlay clicked, closing sidebar');
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Handle close button click
  const handleCloseClick = useCallback(() => {
    console.log('Close button clicked');
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  console.log('Sidebar render - isOpen:', isOpen, 'activeMenuItem:', activeMenuItem);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={handleOverlayClick}
        />
      )}
      
      <aside 
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <h2>Your App</h2>
          <button 
            className={styles.closeBtn} 
            onClick={handleCloseClick}
            type="button"
          >
            ×
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {menuItems.map((item) => (
                <li key={item.name} className={styles.navItem}>
                  <button
                    className={`${styles.navLink} ${
                      activeMenuItem === item.name ? styles.active : ''
                    }`}
                    onClick={() => handleMenuClick(item)}
                    type="button"
                    disabled={isLoggingOut}
                  >
                    <span className={styles.icon}>
                      {item.icon}
                    </span>
                    <span className={styles.text}>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Profile & Logout Section */}
        <div className={styles.sidebarFooter}>
          {/* User Info */}
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>
                {user?.name || user?.username || 'Super Admin'}
              </span>
              <span className={styles.userRole}>
                {user?.userType || 'Administrator'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className={`${styles.logoutButton} ${isLoggingOut ? styles.loggingOut : ''}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
            type="button"
            title="Logout"
          >
            <LogOut size={18} className={styles.logoutIcon} />
            <span className={styles.logoutText}>
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </span>
            {isLoggingOut && (
              <div className={styles.loadingSpinner}></div>
            )}
          </button>
        </div>

        {/* Loading Overlay for Sidebar */}
        {isLoggingOut && (
          <div className={styles.sidebarLoadingOverlay}>
            <div className={styles.sidebarSpinner}></div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;