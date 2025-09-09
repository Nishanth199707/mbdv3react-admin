import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../Dashboard/Dashboard";
import CompaniesPage from "../Companies/CompaniesPage";
import PlansPage from "../Plans/PlansPage";
import UsersPage from "../User/UsersPage";
import styles from "./Layout.module.css";

// Placeholder components for missing pages
const AnalyticsPage = () => (
  <div className="card">
    <div className="card-body">
      <h2>Analytics Dashboard</h2>
      <p>View detailed analytics and reports.</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="card">
    <div className="card-body">
      <h2>Settings</h2>
      <p>Configure system settings and preferences.</p>
    </div>
  </div>
);

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get active menu item from current route
  const getActiveMenuItem = () => {
    const path = location.pathname.substring(1);
    if (path === "" || path === "dashboard") return "Dashboard";

    const basePath = path.split("/")[0];
    return basePath.charAt(0).toUpperCase() + basePath.slice(1);
  };

  const activeMenuItem = getActiveMenuItem();

  // Toggle sidebar
  // const handleMenuClick = useCallback(() => {
  //   console.log("MainLayout - Toggle sidebar, current state:", sidebarOpen);
  //   setSidebarOpen((prev) => !prev);
  // }, [sidebarOpen]);

  // Close sidebar
  // const handleSidebarClose = useCallback(() => {
  //   console.log("MainLayout - Close sidebar");
  //   setSidebarOpen(false);
  // }, []);

  // Close sidebar on route change (mobile)
  // useEffect(() => {
  //   if (window.innerWidth <= 768) {
  //     setSidebarOpen(false);
  //   }
  // }, [location.pathname]);

  // // Handle window resize
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth > 768 && sidebarOpen) {
  //       setSidebarOpen(false);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [sidebarOpen]);

  console.log(
    "MainLayout render - sidebarOpen:",
    sidebarOpen,
    "activeMenuItem:",
    activeMenuItem
  );

  return (
    <div className="h-screen flex w-full overflow-hidden relative bg-white">
      {/* Fixed sidebar with proper width */}
      <div className="">
        <Sidebar
          isOpen={sidebarOpen}
          // onClose={handleSidebarClose}
          activeMenuItem={activeMenuItem}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main content area with left margin to account for sidebar */}
      <div className="flex flex-col flex-1 ml-0 lg:ml-50 transition-all duration-300">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 ">
          <Header
            isOpen={sidebarOpen}
                 setSidebarOpen={setSidebarOpen}
            // onMenuClick={handleMenuClick}
            activeMenuItem={activeMenuItem}
          />
        </div>

        {/* Main content with proper overflow handling */}
        <div className="flex-1 overflow-y-auto bg-gray-300 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
