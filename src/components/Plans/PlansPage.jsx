import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Users,
  Calendar,
  Check,
  X,
  Filter,
  Search,
  IndianRupee,
   PhoneCall
} from "lucide-react";
import { plansAPI } from "../../services/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import styles from "./PlansPage.module.css";

const PlanCard = ({ plan, onEdit, onToggleStatus, onView }) => {
  const isActive = plan.is_active;
console.log(plan,"plan")
  return (
    <div
      className={`${styles.planCard} ${
        isActive ? styles.planCardActive : styles.planCardInactive
      }`}
    >
      {/* Status Badge */}
      <div className={styles.statusBadge}>
        <span
          className={`${styles.statusLabel} ${
            isActive ? styles.statusActive : styles.statusInactive
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Plan Header */}
      <div className={styles.planHeader}>
        <h3 className={styles.planTitle}>{plan.name}</h3>
        <p className={styles.planDescription}>{plan.description}</p>
      </div>

      {/* Pricing */}
      <div className={styles.pricingSection}>
        <div className={styles.priceContainer}>
          <span className={styles.offerPrice}>₹{plan.offer_price}</span>
          <span className={styles.salePrice}>₹{plan.sale_price}</span>
          <span className={styles.duration}>/{plan.no_of_days} days</span>
        </div>
      </div>

      {/* Key Features */}
      <div className={styles.featuresSection}>
        <div className={styles.featureItem}>
          <Users className={styles.featureIcon} style={{ color: "#3b82f6" }} />
          <span>
            {plan.manage_business} Business
            {plan.manage_business > 1 ? "es" : ""}
          </span>
        </div>
        <div className={styles.featureItem}>
          <Users className={styles.featureIcon} style={{ color: "#10b981" }} />
          <span>{plan.staff} Staff Members</span>
        </div>
        <div className={styles.featureItem}>
           <PhoneCall color="blue" className={styles.featureIcon} />
          <span>{plan.free_whatsapp_sms} Free WhatsApp SMS</span>
        </div>
        <div className={styles.featureItem}>
          {plan.ca_access ? (
            <Check
              className={styles.featureIcon}
              style={{ color: "#10b981" }}
            />
          ) : (
            <X className={styles.featureIcon} style={{ color: "#ef4444" }} />
          )}
          <span>CA Access</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionsSection}>
        <button
          onClick={() => onView(plan)}
          className={`${styles.actionButton} ${styles.actionButtonView}`}
        >
          <Eye className={styles.actionIcon} />
          <span className={styles.actionText}>View</span>
        </button>
        <button
          onClick={() => onEdit(plan)}
          className={`${styles.actionButton} ${styles.actionButtonEdit}`}
        >
          <Edit className={styles.actionIcon} />
          <span className={styles.actionText}>Edit</span>
        </button>
        <button
          onClick={() => onToggleStatus(plan)}
          className={`${styles.actionButton} ${
            isActive
              ? styles.actionButtonActivate
              : styles.actionButtonDeactivate
              
          }`}
          title={isActive ? "Deactivate Plan" : "Activate Plan"}
        >
          {isActive ? (
            <ToggleRight className={styles.actionIcon} />
          ) : (
            <ToggleLeft className={styles.actionIcon} />
          )}
        </button>
      </div>
    </div>
  );
};

const PlanModal = ({ plan, isOpen, onClose, title }) => {
  if (!isOpen || !plan) return null;

  const features = [
    { label: "Manage Business", value: plan.manage_business },
    { label: "Branches", value: plan.branch },
    { label: "Access Users", value: plan.access_users },
    { label: "Access On", value: plan.access_on },
    { label: "Staff", value: plan.staff },
    { label: "Godowns", value: plan.godowns },
    { label: "E-way Bills", value: plan.eway_bills },
    { label: "Free WhatsApp SMS", value: plan.free_whatsapp_sms },
  ];

  const booleanFeatures = [
    { label: "Multiple Invoice Themes", value: plan.multiple_invoice_themes },
    { label: "Print Barcodes", value: plan.print_barcodes },
    { label: "Own Online Store", value: plan.own_online_store },
    { label: "CA Access", value: plan.ca_access },
    { label: "Desktop App", value: plan.desktop_app },
    { label: "Generate E-invoices", value: plan.generate_einvoices },
    { label: "POS Billing", value: plan.pos_billing },
    { label: "User Activity Tracker", value: plan.user_activity_tracker },
    { label: "Automated Billing", value: plan.automated_billing },
    { label: "Bulk Download Print", value: plan.bulk_download_print },
    { label: "Referral Bonus", value: plan.referral_bonus },
    { label: "Update Bulk Item", value: plan.update_bulk_item },
    { label: "Party Credit Limit", value: plan.party_credit_limit },
    { label: "Payment Notification", value: plan.payment_notification },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleSection}>
            <h2 className={styles.modalTitle}>{title}</h2>
          </div>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <X className={styles.modalCloseIcon} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Basic Info */}
          <div className={styles.planInfoSection}>
            <h3 className={styles.planModalTitle}>{plan.name}</h3>
            <p className={styles.planModalDescription}>{plan.description}</p>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <p className={styles.pricingLabel}>Offer Price</p>
                <p className={styles.pricingValue} style={{ color: "#3b82f6" }}>
                  ₹{plan.offer_price}
                </p>
              </div>
              <div className={styles.pricingCard}>
                <p className={styles.pricingLabel}>Sale Price</p>
                <p
                  className={`${styles.pricingValue} ${styles.pricingStrikethrough}`}
                >
                  ₹{plan.sale_price}
                </p>
              </div>
              <div className={styles.pricingCard}>
                <p className={styles.pricingLabel}>Duration</p>
                <p className={styles.pricingValue} style={{ color: "#10b981" }}>
                  {plan.no_of_days} days
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className={styles.featuresGrid}>
            <div className={styles.featuresColumn}>
              <h4 className={styles.featuresTitle}>Numeric Features</h4>
              <div className={styles.featuresList}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureRow}>
                    <span className={styles.featureLabel}>{feature.label}</span>
                    <span className={styles.featureValue}>{feature.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.featuresColumn}>
              <h4 className={styles.featuresTitle}>Features</h4>
              <div className={styles.featuresList}>
                {booleanFeatures.map((feature, index) => (
                  <div key={index} className={styles.featureRow}>
                    <span className={styles.featureLabel}>{feature.label}</span>
                    {feature.value ? (
                      <Check className={styles.featureCheckIcon} />
                    ) : (
                      <X className={styles.featureCrossIcon} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreatePlanModal = ({
  isOpen,
  onClose,
  onSave,
  editId,
  setEditId,
  setCreateModalOpen,
  fetchPlans
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    offer_price: "",
    sale_price: "",
    no_of_days: "",
    manage_business: "",
    branch: "",
    access_users: "",
    access_on: "",
    staff: "",
    godowns: "",
    eway_bills: "",
    free_whatsapp_sms: "",
    multiple_invoice_themes: false,
    print_barcodes: false,
    own_online_store: false,
    ca_access: false,
    desktop_app: false,
    generate_einvoices: false,
    pos_billing: false,
    user_activity_tracker: false,
    automated_billing: false,
    bulk_download_print: false,
    referral_bonus: false,
    update_bulk_item: false,
    party_credit_limit: false,
    payment_notification: false,
    is_active: true,
  });
  const [get, setGet] = useState();
  const [saving, setSaving] = useState(false);
  console.log(editId);
  console.log(get, "gett");

  useEffect(() => {
    const fetchData = async () => {
      if (!editId) return;
      if (editId) {
        try {
          const res = await plansAPI.getById(editId);
          setGet(res?.data?.data);

          const plan = res?.data?.data;
          setFormData({
            name: plan.name,
            description: plan.description,
            offer_price: plan.offer_price,
            sale_price: plan.sale_price,
            no_of_days: plan.no_of_days,
            manage_business: plan.manage_business,
            branch: plan.branch,
            access_users: plan.access_users,
            access_on: plan.access_on,
            staff: plan.staff,
            godowns: plan.godowns,
            eway_bills: plan.eway_bills,
            free_whatsapp_sms: plan.free_whatsapp_sms,
            multiple_invoice_themes: plan.multiple_invoice_themes,
            print_barcodes: plan.print_barcodes,
            own_online_store: plan.own_online_store,
            ca_access: plan.ca_access,
            desktop_app: plan.desktop_app,
            generate_einvoices: plan.generate_einvoices,
            pos_billing: plan.pos_billing,
            user_activity_tracker: plan.user_activity_tracker,
            automated_billing: plan.automated_billing,
            bulk_download_print: plan.bulk_download_print,
            referral_bonus: plan.referral_bonus,
            update_bulk_item: plan.update_bulk_item,
            party_credit_limit: plan.party_credit_limit,
            payment_notification: plan.payment_notification,
            is_active: plan.is_active,
          });
          setCreateModalOpen(true);
        } catch (err) {
          console.error("Error fetching plan by ID:", err);
        } 
      }
    };

    fetchData();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        await plansAPI.update(editId,formData);
        setFormData({
          name: "",
          description: "",
          offer_price: "",
          sale_price: "",
          no_of_days: "",
          manage_business: "",
          branch: "",
          access_users: "",
          access_on: "",
          staff: "",
          godowns: "",
          eway_bills: "",
          free_whatsapp_sms: "",
          multiple_invoice_themes: false,
          print_barcodes: false,
          own_online_store: false,
          ca_access: false,
          desktop_app: false,
          generate_einvoices: false,
          pos_billing: false,
          user_activity_tracker: false,
          automated_billing: false,
          bulk_download_print: false,
          referral_bonus: false,
          update_bulk_item: false,
          party_credit_limit: false,
          payment_notification: false,
          is_active: true,
        });
        await plansAPI.getAll()
        fetchPlans()
        onClose();
      } else {
        await plansAPI.create(formData);
        setFormData({
          name: "",
          description: "",
          offer_price: "",
          sale_price: "",
          no_of_days: "",
          manage_business: "",
          branch: "",
          access_users: "",
          access_on: "",
          staff: "",
          godowns: "",
          eway_bills: "",
          free_whatsapp_sms: "",
          multiple_invoice_themes: false,
          print_barcodes: false,
          own_online_store: false,
          ca_access: false,
          desktop_app: false,
          generate_einvoices: false,
          pos_billing: false,
          user_activity_tracker: false,
          automated_billing: false,
          bulk_download_print: false,
          referral_bonus: false,
          update_bulk_item: false,
          party_credit_limit: false,
          payment_notification: false,
          is_active: true,
        });
        await plansAPI.getAll()
        fetchPlans()
        onClose();
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    } finally {
      setSaving(false);
      setEditId(null)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.createModalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Plan</h2>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <X className={styles.modalCloseIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.createModalBody}>
          {/* Basic Information */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Basic Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Plan Name *</label>
                <input
                  type="text"
                  // required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={styles.formInput}
                  placeholder="Enter plan name"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={styles.formTextarea}
                  placeholder="Enter plan description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Pricing</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Offer Price *</label>
                <input
                  type="number"
                  required
                  value={formData.offer_price}
                  onChange={(e) =>
                    handleInputChange("offer_price", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="0"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Sale Price *</label>
                <input
                  type="number"
                  required
                  value={formData.sale_price}
                  onChange={(e) =>
                    handleInputChange("sale_price", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="0"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Duration (Days) *</label>
                <input
                  type="number"
                  required
                  value={formData.no_of_days}
                  onChange={(e) =>
                    handleInputChange("no_of_days", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          {/* Numeric Features */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Limits & Quotas</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Manage Business</label>
                <input
                  type="number"
                  value={formData.manage_business}
                  onChange={(e) =>
                    handleInputChange("manage_business", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="1"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Branches</label>
                <input
                  type="number"
                  value={formData.branch}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  className={styles.formInput}
                  placeholder="1"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Access Users</label>
                <input
                  type="number"
                  value={formData.access_users}
                  onChange={(e) =>
                    handleInputChange("access_users", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="5"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Staff</label>
                <input
                  type="number"
                  value={formData.staff}
                  onChange={(e) => handleInputChange("staff", e.target.value)}
                  className={styles.formInput}
                  placeholder="10"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Godowns</label>
                <input
                  type="number"
                  value={formData.godowns}
                  onChange={(e) => handleInputChange("godowns", e.target.value)}
                  className={styles.formInput}
                  placeholder="1"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>E-way Bills</label>
                <input
                  type="number"
                  value={formData.eway_bills}
                  onChange={(e) =>
                    handleInputChange("eway_bills", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="100"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Free WhatsApp SMS</label>
                <input
                  type="number"
                  value={formData.free_whatsapp_sms}
                  onChange={(e) =>
                    handleInputChange("free_whatsapp_sms", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="100"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Access On</label>
                <input
                  type="text"
                  value={formData.access_on}
                  onChange={(e) =>
                    handleInputChange("access_on", e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="Web, Mobile"
                />
              </div>
            </div>
          </div>

          {/* Boolean Features */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Features</h3>
            <div className={styles.checkboxGrid}>
              {[
                {
                  key: "multiple_invoice_themes",
                  label: "Multiple Invoice Themes",
                },
                { key: "print_barcodes", label: "Print Barcodes" },
                { key: "own_online_store", label: "Own Online Store" },
                { key: "ca_access", label: "CA Access" },
                { key: "desktop_app", label: "Desktop App" },
                { key: "generate_einvoices", label: "Generate E-invoices" },
                { key: "pos_billing", label: "POS Billing" },
                {
                  key: "user_activity_tracker",
                  label: "User Activity Tracker",
                },
                { key: "automated_billing", label: "Automated Billing" },
                { key: "bulk_download_print", label: "Bulk Download Print" },
                { key: "referral_bonus", label: "Referral Bonus" },
                { key: "update_bulk_item", label: "Update Bulk Item" },
                { key: "party_credit_limit", label: "Party Credit Limit" },
                { key: "payment_notification", label: "Payment Notification" },
              ].map((feature) => (
                <div key={feature.key} className={styles.checkboxField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData[feature.key]}
                      onChange={(e) =>
                        handleInputChange(feature.key, e.target.checked)
                      }
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>{feature.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.formButton} ${styles.formButtonSecondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`${styles.formButton} ${styles.formButtonPrimary}`}
            >
              {editId ? "update" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const result = await plansAPI.getAll();

    if (result.success) {
      setPlans(result?.data?.data || []);
      setError("");
    } else {
      setError(result.error);
      // Mock data for development
      setPlans([
        {
          id: 1,
          name: "Basic Plan",
          description: "Perfect for small businesses",
          offer_price: 999,
          sale_price: 1499,
          no_of_days: 30,
          manage_business: 1,
          branch: 1,
          staff: 5,
          free_whatsapp_sms: 100,
          ca_access: false,
          is_active: true,
        },
        {
          id: 2,
          name: "Professional Plan",
          description: "Ideal for growing businesses",
          offer_price: 1999,
          sale_price: 2999,
          no_of_days: 30,
          manage_business: 3,
          branch: 5,
          staff: 15,
          free_whatsapp_sms: 500,
          ca_access: true,
          is_active: true,
        },
      ]);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (plan) => {
    const result = await plansAPI.toggleStatus(plan.id);

    if (result.success) {
      setPlans(
        plans.map((p) =>
          p.id === plan.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    } else {
      alert("Failed to toggle plan status: " + result.error);
    }
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCreatePlan = async (planData) => {
    // Simulate API call
    const newPlan = {
      ...planData,
      id: Date.now(),
    };
    setPlans([...plans, newPlan]);
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && plan.is_active) ||
      (filterStatus === "inactive" && !plan.is_active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner text="Loading plans..." />
      </div>
    );
  }

  if (error && plans.length === 0) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={error} onRetry={fetchPlans} />
      </div>
    );
  }
  console.log(editId, "edit");
  return (
    <div className={"p-2 bg-white rounded-xl"}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Plans Management</h1>
            <p className={styles.subtitle}>
              Manage subscription plans and pricing ({plans.length} total)
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            <Plus className={styles.buttonIcon} />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Plans</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Results Summary */}
      {plans.length > 0 && (
        <div className={styles.resultsSummary}>
          <span>
            Showing {filteredPlans.length} of {plans.length} plans
          </span>
        </div>
      )}

      {/* Plans Grid */}
      <div className={styles.plansGrid}>
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onView={handleViewPlan}
            onEdit={(plan) => {
              console.log("Edit plan:", plan);
              setEditId(plan.id);
            }}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            {searchTerm || filterStatus !== "all" ? (
              <>
                <Search className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No plans found</h3>
                <p className={styles.emptyStateText}>
                  No plans match your current search or filters.
                </p>
              </>
            ) : (
              <>
                <Calendar className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No plans available</h3>
                <p className={styles.emptyStateText}>
                  Get started by creating your first subscription plan.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <PlanModal
        plan={selectedPlan}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Plan Details"
      />

      <CreatePlanModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreatePlan}
        editId={editId}
        setEditId={setEditId}
        setCreateModalOpen={setCreateModalOpen}
        fetchPlans={fetchPlans}
      />
    </div>
  );
};

export default PlansPage;
