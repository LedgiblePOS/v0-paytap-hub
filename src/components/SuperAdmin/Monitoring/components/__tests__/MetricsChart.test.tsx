export enum DeploymentEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export enum AuditEntityType {
  USER = 'user',
  MERCHANT = 'merchant',
  TRANSACTION = 'transaction',
  PRODUCT = 'product',
  CUSTOMER = 'customer',
  API_ABUSE = 'api_abuse',
  PATH_TRAVERSAL = 'path_traversal'
}

// Add UserRole enum
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MERCHANT = 'MERCHANT',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF'
}

// Add Trend enum
export enum Trend {
  UP = 'up',
  DOWN = 'down',
  NEUTRAL = 'neutral'
}

// Add PaymentMethod enum
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE = 'MOBILE',
  TAP_TO_PAY = 'TAP_TO_PAY',
  CBDC = 'CBDC',
  LYNK = 'LYNK',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  WIPAY = 'WIPAY',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  OTHER = 'OTHER'
}

// Add SubscriptionTier enum
export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

// Add LogLevel enum that's needed in environment.ts
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}
