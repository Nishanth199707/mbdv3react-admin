import React, { useState, useEffect } from 'react';
import { Building2, User, Mail, Phone, Calendar, Globe, Key, Users, ChevronLeft, Edit, Trash2, UserCheck, UserX, Shield, Eye, EyeOff, Power, Loader2, AlertTriangle, CheckCircle, FileText, MapPin } from 'lucide-react';
import { companiesAPI } from '../../services/api';

const CompanyList = ({ companies: initialCompanies = [], onCompaniesUpdate }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showUserKey, setShowUserKey] = useState({});
  const [companies, setCompanies] = useState(initialCompanies);
  
  // Loading and notification states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [actioningDomain, setActioningDomain] = useState(null);

  // Update companies when prop changes
  useEffect(() => {
    if (initialCompanies) {
      setCompanies(initialCompanies);
    }
  }, [initialCompanies]);

  // Helper function to determine if company is active
  const isCompanyActive = (company) => {
    // Check if email is verified or has active users
    const hasEmailVerification = company.business?.email_verification === "1";
    const hasActiveUsers = company.user_details?.some(user => user.is_active === 1);
    return hasEmailVerification || hasActiveUsers;
  };

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle company deletion
  const handleDeleteCompany = async (domain) => {
    setIsDeleting(true);
    setActioningDomain(domain);
    
    try {
      const result = await companiesAPI.deleteByDomain(domain);
      
      if (result.success) {
        // Remove company from local state
        const updatedCompanies = companies.filter(company => company.domain !== domain);
        setCompanies(updatedCompanies);
        
        // Update parent component if callback provided
        if (onCompaniesUpdate) {
          onCompaniesUpdate(updatedCompanies);
        }
        
        // Go back to list if we were viewing the deleted company
        if (selectedCompany && selectedCompany.domain === domain) {
          setSelectedCompany(null);
        }
        
        showNotification('Company deleted successfully', 'success');
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to delete company', 'error');
    }
    
    setIsDeleting(false);
    setActioningDomain(null);
    setShowDeleteConfirm(null);
  };

  // Handle status toggle (email verification toggle)
  const handleToggleStatus = async (domain) => {
    setIsTogglingStatus(true);
    setActioningDomain(domain);
    
    try {
      const result = await companiesAPI.statusByDomain(domain);
      
      if (result.success) {
        // Update company status in local state
        const updatedCompanies = companies.map(company => {
          if (company.domain === domain) {
            // Toggle email verification status
            const currentEmailVerification = company.business?.email_verification || "0";
            const newEmailVerification = currentEmailVerification === "1" ? "0" : "1";
            
            return { 
              ...company, 
              business: {
                ...company.business,
                email_verification: newEmailVerification
              }
            };
          }
          return company;
        });
        
        setCompanies(updatedCompanies);
        
        // Update selected company if it's the one being toggled
        if (selectedCompany && selectedCompany.domain === domain) {
          const updatedSelectedCompany = updatedCompanies.find(c => c.domain === domain);
          setSelectedCompany(updatedSelectedCompany);
        }
        
        // Update parent component if callback provided
        if (onCompaniesUpdate) {
          onCompaniesUpdate(updatedCompanies);
        }
        
        showNotification('Company status updated successfully', 'success');
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to update company status', 'error');
    }
    
    setIsTogglingStatus(false);
    setActioningDomain(null);
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleText = (roleId) => {
    const roles = {
      1: 'Owner',
      2: 'Manager', 
      3: 'Admin',
      4: 'Employee'
    };
    return roles[roleId] || 'User';
  };

  const toggleUserKey = (userId) => {
    setShowUserKey(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Confirm delete modal component
  const DeleteConfirmModal = ({ company, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{company.tenant_id}</strong>? 
          This action cannot be undone and will remove all associated data.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(company.domain)}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
          >
            {isDeleting && actioningDomain === company.domain ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Company'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Notification component
  const Notification = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center max-w-md ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
      'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 mr-2" />
        ) : (
          <AlertTriangle className="w-5 h-5 mr-2" />
        )}
        <span className="text-sm">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
      >
        ×
      </button>
    </div>
  );

  // Company Details View
  if (selectedCompany) {
    const company = selectedCompany;
    const companyIsActive = isCompanyActive(company);
    const emailVerified = company.business?.email_verification === "1";
    
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            company={showDeleteConfirm}
            onConfirm={handleDeleteCompany}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedCompany(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Companies
            </button>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center mb-4 lg:mb-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{company.business?.company_name || company.tenant_id}</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-gray-600">ID: {company.id}</p>
                      {company.business?.gstin && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-1" />
                          <span className="font-mono">GST: {company.business.gstin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleToggleStatus(company.domain)}
                    disabled={isTogglingStatus && actioningDomain === company.domain}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                      emailVerified
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isTogglingStatus && actioningDomain === company.domain ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-2" />
                        {emailVerified ? 'Disable' : 'Enable'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(company)}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Company Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-gray-900 mt-1 font-medium">{company.business?.company_name || company.tenant_id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Domain</label>
                      <div className="flex items-center mt-1">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{company.domain}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Type</label>
                      <p className="text-gray-900 mt-1">{company.business?.business_type || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Category</label>
                      <p className="text-gray-900 mt-1">{company.business?.business_category || 'Not specified'}</p>
                    </div>

                    {company.business?.gstin && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">GST Number</label>
                        <div className="flex items-center mt-1">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900 font-mono">{company.business.gstin}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Email</label>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{company.business?.email || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{company.business?.phone_no || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <div className="flex items-start mt-1">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-gray-900">
                          <p>{company.business?.address}</p>
                          <p className="text-sm text-gray-600">
                            {company.business?.city}, {company.business?.state} - {company.business?.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created Date</label>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{formatDate(company.created_at)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Verification</label>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                        emailVerified
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">GST Available</label>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                        company.business?.gstavailable === 'yes'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.business?.gstavailable === 'yes' ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{company.user_details?.length || 0}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {company.user_details?.filter(user => user.is_active === 1).length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <UserX className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {company.user_details?.filter(user => user.is_active === 0).length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Inactive Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                    companyIsActive ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {companyIsActive ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {companyIsActive ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-sm text-gray-600">Company Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Section */}
          {company.user_details && company.user_details.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Users ({company.user_details.length})
                </h2>
              </div>
              
              <div className="p-6">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">User Key</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.user_details.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 mr-2" />
                                {user.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                {user.phone_no}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {getRoleText(user.role_id)}
                              </span>
                            </div>
                            {user.user_type && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                                {user.user_type}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_active === 1 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.is_active === 1 ? 'Active' : 'Inactive'}
                              </span>
                              <span className={`block px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_email_verified === 1 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.is_email_verified === 1 ? 'Email Verified' : 'Email Unverified'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Key className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm font-mono text-gray-600">
                                {showUserKey[user.id] ? user.user_key : '••••••••••••'}
                              </span>
                              <button
                                onClick={() => toggleUserKey(user.id)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                              >
                                {showUserKey[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(user.created_at)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {company.user_details.map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.is_active === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {user.phone_no}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Shield className="w-4 h-4 mr-2" />
                          {getRoleText(user.role_id)}
                          {user.user_type && (
                            <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {user.user_type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(user.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Company List View
  return (
    <div className="bg-white rounded-lg">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          company={showDeleteConfirm}
          onConfirm={handleDeleteCompany}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}

      <div className="p-6">
        {companies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
            <p className="text-gray-500">No companies are currently available in your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const companyIsActive = isCompanyActive(company);
              const emailVerified = company.business?.email_verification === "1";
              
              return (
                <div key={company.id} className="bg-gray-50 rounded-lg border hover:shadow-md transition-shadow relative">
                  {/* Status indicator */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      companyIsActive
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {companyIsActive ? 'Active' : 'Inactive'}
                    </span>
                    {emailVerified && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0 pr-16">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {company.business?.company_name || company.tenant_id}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {company.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{company.domain}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{company.user_details?.length || 0} users</span>
                      </div>
                      {company.business?.gstin && (
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate font-mono text-xs">{company.business.gstin}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(company.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        View Details
                        <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(company)}
                          disabled={isDeleting}
                          className="flex-1 py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;