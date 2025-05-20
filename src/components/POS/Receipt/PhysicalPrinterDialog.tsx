
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Printer, Loader2, RefreshCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { PrinterDevice, connectToPrinter, isWebUSBSupported, printReceipt } from '@/utils/printer';
import { formatReceiptContent, ReceiptData } from '@/utils/receiptUtils';

interface PhysicalPrinterDialogProps {
  open: boolean;
  onClose: () => void;
  receiptData: ReceiptData;
}

const PhysicalPrinterDialog: React.FC<PhysicalPrinterDialogProps> = ({
  open,
  onClose,
  receiptData
}) => {
  const [printer, setPrinter] = useState<PrinterDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  // Check if WebUSB is supported
  useEffect(() => {
    setIsSupported(isWebUSBSupported());
  }, []);

  // Connect to a printer
  const handleConnectPrinter = async () => {
    if (!isSupported) return;
    
    try {
      setIsConnecting(true);
      const selectedPrinter = await connectToPrinter();
      
      if (selectedPrinter) {
        setPrinter(selectedPrinter);
        toast({
          title: "Printer Connected",
          description: `Connected to ${selectedPrinter.productName}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "No printer was selected",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting to printer:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the printer",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Print receipt
  const handlePrint = async () => {
    if (!printer) return;
    
    try {
      setIsPrinting(true);
      const receiptText = formatReceiptContent(receiptData);
      const success = await printReceipt(printer, receiptText);
      
      if (success) {
        toast({
          title: "Print Successful",
          description: "Receipt has been sent to the printer",
        });
        onClose();
      } else {
        throw new Error("Printing failed");
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast({
        title: "Print Error",
        description: "Failed to print the receipt",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Receipt Printer
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!isSupported ? (
            <div className="text-center p-4 border border-amber-200 bg-amber-50 rounded-md">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="font-medium text-amber-800">Browser Not Supported</p>
              <p className="text-sm text-amber-700 mt-1">
                WebUSB is not supported in this browser. Please use Chrome or Edge.
              </p>
            </div>
          ) : !printer ? (
            <div className="text-center p-6">
              <p className="mb-4 text-muted-foreground">
                Connect to a receipt printer to continue
              </p>
              <Button
                onClick={handleConnectPrinter}
                disabled={isConnecting}
                className="mx-auto"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Printer className="mr-2 h-4 w-4" />
                    Connect Printer
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-md bg-muted/30">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">{printer.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {printer.manufacturerName || "Unknown manufacturer"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={handleConnectPrinter}
                  disabled={isConnecting}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Ready to print receipt for transaction {receiptData.transactionId}.</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPrinting}>
            Cancel
          </Button>
          <Button
            onClick={handlePrint}
            disabled={!printer || isPrinting || isConnecting}
          >
            {isPrinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Printing...
              </>
            ) : (
              'Print Receipt'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhysicalPrinterDialog;
