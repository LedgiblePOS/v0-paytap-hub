
import React from "react";
import { 
  BarChart, 
  ShieldCheck, 
  Settings, 
  Users, 
  FileCheck, 
  CreditCard, 
  Clock,
  Activity,
  Home,
  FileText,
  Store,
  BanknoteIcon
} from "lucide-react";

export const SuperAdminNavItems = [
  {
    title: "Dashboard",
    href: "/super-admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "User Management",
    href: "/super-admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Merchant Management",
    href: "/super-admin/merchants",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Merchant Verifications",
    href: "/super-admin/merchant-verification",
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    title: "Transaction Review",
    href: "/super-admin/transactions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Merchant Payouts",
    href: "/super-admin/payouts",
    icon: <BanknoteIcon className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/super-admin/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Monitoring",
    href: "/super-admin/monitoring",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "Security",
    href: "/super-admin/security",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Audit Logs",
    href: "/super-admin/audit-logs",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/super-admin/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Payment Integration",
    href: "/super-admin/payment-integration",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/super-admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default SuperAdminNavItems;
