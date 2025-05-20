
import { SubscriptionTier } from '@/types/enums';

export const SUBSCRIPTION_TIERS = [
  SubscriptionTier.FREE,
  SubscriptionTier.STARTER,
  SubscriptionTier.PROFESSIONAL,
  SubscriptionTier.PRO,
  SubscriptionTier.ENTERPRISE,
  SubscriptionTier.SCALE_UP,
  SubscriptionTier.GO_GLOBAL
];

export const TIER_DESCRIPTIONS = {
  [SubscriptionTier.FREE]: 'Basic features, up to 5 products',
  [SubscriptionTier.STARTER]: 'Essential features, up to 25 products',
  [SubscriptionTier.PROFESSIONAL]: 'Advanced features, up to 100 products',
  [SubscriptionTier.PRO]: 'Advanced features, up to 100 products',
  [SubscriptionTier.ENTERPRISE]: 'Full feature set, unlimited products',
  [SubscriptionTier.SCALE_UP]: 'Scale-up features, up to 500 products',
  [SubscriptionTier.GO_GLOBAL]: 'Global features, unlimited products'
};

export const TIER_REQUIREMENTS = {
  [SubscriptionTier.FREE]: {
    productLimit: 5,
    transactionFee: 0.05,
    monthlyCost: 0
  },
  [SubscriptionTier.STARTER]: {
    productLimit: 25,
    transactionFee: 0.03,
    monthlyCost: 9.99
  },
  [SubscriptionTier.PROFESSIONAL]: {
    productLimit: 100,
    transactionFee: 0.025,
    monthlyCost: 29.99
  },
  [SubscriptionTier.PRO]: {
    productLimit: 100,
    transactionFee: 0.025,
    monthlyCost: 29.99
  },
  [SubscriptionTier.ENTERPRISE]: {
    productLimit: Infinity,
    transactionFee: 0.02,
    monthlyCost: 99.99
  },
  [SubscriptionTier.SCALE_UP]: {
    productLimit: 500,
    transactionFee: 0.022,
    monthlyCost: 49.99
  },
  [SubscriptionTier.GO_GLOBAL]: {
    productLimit: Infinity,
    transactionFee: 0.018,
    monthlyCost: 199.99
  }
};
