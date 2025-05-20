import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { UserData } from '@/types/user';
import { SidebarNav } from '@/components/ui/sidebar/sidebar-nav';

interface SidebarFooterProps {
  user: UserData | null;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ user }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <SidebarNav 
      title="Account"
      items={[{
        name: "Logout",
        path: "#logout",
        icon: <LogOut className="h-4 w-4" />,
        onClick: handleLogout
      }]}
    />
  );
};
