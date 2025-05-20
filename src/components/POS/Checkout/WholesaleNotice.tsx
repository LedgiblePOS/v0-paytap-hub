
import React from 'react';
import { BadgePercent } from 'lucide-react';

interface WholesaleNoticeProps {
  isWholesaleMode: boolean;
}

const WholesaleNotice: React.FC<WholesaleNoticeProps> = ({ isWholesaleMode }) => {
  if (!isWholesaleMode) return null;
  
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <BadgePercent className="h-5 w-5 text-blue-600 mr-2" />
        <span className="text-blue-800 font-medium">Wholesale Pricing Applied</span>
      </div>
    </div>
  );
};

export default WholesaleNotice;
