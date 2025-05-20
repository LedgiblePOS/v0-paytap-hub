
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MerchantVerificationModel } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, FileText, AlertCircle, Eye, Loader2 } from 'lucide-react';
import PermissionButton from '@/components/Auth/PermissionButton';
import { Permission } from '@/utils/permissions/types';

interface VerificationCardProps {
  verification: MerchantVerificationModel;
  showApproveButton?: boolean;
  hideApproveForVerified?: boolean;
  onViewDetails: () => void;
  onApprove?: () => void;
  isApproving?: boolean;
}

const VerificationCard: React.FC<VerificationCardProps> = ({ 
  verification,
  showApproveButton = false,
  hideApproveForVerified = false,
  onViewDetails,
  onApprove,
  isApproving = false
}) => {
  // Format dates for display
  const createdAtFormatted = verification.createdAt ? 
    formatDistanceToNow(new Date(verification.createdAt), { addSuffix: true }) : 
    'Unknown';
    
  const verifiedAtFormatted = verification.verifiedAt ? 
    formatDistanceToNow(new Date(verification.verifiedAt), { addSuffix: true }) : 
    null;
    
  // Get verification status
  const getVerificationStatus = () => {
    if (verification.isVerified) {
      return { label: 'Verified', variant: 'success' as const, icon: <CheckCircle className="h-3 w-3 mr-1" /> };
    }
    
    // Check for rejection
    if (verification.verificationData?.rejection_reason) {
      return { label: 'Rejected', variant: 'destructive' as const, icon: <AlertCircle className="h-3 w-3 mr-1" /> };
    }
    
    return { label: 'Pending', variant: 'outline' as const, icon: <Clock className="h-3 w-3 mr-1" /> };
  };
  
  const status = getVerificationStatus();
  
  // Check if there are documents
  const hasDocuments = verification.verificationData?.documents?.length > 0;

  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApprove) onApprove();
  };

  return (
    <Card 
      className="border-l-4 hover:shadow-md transition-shadow cursor-pointer"
      style={{ borderLeftColor: verification.isVerified ? '#10b981' : verification.verificationData?.rejection_reason ? '#f43f5e' : '#f59e0b' }}
      onClick={onViewDetails}
    >
      <CardContent className="pt-6 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{verification.merchant?.businessName || "Unknown Merchant"}</h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Submitted {createdAtFormatted}</span>
            </div>
          </div>
          
          <Badge variant={status.variant} className="mt-0.5">
            <span className="flex items-center">
              {status.icon} {status.label}
            </span>
          </Badge>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium mb-1">Verification Type</h4>
            <p className="text-sm capitalize">{verification.verificationType.replace('_', ' ')}</p>
          </div>
          
          {hasDocuments && (
            <Badge variant="outline" className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              {verification.verificationData.documents.length} Document{verification.verificationData.documents.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {verification.isVerified && verifiedAtFormatted && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span>Verified {verifiedAtFormatted}</span>
          </div>
        )}
        
        {verification.verificationData?.rejection_reason && (
          <div className="mt-2 text-sm text-red-500">
            <span>Rejected: {verification.verificationData.rejection_reason.substring(0, 60)}
              {verification.verificationData.rejection_reason.length > 60 ? '...' : ''}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="py-3 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Details
        </Button>
        
        {showApproveButton && !verification.isVerified && !verification.verificationData?.rejection_reason && (
          <PermissionButton 
            permission={Permission.VERIFY_MERCHANT}
            variant="secondary" 
            size="sm"
            onClick={handleApproveClick}
            deniedMessage="You don't have permission to verify merchants"
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </>
            )}
          </PermissionButton>
        )}
      </CardFooter>
    </Card>
  );
};

export default VerificationCard;
