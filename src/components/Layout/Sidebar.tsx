
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Gauge, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  BarChart3,
  Box
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <Gauge className="w-4 h-4" />, path: '/dashboard' },
    { name: 'Products', icon: <Box className="w-4 h-4" />, path: '/products' },
    { name: 'Orders', icon: <ShoppingCart className="w-4 h-4" />, path: '/orders' },
    { name: 'Customers', icon: <Users className="w-4 h-4" />, path: '/customers' },
    { name: 'Payments', icon: <CreditCard className="w-4 h-4" />, path: '/payments' },
    { name: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, path: '/analytics' },
    { name: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-background border-r flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold">Merchant Portal</h1>
      </div>
      
      <Separator />
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left"
              )}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
