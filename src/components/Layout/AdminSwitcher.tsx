
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowLeftRight, Store, ShieldCheck } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

const AdminSwitcher: React.FC = () => {
  const { user } = useAuth();
  const { navigateToSuperAdmin, navigateToMerchant, currentSection } = useNavigation();
  
  // Only super admins can switch between views
  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2" 
          data-testid="admin-switcher"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>{currentSection === 'superadmin' ? 'Admin View' : 'Merchant View'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={navigateToSuperAdmin}
          disabled={currentSection === 'superadmin'}
          className="gap-2"
          data-testid="switch-to-admin"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Switch to Admin View</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={navigateToMerchant}
          disabled={currentSection === 'merchant'}
          className="gap-2"
          data-testid="switch-to-merchant"
        >
          <Store className="h-4 w-4" />
          <span>Switch to Merchant View</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminSwitcher;
