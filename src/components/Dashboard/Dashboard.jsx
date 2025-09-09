import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, Shield, BarChart3, Plus, Settings, TrendingUp, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import CompanyList from './CompanyList';
import styles from './Dashboard.module.css';
import { companiesAPI } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  
  // State variables
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await companiesAPI.getAll();
      if (result.success) {
        const fetchedCompanies = result.data.data || [];
        setCompanies(fetchedCompanies);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch companies');
      console.error('Error fetching companies:', err);
    }
    
    setLoading(false);
  };

  const stats = [
    { 
      title: 'Total Companies', 
      value: companies.length.toString(), 
      change: `${companies.length > 0 ? '+' : ''}${companies.length} Active`, 
      icon: Building2, 
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    { 
      title: 'User Access', 
      value: user?.userType || 'Super Admin', 
      change: 'Full permissions', 
      icon: Shield, 
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    { 
      title: 'Session Status', 
      value: 'Active', 
      change: 'Real-time sync', 
      icon: TrendingUp, 
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    { 
      title: 'System Health', 
      value: '99.9%', 
      change: 'All systems operational', 
      icon: BarChart3, 
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
  ];

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

  const quickActions = [
    { 
      icon: Plus, 
      title: 'Add Company', 
      desc: 'Create new company profile', 
      color: '#3b82f6',
      path: '/companies'
    },
    { 
      icon: Users, 
      title: 'Manage Users', 
      desc: 'User accounts & permissions', 
      color: '#10b981',
      path: '/users'
    },
    { 
      icon: BarChart3, 
      title: 'View Analytics', 
      desc: 'Performance insights', 
      color: '#8b5cf6',
      path: '/analytics'
    },
    { 
      icon: Settings, 
      title: 'System Settings', 
      desc: 'Configure platform', 
      color: '#f59e0b',
      path: '/settings'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Unable to load dashboard</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={fetchCompanies} 
            className={styles.retryButton}
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 bg-white">
      {/* Header Section */}
      {/* <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Overview of your business operations</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.primaryButton}>
              <Plus size={18} />
              <span>Add Company</span>
            </button>
          </div>
        </div>
      </div> */}

      {/* Welcome Card */}
      {/* <div className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeInfo}>
            <div className={styles.welcomeGreeting}>
              <h2 className={styles.welcomeTitle}>
                Welcome back, {user?.name || 'Super Admin'}! 👋
              </h2>
              <p className={styles.welcomeSubtitle}>
                You're managing {companies.length} {companies.length === 1 ? 'company' : 'companies'} across the platform.
              </p>
            </div>
            <div className={styles.welcomeStats}>
              <div className={styles.welcomeStat}>
                <Clock size={16} />
                <span>Last login: {formatLoginTime(user?.loginTime)}</span>
              </div>
              <div className={styles.welcomeStat}>
                <TrendingUp size={16} />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
          <div className={styles.welcomeVisual}>
            <div className={styles.welcomeIcon}>
              <Building2 size={48} />
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats Grid */}
          {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <p className={styles.sectionSubtitle}>Frequently used features</p>
        </div>
        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <button key={index} className={styles.actionCard}>
              <div 
                className={styles.actionIconWrapper}
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon size={24} color={action.color} />
              </div>
              <div className={styles.actionContent}>
                <h4 className={styles.actionTitle}>{action.title}</h4>
                <p className={styles.actionDesc}>{action.desc}</p>
              </div>
              <div className={styles.actionArrow}>→</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Key Metrics</h3>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

  
      {/* Companies Section */}
      <div className={styles.companiesSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Companies Overview</h3>
          <p className={styles.sectionSubtitle}>Recent activity and status</p>
        </div>
        <CompanyList companies={companies} />
      </div>
    </div>
  );
};

export default Dashboard;