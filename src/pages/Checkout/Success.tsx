
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentStatusDisplay from "@/components/Checkout/PaymentStatus";
import { CartItemType } from "@/components/POS/Cart";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, Mail, QrCode, Download } from "lucide-react";
import ReceiptPreview from "@/components/POS/Receipt/ReceiptPreview";
import EmailReceiptDialog from "@/components/POS/Receipt/EmailReceiptDialog";
import { ReceiptData, generateReceiptQRCode } from "@/utils/receiptUtils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Success: React.FC = () => {
  const location = useLocation();
  const amount = location.state?.amount || 0;
  const cartItems = location.state?.cartItems || [];
  const transactionId = location.state?.transactionId || '';
  const customerEmail = location.state?.customerEmail || '';
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Create receipt data from the transaction info
  const receiptData: ReceiptData = {
    merchantName: "Your Business Name", // This would come from merchant settings in a real app
    merchantId: "merchant-123", // This would come from merchant settings
    transactionId: transactionId,
    date: new Date().toLocaleString(),
    items: cartItems,
    subtotal: amount,
    discountAmount: 0, // This would be calculated based on applied discounts
    total: amount,
    paymentMethod: "Card", // This would come from the payment method used
    // Optional fields can be added as needed
  };

  const handleShowQRCode = async () => {
    try {
      const url = await generateReceiptQRCode(receiptData);
      setQrCodeUrl(url);
      setShowQRCode(true);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <PaymentStatusDisplay 
        status="completed"
        amount={amount}
        cartItems={cartItems}
        transactionId={transactionId}
      />
      
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button 
          onClick={() => setShowReceipt(true)}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          View & Print Receipt
        </Button>
        
        <Button 
          onClick={() => setShowEmailDialog(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Email Receipt
        </Button>
        
        <Button
          onClick={handleShowQRCode}
          variant="outline"
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </div>
      
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <ReceiptPreview 
            receiptData={receiptData} 
            onClose={() => setShowReceipt(false)}
          />
        </DialogContent>
      </Dialog>
      
      <EmailReceiptDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        receiptData={receiptData}
        customerEmail={customerEmail}
      />
      
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-xs text-center">
          <h2 className="text-xl font-semibold mb-4">Digital Receipt</h2>
          {qrCodeUrl && (
            <div className="bg-white p-4 rounded-md mb-4">
              <div className="w-48 h-48 mx-auto border flex items-center justify-center">
                {/* In a real implementation, we'd render an actual QR code here */}
                <QrCode className="h-32 w-32 opacity-70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 break-all">
                {qrCodeUrl}
              </p>
            </div>
          )}
          <Button variant="outline" onClick={() => setShowQRCode(false)} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Success;
