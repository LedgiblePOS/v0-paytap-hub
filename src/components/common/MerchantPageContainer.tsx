
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface MerchantPageContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const MerchantPageContainer: React.FC<MerchantPageContainerProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { user } = useAuth();

  // Use merchantId instead of merchant_id
  const merchantId = user?.merchantId;

  // Check if the user has a merchant ID
  const hasMerchant = Boolean(merchantId);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
      </div>
      
      {hasMerchant ? (
        <div>{children}</div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
          <p className="text-amber-800">
            You need to set up a merchant account before accessing this feature.
          </p>
        </div>
      )}
    </div>
  );
};

export default MerchantPageContainer;
