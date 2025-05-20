
import React from "react";
import { DollarSign, CreditCard, Package, Users } from "lucide-react";
import DashboardStat from "@/components/Dashboard/DashboardStat";
import { useMerchant } from "@/hooks/useMerchant";
import { formatCurrency } from "@/utils/formatters";
import { Trend } from "@/types/enums";

interface DashboardStatsProps {
  isLoading: boolean;
  totalRevenue: number;
  transactionCount: number;
  productCount: number;
  customerCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  isLoading, 
  totalRevenue,
  transactionCount,
  productCount,
  customerCount
}) => {
  const { merchant } = useMerchant();

  const stats = [
    {
      title: "Total Revenue",
      value: isLoading ? "..." : formatCurrency(totalRevenue, merchant?.defaultCurrency || 'USD'),
      icon: <DollarSign className="h-8 w-8 text-ledgible-blue" />,
      change: "+12.5%",
      trend: Trend.UP,
    },
    {
      title: "Transactions",
      value: isLoading ? "..." : `${transactionCount}`,
      icon: <CreditCard className="h-8 w-8 text-ledgible-blue" />,
      change: "+8.2%",
      trend: Trend.UP,
    },
    {
      title: "Products",
      value: isLoading ? "..." : `${productCount}`,
      icon: <Package className="h-8 w-8 text-ledgible-blue" />,
      change: "+5.1%",
      trend: Trend.UP,
    },
    {
      title: "Customers",
      value: isLoading ? "..." : `${customerCount}`,
      icon: <Users className="h-8 w-8 text-ledgible-blue" />,
      change: "+16.8%",
      trend: Trend.UP,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <DashboardStat
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
