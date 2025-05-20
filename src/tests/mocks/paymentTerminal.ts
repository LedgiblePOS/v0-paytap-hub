
import { FasstapService } from '@/services/fasstapService';

export const mockPaymentTerminal = (options = { type: 'TAP_TO_PAY' }) => {
  // Mock terminal connection
  jest.spyOn(FasstapService, 'connect').mockResolvedValue(true);
  
  // Mock payment processing
  jest.spyOn(FasstapService, 'processPayment').mockImplementation(async () => {
    return {
      success: true,
      transactionId: `mock-${Date.now()}`,
      status: 'completed'
    };
  });
  
  if (options.type === 'CBDC') {
    // Add CBDC-specific mocks if needed
    jest.spyOn(window, 'fetch').mockImplementationOnce(async () => {
      return new Response(JSON.stringify({
        success: true,
        transactionId: `cbdc-${Date.now()}`
      }));
    });
  }
};
