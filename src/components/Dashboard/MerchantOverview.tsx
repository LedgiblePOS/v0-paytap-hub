
import React from "react";
import { User, MerchantModel } from "@/types";

interface MerchantOverviewProps {
  merchant: MerchantModel;
  user: User | null;
}

const MerchantOverview: React.FC<MerchantOverviewProps> = ({ merchant, user }) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.firstName}!</h2>
      <p className="text-gray-600">{merchant.businessName || "Your Business"}</p>
      <div className="mt-4 flex items-center flex-wrap gap-3">
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
          {merchant.subscriptionTier || "STARTER"} Plan
        </div>
        <div className="text-xs text-gray-500">
          Products: {merchant.productCount || 0} / {merchant.productLimit || 10}
        </div>
        {merchant.country && (
          <div className="text-xs text-gray-500">
            Country: {merchant.country}
          </div>
        )}
        {merchant.defaultCurrency && (
          <div className="text-xs text-gray-500">
            Currency: {merchant.defaultCurrency}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantOverview;
