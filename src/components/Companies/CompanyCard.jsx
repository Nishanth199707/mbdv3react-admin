import React, { useState } from 'react';
import { Building2, Users, MapPin, Phone, Mail, MoreVertical, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import styles from './CompanyCard.module.css';

const CompanyCard = ({ company, onCompanyDeleted }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle different property names for company data
  const companyData = {
    id: company.id || company._id,
    name: company.name || company.tenant_id || company.companyName || 'Unnamed Company',
    email: company.email || company.contactEmail || '',
    phone: company.phone || company.phoneNumber || '',
    city: company.city || company.location || '',
    state: company.state || company.region || '',
    status: company.status || 'active',
    userCount: company.userCount || company.users || company.employeeCount || 0,
    createdAt: company.createdAt || company.created_at || new Date().toISOString()
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#d1fae5';
      case 'inactive':
        return '#fee2e2';
      case 'pending':
        return '#fef3c7';
      default:
        return '#f1f5f9';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${companyData.name}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onCompanyDeleted) {
        onCompanyDeleted(companyData.id);
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleEdit = () => {
    console.log('Edit company:', companyData.id);
    setShowMenu(false);
    // Add edit functionality here
  };

  const handleView = () => {
    console.log('View company:', companyData.id);
    setShowMenu(false);
    // Add view functionality here
  };

  return (
    <div className={`${styles.companyCard} ${isDeleting ? styles.deleting : ''}`}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.companyInfo}>
          <div className={styles.companyIconWrapper}>
            <Building2 size={24} color="#3b82f6" />
          </div>
          <div className={styles.companyDetails}>
            <h3 className={styles.companyName} title={companyData.name}>
              {companyData.name}
            </h3>
            <div 
              className={styles.companyStatus}
              style={{ 
                color: getStatusColor(companyData.status),
                backgroundColor: getStatusBgColor(companyData.status)
              }}
            >
              {companyData.status}
            </div>
          </div>
        </div>
        
        <div className={styles.cardActions}>
          <button
            className={styles.menuButton}
            onClick={() => setShowMenu(!showMenu)}
            disabled={isDeleting}
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownContent}>
                <button
                  className={styles.dropdownItem}
                  onClick={handleView}
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={handleEdit}
                >
                  <Edit size={16} />
                  <span>Edit Company</span>
                </button>
                <div className={styles.dropdownDivider}></div>
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Company'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        {companyData.email && (
          <div className={styles.contactItem}>
            <Mail size={16} className={styles.contactIcon} />
            <span className={styles.contactText} title={companyData.email}>
              {companyData.email}
            </span>
          </div>
        )}
        
        {companyData.phone && (
          <div className={styles.contactItem}>
            <Phone size={16} className={styles.contactIcon} />
            <span className={styles.contactText}>{companyData.phone}</span>
          </div>
        )}
        
        {(companyData.city || companyData.state) && (
          <div className={styles.contactItem}>
            <MapPin size={16} className={styles.contactIcon} />
            <span className={styles.contactText}>
              {[companyData.city, companyData.state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        
        <div className={styles.contactItem}>
          <Users size={16} className={styles.contactIcon} />
          <span className={styles.contactText}>
            {companyData.userCount} {companyData.userCount === 1 ? 'user' : 'users'}
          </span>
        </div>

        <div className={styles.contactItem}>
          <Calendar size={16} className={styles.contactIcon} />
          <span className={styles.contactText}>
            Created {formatDate(companyData.createdAt)}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.footerActions}>
          <button 
            className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            onClick={handleView}
            disabled={isDeleting}
          >
            <Eye size={16} />
            <span className={styles.actionButtonText}>View</span>
          </button>
          <button 
            className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
            onClick={handleEdit}
            disabled={isDeleting}
          >
            <Edit size={16} />
            <span className={styles.actionButtonText}>Edit</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isDeleting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Deleting...</span>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;