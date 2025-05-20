
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, BadgeAlert, Eye, Check, X, Loader2 } from "lucide-react";
import { MerchantEntity } from "@/types/merchant";

interface VerificationMerchant extends MerchantEntity {
  is_verified?: boolean;
}

interface MerchantVerificationListProps {
  merchants: VerificationMerchant[];
  isLoading?: boolean;
  onViewDetails: (merchantId: string) => void;
  onApprove: (merchantId: string) => Promise<void>;
  onReject: (merchantId: string) => Promise<void>;
}

const MerchantVerificationList: React.FC<MerchantVerificationListProps> = ({
  merchants,
  isLoading = false,
  onViewDetails,
  onApprove,
  onReject,
}) => {
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  const handleApprove = async (merchantId: string) => {
    setProcessingIds((prev) => ({ ...prev, [merchantId]: true }));
    try {
      await onApprove(merchantId);
    } finally {
      setProcessingIds((prev) => ({ ...prev, [merchantId]: false }));
    }
  };

  const handleReject = async (merchantId: string) => {
    setProcessingIds((prev) => ({ ...prev, [merchantId]: true }));
    try {
      await onReject(merchantId);
    } finally {
      setProcessingIds((prev) => ({ ...prev, [merchantId]: false }));
    }
  };

  const isPending = (merchant: VerificationMerchant) => {
    return merchant.is_verified === undefined || merchant.is_verified === null;
  };

  const isVerified = (merchant: VerificationMerchant) => {
    return merchant.is_verified === true;
  };

  const isRejected = (merchant: VerificationMerchant) => {
    return merchant.is_verified === false;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Merchant Verifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : merchants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No merchants pending verification
          </div>
        ) : (
          <div className="space-y-4">
            {merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md"
              >
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  {isPending(merchant) ? (
                    <BadgeAlert className="h-5 w-5 text-amber-500" />
                  ) : isVerified(merchant) ? (
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <BadgeAlert className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h3 className="font-medium">{merchant.business_name}</h3>
                    <p className="text-xs text-gray-500">
                      {merchant.country || "Unknown location"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(merchant.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  {isPending(merchant) && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(merchant.id)}
                        disabled={processingIds[merchant.id]}
                      >
                        {processingIds[merchant.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(merchant.id)}
                        disabled={processingIds[merchant.id]}
                      >
                        {processingIds[merchant.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <X className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantVerificationList;
