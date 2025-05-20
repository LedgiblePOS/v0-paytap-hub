import { UserData, User, EditUserData, UserRole } from '@/types/user';
import { SystemMetric, LocalSystemMetric } from '@/types/metrics';
import { Trend } from '@/types/enums';

/**
 * User Data Converters
 */

// Convert from snake_case (database) to camelCase (UI)
export const toUserModel = (userData: UserData): User => {
  return {
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
    role: userData.role,
    isActive: userData.is_active,
    merchantId: userData.merchant_id || null,
    merchantName: userData.merchant_name || null,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at
  };
};

// Convert from camelCase (UI) to snake_case (database)
export const toUserData = (user: User): UserData => {
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    role: user.role,
    is_active: user.isActive,
    merchant_id: user.merchantId || null,
    merchant_name: user.merchantName || null,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };
};

// Convert to edit format (contains both snake_case and camelCase for compatibility)
export const toEditUserData = (userData: UserData | User): EditUserData => {
  if ('firstName' in userData) {
    // It's already in camelCase format
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      isActive: userData.isActive,
      merchantId: userData.merchantId,
      merchantName: userData.merchantName || null,
      first_name: userData.firstName,
      last_name: userData.lastName,
      is_active: userData.isActive,
      merchant_id: userData.merchantId,
      created_at: userData.createdAt,
      updated_at: userData.updatedAt,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };
  } else {
    // It's in snake_case format
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      isActive: userData.is_active,
      merchantId: userData.merchant_id,
      merchantName: userData.merchant_name || null,
      first_name: userData.first_name,
      last_name: userData.last_name,
      is_active: userData.is_active,
      merchant_id: userData.merchant_id,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    };
  }
};

/**
 * Batch conversion utilities
 */
export const toUserModels = (userDataArray: UserData[]): User[] => {
  return userDataArray.map(toUserModel);
};

export const toUserDatas = (userModels: User[]): UserData[] => {
  return userModels.map(toUserData);
};

/**
 * System Metrics Converters
 */
export const toLocalSystemMetric = (metric: SystemMetric): LocalSystemMetric => {
  return {
    id: metric.id,
    metricName: metric.metric_name,
    metricType: metric.metric_type,
    metricValue: metric.metric_value,
    metricDate: metric.metric_date,
    percentageChange: metric.percentage_change,
    trend: metric.trend || Trend.NEUTRAL,
    category: metric.category || 'general',
    createdAt: metric.created_at,
    updatedAt: metric.updated_at,
    // Keep snake_case properties for backward compatibility
    metric_name: metric.metric_name,
    metric_type: metric.metric_type,
    metric_value: metric.metric_value,
    metric_date: metric.metric_date,
    percentage_change: metric.percentage_change,
    created_at: metric.created_at,
    updated_at: metric.updated_at
  };
};

export const toLocalSystemMetrics = (metrics: SystemMetric[]): LocalSystemMetric[] => {
  return metrics.map(toLocalSystemMetric);
};
