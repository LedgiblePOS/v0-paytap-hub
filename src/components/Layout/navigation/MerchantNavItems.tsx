
import React from 'react';
import { LayoutDashboard, Receipt, Package2, Users, ShoppingCart, Settings, ChartBar, Calendar, CreditCard, ListChecks, User } from 'lucide-react';

// Enhanced merchant navigation with consistent routing paths
const MerchantNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    description: "Overview of your business"
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <Package2 className="h-5 w-5" />,
    description: "Manage your product inventory"
  },
  {
    title: "Accounting",
    href: "/accounting",
    icon: <Receipt className="h-5 w-5" />,
    description: "Track your finances"
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
    description: "Manage customer relationships"
  },
  {
    title: "Point of Sale",
    href: "/pos",
    icon: <ShoppingCart className="h-5 w-5" />,
    description: "Process sales transactions"
  },
  {
    title: "Tax Reporting",
    href: "/tax-reporting",
    icon: <ListChecks className="h-5 w-5" />,
    description: "Manage tax obligations"
  },
  {
    title: "Sales Projections",
    href: "/sales-projections",
    icon: <ChartBar className="h-5 w-5" />,
    description: "View sales forecasts"
  },
  {
    title: "Payments",
    href: "/payments",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Manage payment processing"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <Calendar className="h-5 w-5" />,
    description: "Business insights and data"
  },
  {
    title: "Account",
    href: "/account",
    icon: <User className="h-5 w-5" />,
    description: "Manage your account"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    description: "Configure preferences"
  }
];

// Add console logging to help debug sidebar navigation
console.log('[MerchantNavItems] Navigation items initialized:', MerchantNavItems.map(item => item.title));

export default MerchantNavItems;
