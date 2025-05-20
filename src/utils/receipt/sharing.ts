
import { ReceiptData } from "./types";

/**
 * Send a receipt via email
 */
export const emailReceipt = async (receiptData: ReceiptData, email: string): Promise<boolean> => {
  try {
    // Format the items for email display
    const formattedItems = receiptData.items.map(item => ({
      name: item.name,
      price: item.price.toFixed(2),
      quantity: item.quantity,
      total: (item.price * item.quantity).toFixed(2)
    }));
    
    // Format the receipt data for the API
    const emailData = {
      to: email,
      subject: `Receipt from ${receiptData.merchantName} - ${receiptData.date}`,
      receiptData: {
        merchantName: receiptData.merchantName,
        transactionId: receiptData.transactionId,
        date: receiptData.date,
        items: formattedItems,
        subtotal: receiptData.subtotal.toFixed(2),
        discount: receiptData.discountAmount.toFixed(2),
        tax: receiptData.taxAmount ? receiptData.taxAmount.toFixed(2) : "0.00",
        total: receiptData.total.toFixed(2),
        paymentMethod: receiptData.paymentMethod
      }
    };
    
    // Call the email API endpoint
    const response = await fetch('/api/email-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error(`Email failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return false;
  }
};

/**
 * Generate a QR code for a digital receipt
 */
export const generateReceiptQRCode = (receiptData: ReceiptData): Promise<string> => {
  // In a production environment, we would use a library like qrcode.js
  // For now, we'll use a placeholder URL
  const receiptId = receiptData.transactionId;
  const merchantId = receiptData.merchantId;
  const receiptUrl = `https://example.com/receipts/${merchantId}/${receiptId}`;
  
  // This is a placeholder that would be replaced with actual QR code generation
  return Promise.resolve(receiptUrl);
};
