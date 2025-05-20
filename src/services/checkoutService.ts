import { FasstapService, FasstapPaymentOptions, FasstapPaymentResult } from "./fasstapService";
import { CartItemType } from "@/components/POS/Cart";
import FasstapBridge from "@/bridges/FasstapBridge";
import CBDCService, { CBDCPaymentResult } from "./cbdcService";
import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = "CARD" | "CASH" | "TAP_TO_PAY" | "CBDC";

export interface CheckoutOptions {
  amount: number;
  paymentMethod: PaymentMethod;
  merchantId: string;
  cartItems?: CartItemType[];
  metadata?: Record<string, any>;
}

export interface MerchantApiCredentials {
  id?: string;
  merchant_id: string;
  fasstap_username?: string;
  fasstap_password?: string;
  fasstap_api_url?: string;
  cbdc_username?: string;
  cbdc_password?: string;
  cbdc_api_url?: string;
  use_fasstap_bridge?: boolean;
  use_cbdc?: boolean;
}

export class CheckoutService {
  private static instance: CheckoutService;
  private useBridge: boolean = false;  // Flag to determine whether to use bridge or legacy service
  private useCBDC: boolean = false;    // Flag to determine whether to use CBDC
  private merchantId: string = "merchant-1";
  private credentials: MerchantApiCredentials | null = null;
  
  private constructor() {
    // Initialize the bridge but don't enable it by default
    const bridge = new FasstapBridge({
      merchantId: this.merchantId,
      environmentMode: "sandbox"
    });
    
    bridge.initialize();

    // Initialize CBDC service but don't enable it by default
    CBDCService.initialize("device-1");

    // For now, we'll check for the presence of a special localStorage flag to enable the bridge
    // In a real implementation, we might detect capabilities or use a configuration setting
    this.useBridge = localStorage.getItem("USE_FASSTAP_BRIDGE") === "true";
    this.useCBDC = localStorage.getItem("USE_CBDC") === "true";
    
    // Load merchant credentials asynchronously
    this.loadMerchantCredentials();
  }
  
