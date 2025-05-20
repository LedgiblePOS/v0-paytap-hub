
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { MerchantVerificationModel } from '@/types';
import VerificationCard from './VerificationCard';
import VerificationDetailsDialog from './VerificationDetailsDialog';
import { useVerificationActions } from '../hooks/useVerificationActions';
import { Loader2 } from 'lucide-react';
import ErrorState from '@/components/SuperAdmin/Metrics/ErrorState';

interface VerificationListProps {
  verifications: MerchantVerificationModel[];
  showApproveButton?: boolean;
  hideApproveForVerified?: boolean;
  onVerificationUpdate?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

const VerificationList: React.FC<VerificationListProps> = ({ 
  verifications,
  showApproveButton = false,
  hideApproveForVerified = false,
  onVerificationUpdate = () => {},
  isLoading = false,
  error = null
}) => {
  const [selectedVerification, setSelectedVerification] = useState<MerchantVerificationModel | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { approveVerification, rejectVerification, loading } = useVerificationActions();

  const openDetails = (verification: MerchantVerificationModel) => {
    setSelectedVerification(verification);
    setIsDetailsOpen(true);
  };

  const handleApprove = async (id: string, merchantId: string) => {
    const success = await approveVerification(id, merchantId);
    if (success) {
      onVerificationUpdate();
    }
  };

  const handleReject = async (id: string, reason: string) => {
    const success = await rejectVerification(id, reason);
    if (success) {
      onVerificationUpdate();
    }
  };

  if (isLoading) {
    return (
      <CardContent>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CardContent>
    );
  }

  if (error) {
    return (
      <CardContent>
        <ErrorState 
          message="Failed to load verification data. Please try again."
          onRetry={onVerificationUpdate}
        />
      </CardContent>
    );
  }

  return (
    <CardContent>
      {verifications.length > 0 ? (
        <div className="space-y-4">
          {verifications.map(verification => (
            <VerificationCard
              key={verification.id}
              verification={verification}
              showApproveButton={showApproveButton && !(hideApproveForVerified && verification.isVerified)}
              hideApproveForVerified={hideApproveForVerified}
              onViewDetails={() => openDetails(verification)}
              onApprove={() => handleApprove(verification.id, verification.merchantId)}
              isApproving={loading}
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          No verifications found
        </p>
      )}
      
      <VerificationDetailsDialog
        verification={selectedVerification}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </CardContent>
  );
};

export default VerificationList;
