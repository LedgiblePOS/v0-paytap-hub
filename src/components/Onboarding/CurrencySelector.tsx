
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Currency, CurrencyRegion, CURRENCIES, getCurrenciesByRegion } from "@/types/currency";

interface CurrencySelectorProps {
  onCurrencyChange: (currency: Currency) => void;
  initialCurrencyCode?: string;
  disabled?: boolean;
  showAllCurrencies?: boolean;
  region?: CurrencyRegion;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  onCurrencyChange,
  initialCurrencyCode = "USD",
  disabled = false,
  showAllCurrencies = true,
  region
}) => {
  const handleCurrencyChange = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code);
    if (currency) {
      onCurrencyChange(currency);
    }
  };

  // Filter currencies by region if provided
  const currencies = region ? getCurrenciesByRegion(region) : CURRENCIES;

  return (
    <Select
      onValueChange={handleCurrencyChange}
      defaultValue={initialCurrencyCode}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a currency" />
      </SelectTrigger>
      <SelectContent>
        {showAllCurrencies ? (
          <>
            <SelectGroup>
              <SelectLabel>North America</SelectLabel>
              {CURRENCIES.filter(c => c.region === CurrencyRegion.NORTH_AMERICA).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Caribbean</SelectLabel>
              {CURRENCIES.filter(c => c.region === CurrencyRegion.CARIBBEAN).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Latin America</SelectLabel>
              {CURRENCIES.filter(c => c.region === CurrencyRegion.LATIN_AMERICA).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              {CURRENCIES.filter(c => c.region === CurrencyRegion.EUROPE).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              {CURRENCIES.filter(c => c.region === CurrencyRegion.ASIA).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Africa</SelectLabel>
              {CURRENCIES.filter(c => c.region === CurrencyRegion.AFRICA).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectGroup>
          </>
        ) : (
          <SelectGroup>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name} ({currency.symbol})
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
