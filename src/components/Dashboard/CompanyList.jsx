import React from 'react';
import { Building2, ExternalLink, Search } from 'lucide-react';
import styles from './CompanyList.module.css';

const CompanyList = ({ companies }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  // console.log(companies,'companies');
  const filteredCompanies = companies.filter(company =>
    company.tenant_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!companies || companies.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyStateContent}>
          <Building2 className={styles.emptyStateIcon} />
          <h3 className={styles.emptyStateTitle}>No Companies Found</h3>
          <p className={styles.emptyStateText}>No companies are currently available in your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.companyListContainer}>
      {/* Header with Search */}
      <div className={styles.listHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.listTitle}>
            Companies ({filteredCompanies.length})
          </h3>
          <div className={styles.searchContainer}>
            <div className={styles.searchIconWrapper}>
              <Search className={styles.searchIcon} />
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className={styles.tableContainer}>
        <table className={styles.companyTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>
                Company
              </th>
              <th className={styles.tableHeaderCell}>
                Company ID
              </th>
              <th className={styles.tableHeaderCell}>
                Status
              </th>
              <th className={styles.tableHeaderCell}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.companyInfo}>
                    <div className={styles.companyIconContainer}>
                      <div className={styles.companyIcon}>
                        <Building2 className={styles.iconSvg} />
                      </div>
                    </div>
                    <div className={styles.companyDetails}>
                      <div className={styles.companyName}>
                        {company.tenant_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.companyId}>{company.id}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.statusBadge}>
                    Active
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <button className={styles.actionButton}>
                    <ExternalLink className={styles.actionIcon} />
                    <span className={styles.actionText}>View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCardsContainer}>
        {filteredCompanies.map((company) => (
          <div key={company.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.companyInfo}>
                <div className={styles.companyIconContainer}>
                  <div className={styles.companyIcon}>
                    <Building2 className={styles.iconSvg} />
                  </div>
                </div>
                <div className={styles.companyDetails}>
                  <div className={styles.companyName}>
                    {company.tenant_id}
                  </div>
                  <div className={styles.companyIdMobile}>
                    ID: {company.id}
                  </div>
                </div>
              </div>
              <span className={styles.statusBadge}>
                Active
              </span>
            </div>
            <div className={styles.mobileCardFooter}>
              <button className={styles.actionButtonMobile}>
                <ExternalLink className={styles.actionIcon} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* No Results Message */}
      {filteredCompanies.length === 0 && searchTerm && (
        <div className={styles.noResultsContainer}>
          <p className={styles.noResultsText}>No companies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;