
import { useEffect, useState, useCallback, useRef } from 'react';
import { getScanner } from './scannerService';
import { ScanResult } from './types';

export interface UseBarcodeScannerOptions {
  onScan?: (result: ScanResult) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * React hook for barcode scanning functionality
 */
export const useBarcodeScanner = (
  callbackOrOptions: ((barcode: string) => void) | UseBarcodeScannerOptions = {}
) => {
  // Determine if the first argument is a callback function or options object
  const isCallbackFn = typeof callbackOrOptions === 'function';
  const options = isCallbackFn ? {} : callbackOrOptions;
  
  // Use refs instead of state for callback storage to avoid re-renders
  const callbackRef = useRef<((barcode: string) => void) | ((result: ScanResult) => void) | undefined>(
    isCallbackFn ? callbackOrOptions : options.onScan
  );
  
  // Update the callback ref when it changes - without triggering effects
  useEffect(() => {
    callbackRef.current = isCallbackFn ? callbackOrOptions : options.onScan;
  }, [isCallbackFn, callbackOrOptions, options.onScan]);
  
  // Maintain state in refs instead of useState where appropriate
  const isEnabledRef = useRef(options.enabled ?? false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  // Only track UI-relevant states with useState
  const [isEnabled, setIsEnabled] = useState(isEnabledRef.current);
  const [isScanning, setIsScanning] = useState(false);
  
  // Mount flag to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Handler for scan events - stable reference with useCallback
  const handleScan = useCallback((result: ScanResult) => {
    if (!isMountedRef.current) return;
    
    setLastScan(result);
    
    if (result.success && callbackRef.current) {
      try {
        // If using the callback function signature, we pass just the barcode string
        if (isCallbackFn) {
          (callbackRef.current as (barcode: string) => void)(result.barcode);
        } else {
          // If using the options signature, we pass the full result
          (callbackRef.current as ((result: ScanResult) => void))(result);
        }
      } catch (error) {
        console.error('Error in barcode scan handler:', error);
        if (options.onError && isMountedRef.current) {
          options.onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    } else if (options.onError && result.error && isMountedRef.current) {
      options.onError(result.error);
    }
  }, [isCallbackFn, options.onError]);

  // Start scanning method with stable reference
  const startScanning = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const scanner = getScanner();
    scanner.addListener(handleScan);
    scanner.startListening();
    
    // Only update state if mounted
    if (isMountedRef.current) {
      setIsScanning(true);
      setIsEnabled(true);
      isEnabledRef.current = true;
    }
  }, [handleScan]);

  // Stop scanning method with stable reference
  const stopScanning = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const scanner = getScanner();
    scanner.removeListener(handleScan);
    scanner.stopListening();
    
    // Only update state if mounted
    if (isMountedRef.current) {
      setIsScanning(false);
      // We don't change isEnabled here to maintain user preference
    }
  }, [handleScan]);

  // Initialize and clean up scanner
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Only auto-start if enabled initially
    if (isEnabledRef.current) {
      startScanning();
    }
    
    // Clean up on unmount
    return () => {
      isMountedRef.current = false;
      const scanner = getScanner();
      scanner.removeListener(handleScan);
      scanner.stopListening();
    };
  }, [startScanning, handleScan]); // These dependencies are stable due to useCallback

  // Handle changes to the enabled option without causing infinite loops
  useEffect(() => {
    // Only respond to changes, not initial setup (handled by first effect)
    if (isEnabledRef.current !== options.enabled && options.enabled !== undefined) {
      isEnabledRef.current = options.enabled;
      
      if (options.enabled) {
        startScanning();
      } else {
        stopScanning();
      }
      
      if (isMountedRef.current) {
        setIsEnabled(options.enabled);
      }
    }
  }, [options.enabled, startScanning, stopScanning]);

  // Simulate a scan (useful for testing) - stable reference with useCallback
  const simulateScan = useCallback((barcode: string) => {
    const scanner = getScanner();
    scanner.simulateScan(barcode);
  }, []);

  return {
    lastScan,
    isEnabled,
    isScanning,
    enableScanner: startScanning,
    disableScanner: stopScanning,
    startScanning,
    stopScanning,
    simulateScan
  };
};

export default useBarcodeScanner;
