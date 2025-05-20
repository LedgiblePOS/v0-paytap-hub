
import { SubscriptionTier } from './enums';

export interface SubscriptionPlanModel {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  productLimit: number;
  isActive: boolean;
  transactionFeePercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionTierDetails {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
}

// Update SubscriptionTier enum to include new values
export const extendedSubscriptionTiers = {
  ...SubscriptionTier,
  SCALE_UP: 'SCALE_UP' as SubscriptionTier,
  GO_GLOBAL: 'GO_GLOBAL' as SubscriptionTier,
}
