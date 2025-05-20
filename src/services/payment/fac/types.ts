
/**
 * Type definitions for First Atlantic Commerce payment gateway
 */

export interface CardDetails {
  cardNumber: string; 
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCVV: string;
  cardHolderName: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string; // ISO-3166 country code
  phone?: string;
  email: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string; // 3-digit currency code (e.g. 'USD')
  merchantReference: string;
  card: CardDetails;
  billingAddress: BillingAddress;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  authCode?: string;
  responseCode?: string;
  responseMessage?: string;
  errorMessage?: string;
}

export interface FACApiRequest {
  TransactionDetails: {
    Amount: string;
    Currency: string;
    MerchantReference: string;
  };
  CardDetails: {
    CardNumber: string;
    CardExpiryMonth: string;
    CardExpiryYear: string;
    CardCVV: string;
  };
  BillingDetails: {
    BillingFirstName: string;
    BillingLastName: string;
    BillingAddress1: string;
    BillingAddress2: string;
    BillingCity: string;
    BillingState: string;
    BillingPostalCode: string;
    BillingCountry: string;
    BillingPhone: string;
    BillingEmail: string;
  };
  MerchantResponseURL: string;
}
