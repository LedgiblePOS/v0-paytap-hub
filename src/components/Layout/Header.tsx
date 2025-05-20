
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';
import AdminSwitcher from './AdminSwitcher';

const Header: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header className="border-b bg-background py-3 px-6 flex justify-between items-center h-14">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">
          {user?.role === UserRole.SUPER_ADMIN ? 'Admin Dashboard' : 'Merchant Dashboard'}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Include AdminSwitcher component for SuperAdmin users */}
        <AdminSwitcher />
        
        <div className="text-sm font-medium">
          {user && (
            <span>
              {user.firstName} {user.lastName}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
