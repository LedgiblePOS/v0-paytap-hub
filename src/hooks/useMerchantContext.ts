
import { useContext } from 'react';
import { MerchantContext } from '@/contexts/MerchantContext';

export function useMerchantContext() {
  const context = useContext(MerchantContext);
  
  if (context === undefined) {
    throw new Error('useMerchantContext must be used within a MerchantProvider');
  }
  
  return context;
}

export default useMerchantContext;
