
import { SubscriptionTier } from '@/types/enums';
import { MerchantEntity } from '@/types/merchant';

export interface CreateSubscriptionPlanInput {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  productLimit: number;
  transactionFeePercentage: number;
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanInput {
  name?: string;
  monthlyPrice?: number;
  annualPrice?: number;
  features?: string[];
  productLimit?: number;
  transactionFeePercentage?: number;
  isActive?: boolean;
}

export interface SubscriptionPlanWithStats extends SubscriptionPlanModel {
  merchantCount?: number;
}

export interface SubscriptionPlanModel {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isActive: boolean;
  productLimit: number;
  transactionFeePercentage: number;
  createdAt?: string;
  updatedAt?: string;
}
