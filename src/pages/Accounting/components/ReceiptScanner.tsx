
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { processReceiptImage } from '@/services/accounting/expenseService';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, FileImage, RefreshCw } from 'lucide-react';

interface ReceiptScannerProps {
  merchantId: string | undefined;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ merchantId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset extracted data
      setExtractedData(null);
    }
  };

  const handleScanClick = async () => {
    if (!selectedFile) {
      toast({
        title: "No Receipt Selected",
        description: "Please select a receipt image to scan",
        variant: "destructive"
      });
      return;
    }

    if (!merchantId) {
      toast({
        title: "Error",
        description: "Merchant ID is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        // Process receipt with AI
        const data = await processReceiptImage(base64String);
        setExtractedData(data);
        
        toast({
          title: "Receipt Processed",
          description: "Receipt data has been successfully extracted",
        });
        
        setIsProcessing(false);
      };
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error Processing Receipt",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Receipt Scanner</CardTitle>
          <CardDescription>
            Upload your receipt to extract expense information automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="receipt">Upload Receipt</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
            
            {previewUrl && (
              <div className="border rounded-md p-2 mt-4">
                <img 
                  src={previewUrl} 
                  alt="Receipt preview" 
                  className="w-full max-h-96 object-contain" 
                />
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleScanClick} 
                disabled={!selectedFile || isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Scan Receipt
                  </>
                )}
              </Button>
              {selectedFile && (
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Extracted Data</CardTitle>
          <CardDescription>
            Automatically extracted information from your receipt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {extractedData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{extractedData.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{extractedData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${extractedData.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Amount</p>
                  <p className="font-medium">${extractedData.taxAmount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                        <th className="p-2 text-right text-xs font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.items.map((item: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td className="p-2 text-sm">{item.description}</td>
                          <td className="p-2 text-right text-sm">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                Create Expense from Receipt
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileImage className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Upload and scan a receipt to extract data
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptScanner;
