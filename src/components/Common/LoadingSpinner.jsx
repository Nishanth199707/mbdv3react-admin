import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerCircle}></div>
      {text && <p className={styles.spinnerText}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;