
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/enums';
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import MerchantNavItems from './navigation/MerchantNavItems';
import { toast } from '@/components/ui/use-toast';

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out",
        variant: "destructive"
      });
    }
  };
  
  // Function to determine if a nav item is active
  const isItemActive = (itemHref: string) => {
    if (!itemHref) return false;
    
    // For root paths, ensure exact match
    if (itemHref === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    
    // Special case for settings to highlight parent menu item
    if (itemHref === '/settings' && location.pathname.startsWith('/settings/')) {
      return true;
    }
    
    // For other paths, check if the current path starts with the item path
    return location.pathname.startsWith(itemHref);
  };
  
  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-4 border-b">
        <h1 className="font-semibold text-lg">Merchant Dashboard</h1>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MerchantNavItems.map(item => (
                <SidebarMenuItem key={item.href || item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isItemActive(item.href || "")}
                    tooltip={item.description || item.title}
                  >
                    <a 
                      href={item.href || "#"} 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.href || "#");
                      }}
                      data-testid={`nav-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
      </div>
      
      {user && (
        <div className="p-4 border-t flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-muted flex items-center justify-center"
              title="Logout"
              aria-label="Logout"
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
