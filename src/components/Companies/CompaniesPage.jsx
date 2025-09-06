import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Grid, List, Plus, Building2, RefreshCw, Filter, X } from 'lucide-react';
import CompanyCard from './CompanyCard';
import CompanyList from '../Dashboard/CompanyList';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import { companiesAPI } from '../../services/api';
import styles from './CompaniesPage.module.css';

const CompaniesPage = ({ onCompanyDeleted }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await companiesAPI.getAll();
      if (result.success) {
        // Handle different response formats
        let fetchedCompanies = [];
        if (Array.isArray(result.data)) {
          fetchedCompanies = result.data;
        } else if (result.data?.data && Array.isArray(result.data.data)) {
          fetchedCompanies = result.data.data;
        } else if (result.data?.companies && Array.isArray(result.data.companies)) {
          fetchedCompanies = result.data.companies;
        }
        
        setCompanies(fetchedCompanies);
        setError('');
      } else {
        setError(result.error || 'Failed to fetch companies');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to fetch companies');
      
      // Add mock data for development
      if (process.env.NODE_ENV === 'development') {
        setCompanies([
          {
            id: '1',
            tenant_id: 'acme-corp',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1 (555) 123-4567',
            city: 'San Francisco',
            state: 'CA',
            status: 'active',
            userCount: 15,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            tenant_id: 'tech-solutions',
            name: 'Tech Solutions Inc',
            email: 'info@techsolutions.com',
            phone: '+1 (555) 987-6543',
            city: 'Seattle',
            state: 'WA',
            status: 'active',
            userCount: 28,
            createdAt: '2024-02-20T14:15:00Z'
          }
        ]);
      }
    }
    
    setLoading(false);
  };

  const handleCompanyDeleted = (companyId) => {
    const updatedCompanies = companies.filter(company => company.id !== companyId);
    setCompanies(updatedCompanies);
    
    const userData = JSON.parse(localStorage.getItem('mdb_admin_user') || '{}');
    if (userData.companies) {
      userData.companies = updatedCompanies;
      localStorage.setItem('mdb_admin_user', JSON.stringify(userData));
    }
    
    if (onCompanyDeleted) {
      onCompanyDeleted(companyId);
    }
  };

  const filteredAndSortedCompanies = companies
    .filter(company => {
      const searchableText = [
        company.tenant_id || '',
        company.name || '',
        company.id || '',
        company.email || '',
        company.city || ''
      ].join(' ').toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        searchableText.includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'active' && company.status === 'active') || 
        (filterStatus === 'inactive' && company.status !== 'active');
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = (a.name || a.tenant_id || '').toLowerCase();
          bValue = (b.name || b.tenant_id || '').toLowerCase();
          break;
        case 'id':
          aValue = (a.id || '').toLowerCase();
          bValue = (b.id || '').toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = (a.name || a.tenant_id || '').toLowerCase();
          bValue = (b.name || b.tenant_id || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('name');
    setSortOrder('asc');
    setShowMobileFilters(false);
  };

  const hasActiveFilters = searchTerm || filterStatus !== 'all' || sortBy !== 'name' || sortOrder !== 'asc';

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Companies</h1>
            <p className={styles.subtitle}>Loading companies...</p>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <LoadingSpinner text="Loading companies..." />
        </div>
      </div>
    );
  }

  if (error && companies.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Companies</h1>
            <p className={styles.subtitle}>Error loading companies</p>
          </div>
        </div>
        <div className={styles.errorContainer}>
          <ErrorMessage message={error} onRetry={fetchCompanies} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Companies</h1>
            <p className={styles.subtitle}>
              Manage all companies in your system ({companies.length} total)
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={fetchCompanies}
              disabled={loading}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              <RefreshCw className={`${styles.buttonIcon} ${loading ? styles.spinning : ''}`} />
              <span className={styles.buttonTextDesktop}>Refresh</span>
            </button>
            <button className={`${styles.button} ${styles.buttonPrimary}`}>
              <Plus className={styles.buttonIcon} />
              <span>Add Company</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className={styles.filtersCard}>
        {/* Desktop Filters */}
        <div className={styles.filtersDesktop}>
          <div className={styles.filtersLeft}>
            {/* Search Box */}
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={styles.searchClear}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className={styles.filterSelect}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="id-asc">ID A-Z</option>
              <option value="id-desc">ID Z-A</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className={styles.viewModeToggle}>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.viewModeActive : ''}`}
            >
              <Grid className={styles.viewModeIcon} />
              <span className={styles.viewModeTextDesktop}>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.viewModeActive : ''}`}
            >
              <List className={styles.viewModeIcon} />
              <span className={styles.viewModeTextDesktop}>List</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters Toggle */}
        <div className={styles.filtersMobile}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={styles.searchClear}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className={styles.mobileControls}>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`${styles.button} ${styles.buttonSecondary} ${styles.mobileFilterButton}`}
            >
              <Filter className={styles.buttonIcon} />
              <span>Filters</span>
              {hasActiveFilters && <span className={styles.filtersBadge}></span>}
            </button>
            
            <div className={styles.viewModeToggle}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.viewModeActive : ''}`}
              >
                <Grid className={styles.viewModeIcon} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.viewModeActive : ''}`}
              >
                <List className={styles.viewModeIcon} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className={styles.mobileFiltersDropdown}>
            <div className={styles.mobileFiltersContent}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className={styles.filterSelect}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="id-asc">ID A-Z</option>
                <option value="id-desc">ID Z-A</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className={`${styles.button} ${styles.buttonSecondary} ${styles.clearFiltersButton}`}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            <div className={styles.activeFiltersContent}>
              <span className={styles.activeFiltersLabel}>Active filters:</span>
              
              {searchTerm && (
                <span className={styles.filterChip}>
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className={styles.filterChipRemove}
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filterStatus !== 'all' && (
                <span className={styles.filterChip}>
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={styles.filterChipRemove}
                  >
                    ×
                  </button>
                </span>
              )}

              {(sortBy !== 'name' || sortOrder !== 'asc') && (
                <span className={styles.filterChip}>
                  Sort: {sortBy} {sortOrder === 'asc' ? '↑' : '↓'}
                  <button
                    onClick={() => {
                      setSortBy('name');
                      setSortOrder('asc');
                    }}
                    className={styles.filterChipRemove}
                  >
                    ×
                  </button>
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className={styles.clearAllLink}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {companies.length > 0 && (
        <div className={styles.resultsSummary}>
          <span className={styles.resultsText}>
            Showing {filteredAndSortedCompanies.length} of {companies.length} companies
          </span>
          <span className={styles.viewModeText}>
            View: <span className={styles.viewModeLabel}>{viewMode === 'grid' ? 'Grid' : 'List'}</span>
          </span>
        </div>
      )}

      {/* Companies Display */}
      {filteredAndSortedCompanies.length > 0 ? (
        <div className={styles.companiesContent}>
          {viewMode === 'grid' ? (
            <div className={styles.companiesGrid}>
              {filteredAndSortedCompanies.map((company) => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  onCompanyDeleted={handleCompanyDeleted}
                />
              ))}
            </div>
          ) : (
            <CompanyList 
              companies={filteredAndSortedCompanies} 
              onCompanyDeleted={handleCompanyDeleted}
            />
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <Search className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No companies found</h3>
                <p className={styles.emptyStateText}>
                  No companies match your current filters. Try adjusting your search or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Clear All Filters
                </button>
              </>
            ) : (
              <>
                <Building2 className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No companies yet</h3>
                <p className={styles.emptyStateText}>
                  Get started by adding your first company to the system.
                </p>
                <button className={`${styles.button} ${styles.buttonPrimary}`}>
                  <Plus className={styles.buttonIcon} />
                  Add Your First Company
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;