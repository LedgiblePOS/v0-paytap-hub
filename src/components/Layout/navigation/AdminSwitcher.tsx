
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, Building } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

const AdminSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { currentSection, navigateToSuperAdmin, navigateToMerchant } = useNavigation();

  return (
    <div className="flex items-center space-x-2 ml-4">
      <Button
        variant={currentSection === 'superadmin' ? 'default' : 'outline'}
        size="sm"
        className="gap-2"
        onClick={navigateToSuperAdmin}
      >
        <Building className="h-4 w-4" />
        <span className="hidden sm:inline">Admin</span>
      </Button>
      <Button
        variant={currentSection === 'merchant' ? 'default' : 'outline'}
        size="sm"
        className="gap-2"
        onClick={navigateToMerchant}
      >
        <Store className="h-4 w-4" />
        <span className="hidden sm:inline">Merchant</span>
      </Button>
    </div>
  );
};

export default AdminSwitcher;
