
/**
 * Printer utility functions for interacting with physical receipt printers via WebUSB
 */

export interface PrinterDevice {
  manufacturerName: string;
  productName: string;
  serialNumber: string;
  device: USBDevice;
}

/**
 * Check if WebUSB is supported in the current browser
 */
export function isWebUSBSupported(): boolean {
  return !!navigator.usb;
}

/**
 * Connect to a printer using WebUSB
 * @returns The selected printer device, or null if no device was selected
 */
export async function connectToPrinter(): Promise<PrinterDevice | null> {
  try {
    if (!isWebUSBSupported()) {
      throw new Error("WebUSB is not supported in this browser");
    }
    
    // Request a printer device
    const device = await navigator.usb.requestDevice({
      filters: [
        // Common receipt printer USB vendor IDs
        { vendorId: 0x04b8 }, // Epson
        { vendorId: 0x0519 }, // Star Micronics
        { vendorId: 0x0dd4 }, // Custom
        { vendorId: 0x067b }, // Prolific
        // Add more vendor IDs as needed
      ]
    });
    
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    
    return {
      manufacturerName: device.manufacturerName || "Unknown",
      productName: device.productName || "Printer",
      serialNumber: device.serialNumber || "N/A",
      device: device
    };
  } catch (error) {
    console.error("Error connecting to printer:", error);
    return null;
  }
}

/**
 * Print a receipt on a connected printer
 * @param printer The printer device to print to
 * @param content The receipt content to print
 * @returns Success status and error message if applicable
 */
export async function printReceipt(
  printer: PrinterDevice, 
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!printer || !printer.device) {
      throw new Error("No printer connected");
    }
    
    // Convert content to printer commands
    // This is a simplified implementation - actual commands depend on the printer
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    // Send the data to the printer
    // The actual endpoint and data format will depend on the specific printer
    await printer.device.transferOut(1, data);
    
    // Add cut command (this is specific to the printer model)
    const cutCommand = new Uint8Array([0x1D, 0x56, 0x41, 0x10]);
    await printer.device.transferOut(1, cutCommand);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error printing receipt:", error);
    return {
      success: false,
      error: error.message || "Failed to print receipt"
    };
  }
}

/**
 * Create a new documentation to explain common type errors and solutions
 */
