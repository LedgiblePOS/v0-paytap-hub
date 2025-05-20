
import React, { useEffect, useMemo } from 'react';
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { User, UserRole } from '@/types';
import { Location, useNavigate } from 'react-router-dom';
import { SuperAdminNavItems } from '../navigation/SuperAdminNavItems';
import MerchantNavItems from '../navigation/MerchantNavItems';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/contexts/NavigationContext';

interface SidebarNavigationItemsProps {
  user: User | null;
  location: Location;
}

export const SidebarNavigationItems: React.FC<SidebarNavigationItemsProps> = ({ 
  user,
  location
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentSection } = useNavigation();
  
  // Check if user is a super admin
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  
  // Function to determine if we're in super admin section - memoized to prevent unnecessary calculations
  const isInSuperAdminSection = useMemo(() => {
    return location.pathname.startsWith('/super-admin');
  }, [location.pathname]);
  
  // Enhanced logging for debugging
  useEffect(() => {
    console.log("[SidebarNavigationItems] Rendering with:", { 
      isSuperAdmin, 
      userRole: user?.role,
      pathname: location.pathname,
      isInSuperAdminSection,
      currentSection
    });
  }, [isSuperAdmin, user?.role, location.pathname, isInSuperAdminSection, currentSection]);

  // For super admins, we need to decide which navigation items to show based on the current section
  // For merchants, always show merchant navigation
  const navItems = useMemo(() => {
    // Always use SuperAdminNavItems when in the super-admin section
    if (isInSuperAdminSection) {
      return SuperAdminNavItems;
    }
    return MerchantNavItems;
  }, [isInSuperAdminSection]);

  // Navigation handler
  const handleNavigate = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`[SidebarNavigationItems] Navigating to: ${href}`);
    
    // Don't navigate if we're already on the unauthorized page
    if (location.pathname === '/unauthorized' && href === '/unauthorized') {
      return;
    }
    
    try {
      navigate(href);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  
  // Function to determine if a nav item is active
  const isItemActive = (itemHref: string) => {
    if (!itemHref) return false;
    
    // For root paths, ensure exact match
    if (itemHref === '/super-admin' && location.pathname === '/super-admin') {
      return true;
    }
    
    if (itemHref === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    
    // Special case for settings to highlight parent menu item
    if (itemHref === '/super-admin/settings' && location.pathname.startsWith('/super-admin/settings/')) {
      return true;
    }
    
    if (itemHref === '/settings' && location.pathname.startsWith('/settings/')) {
      return true;
    }
    
    // For other paths, check if the current path starts with the item path
    return location.pathname === itemHref || location.pathname.startsWith(`${itemHref}/`);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>
          {isInSuperAdminSection ? 'Admin' : 'Main'}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map(item => (
              <SidebarMenuItem key={item.href || item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isItemActive(item.href || "")}
                  tooltip={item.title}
                >
                  <a 
                    href={item.href || "#"} 
                    onClick={(e) => handleNavigate(item.href || "#", e)}
                    data-testid={`nav-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    data-role={isSuperAdmin ? 'super-admin' : 'merchant'}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      {/* Account Section with Logout */}
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <a 
                  href="#" 
                  onClick={handleLogout}
                  data-testid="nav-item-logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
