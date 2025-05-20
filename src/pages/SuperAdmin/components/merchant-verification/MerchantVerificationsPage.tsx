
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Eye } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface MerchantVerification {
  id: string;
  merchant_id: string;
  verification_type: string;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
  business_name: string;
  user_email: string;
}

const MerchantVerificationsPage = () => {
  const { toast } = useToast();
  const [selectedVerification, setSelectedVerification] = useState<MerchantVerification | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  const {
    data: verifications,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['merchantVerifications'],
    queryFn: async () => {
      try {
        // Join merchant_verifications with merchants table to get business name
        const { data, error } = await supabase
          .from('merchant_verifications')
          .select(`
            id,
            merchant_id,
            verification_type, 
            is_verified,
            verified_at,
            created_at,
            merchants (
              business_name,
              user_id
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get user details for each verification
        const enhancedData = await Promise.all(
          data.map(async (verification) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', verification.merchants.user_id)
              .single();

            return {
              ...verification,
              business_name: verification.merchants.business_name,
              user_email: userData?.email || 'Unknown'
            };
          })
        );

        return enhancedData;
      } catch (error) {
        console.error('Error fetching merchant verifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch merchant verifications',
          variant: 'destructive'
        });
        return [];
      }
    }
  });

  const fetchVerificationData = async (verificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('merchant_verifications')
        .select('verification_data')
        .eq('id', verificationId)
        .single();
      
      if (error) throw error;
      
      setVerificationData(data.verification_data);
    } catch (error) {
      console.error('Error fetching verification data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch verification details',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetails = (verification: MerchantVerification) => {
    setSelectedVerification(verification);
    fetchVerificationData(verification.id);
    setViewDetailsOpen(true);
  };

  const handleApprove = (verification: MerchantVerification) => {
    setSelectedVerification(verification);
    setApprovalDialogOpen(true);
  };

  const handleReject = (verification: MerchantVerification) => {
    setSelectedVerification(verification);
    setRejectionDialogOpen(true);
  };

  const confirmApproval = async () => {
    if (!selectedVerification) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('merchant_verifications')
        .update({ 
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', selectedVerification.id);
      
      if (error) throw error;
      
      // Log the approval action
      await supabase
        .from('audit_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'UPDATE',
          resource: 'MERCHANT_VERIFICATION',
          resource_id: selectedVerification.id,
          description: `Approved merchant verification for ${selectedVerification.business_name}`
        });
      
      toast({
        title: 'Merchant Verified',
        description: `${selectedVerification.business_name} has been successfully verified.`,
      });
      
      refetch();
    } catch (error) {
      console.error('Error approving merchant:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify merchant',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setApprovalDialogOpen(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedVerification) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('merchant_verifications')
        .update({ 
          is_verified: false,
          verified_at: null
        })
        .eq('id', selectedVerification.id);
      
      if (error) throw error;
      
      // Log the rejection action
      await supabase
        .from('audit_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'UPDATE',
          resource: 'MERCHANT_VERIFICATION',
          resource_id: selectedVerification.id,
          description: `Rejected merchant verification for ${selectedVerification.business_name}`
        });
      
      toast({
        title: 'Verification Rejected',
        description: `Verification for ${selectedVerification.business_name} has been rejected.`,
      });
      
      refetch();
    } catch (error) {
      console.error('Error rejecting merchant:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject verification',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setRejectionDialogOpen(false);
    }
  };

  const columns: ColumnDef<MerchantVerification>[] = [
    {
      accessorKey: "business_name",
      header: "Business Name",
    },
    {
      accessorKey: "user_email",
      header: "User Email",
    },
    {
      accessorKey: "verification_type",
      header: "Verification Type",
      cell: ({ row }) => {
        const type = row.getValue("verification_type") as string;
        return (
          <Badge variant="outline">
            {type.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      accessorKey: "created_at",
      header: "Submitted On",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return format(new Date(date), 'MMM d, yyyy');
      }
    },
    {
      accessorKey: "is_verified",
      header: "Status",
      cell: ({ row }) => {
        const isVerified = row.getValue("is_verified") as boolean;
        const verifiedAt = row.original.verified_at;
        
        if (isVerified && verifiedAt) {
          return (
            <Badge className="bg-green-500">Verified</Badge>
          );
        } else if (verifiedAt === null) {
          return (
            <Badge variant="outline">Pending</Badge>
          );
        } else {
          return (
            <Badge variant="destructive">Rejected</Badge>
          );
        }
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const verification = row.original;
        const isPending = verification.verified_at === null;
        
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleViewDetails(verification)}
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            {isPending && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-green-500 hover:text-green-700 hover:bg-green-100"
                  onClick={() => handleApprove(verification)}
                  title="Approve"
                >
                  <Check className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => handleReject(verification)}
                  title="Reject"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Merchant Verifications</CardTitle>
          <CardDescription>
            Review and approve merchant account verifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={verifications || []} 
            loading={isLoading}
          />
        </CardContent>
      </Card>
      
      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>
              {selectedVerification?.business_name} - {selectedVerification?.verification_type}
            </DialogDescription>
          </DialogHeader>
          
          {verificationData ? (
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(verificationData).map(([key, value]) => (
                  <div key={key} className="border rounded p-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {key.replace(/_/g, ' ')}:
                    </div>
                    <div className="font-medium break-all">
                      {typeof value === 'string' && value.match(/^https?:\/\//i) ? (
                        <a 
                          href={value as string} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {value as string}
                        </a>
                      ) : (
                        String(value)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Merchant Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve verification for {selectedVerification?.business_name}?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={confirmApproval} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Approve'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Merchant Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject verification for {selectedVerification?.business_name}?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)} disabled={isProcessing}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRejection} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MerchantVerificationsPage;
