
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download, Mail, QrCode, SmartphoneNfc } from 'lucide-react';
import { ReceiptData, printReceipt, formatReceiptContent, generateReceiptQRCode } from '@/utils/receiptUtils';
import EmailReceiptDialog from './EmailReceiptDialog';
import PhysicalPrinterDialog from './PhysicalPrinterDialog';

interface ReceiptPreviewProps {
  receiptData: ReceiptData;
  onClose?: () => void;
  customerEmail?: string;
}

/**
 * Component to display and print a formatted receipt
 */
const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ 
  receiptData,
  onClose,
  customerEmail = ''
}) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPrinterDialog, setShowPrinterDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  // Handle print action
  const handlePrint = () => {
    printReceipt(receiptData);
  };
  
  // Handle QR code generation
  const handleGenerateQR = async () => {
    try {
      const url = await generateReceiptQRCode(receiptData);
      setQrCodeUrl(url);
      setShowQRCode(true);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };
  
  // Format receipt for display
  const receiptContent = formatReceiptContent(receiptData);
  const receiptLines = receiptContent.split('\n');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-center">Receipt</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
          <div className="receipt-content">
            {receiptLines.map((line, index) => (
              <div 
                key={index} 
                className={`receipt-line ${line.startsWith("--") ? "border-t border-dashed border-gray-300 my-1" : ""}`}
              >
                {line === "" ? <br /> : line}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePrint} size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowEmailDialog(true)}
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowPrinterDialog(true)}
          >
            <SmartphoneNfc className="h-4 w-4" />
            Receipt Printer
          </Button>
        </div>
        
        {onClose && (
          <Button variant="ghost" onClick={onClose} size="sm">
            Close
          </Button>
        )}
      </CardFooter>
      
      <EmailReceiptDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        receiptData={receiptData}
        customerEmail={customerEmail}
      />
      
      <PhysicalPrinterDialog
        open={showPrinterDialog}
        onClose={() => setShowPrinterDialog(false)}
        receiptData={receiptData}
      />
    </Card>
  );
};

export default ReceiptPreview;
