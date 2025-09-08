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
    <div className="">
      <div className="flex items-center justify-between h-15 p-2">
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
          
          {/* <h1 className={styles.pageTitle}>{activeMenuItem || 'Dashboard'}</h1> */}
          {/* <h1 className='font-bold tex-lg'>MDB</h1> */}
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.userSection}>
            <span>👤 User</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;