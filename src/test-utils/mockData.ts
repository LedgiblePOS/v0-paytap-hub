
import { UserRole, UserData, UserModel } from "@/types/user";
import { MerchantModel, MerchantEntity } from "@/types/merchant";
import { Trend } from "@/types/user";

// Mock User Data for tests
export const createMockUser = (overrides?: Partial<UserData>): UserData => ({
  id: "user-123",
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  role: UserRole.USER,
  is_active: true,
  created_at: "2023-01-01T00:00:00Z",
  ...overrides
});

// Mock Merchant Data for tests
export const createMockMerchant = (overrides?: Partial<MerchantModel>): MerchantModel => ({
  id: "merchant-123",
  userId: "user-123",
  businessName: "Test Business",
  businessEmail: "business@example.com",
  country: "United States",
  defaultCurrency: "USD",
  subscriptionTier: "BASIC",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  ...overrides
});

// Mock Merchant Entity
export const createMockMerchantEntity = (overrides?: Partial<MerchantEntity>): MerchantEntity => ({
  id: "merchant-123",
  user_id: "user-123",
  business_name: "Test Business",
  business_email: "business@example.com",
  country: "United States",
  default_currency: "USD",
  subscription_tier: "BASIC",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides
});

// Mock metrics data for tests
export const createMockMetric = (overrides?: Partial<any>) => ({
  id: "metric-123",
  metricName: "Active Users",
  metricType: "users",
  metricValue: 100,
  metricDate: "2023-01-01T00:00:00Z",
  percentageChange: 5,
  trend: Trend.UP,
  category: "USER_ACTIVITY",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  ...overrides
});
