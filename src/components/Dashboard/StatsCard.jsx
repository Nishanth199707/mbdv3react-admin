import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
  const isPositive = change && (change.includes('+') || change.includes('Active') || change.includes('operational'));
  
  return (
    <div className={styles.statsCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper} style={{ backgroundColor: bgColor }}>
          <Icon size={24} color={color} />
        </div>
        <div className={styles.trendIcon}>
          {isPositive ? (
            <TrendingUp size={16} className={styles.trendUp} />
          ) : (
            <TrendingDown size={16} className={styles.trendDown} />
          )}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.cardValue}>{value}</div>
        <div className={`${styles.cardChange} ${isPositive ? styles.positive : styles.neutral}`}>
          {change}
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              backgroundColor: color,
              width: isPositive ? '75%' : '45%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;