
import { ReceiptData } from "./types";

/**
 * Formats a receipt for printing based on transaction data,
 * Including a line for the transaction fee if provided.
 */
export const formatReceiptContent = (data: ReceiptData): string => {
  const header = [
    `${data.merchantName}`,
    `Transaction: ${data.transactionId}`,
    `Date: ${data.date}`,
    data.customer ? `Customer: ${data.customer.name}` : '',
    '-'.repeat(32),
  ].filter(Boolean).join('\n');

  const items = data.items.map(item => {
    const price = item.discountedPrice || item.price;
    return `${item.name} x${item.quantity}\n  $${price.toFixed(2)} ea  $${(price * item.quantity).toFixed(2)}`;
  }).join('\n');

  const summaryLines: string[] = [
    '-'.repeat(32),
    `Subtotal: $${data.subtotal.toFixed(2)}`,
  ];
  if (data.discountAmount > 0) {
    summaryLines.push(`Discount: $${data.discountAmount.toFixed(2)}`);
  }
  if (typeof data.taxAmount === 'number' && typeof data.taxRate === 'number') {
    summaryLines.push(`Tax (${data.taxRate}%): $${data.taxAmount.toFixed(2)}`);
  }
  // Add transaction fee line if available (as Service Charge)
  if (data.transactionFee && data.transactionFee > 0) {
    summaryLines.push(
      (typeof data.feePercentage === "number" 
        ? `Service Charge (${data.feePercentage.toFixed(2)}%):`
        : "Service Charge:") +
      ` $${data.transactionFee.toFixed(2)}`
    );
  }
  summaryLines.push(`Total: $${data.total.toFixed(2)}`);
  summaryLines.push('-'.repeat(32));
  summaryLines.push(`Paid via: ${data.paymentMethod}`);
  if (data.cashGiven) summaryLines.push(`Cash tendered: $${data.cashGiven.toFixed(2)}`);
  if (data.change) summaryLines.push(`Change: $${data.change.toFixed(2)}`);
  if (data.notes) summaryLines.push(`\nNotes: ${data.notes}`);
  summaryLines.push('\nThank you for your business!');

  const summary = summaryLines.filter(Boolean).join('\n');

  return `${header}\n\n${items}\n\n${summary}`;
};
