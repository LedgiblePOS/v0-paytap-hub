
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';

interface SettingsLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, title, description }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Extract the last part of the path
  const getCurrentTab = () => {
    const pathParts = currentPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // If we're at /settings, set general as default
    if (lastPart === 'settings') return 'general';
    return lastPart;
  };
  
  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <MainLayoutContent>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          
          {children}
        </Tabs>
      </div>
    </MainLayoutContent>
  );
};

export default SettingsLayout;
