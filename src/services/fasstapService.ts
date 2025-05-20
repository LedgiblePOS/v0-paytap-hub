
import { supabase } from "@/integrations/supabase/client";

export type FasstapPaymentOptions = {
  amount: number;
  currency: string;
  merchantId: string;
  description?: string;
  metadata?: Record<string, any>;
};

export type FasstapPaymentResult = {
  success: boolean;
  transactionId?: string;
  error?: string;
  status: "completed" | "failed" | "cancelled" | "pending";
};

export type FasstapCredentials = {
  username: string;
  password: string;
  apiUrl?: string;
};

type WalletType = 'apple_pay' | 'google_pay' | 'other';

export class FasstapService {
  private static instance: FasstapService;
  private successRedirectUrl: string = "/payment-success";
  private cancelRedirectUrl: string = "/payment-cancelled";
  private paymentListeners: ((result: FasstapPaymentResult) => void)[] = [];
  private pendingTransactions: Map<string, { resolve: (result: FasstapPaymentResult) => void, reject: (error: any) => void }> = new Map();
  private merchantId: string | null = null;
  private connectedDeviceId: string | null = null;
  private apiFeatures: { applePayEnabled: boolean, googlePayEnabled: boolean } = {
    applePayEnabled: false,
    googlePayEnabled: false
  };

  private constructor() {
    // Private constructor for singleton pattern
    this.setupDeviceMonitoring();
  }

  public static getInstance(): FasstapService {
    if (!FasstapService.instance) {
      FasstapService.instance = new FasstapService();
    }
    return FasstapService.instance;
  }

  public setMerchantId(merchantId: string): void {
    this.merchantId = merchantId;
    // Load merchant features after setting ID
    this.loadMerchantFeatures();
  }

  private async loadMerchantFeatures(): Promise<void> {
    if (!this.merchantId) return;
    
    try {
      // Load merchant settings to determine payment capabilities
      const { data: credentials } = await supabase
        .from('merchant_api_credentials')
        .select('apple_pay_enabled, google_pay_enabled')
        .eq('merchant_id', this.merchantId)
        .maybeSingle();
        
      if (credentials) {
        this.apiFeatures = {
          applePayEnabled: credentials.apple_pay_enabled || false,
          googlePayEnabled: credentials.google_pay_enabled || false
        };
        console.log("Merchant features loaded:", this.apiFeatures);
      }
    } catch (error) {
      console.error("Error loading merchant features:", error);
    }
  }

  public setRedirectUrls(successUrl: string, cancelUrl: string): void {
    this.successRedirectUrl = successUrl;
    this.cancelRedirectUrl = cancelUrl;
  }

  public addPaymentListener(listener: (result: FasstapPaymentResult) => void): () => void {
    this.paymentListeners.push(listener);
    return () => this.removePaymentListener(listener);
  }

  public removePaymentListener(listener: (result: FasstapPaymentResult) => void): void {
    const index = this.paymentListeners.indexOf(listener);
    if (index !== -1) {
      this.paymentListeners.splice(index, 1);
    }
  }

  private notifyListeners(result: FasstapPaymentResult): void {
    this.paymentListeners.forEach(listener => listener(result));
  }

  private setupDeviceMonitoring(): void {
    // Setup periodic checks for connected devices
    setInterval(() => this.checkConnectedDevices(), 30000); // Every 30 seconds
  }

  private async checkConnectedDevices(): Promise<void> {
    if (!this.merchantId) return;
    
    try {
      // Check for active devices registered for this merchant
      const { data: wallets } = await supabase
        .from('merchant_wallets')
        .select('device_id, status, last_ping')
        .eq('merchant_id', this.merchantId)
        .eq('status', 'active')
        .order('last_ping', { ascending: false })
        .limit(1);
        
      if (wallets && wallets.length > 0) {
        const latestDevice = wallets[0];
        const lastPing = new Date(latestDevice.last_ping);
        const now = new Date();
        const minutesSinceLastPing = (now.getTime() - lastPing.getTime()) / (1000 * 60);
        
        // Consider device connected if pinged in last 5 minutes
        if (minutesSinceLastPing < 5) {
          this.connectedDeviceId = latestDevice.device_id;
          console.log("Connected to device:", this.connectedDeviceId);
        } else {
          this.connectedDeviceId = null;
        }
      } else {
        this.connectedDeviceId = null;
      }
    } catch (error) {
      console.error("Error checking connected devices:", error);
      this.connectedDeviceId = null;
    }
  }

  public isDeviceConnected(): boolean {
    return this.connectedDeviceId !== null;
  }

  public async registerWallet(walletType: WalletType, walletId: string): Promise<boolean> {
    if (!this.merchantId) {
      throw new Error("Merchant ID not set");
    }
    
    try {
      const deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      const { data, error } = await supabase.functions.invoke('wallet-connection', {
        body: {
          action: 'register',
          merchantId: this.merchantId,
          walletType,
          walletId,
          deviceId
        }
      });
      
      if (error) throw error;
      
      this.connectedDeviceId = deviceId;
      return data.success;
    } catch (error) {
      console.error("Error registering wallet:", error);
      return false;
    }
  }

  public static async connect(): Promise<boolean> {
    console.log("Connecting to Fasstap payment terminal...");
    
    const service = FasstapService.getInstance();
    if (!service.merchantId) {
      console.error("Merchant ID not set");
      return false;
    }
    
    try {
      await service.checkConnectedDevices();
      return service.isDeviceConnected();
    } catch (error) {
      console.error("Error connecting to payment terminal:", error);
      return false;
    }
  }

