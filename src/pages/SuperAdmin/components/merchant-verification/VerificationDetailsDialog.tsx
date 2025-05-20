
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MerchantVerificationModel } from '@/types';
import { Textarea } from '@/components/ui/textarea';

interface VerificationDetailsDialogProps {
  verification: MerchantVerificationModel | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string, merchantId: string) => void;
  onReject: (id: string, reason: string) => void;
}

const VerificationDetailsDialog: React.FC<VerificationDetailsDialogProps> = ({
  verification,
  open,
  onClose,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setActiveTab('details');
      setRejectReason('');
      setIsSubmittingApproval(false);
      setIsSubmittingRejection(false);
    }
  }, [open]);

  if (!verification) return null;

  const handleApprove = async () => {
    setIsSubmittingApproval(true);
    try {
      await onApprove(verification.id, verification.merchantId);
    } finally {
      setIsSubmittingApproval(false);
      onClose();
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    
    setIsSubmittingRejection(true);
    try {
      await onReject(verification.id, rejectReason);
    } finally {
      setIsSubmittingRejection(false);
      onClose();
    }
  };

  // Helper function for verification status badge
  const renderStatusBadge = () => {
    if (verification.isVerified) {
      return (
        <Badge variant="success" className="ml-2">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
        </Badge>
      );
    }

    if (verification.verificationData?.rejection_reason) {
      return (
        <Badge variant="destructive" className="ml-2">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="ml-2">
        <AlertCircle className="h-3 w-3 mr-1" /> Pending
      </Badge>
    );
  };

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not available";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            Verification Details {renderStatusBadge()}
          </DialogTitle>
          <DialogDescription>
            Review merchant verification data
          </DialogDescription>
          <DialogDescription className="font-medium text-black dark:text-white">
            Merchant: {verification.merchant?.businessName || "Unknown"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Verification Details</TabsTrigger>
            <TabsTrigger value="documents">Submitted Documents</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Merchant Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span>{' '}
                    {verification.merchant?.businessName || "Not provided"}
                  </div>
                  <div>
                    <span className="font-semibold">Merchant ID:</span>{' '}
                    {verification.merchantId}
                  </div>
                  <div>
                    <span className="font-semibold">Verification Type:</span>{' '}
                    {verification.verificationType}
                  </div>
                  <div>
                    <span className="font-semibold">Submitted:</span>{' '}
                    {formatDate(verification.createdAt)}
                  </div>
                  {verification.verifiedAt && (
                    <div>
                      <span className="font-semibold">Verified At:</span>{' '}
                      {formatDate(verification.verifiedAt)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Verification Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify(verification.verificationData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">
                  {verification.verificationData?.documents ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Document preview would go here */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded text-center">
                        Document preview not available
                      </div>
                    </div>
                  ) : (
                    <p>No documents were submitted for this verification request.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Verification Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Button 
                      onClick={handleApprove}
                      disabled={verification.isVerified || !!verification.verificationData?.rejection_reason || isSubmittingApproval || isSubmittingRejection}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmittingApproval ? "Processing..." : "Approve Verification"}
                    </Button>
                  </div>
                  
                  <Separator />

                  <div className="space-y-2">
                    <label htmlFor="rejectReason" className="text-sm font-medium">
                      Rejection reason (required for rejection):
                    </label>
                    <Textarea
                      id="rejectReason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={3}
                      disabled={verification.isVerified || !!verification.verificationData?.rejection_reason}
                      placeholder="Provide a reason for rejection"
                    />
                    <Button 
                      onClick={handleReject}
                      disabled={verification.isVerified || !!verification.verificationData?.rejection_reason || !rejectReason.trim() || isSubmittingApproval || isSubmittingRejection}
                      variant="destructive"
                      className="w-full"
                    >
                      {isSubmittingRejection ? "Processing..." : "Reject Verification"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDetailsDialog;
