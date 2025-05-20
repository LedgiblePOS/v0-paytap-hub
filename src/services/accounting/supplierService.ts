
import { v4 as uuidv4 } from 'uuid';

export interface ReorderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ReorderRequest {
  supplierId: string;
  items: ReorderItem[];
  deliveryDate: string;
  notes?: string;
  paymentMethod: string;
  paymentType: string;
}

/**
 * Create an expense record for a reorder request
 * @param merchantId The ID of the merchant creating the reorder
 * @param request The details of the reorder
 * @returns A promise resolving to the expense record ID
 */
export const createReorderExpense = async (merchantId: string, request: ReorderRequest): Promise<string> => {
  try {
    const totalAmount = request.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    console.log("Creating reorder expense:", {
      merchant_id: merchantId,
      supplier_id: request.supplierId,
      amount: totalAmount,
      date: new Date().toISOString(),
      description: `Reorder of ${request.items.length} products`,
      payment_method: request.paymentMethod,
      items: request.items
    });
    
    // Simulate a successful database operation
    setTimeout(() => {
      // This would be where we update inventory quantities after reordering
      console.log("Inventory quantities would be updated here");
    }, 1000);
    
    return uuidv4(); // Return a mock expense ID
  } catch (error) {
    console.error("Error creating reorder expense:", error);
    throw new Error("Failed to create reorder expense");
  }
};
