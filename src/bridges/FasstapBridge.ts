
import { FasstapBridgeConfig, FasstapTransactionResult } from './fasstap/types';
import TransactionManager from './fasstap/transactionManager';
import DetectionService from './fasstap/detectionService';

/**
 * Fasstap Bridge for handling tap-to-pay functionality
 * This bridge abstracts the native SDK and provides a consistent interface
 */
class FasstapBridge {
  private config: FasstapBridgeConfig;
  private transactionManager: typeof TransactionManager;
  private detectionService: typeof DetectionService;
  
  constructor(config: FasstapBridgeConfig) {
    this.config = {
      ...config,
      environmentMode: config.environmentMode || 'sandbox',
      terminalId: config.terminalId || 'WEB_TERMINAL'
    };
    
    this.detectionService = DetectionService;
    this.transactionManager = TransactionManager;
  }
  
  /**
   * Initialize the bridge with the provided configuration
   */
  public initialize(): Promise<boolean> {
    console.log('Initializing Fasstap Bridge with config:', this.config);
    
    // Check if the native SDK is available
    const isNativeSDKAvailable = this.detectionService.detectNativeSDK();
    
    if (isNativeSDKAvailable) {
      console.log('Using native Fasstap SDK');
      // TODO: Initialize the native SDK here
      return Promise.resolve(true);
    } else {
      console.log('Using mock Fasstap implementation');
      return Promise.resolve(true);
    }
  }
  
  /**
   * Starts a payment transaction
   * @param amount The amount to charge
   * @returns A promise that resolves with the transaction result
   */
  public startPayment(amount: number): Promise<FasstapTransactionResult> {
    console.log(`Starting Fasstap payment for amount: ${amount}`);
    
    // Fix: TransactionManager uses a different method name
    return this.transactionManager.handleTransaction({
      merchantId: this.config.merchantId,
      terminalId: this.config.terminalId || 'WEB_TERMINAL',
      amount,
      currency: 'USD'
    });
  }
  
  /**
   * Cancels the current transaction in progress
   */
  public cancelTransaction(): Promise<void> {
    console.log('Cancelling Fasstap transaction');
    // Fix: TransactionManager uses a different method name
    return this.transactionManager.abortTransaction();
  }
  
  /**
   * Gets the status of an existing transaction
   * @param transactionId The ID of the transaction to check
   */
  public getTransactionStatus(transactionId: string): Promise<FasstapTransactionResult> {
    console.log(`Getting status for transaction: ${transactionId}`);
    // Fix: TransactionManager uses checkTransactionStatus
    return this.transactionManager.checkTransactionStatus(transactionId);
  }
  
  /**
   * Process a payment
   * This is a static convenience method for processing payments
   */
  public static processPayment(amount: number, cartItems: any[], metadata: Record<string, any>): Promise<FasstapTransactionResult> {
    const instance = new FasstapBridge({
      merchantId: 'DEFAULT_MERCHANT',
      environmentMode: 'sandbox'
    });
    
    return instance.startPayment(amount);
  }
}

// Export the main class and types
export default FasstapBridge;
export type { FasstapBridgeConfig, FasstapTransactionResult };