  private async loadMerchantCredentials() {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Get merchant ID for the current user
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      
      if (merchantError || !merchant) {
        console.error("Error loading merchant:", merchantError);
        return;
      }
      
      // Get merchant API credentials
      const { data: credentials, error: credentialsError } = await supabase
        .from('merchant_api_credentials')
        .select('*')
        .eq('merchant_id', merchant.id)
        .maybeSingle();
      
      if (credentialsError) {
        console.error("Error loading merchant credentials:", credentialsError);
        return;
      }
      
      if (credentials) {
        this.credentials = credentials;
        this.useBridge = credentials.use_fasstap_bridge || false;
        this.useCBDC = credentials.use_cbdc || false;
        
        // Update the bridge and CBDC service with merchant-specific credentials
        if (credentials.fasstap_username && credentials.fasstap_password) {
          FasstapService.getInstance().setCredentials({
            username: credentials.fasstap_username,
            password: credentials.fasstap_password,
            apiUrl: credentials.fasstap_api_url
          });
        }
        
        if (credentials.cbdc_username && credentials.cbdc_password) {
          CBDCService.setCredentials({
            username: credentials.cbdc_username,
            password: credentials.cbdc_password,
            apiUrl: credentials.cbdc_api_url
          });
        }
        
        // Update localStorage to match database settings
        localStorage.setItem("USE_FASSTAP_BRIDGE", this.useBridge ? "true" : "false");
        localStorage.setItem("USE_CBDC", this.useCBDC ? "true" : "false");
      }
    } catch (error) {
      console.error("Error in loadMerchantCredentials:", error);
    }
  }
  
  public static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService();
    }
    return CheckoutService.instance;
  }

  /**
   * Set the merchant ID and reload credentials
   */
  public setMerchantId(merchantId: string): void {
    this.merchantId = merchantId;
    this.loadMerchantCredentials();
  }

  /**
   * Toggle the use of the Fasstap Bridge implementation
   * Changed from static to instance method
   */
  public toggleBridgeMode(enable: boolean): void {
    this.useBridge = enable;
    localStorage.setItem("USE_FASSTAP_BRIDGE", enable ? "true" : "false");
    
    // Update database if we have merchant credentials
    this.saveSettings();
  }

  /**
   * Toggle the use of CBDC
   * Changed from static to instance method
   */
  public toggleCBDCMode(enable: boolean): void {
    this.useCBDC = enable;
    localStorage.setItem("USE_CBDC", enable ? "true" : "false");
    
    // Update database if we have merchant credentials
    this.saveSettings();
  }

  /**
   * Check if CBDC mode is enabled
   */
  public isCBDCEnabled(): boolean {
    return this.useCBDC;
  }
  
  /**
   * Save current settings to database if we have merchant credentials
   */
  private async saveSettings() {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Get merchant ID for the current user
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      
      if (merchantError || !merchant) {
        console.error("Error loading merchant:", merchantError);
        return;
      }
      
      // Update or insert merchant API credentials
      const updatedCredentials = {
        ...this.credentials,
        merchant_id: merchant.id,
        use_fasstap_bridge: this.useBridge,
        use_cbdc: this.useCBDC
      };
      
      if (this.credentials?.id) {
        // Update existing record
        const { error } = await supabase
          .from('merchant_api_credentials')
          .update({
            use_fasstap_bridge: this.useBridge,
            use_cbdc: this.useCBDC
          })
          .eq('id', this.credentials.id);
          
        if (error) console.error("Error updating settings:", error);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('merchant_api_credentials')
          .insert({
            merchant_id: merchant.id,
            use_fasstap_bridge: this.useBridge,
            use_cbdc: this.useCBDC
          });
          
        if (error) console.error("Error inserting settings:", error);
      }
    } catch (error) {
      console.error("Error in saveSettings:", error);
    }
  }

  /**
   * Save API credentials to database
   */
  public async saveApiCredentials(credentials: {
    fasstapUsername?: string;
    fasstapPassword?: string;
    fasstapApiUrl?: string;
    cbdcUsername?: string;
    cbdcPassword?: string;
    cbdcApiUrl?: string;
    merchantId?: string;
  }): Promise<boolean> {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      
      // Get merchant ID for the current user
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      
      if (merchantError || !merchant) {
        console.error("Error loading merchant:", merchantError);
        return false;
      }
      
      // Check if credentials exist
      const { data: existingCredentials, error: checkError } = await supabase
        .from('merchant_api_credentials')
        .select('id')
        .eq('merchant_id', merchant.id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking credentials:", checkError);
        return false;
      }
      
      // Set credentials for the services
      if (credentials.fasstapUsername && credentials.fasstapPassword) {
        FasstapService.getInstance().setCredentials({
          username: credentials.fasstapUsername,
          password: credentials.fasstapPassword,
          apiUrl: credentials.fasstapApiUrl
        });
      }
      
      if (credentials.cbdcUsername && credentials.cbdcPassword) {
        CBDCService.setCredentials({
          username: credentials.cbdcUsername,
          password: credentials.cbdcPassword,
          apiUrl: credentials.cbdcApiUrl
        });
      }
      
      // Update merchant ID if provided
      if (credentials.merchantId) {
        this.merchantId = credentials.merchantId;
        const bridge = new FasstapBridge({
          merchantId: credentials.merchantId,
          environmentMode: "sandbox"
        });
        
        bridge.initialize();
      }
      
      // Prepare data for saving
      const credentialsData = {
        merchant_id: merchant.id,
        fasstap_username: credentials.fasstapUsername,
        fasstap_password: credentials.fasstapPassword,
        fasstap_api_url: credentials.fasstapApiUrl,
        cbdc_username: credentials.cbdcUsername,
        cbdc_password: credentials.cbdcPassword,
        cbdc_api_url: credentials.cbdcApiUrl,
        use_fasstap_bridge: this.useBridge,
        use_cbdc: this.useCBDC
      };
      
      let result;
      
      if (existingCredentials?.id) {
        // Update existing record
        result = await supabase
          .from('merchant_api_credentials')
          .update(credentialsData)
          .eq('id', existingCredentials.id);
      } else {
        // Insert new record
        result = await supabase
          .from('merchant_api_credentials')
          .insert(credentialsData);
      }
      
      if (result.error) {
        console.error("Error saving credentials:", result.error);
        return false;
      }
      
      // Update local credentials
      await this.loadMerchantCredentials();
      return true;
    } catch (error) {
      console.error("Error in saveApiCredentials:", error);
      return false;
    }
  }

  /**
   * Process a payment using the selected payment method
   */
  public async processPayment(options: CheckoutOptions): Promise<FasstapPaymentResult | null> {
    const { amount, paymentMethod, merchantId, cartItems, metadata } = options;
    
    switch (paymentMethod) {
      case "TAP_TO_PAY":
        if (this.useBridge) {
          return this.processTapToPayWithBridge(amount, cartItems || [], metadata || {});
        } else {
          return this.processTapToPay({
            amount,
            currency: "USD",
            merchantId,
            description: "Purchase from Ledgible Go",
            metadata: {
              cartItems: JSON.stringify(cartItems || []),
              timestamp: new Date().toISOString(),
              ...metadata
            }
          });
        }
      
      case "CBDC":
        return this.processCBDCPayment({
          amount,
          currency: "USD",
          merchantId,
          description: "CBDC Purchase from Ledgible Go",
          metadata: {
            cartItems: JSON.stringify(cartItems || []),
            timestamp: new Date().toISOString(),
            ...metadata
          }
        });
      
      case "CARD":
      case "CASH":
        // For now, these methods don't require external processing
        return {
          success: true,
          transactionId: `${paymentMethod.toLowerCase()}-${Date.now()}`,
          status: "completed"
        };
        
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }

  /**
   * Process a Tap to Pay payment using the legacy Fasstap service
   */
  private async processTapToPay(options: FasstapPaymentOptions): Promise<null> {
    // Get the instance of FasstapService first, then call the initiatePayment method
    await FasstapService.getInstance().initiatePayment(options);
    // Return null as the result will be handled via redirect
    return null;
  }

  /**
   * Process a Tap to Pay payment using the new Fasstap Bridge
   */
  private async processTapToPayWithBridge(
    amount: number, 
    cartItems: CartItemType[],
    metadata: Record<string, any>
  ): Promise<FasstapPaymentResult | null> {
    try {
      const bridge = new FasstapBridge({
        merchantId: this.merchantId,
        environmentMode: "sandbox"
      });
      
      const result = await bridge.startPayment(amount);
      
      if (!result) return null;
      
      // Convert bridge result to FasstapPaymentResult format
      return {
        success: result.status === "completed",
        transactionId: result.transactionId,
        status: result.status,
        error: result.errorMessage
      };
    } catch (error) {
      console.error("Error processing payment with bridge:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        status: "failed"
      };
    }
  }

  /**
   * Process a CBDC payment
   */
  private async processCBDCPayment(options: any): Promise<FasstapPaymentResult | null> {
    try {
      const result = await CBDCService.initiatePayment(options);
      
      // Convert CBDC result to FasstapPaymentResult format for consistency
      // Fix the type mismatch by mapping 'pending' to 'cancelled' since FasstapPaymentResult doesn't support 'pending'
      const mappedStatus: "completed" | "failed" | "cancelled" = 
        result.status === "pending" ? "cancelled" : result.status;
      
      return {
        success: result.success,
        transactionId: result.transactionId,
        status: mappedStatus,
        error: result.error
      };
    } catch (error) {
      console.error("Error processing CBDC payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        status: "failed"
      };
    }
  }
}

// Export the singleton instance directly
export default CheckoutService.getInstance();
