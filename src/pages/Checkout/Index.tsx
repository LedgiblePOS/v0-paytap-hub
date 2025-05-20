
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TapToPay from "@/components/Checkout/TapToPay";
import { CheckoutSummary } from "@/components/Checkout/CheckoutSummary";
import { FasstapService } from "@/services/fasstapService";
import FasstapBridge from "@/bridges/FasstapBridge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 0, cartItems = [] } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [merchantId, setMerchantId] = useState("merchant-1");
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 200);

    // Fixed to use FasstapService.getInstance() correctly
    FasstapService.getInstance().setRedirectUrls("/payment-success", "/payment-cancelled");
    
    // Initialize Fasstap Bridge
    const bridge = new FasstapBridge({
      merchantId: merchantId,
      environmentMode: "sandbox"
    });
    
    bridge.initialize();

    // Load merchant ID if user is logged in
    const loadMerchantId = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('merchants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setMerchantId(data.id);
            
            // Update the merchant ID in the bridge
            const updatedBridge = new FasstapBridge({
              merchantId: data.id,
              environmentMode: "sandbox"
            });
            
            updatedBridge.initialize();
          }
        } catch (error) {
          console.error("Error loading merchant ID:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadMerchantId();

    return () => clearInterval(timer);
  }, [user, merchantId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <Progress value={progress} className="w-full max-w-md mb-4" />
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-ledgible-blue" />
          <p className="text-ledgible-blue">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!amount || amount <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-ledgible-gray p-6">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4">No Payment Amount</h2>
          <p className="text-gray-600 mb-6">There's no payment amount specified for checkout.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ledgible-gray p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-center flex-grow">Checkout</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {/* Show order summary if cart items exist */}
        {cartItems.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300">
            <CheckoutSummary 
              cartItems={cartItems} 
              amount={amount}
            />
          </div>
        )}
        
        <TapToPay 
          amount={amount} 
          merchantId={merchantId}
          cartItems={cartItems} // Add the missing cartItems prop
          onSuccess={(transactionId) => {
            navigate('/payment-success', { 
              state: { transactionId, amount, cartItems } 
            });
          }}
          onCancel={() => {
            navigate('/payment-cancelled');
          }}
        />
      </div>
    </div>
  );
};

export default Checkout;
