import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Merchant {
  id: string;
  name: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  city: string;
  state: string;
  zip_code: string;
  postal_code?: string;
  country: string;
  subscription_tier: string;
  is_verified: boolean;
  is_active: boolean;
  verification_data: any;
  created_at: string;
  updated_at: string;
  user_email: string;
  user_id: string;
  default_currency: string;
  product_count: number;
  product_limit: number;
}

interface UseMerchantsListResult {
  merchants: Merchant[];
  loading: boolean;
  error: string | null;
}

const useMerchantsList = (): UseMerchantsListResult => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('merchants')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          if (data && Array.isArray(data)) {
            const updatedMerchants = data.map(data => {
              const updatedMerchantData = {
                ...data,
                name: data.business_name || data.name || '',
                zip_code: data.zip_code || '',
                postal_code: data.postal_code || data.zip_code || '' // Ensure postal_code exists if zip_code is used
              };
              return updatedMerchantData as Merchant;
            });
            setMerchants(updatedMerchants);
          } else {
            setMerchants([]);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  return { merchants, loading, error };
};

export default useMerchantsList;
