
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDetails, BillingAddress, processSubscriptionUpgrade } from '@/services/payment/firstAtlanticCommerce';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Loader2 } from 'lucide-react';
import { SubscriptionPlanModel } from '@/types';

interface SubscriptionPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlanModel;
  merchantId: string;
}

const SubscriptionPaymentDialog: React.FC<SubscriptionPaymentDialogProps> = ({
  isOpen,
  onClose,
  plan,
  merchantId,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card details state
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
    cardHolderName: '',
  });
  
  // Billing address state (pre-filled with user info if available)
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'US',
    email: user?.email || '',
    phone: '',
  });
  
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const result = await processSubscriptionUpgrade(
        merchantId,
        plan.id,
        {
          amount: plan.monthlyPrice,
          currency: 'USD',
          merchantReference: `SUB-${Date.now()}`,
          card: cardDetails,
          billingAddress,
        }
      );
      
      if (result.success) {
        toast({
          title: 'Subscription updated',
          description: `Successfully upgraded to ${plan.name} plan.`,
        });
        onClose();
        // Reload to show the new subscription
        window.location.reload();
      } else {
        toast({
          title: 'Payment failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upgrade to {plan.name}</DialogTitle>
          <DialogDescription>
            Enter your payment details to subscribe to the {plan.name} plan for ${plan.monthlyPrice}/month.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Card Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardHolderName">Cardholder Name</Label>
                  <Input
                    id="cardHolderName"
                    name="cardHolderName"
                    value={cardDetails.cardHolderName}
                    onChange={handleCardInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    required
                    maxLength={16}
                    pattern="\d{15,16}"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="cardExpiryMonth">Expiry Month</Label>
                    <Input
                      id="cardExpiryMonth"
                      name="cardExpiryMonth"
                      value={cardDetails.cardExpiryMonth}
                      onChange={handleCardInputChange}
                      required
                      maxLength={2}
                      pattern="\d{1,2}"
                      placeholder="MM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardExpiryYear">Expiry Year</Label>
                    <Input
                      id="cardExpiryYear"
                      name="cardExpiryYear"
                      value={cardDetails.cardExpiryYear}
                      onChange={handleCardInputChange}
                      required
                      maxLength={2}
                      pattern="\d{2}"
                      placeholder="YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCVV">CVV</Label>
                    <Input
                      id="cardCVV"
                      name="cardCVV"
                      value={cardDetails.cardCVV}
                      onChange={handleCardInputChange}
                      required
                      maxLength={4}
                      pattern="\d{3,4}"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Billing Address</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={billingAddress.firstName}
                      onChange={handleBillingInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={billingAddress.lastName}
                      onChange={handleBillingInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input
                    id="address1"
                    name="address1"
                    value={billingAddress.address1}
                    onChange={handleBillingInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    name="address2"
                    value={billingAddress.address2}
                    onChange={handleBillingInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={billingAddress.city}
                      onChange={handleBillingInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={billingAddress.state}
                      onChange={handleBillingInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={billingAddress.postalCode}
                      onChange={handleBillingInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={billingAddress.phone}
                      onChange={handleBillingInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay ${plan.monthlyPrice}/month
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPaymentDialog;
