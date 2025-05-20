export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  MERCHANT = "MERCHANT",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER"
}

export enum Permission {
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  MANAGE_USERS = "MANAGE_USERS",
  VIEW_INVENTORY = "VIEW_INVENTORY",
  MANAGE_INVENTORY = "MANAGE_INVENTORY",
  VIEW_ORDERS = "VIEW_ORDERS",
  MANAGE_ORDERS = "MANAGE_ORDERS",
  VIEW_REPORTS = "VIEW_REPORTS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
  VIEW_SETTINGS = "VIEW_SETTINGS"
}

export enum EntityType {
  USER = "user",
  PRODUCT = "product",
  ORDER = "order",
  CATEGORY = "category",
  INVENTORY = "inventory",
  MERCHANT = "merchant"
}

export enum Trend {
  UP = "up",
  DOWN = "down",
  NEUTRAL = "neutral",
  STABLE = "stable" // Add missing STABLE value
}

export enum TimeRange {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year"
}

export enum DeploymentEnvironment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
  TEST = "test"
}

export enum AuditSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical"
}

export enum AuditEntityType {
  USER = "user",
  MERCHANT = "merchant",
  PRODUCT = "product",
  ORDER = "order",
  SYSTEM = "system"
}

export enum SubscriptionTier {
  FREE = "FREE",
  STARTER = "STARTER",
  PROFESSIONAL = "PROFESSIONAL",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
  SCALE_UP = "SCALE_UP",
  GO_GLOBAL = "GO_GLOBAL"
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card", 
  CASH = "cash",
  MOBILE_PAYMENT = "mobile_payment",
  BANK_TRANSFER = "bank_transfer",
  OTHER = "other",
  // Add missing values used in components
  CARD = "CARD",
  MOBILE = "MOBILE",
  TAP_TO_PAY = "TAP_TO_PAY",
  CBDC = "CBDC",
  LYNK = "LYNK",
  APPLE_PAY = "APPLE_PAY",
  GOOGLE_PAY = "GOOGLE_PAY",
  WIPAY = "WIPAY",
  CHECK = "CHECK"
}

// Fix LogLevel enum
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  WARNING = "warning", // Add WARNING as alias for WARN
  ERROR = "error",
  FATAL = "fatal"
}
