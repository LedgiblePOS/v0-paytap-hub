
import { supabase } from "@/integrations/supabase/client";

export type CBDCPaymentOptions = {
  amount: number;
  currency: string;
  merchantId: string;
  description?: string;
  metadata?: Record<string, any>;
};

export type CBDCPaymentResult = {
  success: boolean;
  transactionId?: string;
  error?: string;
  status: "completed" | "failed" | "cancelled" | "pending";
};

export type CBDCCredentials = {
  username: string;
  password: string;
  apiUrl?: string;
};

class CBDCService {
  private static instance: CBDCService;
  private merchantId: string | null = null;
  private deviceId: string | null = null;
  private paymentListeners: ((result: CBDCPaymentResult) => void)[] = [];

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): CBDCService {
    if (!CBDCService.instance) {
      CBDCService.instance = new CBDCService();
    }
    return CBDCService.instance;
  }

  public static initialize(deviceId: string): void {
    const service = CBDCService.getInstance();
    service.deviceId = deviceId;
  }

  public setMerchantId(merchantId: string): void {
    this.merchantId = merchantId;
    console.log("CBDC Service: Merchant ID set to", merchantId);
  }

  public setCredentials(credentials: CBDCCredentials): void {
    console.log("CBDC Service: credentials updated for", this.merchantId);
    // We don't need to store credentials locally since they're stored in Supabase
    // Just log that we received them
  }

  public addPaymentListener(listener: (result: CBDCPaymentResult) => void): () => void {
    this.paymentListeners.push(listener);
    return () => this.removePaymentListener(listener);
  }

  public removePaymentListener(listener: (result: CBDCPaymentResult) => void): void {
    const index = this.paymentListeners.indexOf(listener);
    if (index !== -1) {
      this.paymentListeners.splice(index, 1);
    }
  }

  private notifyListeners(result: CBDCPaymentResult): void {
    this.paymentListeners.forEach(listener => listener(result));
  }

  public async initiatePayment(options: CBDCPaymentOptions): Promise<CBDCPaymentResult> {
    console.log("Initiating CBDC payment with options:", options);
    
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('cbdc-proxy', {
        body: {
          merchantId: this.merchantId,
          endpoint: 'payments/initiate',
          data: {
            amount: options.amount,
            currency: options.currency || "USD",
            description: options.description || "CBDC transaction",
            metadata: options.metadata || {},
            deviceId: this.deviceId
          }
        }
      });
      
      if (error) throw error;
      
      const result: CBDCPaymentResult = {
        success: data.success,
        transactionId: data.transactionId || `cbdc-${Date.now()}`,
        status: data.success ? "completed" : "failed",
        error: data.error
      };
      
      this.notifyListeners(result);
      return result;
    } catch (error) {
      console.error("Error initiating CBDC payment:", error);
      
      const result: CBDCPaymentResult = {
        success: false,
        error: error.message || "An unexpected error occurred",
        status: "failed"
      };
      
      this.notifyListeners(result);
      return result;
    }
  }

  public async getTransactionStatus(transactionId: string): Promise<CBDCPaymentResult> {
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('cbdc-proxy', {
        body: {
          merchantId: this.merchantId,
          endpoint: 'payments/status',
          data: {
            transactionId
          }
        }
      });
      
      if (error) throw error;
      
      return {
        success: data.success,
        transactionId,
        status: data.status || "failed",
        error: data.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to get transaction status",
        status: "failed"
      };
    }
  }

  public async cancelPayment(transactionId: string): Promise<CBDCPaymentResult> {
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('cbdc-proxy', {
        body: {
          merchantId: this.merchantId,
          endpoint: 'payments/cancel',
          data: {
            transactionId
          }
        }
      });
      
      if (error) throw error;
      
      return {
        success: true,
        transactionId,
        status: "cancelled",
        error: data.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to cancel payment",
        status: "failed"
      };
    }
  }
}

export default CBDCService.getInstance();
