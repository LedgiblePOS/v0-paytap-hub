
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Upload, FileX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MerchantVerification } from '@/types/merchant';
import { VerificationStatus } from '@/types/enums';

const MerchantVerificationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    taxId: '',
    registrationNumber: '',
    website: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [verifications, setVerifications] = useState<MerchantVerification[]>([]);
  
  useEffect(() => {
    if (user?.merchantId) {
      fetchVerificationStatus(user.merchantId);
    }
  }, [user]);
  
  const fetchVerificationStatus = async (merchantId: string) => {
    try {
      const { data, error } = await supabase
        .from('merchant_verifications')
        .select('*, merchant:merchants(id, business_name, user_id)')
        .eq('merchant_id', merchantId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Convert from snake_case to camelCase
        const formattedVerifications: MerchantVerification[] = data.map(item => ({
          id: item.id,
          merchantId: item.merchant_id,
          isVerified: item.is_verified,
          status: item.status,
          verificationType: item.verification_type,
          verificationData: item.verification_data,
          documentUrls: item.document_urls,
          rejectionReason: item.rejection_reason,
          verifiedAt: item.verified_at,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          merchant: item.merchant ? {
            id: item.merchant.id,
            business_name: item.merchant.business_name,
            user_id: item.merchant.user_id
          } : undefined
        }));
        
        setVerifications(formattedVerifications);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch verification status',
        variant: 'destructive',
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.merchantId) {
      toast({
        title: 'Error',
        description: 'You must be registered as a merchant to submit verification',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload documents if any
      const documentUrls: string[] = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.merchantId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('verification_documents')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          const { data: urlData } = await supabase.storage
            .from('verification_documents')
            .getPublicUrl(fileName);
          
          documentUrls.push(urlData.publicUrl);
        }
      }
      
      // Create verification request
      const verificationData = {
        merchant_id: user.merchantId,
        verification_type: 'business',
        status: VerificationStatus.PENDING,
        is_verified: false,
        verification_data: businessInfo,
        document_urls: documentUrls
      };
      
      const { error: insertError } = await supabase
        .from('merchant_verifications')
        .insert(verificationData);
      
      if (insertError) throw insertError;
      
      // Refresh verification status
      await fetchVerificationStatus(user.merchantId);
      
      toast({
        title: 'Success',
        description: 'Verification request submitted successfully',
      });
      
      // Reset form
      setBusinessInfo({
        businessName: '',
        businessType: '',
        taxId: '',
        registrationNumber: '',
        website: ''
      });
      setFiles([]);
      
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: 'Error',
        description: `Failed to submit verification: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isPending = verifications.some(v => v.status === VerificationStatus.PENDING);
  const isVerified = verifications.some(v => v.status === VerificationStatus.APPROVED);
  const isRejected = verifications.some(v => v.status === VerificationStatus.REJECTED);
  
  const getStatusMessage = () => {
    if (isVerified) {
      return (
        <Alert className="mb-4 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Verification Approved</AlertTitle>
          <AlertDescription>
            Your business has been verified. You now have full access to all platform features.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (isPending) {
      return (
        <Alert className="mb-4 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>Verification Pending</AlertTitle>
          <AlertDescription>
            Your verification request is currently being reviewed. This process typically takes 1-3 business days.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (isRejected) {
      const rejection = verifications.find(v => v.status === VerificationStatus.REJECTED);
      return (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            {rejection?.rejectionReason || 'Your verification request was not approved. Please review the requirements and submit again.'}
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };
  
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Business Verification</h1>
      
      {getStatusMessage()}
      
      {!isPending && !isVerified && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Business</CardTitle>
            <CardDescription>
              Complete the verification process to unlock full access to all features.
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business">Business Information</TabsTrigger>
              <TabsTrigger value="documents">Upload Documents</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="business">
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      name="businessName" 
                      value={businessInfo.businessName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input 
                      id="businessType" 
                      name="businessType" 
                      value={businessInfo.businessType} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input 
                      id="taxId" 
                      name="taxId" 
                      value={businessInfo.taxId} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Business Registration Number</Label>
                    <Input 
                      id="registrationNumber" 
                      name="registrationNumber" 
                      value={businessInfo.registrationNumber} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      value={businessInfo.website} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={() => setActiveTab('documents')}>
                    Continue to Document Upload
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="documents">
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="documents">Upload Business Documents</Label>
                    <p className="text-sm text-gray-500 mb-2">
                      Please upload business registration, tax documents, or ID verification. Accepted formats: PDF, JPG, PNG.
                    </p>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Drag & drop files here or click to browse</p>
                      <Input 
                        id="documents" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png" 
                        multiple 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('documents')?.click()}
                      >
                        Select Files
                      </Button>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                        <ul className="space-y-2">
                          {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                              <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                              >
                                <FileX className="h-4 w-4 text-red-500" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('business')}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting || files.length === 0}>
                    {isSubmitting ? 'Submitting...' : 'Submit Verification Request'}
                  </Button>
                </CardFooter>
              </TabsContent>
            </form>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default MerchantVerificationPage;
