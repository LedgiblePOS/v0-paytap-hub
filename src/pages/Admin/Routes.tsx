
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UsersPage from './UsersPage';
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';
import PaymentsPage from './PaymentsPage';
import ReportsPage from './ReportsPage';
import AnalyticsPage from './AnalyticsPage';
import SecurityPage from './SecurityPage';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';
import MonitoringDashboard from './MonitoringDashboard';
import SecurityAuditPage from './SecurityAuditPage';
import PerformanceDashboard from './PerformanceDashboard';
import UserAcceptanceTesting from '@/pages/Testing/UserAcceptanceTesting';
import NotFound from '@/components/NotFound';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="monitoring" element={<MonitoringDashboard />} />
      <Route path="performance" element={<PerformanceDashboard />} />
      <Route path="security" element={<SecurityPage />} />
      <Route path="security/audit" element={<SecurityAuditPage />} />
      <Route path="testing/uat" element={<UserAcceptanceTesting />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
