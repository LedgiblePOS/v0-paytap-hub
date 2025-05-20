
import { ScanResult } from './types';

type ScanListener = (result: ScanResult) => void;

class BarcodeScanner {
  private listeners: ScanListener[] = [];
  private isListening: boolean = false;
  private keyBuffer: string = '';
  private lastScanTime: number = 0;
  private keyTimeout: number | null = null;
  
  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.processBuffer = this.processBuffer.bind(this);
  }
  
  public startListening(): void {
    if (this.isListening) return;
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.isListening = true;
    console.log('[BarcodeScanner] Started listening for barcodes');
  }
  
  public stopListening(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.isListening = false;
    this.clearBuffer();
    console.log('[BarcodeScanner] Stopped listening for barcodes');
  }
  
  public addListener(listener: ScanListener): void {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }
  
  public removeListener(listener: ScanListener): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
  
  public simulateScan(barcode: string): void {
    const result: ScanResult = {
      success: true,
      barcode,
      timestamp: new Date()
    };
    
    this.notifyListeners(result);
  }
  
  private handleKeyDown(e: KeyboardEvent): void {
    // Typical barcode scanners send characters rapidly
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastScanTime;
    
    // Reset buffer if there was a long pause
    if (timeDiff > 500 && this.keyBuffer.length > 0) {
      this.clearBuffer();
    }
    
    // Update last scan time
    this.lastScanTime = currentTime;
    
    // If Enter key is pressed, process the buffer
    if (e.key === 'Enter' && this.keyBuffer.length > 0) {
      this.processBuffer();
      // Prevent form submission if this was a barcode scan
      e.preventDefault();
      return;
    }
    
    // Add character to buffer if it's a valid barcode character
    if (this.isValidBarcodeChar(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
      this.keyBuffer += e.key;
      
      // Reset timeout
      if (this.keyTimeout !== null) {
        window.clearTimeout(this.keyTimeout);
      }
      
      // Set timeout to process buffer if no more keys are pressed
      this.keyTimeout = window.setTimeout(this.processBuffer, 100);
    }
  }
  
  private processBuffer(): void {
    if (this.keyBuffer.length > 5) {  // Most barcodes are longer than 5 chars
      const result: ScanResult = {
        success: true,
        barcode: this.keyBuffer,
        timestamp: new Date()
      };
      
      this.notifyListeners(result);
    }
    
    this.clearBuffer();
  }
  
  private clearBuffer(): void {
    this.keyBuffer = '';
    if (this.keyTimeout !== null) {
      window.clearTimeout(this.keyTimeout);
      this.keyTimeout = null;
    }
  }
  
  private isValidBarcodeChar(key: string): boolean {
    // Barcodes typically contain numbers, letters, and some special chars
    return key.length === 1 && /[a-zA-Z0-9\-\.]/.test(key);
  }
  
  private notifyListeners(result: ScanResult): void {
    this.listeners.forEach(listener => {
      try {
        listener(result);
      } catch (error) {
        console.error('[BarcodeScanner] Error in listener:', error);
      }
    });
  }
}

// Singleton instance
let scanner: BarcodeScanner | null = null;

export function getScanner(): BarcodeScanner {
  if (!scanner) {
    scanner = new BarcodeScanner();
  }
  return scanner;
}
