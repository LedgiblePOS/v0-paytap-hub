
export interface ScanResult {
  success: boolean;
  barcode: string;
  timestamp: Date;
  error?: Error;
}

export interface BarcodeScannerConfig {
  minLength: number;
  maxGapMillis: number;
  scanCallback: (barcode: string) => void;
  errorCallback: (error: Error) => void;
}
