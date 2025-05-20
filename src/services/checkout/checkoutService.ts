
import FasstapBridge from "@/bridges/FasstapBridge";
import { CartItemType } from "@/components/POS/Cart";
import CBDCService from "../cbdcService";
import { CheckoutOptions } from "./types";
import settingsManager from "./settingsManager";
import credentialsManager from "./credentialsManager";
import paymentProcessor from "./paymentProcessor";

/**
 * Service for managing checkout operations
 */
class CheckoutService {
  private merchantId: string = "merchant-1";
  
  constructor() {
    // Initialize the bridge
    const bridge = new FasstapBridge({
      merchantId: this.merchantId,
      environmentMode: "sandbox"
    });
    
    bridge.initialize();

    // Initialize CBDC service
    CBDCService.initialize("device-1");
  }
  
  /**
   * Set the merchant ID and reload credentials
   */
  public setMerchantId(merchantId: string): void {
    this.merchantId = merchantId;
    
    // Update bridges with new merchant ID
    const bridge = new FasstapBridge({
      merchantId: this.merchantId,
      environmentMode: "sandbox"
    });
    
    bridge.initialize();
    
    // Reload credentials
    this.loadMerchantCredentials();
  }

  /**
   * Toggle the use of the Fasstap Bridge implementation
   */
  public toggleBridgeMode(enable: boolean): void {
    settingsManager.toggleBridgeMode(enable);
  }

  /**
   * Toggle the use of CBDC
   */
  public toggleCBDCMode(enable: boolean): void {
    settingsManager.toggleCBDCMode(enable);
  }

  /**
   * Check if CBDC mode is enabled
   */
  public isCBDCEnabled(): boolean {
    return settingsManager.isCBDCEnabled();
  }
  
  /**
   * Check if Bridge mode is enabled
   * @returns {boolean} True if bridge mode is enabled, false otherwise
   */
  public isBridgeEnabled(): boolean {
    return settingsManager.isBridgeEnabled();
  }
  
  /**
   * Load merchant credentials
   */
  public async loadMerchantCredentials(): Promise<void> {
    await credentialsManager.loadCredentials(this.merchantId);
    await settingsManager.loadSettings(this.merchantId);
  }
  
  /**
   * Save API credentials
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
    // Update merchant ID if provided
    if (credentials.merchantId) {
      this.merchantId = credentials.merchantId;
    }
    
    return credentialsManager.saveCredentials({
      merchantId: this.merchantId,
      fasstapUsername: credentials.fasstapUsername,
      fasstapPassword: credentials.fasstapPassword,
      fasstapApiUrl: credentials.fasstapApiUrl,
      cbdcUsername: credentials.cbdcUsername,
      cbdcPassword: credentials.cbdcPassword,
      cbdcApiUrl: credentials.cbdcApiUrl,
      useFasstapBridge: settingsManager.isBridgeEnabled(),
      useCBDC: settingsManager.isCBDCEnabled()
    });
  }

  /**
   * Process a payment
   */
  public async processPayment(options: CheckoutOptions) {
    return paymentProcessor.processPayment(options);
  }

  /**
   * Initialize the checkout service
   */
  public async initialize(): Promise<void> {
    await this.loadMerchantCredentials();
  }
}

// Export singleton instance
export default new CheckoutService();
