
import { BarcodeScannerConfig, ScanResult, DEFAULT_CONFIG } from './types';

/**
 * BarcodeScanner - Manages barcode scanning functionality
 */
export class BarcodeScanner {
  private config: BarcodeScannerConfig;
  private buffer: string = '';
  private lastCharTime: number = 0;
  private listeners: ((result: ScanResult) => void)[] = [];
  private isListening: boolean = false;
  
  /**
   * Create a scanner instance
   */
  constructor(config?: Partial<BarcodeScannerConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
  }
  
  /**
   * Start listening for barcode scan events
   */
  public startListening(): void {
    if (this.isListening) return;
    
    // Listen for keyboard events (most barcode scanners emulate keyboard input)
    if (this.config.type === 'keyboard') {
      document.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
      console.log('Barcode scanner listening for keyboard events');
    }
    // Additional scanner types can be implemented here
  }
  
  /**
   * Stop listening for barcode scan events
   */
  public stopListening(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.isListening = false;
    console.log('Barcode scanner stopped listening');
  }
  
  /**
   * Add a listener for scan events
   */
  public addListener(callback: (result: ScanResult) => void): void {
    this.listeners.push(callback);
  }
  
  /**
   * Remove a listener
   */
  public removeListener(callback: (result: ScanResult) => void): void {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }
  
  /**
   * Handle keyboard input (for keyboard emulation scanners)
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const currentTime = new Date().getTime();
    
    // If there's a timeout between inputs, reset the buffer
    if (currentTime - this.lastCharTime > (this.config.timeout || 20)) {
      this.buffer = '';
    }
    
    this.lastCharTime = currentTime;
    
    // Handle Enter key as end of barcode input
    if (event.key === 'Enter') {
      if (this.buffer.length >= (this.config.minLength || 4)) {
        this.processBarcode();
      }
      return;
    }
    
    // Add character to buffer
    this.buffer += event.key;
  }
  
  /**
   * Process complete barcode
   */
  private processBarcode(): void {
    // Remove prefix and suffix if configured
    let barcode = this.buffer;
    if (this.config.prefix && barcode.startsWith(this.config.prefix)) {
      barcode = barcode.substring(this.config.prefix.length);
    }
    if (this.config.suffix && barcode.endsWith(this.config.suffix)) {
      barcode = barcode.substring(0, barcode.length - this.config.suffix.length);
    }
    
    // Create scan result
    const result: ScanResult = {
      barcode,
      timestamp: new Date().getTime(),
      success: true
    };
    
    // Notify all listeners
    this.listeners.forEach(callback => {
      try {
        callback(result);
      } catch (err) {
        console.error('Error in barcode scanner callback:', err);
      }
    });
    
    // Clear buffer
    this.buffer = '';
  }
  
  /**
   * Simulate a barcode scan (useful for testing)
   */
  public simulateScan(barcode: string): void {
    const result: ScanResult = {
      barcode,
      timestamp: new Date().getTime(),
      success: true
    };
    
    this.listeners.forEach(callback => callback(result));
  }
}
