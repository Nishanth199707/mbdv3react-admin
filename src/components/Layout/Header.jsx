import React from 'react';
import styles from './Header.module.css';
import {useAuth} from "../../context/AuthContext"

const Header = ({ onMenuClick, activeMenuItem }) => {
  const handleMenuClick = () => {
    console.log('Header menu button clicked');
    if (onMenuClick) {
      onMenuClick();
    }
  };
    const { user } = useAuth();

      const formatLoginTime = (loginTime) => {
    if (!loginTime) return 'Unknown';
    return new Date(loginTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        
        <div className="flex items-center  invisible  md:visible ">
          <div className={styles.userSection}>
            <span>👤{user?.name || "Super Admin"}</span><br/>
              <span>Last login: {formatLoginTime(user?.loginTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;