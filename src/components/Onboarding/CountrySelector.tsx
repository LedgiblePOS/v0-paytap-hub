
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { COUNTRIES, Country, getCurrencyByCountryCode } from "@/types/countries";
import { Currency, getCurrencyByCode } from "@/types/currency";

interface CountrySelectorProps {
  onCountryChange: (country: Country) => void;
  onCurrencyChange: (currency: Currency) => void;
  initialCountryCode?: string;
  disabled?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onCountryChange,
  onCurrencyChange,
  initialCountryCode,
  disabled = false
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    if (initialCountryCode) {
      const country = COUNTRIES.find(c => c.code === initialCountryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [initialCountryCode]);

  const handleCountryChange = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code);
    if (country) {
      setSelectedCountry(country);
      onCountryChange(country);
      
      // Update the currency based on the country
      const currencyCode = getCurrencyByCountryCode(code);
      const currency = getCurrencyByCode(currencyCode);
      if (currency) {
        onCurrencyChange(currency);
      }
    }
  };

  return (
    <Select
      onValueChange={handleCountryChange}
      defaultValue={initialCountryCode}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'North America').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Caribbean</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'Caribbean').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Latin America</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'Latin America').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'Europe').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'Asia').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Africa</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'Africa').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Oceania</SelectLabel>
          {COUNTRIES.filter(c => c.region === 'Oceania').map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
