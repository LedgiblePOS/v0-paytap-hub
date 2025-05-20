
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Type for exchange rate response
interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

// Cache exchange rates for 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

export const useExchangeRates = (baseCurrency: string = 'USD') => {
  return useQuery({
    queryKey: ['exchangeRates', baseCurrency],
    queryFn: async () => {
      try {
        // Check if we have cached rates in Supabase
        const { data: cached } = await supabase
          .from('exchange_rates')
          .select('*')
          .eq('base_currency', baseCurrency)
          .single();

        // If cached data exists and is less than 1 hour old, use it
        if (cached && Date.now() - new Date(cached.updated_at).getTime() < CACHE_DURATION) {
          return cached.rates as Record<string, number>;
        }

        // Fetch new rates from exchange rate API
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
        );
        const data: ExchangeRateResponse = await response.json();

        // Update cache in Supabase
        await supabase.from('exchange_rates').upsert({
          base_currency: baseCurrency,
          rates: data.rates,
          updated_at: new Date().toISOString()
        });

        return data.rates;
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback to default rates if API call fails
        return {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
          CAD: 1.25,
          AUD: 1.35
        };
      }
    },
    staleTime: CACHE_DURATION, // Keep data fresh for 1 hour
    refetchOnWindowFocus: false
  });
};

export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === toCurrency) return amount;
  if (!rates) return amount;

  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // Convert to USD first (base currency), then to target currency
  const amountInUSD = amount / fromRate;
  return Math.round(amountInUSD * toRate);
};
