
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Layers, 
  Users, 
  Settings, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Shield, 
  Bell,
  Activity
} from "lucide-react";
import { cn } from '@/lib/utils';

interface AdminNavigationProps {
  className?: string;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ className }) => {
  const navItems = [
    {
      title: 'Dashboard',
      icon: <Layers className="h-4 w-4" />,
      href: '/admin',
    },
    {
      title: 'Users',
      icon: <Users className="h-4 w-4" />,
      href: '/admin/users',
    },
    {
      title: 'Products',
      icon: <ShoppingBag className="h-4 w-4" />,
      href: '/admin/products',
    },
    {
      title: 'Orders',
      icon: <Package className="h-4 w-4" />,
      href: '/admin/orders',
    },
    {
      title: 'Payments',
      icon: <CreditCard className="h-4 w-4" />,
      href: '/admin/payments',
    },
    {
      title: 'Reports',
      icon: <FileText className="h-4 w-4" />,
      href: '/admin/reports',
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      href: '/admin/analytics',
    },
    {
      title: 'Monitoring',
      icon: <Activity className="h-4 w-4" />,
      href: '/admin/monitoring',
    },
    {
      title: 'Security',
      icon: <Shield className="h-4 w-4" />,
      href: '/admin/security',
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      href: '/admin/notifications',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      href: '/admin/settings',
    },
  ];

  return (
    <nav className={cn("space-y-1", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          {item.icon}
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminNavigation;
