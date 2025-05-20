
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItemType } from "@/components/POS/Cart";
import { FasstapService } from "@/services/fasstapService";
import settingsManager from "@/services/checkout/settingsManager";
import credentialsManager from "@/services/checkout/credentialsManager";
import { MerchantApiCredentials } from "@/services/checkout/types";
import { useNavigate } from "react-router-dom";

export type PaymentStatus = "idle" | "connecting" | "waiting" | "processing" | "success" | "failed" | "cancelled";

interface UseTapToPayProps {
  amount: number;
  merchantId: string;
  cartItems: CartItemType[];
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function useTapToPay({ amount, merchantId, cartItems, onSuccess, onCancel }: UseTapToPayProps) {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [credentials, setCredentials] = useState<MerchantApiCredentials | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load merchant credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const creds = await credentialsManager.loadCredentials(merchantId);
        setCredentials(creds);
        
        // Also load settings
        await settingsManager.loadSettings(merchantId);
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading credentials:", error);
        setErrorMessage("Failed to load payment credentials");
        setStatus("failed");
      }
    };
    
    loadCredentials();
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [merchantId]);

  const startPayment = async () => {
    if (status !== "idle") return;
    
    setStatus("connecting");
    setErrorMessage("");
    
    try {
      // Check if we have credentials
      if (!credentials) {
        throw new Error("Payment credentials not configured");
      }
      
      // Initialize the payment service
      const useBridge = settingsManager.isBridgeEnabled();
      
      // Connect to the payment terminal
      const connected = await FasstapService.connect();
      if (!connected) {
        throw new Error("Could not connect to payment terminal");
      }
      
      setStatus("waiting");
      
      // Start the payment process
      const result = await FasstapService.processPayment({
        amount: Number(amount),
        useBridge,
        timeout: 60000, // 1 minute timeout
      });
      
      if (result.success) {
        setStatus("processing");
        
        // Save the transaction to the database
        const { data: transaction, error: transactionError } = await supabase
          .from('transactions')
          .insert({
            merchant_id: merchantId,
            amount: amount,
            status: "COMPLETED",
            payment_method: "TAP_TO_PAY",
            reference: result.transactionId
          })
          .select()
          .single();
        
        if (transactionError) {
          throw new Error("Failed to save transaction");
        }
        
        // Save transaction items
        const transactionItems = cartItems.map(item => ({
          transaction_id: transaction.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }));
        
        const { error: itemsError } = await supabase
          .from('transaction_items')
          .insert(transactionItems);
        
        if (itemsError) {
          console.error("Error saving transaction items:", itemsError);
          // Don't fail the transaction if items fail to save
        }
        
        // Update product inventory
        for (const item of cartItems) {
          // First get the current inventory
          const { data: productData, error: fetchError } = await supabase
            .from('products')
            .select('in_stock')
            .eq('id', item.id)
            .single();
            
          if (fetchError) {
            console.error("Error fetching product inventory:", fetchError);
            continue;
          }
          
          // Then update with the new inventory value
          const currentStock = productData?.in_stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          const { error: inventoryError } = await supabase
            .from('products')
            .update({ in_stock: newStock })
            .eq('id', item.id);
          
          if (inventoryError) {
            console.error("Error updating inventory:", inventoryError);
          }
        }
        
        setStatus("success");
        
        // Notify parent of success
        onSuccess(transaction.id);
        
        // Auto-redirect after success
        timeoutRef.current = setTimeout(() => {
          navigate("/transactions");
        }, 3000);
      } else {
        setErrorMessage(result.error || "Payment failed");
        setStatus("failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      setStatus("failed");
      
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (status === "waiting" || status === "connecting") {
      FasstapService.cancelPayment();
    }
    setStatus("cancelled");
    onCancel();
  };

  return {
    status,
    errorMessage,
    isInitialized,
    startPayment,
    handleCancel
  };
}
