
import React from 'react';
import { Route, useParams } from 'react-router-dom';
// Comment out imports that are causing issues - these files don't exist
// We'll create stubs for these components later if needed
// import ProtectedSuperAdminLayout from './superAdmin/ProtectedSuperAdminLayout';
// import SuperAdminDashboard from '@/pages/SuperAdmin/Dashboard';
// import UserManagement from '@/pages/SuperAdmin/UserManagement';
// import MerchantManagement from '@/pages/SuperAdmin/MerchantManagement';
// import MerchantDetails from '@/pages/SuperAdmin/MerchantDetails';
// import SystemSettings from '@/pages/SuperAdmin/SystemSettings';
// import AuditLogs from '@/pages/SuperAdmin/AuditLogs';
// import SystemMonitoring from '@/pages/SuperAdmin/SystemMonitoring';
// import MerchantVerification from '@/pages/SuperAdmin/MerchantVerification';
// import APIManagement from '@/pages/SuperAdmin/APIManagement';
// import SuperAdminReports from '@/pages/SuperAdmin/Reports';
// import PaymentManagement from '@/pages/SuperAdmin/PaymentManagement';
import { MerchantModel } from '@/types/models'; // Using the MerchantModel instead of Merchant
import { fixMerchantEntitiesForAdmin, toConsistentMerchantModels } from '@/components/Dashboard/DashboardWrapper';

// Create placeholders for the components
const ProtectedSuperAdminLayout: React.FC<{children?: React.ReactNode}> = ({children}) => <div>{children}</div>;
const SuperAdminDashboard: React.FC<{loading: boolean, merchants: MerchantModel[], users: any[], recentTransactions: any[]}> = () => <div>SuperAdmin Dashboard</div>;
const UserManagement: React.FC = () => <div>User Management</div>;
const MerchantManagement: React.FC = () => <div>Merchant Management</div>;
const MerchantDetails: React.FC<{id: string}> = () => <div>Merchant Details</div>;
const SystemSettings: React.FC = () => <div>System Settings</div>;
const AuditLogs: React.FC = () => <div>Audit Logs</div>;
const SystemMonitoring: React.FC = () => <div>System Monitoring</div>;
const MerchantVerification: React.FC = () => <div>Merchant Verification</div>;
const APIManagement: React.FC = () => <div>API Management</div>;
const SuperAdminReports: React.FC = () => <div>Super Admin Reports</div>;
const PaymentManagement: React.FC = () => <div>Payment Management</div>;

const SuperAdminDashboardHandler = () => {
  const [loadingData, setLoadingData] = React.useState(true);
  const [merchants, setMerchants] = React.useState<MerchantModel[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch merchant data
        const merchantResponse = await fetch('/api/merchants?limit=5');
        if (merchantResponse.ok) {
          const merchantData = await merchantResponse.json();
          // Use the helper functions to ensure consistent merchant model
          const fixedEntities = fixMerchantEntitiesForAdmin(merchantData);
          const consistentModels = toConsistentMerchantModels(fixedEntities);
          setMerchants(consistentModels);
        }
        
        // Fetch user data
        const userResponse = await fetch('/api/users?limit=5');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUsers(userData);
        }
        
        // Fetch transaction data
        const transactionResponse = await fetch('/api/transactions?limit=10');
        if (transactionResponse.ok) {
          const transactionData = await transactionResponse.json();
          setRecentTransactions(transactionData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return <SuperAdminDashboard 
    loading={loadingData} 
    merchants={merchants} 
    users={users} 
    recentTransactions={recentTransactions}
  />;
};

const MerchantDetailsHandler = () => {
  const { id } = useParams<{ id: string }>();
  return <MerchantDetails id={id || ''} />;
};

const SuperAdminRoutes = () => {
  return (
    <Route element={<ProtectedSuperAdminLayout />}>
      <Route path="/dashboard" element={<SuperAdminDashboardHandler />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/merchants" element={<MerchantManagement />} />
      <Route path="/merchants/:id" element={<MerchantDetailsHandler />} />
      <Route path="/settings" element={<SystemSettings />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/monitoring" element={<SystemMonitoring />} />
      <Route path="/verification" element={<MerchantVerification />} />
      <Route path="/api-management" element={<APIManagement />} />
      <Route path="/reports" element={<SuperAdminReports />} />
      <Route path="/payment-management/*" element={<PaymentManagement />} />
    </Route>
  );
};

export default SuperAdminRoutes;
