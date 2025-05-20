
import React from 'react';
import { SidebarContent } from '@/components/ui/sidebar/sidebar-components';
import { User, UserRole } from '@/types';

interface SidebarHeaderProps {
  user: User | null;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ user }) => {
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">
        {isSuperAdmin 
          ? 'Super Admin Panel' 
          : user ? `Welcome, ${user.email}` : 'Welcome'}
      </h2>
    </div>
  );
};
