
# Barcode Scanner Implementation

This document outlines the architecture and usage patterns for the barcode scanning functionality in our POS system.

## Architecture Overview

The barcode scanning functionality is organized into several focused modules:

1. **Core Types** (`types.ts`)
   - Defines interfaces for scanner configuration and scan results
   - Provides default configuration values

2. **Scanner Class** (`BarcodeScanner.ts`)
   - Handles the low-level barcode scanning functionality
   - Manages keyboard input events and timing logic
   - Processes raw input into formatted barcode values

3. **Scanner Service** (`scannerService.ts`)
   - Implements the singleton pattern for scanner instances
   - Prevents multiple scanners from interfering with each other

4. **React Integration** (`useBarcodeScanner.tsx`)
   - Provides a React hook for easy integration with components
   - Manages scanning state and cleanup

## Usage Patterns

### Basic Component Integration

```typescript
import { useBarcodeScanner } from '@/utils/barcode';

const MyComponent = () => {
  const handleBarcodeScan = (barcode: string) => {
    console.log('Barcode scanned:', barcode);
    // Process the scanned barcode
  };

  const { startScanning, stopScanning, isScanning } = 
    useBarcodeScanner(handleBarcodeScan);

  return (
    <div>
      <button onClick={startScanning}>Start Scanning</button>
      <button onClick={stopScanning}>Stop Scanning</button>
      {isScanning && <div>Scanner active - Ready to scan</div>}
    </div>
  );
};
```

### Advanced Configuration

```typescript
import { useBarcodeScanner, ScannerType } from '@/utils/barcode';

// Configure with custom options
const { startScanning } = useBarcodeScanner(
  handleBarcodeScan,
  {
    type: 'keyboard' as ScannerType,
    minLength: 8,      // Minimum barcode length
    timeout: 50,       // Milliseconds between keystrokes to be considered from scanner
    prefix: 'PRE',     // Prefix to strip from scanned codes
    suffix: 'POST'     // Suffix to strip from scanned codes
  }
);
```

### Global Scanner Implementation

For application-wide barcode scanning:

```typescript
// In a layout or context provider component
import { useBarcodeScanner } from '@/utils/barcode';

const LayoutWithScanner = ({ children }) => {
  const handleGlobalScan = (barcode) => {
    // Dispatch a global event that components can listen for
    document.dispatchEvent(
      new CustomEvent('barcode-scanned', { detail: { barcode } })
    );
  };
  
  const { startScanning } = useBarcodeScanner(handleGlobalScan);
  
  // Start scanning when component mounts
  useEffect(() => {
    startScanning();
    // No need for cleanup since this is a layout component
  }, [startScanning]);
  
  return <>{children}</>;
};

// In a component that needs to respond to scans
useEffect(() => {
  const handleBarcodeEvent = (event) => {
    const { barcode } = event.detail;
    // Process the barcode
  };
  
  document.addEventListener('barcode-scanned', handleBarcodeEvent);
  
  return () => {
    document.removeEventListener('barcode-scanned', handleBarcodeEvent);
  };
}, []);
```

## Testing Barcode Scanning

For development and testing, you can simulate barcode scans without hardware:

```typescript
import { getScanner } from '@/utils/barcode';

// Get the scanner instance and simulate a scan
const scanner = getScanner();
scanner.simulateScan('123456789');
```

## Common Scenarios

### 1. POS Product Scanning

In the POS module, barcode scanning is used to quickly find and add products to the cart.

### 2. Inventory Management

Barcode scanning can be used for inventory counts and stock adjustments.

### 3. Checkout Process

Scanning customer loyalty cards or discount codes during checkout.

## Best Practices

1. **Always clean up scanners** when components unmount to prevent memory leaks
2. **Provide user feedback** during scanning operations
3. **Handle scan errors** gracefully with user-friendly messages
4. **Consider accessibility** for users who cannot use barcode scanners

By following these patterns, we can maintain consistent barcode scanning behavior across the application.
