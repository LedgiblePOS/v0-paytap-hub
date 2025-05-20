
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED'
}

export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface SecurityEvent {
  id?: string;
  userId?: string;
  type: SecurityEventType;
  timestamp: Date | string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: SecurityEventSeverity;
}

export interface MetricsData {
  dailyActiveUsers?: number;
  monthlyActiveUsers?: number;
  totalRevenue?: number;
  averageOrderValue?: number;
  conversionRate?: number;
  userGrowth?: number;
  revenueGrowth?: number;
}
