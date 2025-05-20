
/**
 * First Atlantic Commerce Payment Gateway Processing Service
 * Handles core payment processing functionality
 */

import { toast } from '@/components/ui/use-toast';
import { FAC_TEST_URL, MERCHANT_ID, MERCHANT_PASSWORD } from './config';
import { PaymentRequest, PaymentResponse, FACApiRequest } from './types';

/**
 * Process a payment through First Atlantic Commerce gateway
 */
export const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // Format the request according to FAC API specifications
    const facRequest: FACApiRequest = {
      TransactionDetails: {
        Amount: (request.amount * 100).toString(), // Convert to cents
        Currency: request.currency,
        MerchantReference: request.merchantReference,
      },
      CardDetails: {
        CardNumber: request.card.cardNumber,
        CardExpiryMonth: request.card.cardExpiryMonth,
        CardExpiryYear: request.card.cardExpiryYear,
        CardCVV: request.card.cardCVV,
      },
      BillingDetails: {
        BillingFirstName: request.billingAddress.firstName,
        BillingLastName: request.billingAddress.lastName,
        BillingAddress1: request.billingAddress.address1,
        BillingAddress2: request.billingAddress.address2 || '',
        BillingCity: request.billingAddress.city,
        BillingState: request.billingAddress.state,
        BillingPostalCode: request.billingAddress.postalCode,
        BillingCountry: request.billingAddress.countryCode,
        BillingPhone: request.billingAddress.phone || '',
        BillingEmail: request.billingAddress.email,
      },
      MerchantResponseURL: window.location.origin + '/payment-callback',
    };

    // In a real implementation, this would be an actual API call
    console.log('Processing payment with FAC gateway:', facRequest);
    
    // Simulate successful transaction (in production, this would be a real API call)
    // For demo purposes, we'll approve any card number that ends with an even digit
    const lastDigit = parseInt(request.card.cardNumber.slice(-1));
    
    if (!isNaN(lastDigit) && lastDigit % 2 === 0) {
      return {
        success: true,
        transactionId: 'FAC-' + Date.now().toString(),
        authCode: 'AUTH' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        responseCode: '00',
        responseMessage: 'Approved',
      };
    } else {
      // Simulate declined transaction
      return {
        success: false,
        responseCode: '05',
        responseMessage: 'Declined',
        errorMessage: 'Card declined by issuer'
      };
    }
    
    /* Real implementation would look like this:
    const response = await fetch(`${FAC_TEST_URL}/Authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${MERCHANT_ID}:${MERCHANT_PASSWORD}`)
      },
      body: JSON.stringify(facRequest)
    });
    
    const responseData = await response.json();
    
    // Process FAC response
    if (responseData.ResponseCode === '00') {
      return {
        success: true,
        transactionId: responseData.TransactionID,
        authCode: responseData.AuthCode,
        responseCode: responseData.ResponseCode,
        responseMessage: responseData.ResponseMessage
      };
    } else {
      return {
        success: false,
        responseCode: responseData.ResponseCode,
        responseMessage: responseData.ResponseMessage,
        errorMessage: responseData.ErrorMessage || 'Payment declined'
      };
    }
    */
  } catch (error) {
    console.error('FAC payment processing error:', error);
    return {
      success: false,
      errorMessage: 'Payment processing failed'
    };
  }
};
