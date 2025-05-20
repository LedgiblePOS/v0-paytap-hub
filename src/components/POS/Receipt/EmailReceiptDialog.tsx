
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ReceiptData, emailReceipt } from '@/utils/receiptUtils';
import { Mail, Loader2 } from 'lucide-react';

interface EmailReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  receiptData: ReceiptData;
  customerEmail?: string;
}

const EmailReceiptDialog: React.FC<EmailReceiptDialogProps> = ({
  open,
  onClose,
  receiptData,
  customerEmail = ''
}) => {
  const [email, setEmail] = useState(customerEmail);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      const success = await emailReceipt(receiptData, email);
      
      if (success) {
        toast({
          title: "Receipt Sent",
          description: `Receipt has been sent to ${email}`,
        });
        onClose();
      } else {
        throw new Error("Failed to send receipt");
      }
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "There was an error sending the receipt",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="email" className="mb-2 block">
            Send receipt to
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="customer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          
          <div className="text-sm text-muted-foreground">
            <p>A copy of the receipt will be sent to the email address above.</p>
            <p className="mt-2">Transaction ID: {receiptData.transactionId}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Receipt'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailReceiptDialog;
