
import { ReceiptData } from "./types";
import { formatReceiptContent } from "./formatters";

/**
 * Print a receipt using the browser's print functionality
 * @param receiptData The data to include in the receipt
 */
export const printReceipt = (receiptData: ReceiptData): void => {
  const receipt = formatReceiptContent(receiptData);
  
  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);
  
  const contentWindow = iframe.contentWindow;
  if (contentWindow) {
    // Write receipt content to iframe
    contentWindow.document.open();
    contentWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              width: 3in;
              margin: 0 auto;
              padding: 0.2in;
              line-height: 1.2;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
            }
            .divider {
              border-top: 1px dotted #000;
              margin: 5px 0;
            }
            .text-right {
              text-align: right;
            }
            .total {
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <pre>${receipt}</pre>
        </body>
      </html>
    `);
    contentWindow.document.close();
    
    // Print and remove the iframe
    setTimeout(() => {
      contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  }
};

/**
 * Generate a receipt PDF using a canvas
 * This can be used for saving receipts or sending via email
 */
export const generateReceiptPDF = async (receiptData: ReceiptData): Promise<Blob> => {
  // This is a placeholder for PDF generation functionality
  // In a real implementation, you would use a library like jsPDF or pdfmake
  
  // For now, we'll just throw an error indicating this needs to be implemented
  throw new Error('PDF generation not yet implemented');
  
  // Example implementation with jsPDF would be:
  // const doc = new jsPDF({ format: 'a7', unit: 'mm' });
  // doc.text(receipt, 10, 10);
  // return doc.output('blob');
};
