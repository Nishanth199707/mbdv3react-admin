import React from 'react';
import styles from './Header.module.css';

const Header = ({ onMenuClick, activeMenuItem }) => {
  const handleMenuClick = () => {
    console.log('Header menu button clicked');
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <button
            className={styles.menuButton}
            onClick={handleMenuClick}
            type="button"
            data-menu-button="true"
          >
            <div className={styles.hamburger}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <h1 className={styles.pageTitle}>{activeMenuItem || 'Dashboard'}</h1>
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.userSection}>
            <span>👤 User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;