  public static async processPayment(options: {
    amount: number;
    useBridge?: boolean;
    timeout?: number;
    metadata?: Record<string, any>;
  }): Promise<FasstapPaymentResult> {
    console.log("Processing payment with Fasstap:", options);
    
    const service = FasstapService.getInstance();
    if (!service.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('fasstap-proxy', {
        body: {
          merchantId: service.merchantId,
          endpoint: 'payments',
          data: {
            amount: options.amount,
            currency: "USD",
            description: "Payment processing",
            metadata: options.metadata || {},
            deviceId: service.connectedDeviceId
          }
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        return {
          success: false,
          error: data.error || "Payment processing failed",
          status: "failed"
        };
      }
      
      return {
        success: true,
        transactionId: data.transactionId || `fasstap-${Date.now()}`,
        status: "completed"
      };
    } catch (error) {
      console.error("Error processing payment:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
        status: "failed"
      };
    }
  }

  public static async cancelPayment(transactionId?: string): Promise<void> {
    console.log("Cancelling Fasstap payment:", transactionId || "current transaction");
    
    const service = FasstapService.getInstance();
    if (!service.merchantId || !transactionId) return;
    
    try {
      await supabase.functions.invoke('fasstap-proxy', {
        body: {
          merchantId: service.merchantId,
          endpoint: 'payments/cancel',
          data: {
            transactionId
          }
        }
      });
    } catch (error) {
      console.error("Error cancelling payment:", error);
    }
  }

  public async initiatePayment(options: FasstapPaymentOptions): Promise<FasstapPaymentResult> {
    console.log("Initiating Fasstap payment with options:", options);
    
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      // Create a transaction reference ID
      const transactionRef = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Create a pending transaction promise that will be resolved when payment is completed
      const transactionPromise = new Promise<FasstapPaymentResult>((resolve, reject) => {
        this.pendingTransactions.set(transactionRef, { resolve, reject });
        
        // Set timeout to prevent waiting indefinitely
        setTimeout(() => {
          const transaction = this.pendingTransactions.get(transactionRef);
          if (transaction) {
            this.pendingTransactions.delete(transactionRef);
            reject(new Error("Payment timeout"));
          }
        }, 60000); // 1 minute timeout
      });
      
      // Initiate the payment through the Edge Function
      const { data, error } = await supabase.functions.invoke('fasstap-proxy', {
        body: {
          merchantId: this.merchantId,
          endpoint: 'payments/initiate',
          data: {
            amount: options.amount,
            currency: options.currency || "USD",
            description: options.description || "Tap-to-pay transaction",
            metadata: {
              ...options.metadata || {},
              transactionRef
            },
            deviceId: this.connectedDeviceId
          }
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        const result: FasstapPaymentResult = {
          success: false,
          error: data.error || "Payment initiation failed",
          status: "failed"
        };
        
        this.notifyListeners(result);
        return result;
      }
      
      // Return a pending result
      const pendingResult: FasstapPaymentResult = {
        success: true,
        transactionId: data.transactionId,
        status: "pending"
      };
      
      this.notifyListeners(pendingResult);
      
      // Wait for the transaction to complete
      return await transactionPromise;
    } catch (error) {
      const failedResult: FasstapPaymentResult = {
        success: false,
        error: error.message || "An unexpected error occurred",
        status: "failed"
      };
      
      this.notifyListeners(failedResult);
      return failedResult;
    }
  }

  // Support for Apple Pay
  public isApplePayAvailable(): boolean {
    return this.apiFeatures.applePayEnabled && 
      typeof window !== 'undefined' && 
      window.ApplePaySession && 
      ApplePaySession.canMakePayments();
  }

  // Support for Google Pay
  public isGooglePayAvailable(): boolean {
    return this.apiFeatures.googlePayEnabled && 
      typeof window !== 'undefined' && 
      !!(window as any).google?.payments?.api;
  }

  public async processApplePayPayment(paymentData: any): Promise<FasstapPaymentResult> {
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('fasstap-proxy', {
        body: {
          merchantId: this.merchantId,
          endpoint: 'payments/apple-pay',
          data: paymentData
        }
      });
      
      if (error) throw error;
      
      return {
        success: data.success,
        transactionId: data.transactionId,
        status: data.success ? "completed" : "failed",
        error: data.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Apple Pay processing failed",
        status: "failed"
      };
    }
  }

  public async processGooglePayPayment(paymentData: any): Promise<FasstapPaymentResult> {
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('fasstap-proxy', {
        body: {
          merchantId: this.merchantId,
          endpoint: 'payments/google-pay',
          data: paymentData
        }
      });
      
      if (error) throw error;
      
      return {
        success: data.success,
        transactionId: data.transactionId,
        status: data.success ? "completed" : "failed",
        error: data.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Google Pay processing failed",
        status: "failed"
      };
    }
  }

  public async getTransactionStatus(transactionId: string): Promise<FasstapPaymentResult> {
    if (!this.merchantId) {
      return {
        success: false,
        error: "Merchant ID not set",
        status: "failed"
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('fasstap-proxy', {
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

  public async cancelPayment(transactionId: string): Promise<FasstapPaymentResult> {
    return FasstapService.cancelPayment(transactionId) as any;
  }
  
  public async startPayment(merchantId: string, amount: number): Promise<FasstapPaymentResult> {
    this.setMerchantId(merchantId);
    return this.initiatePayment({
      amount,
      currency: "USD",
      merchantId,
      description: "Tap-to-pay transaction"
    });
  }
  
  public async cancelTransaction(transactionId: string): Promise<FasstapPaymentResult> {
    return this.cancelPayment(transactionId);
  }
}

export default FasstapService.getInstance();
