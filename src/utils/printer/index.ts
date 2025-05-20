
/**
 * Printer utilities for interacting with physical receipt printers 
 * via Web USB API
 */

const ESC = 0x1B;
const LF = 0x0A;

export type PrinterDevice = {
  device: USBDevice;
  productName: string;
  manufacturerName: string | null;
};

// Check if WebUSB is supported in the browser
export const isWebUSBSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.usb;
};

// Connect to a receipt printer
export const connectToPrinter = async (): Promise<PrinterDevice | null> => {
  if (!isWebUSBSupported()) {
    console.error('WebUSB is not supported in this browser');
    return null;
  }
  
  try {
    const device = await navigator.usb.requestDevice({
      filters: [
        // Common receipt printer vendor IDs
        { vendorId: 0x04b8 }, // Epson
        { vendorId: 0x0519 }, // Star Micronics
        { vendorId: 0x0dd4 }  // Custom America
      ]
    });
    
    return {
      device,
      productName: device.productName || 'Unknown Printer',
      manufacturerName: device.manufacturerName
    };
  } catch (err) {
    console.error('Error requesting USB device:', err);
    return null;
  }
};

// Print receipt using connected device
export const printReceipt = async (
  printerDevice: PrinterDevice, 
  receiptText: string
): Promise<boolean> => {
  const { device } = printerDevice;
  
  if (!device) {
    return false;
  }
  
  try {
    await device.open();
    
    // Most printers use configuration #1
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    
    // Look for the first interface with endpoints
    const interfaces = device.configuration?.interfaces || [];
    let interfaceNumber = 0;
    let endpointNumber = 0;
    let foundEndpoint = false;
    
    for (const iface of interfaces) {
      if (iface.alternate.endpoints.length > 0) {
        interfaceNumber = iface.interfaceNumber;
        
        // Find the first output endpoint
        const endpoint = iface.alternate.endpoints.find(e => e.direction === "out");
        if (endpoint) {
          endpointNumber = endpoint.endpointNumber;
          await device.claimInterface(interfaceNumber);
          foundEndpoint = true;
          break;
        }
      }
    }
    
    if (!foundEndpoint) {
      throw new Error('No suitable interface and endpoint found');
    }
    
    // Convert text to bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(formatReceiptForPrinting(receiptText));
    
    // Send data to printer
    await device.transferOut(endpointNumber, data);
    
    // Send form feed to finish printing
    await device.transferOut(endpointNumber, new Uint8Array([LF, LF, LF, LF]));
    
    // Release interface and close device
    await device.releaseInterface(interfaceNumber);
    await device.close();
    
    return true;
  } catch (err) {
    console.error('Error printing:', err);
    
    // Try to clean up if there was an error
    try {
      if (device.opened) {
        await device.close();
      }
    } catch (closeError) {
      console.error('Error closing device:', closeError);
    }
    
    return false;
  }
};

// Format receipt for printing with proper control codes
const formatReceiptForPrinting = (content: string): string => {
  let formatted = '\x1B@';  // Initialize printer
  formatted += '\x1B!1';    // Set emphasized mode
  formatted += content;
  formatted += '\x1B!0';    // Cancel emphasized mode
  formatted += '\n\n\n\n\n'; // Add extra line feeds for paper cutting
  return formatted;
};

// Class implementation is kept for backward compatibility
export class ReceiptPrinter {
  private device: USBDevice | null = null;
  private interface: number = 0;
  private endPoint: number = 0;
  
  constructor() {
    this.device = null;
  }
  
  public async requestPrinter(): Promise<boolean> {
    if (!navigator.usb) {
      console.error('WebUSB is not supported in this browser');
      return false;
    }
    
    try {
      this.device = await navigator.usb.requestDevice({
        filters: [
          // Common receipt printer vendor IDs
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x0519 }, // Star Micronics
          { vendorId: 0x0dd4 }  // Custom America
        ]
      });
      
      return true;
    } catch (err) {
      console.error('Error requesting USB device:', err);
      return false;
    }
  }
  
  public async connect(): Promise<boolean> {
    if (!this.device || !navigator.usb) {
      return false;
    }
    
    try {
      await this.device.open();
      
      // Most printers use configuration #1
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }
      
      // Look for the first interface with endpoints
      const interfaces = this.device.configuration?.interfaces || [];
      for (const iface of interfaces) {
        if (iface.alternate.endpoints.length > 0) {
          this.interface = iface.interfaceNumber;
          
          // Find the first output endpoint
          const endpoint = iface.alternate.endpoints.find(e => e.direction === "out");
          if (endpoint) {
            this.endPoint = endpoint.endpointNumber;
            await this.device.claimInterface(this.interface);
            return true;
          }
        }
      }
      
      throw new Error('No suitable interface and endpoint found');
    } catch (err) {
      console.error('Error connecting to printer:', err);
      return false;
    }
  }
  
  public async print(text: string): Promise<boolean> {
    if (!this.device || this.endPoint === 0) {
      return false;
    }
    
    try {
      // Convert text to bytes
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Send data to printer
      await this.device.transferOut(this.endPoint, data);
      
      // Send form feed to finish printing
      await this.device.transferOut(this.endPoint, new Uint8Array([LF, LF, LF, LF]));
      
      return true;
    } catch (err) {
      console.error('Error printing:', err);
      return false;
    }
  }
  
  public async printReceipt(receiptContent: string): Promise<boolean> {
    // Format receipt appropriately
    const formattedReceipt = this.formatReceiptForPrinting(receiptContent);
    return this.print(formattedReceipt);
  }
  
  private formatReceiptForPrinting(content: string): string {
    // Format receipt content with proper line breaks, centering, etc.
    // This is a simplified version - real implementation would need more printer-specific commands
    let formatted = '\x1B@';  // Initialize printer
    formatted += '\x1B!1';    // Set emphasized mode
    formatted += content;
    formatted += '\x1B!0';    // Cancel emphasized mode
    formatted += '\n\n\n\n\n'; // Add extra line feeds for paper cutting
    return formatted;
  }
  
  public async disconnect(): Promise<void> {
    if (this.device && this.device.opened) {
      try {
        await this.device.releaseInterface(this.interface);
        await this.device.close();
      } catch (err) {
        console.error('Error disconnecting printer:', err);
      }
    }
  }
}

export default ReceiptPrinter;
