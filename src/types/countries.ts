
import { CurrencyRegion } from './currency';

export interface Country {
  code: string;
  name: string;
  currency: string;
  region: string;
}

export const COUNTRIES: Country[] = [
  // North America
  { code: "US", name: "United States", currency: "USD", region: "North America" },
  { code: "CA", name: "Canada", currency: "CAD", region: "North America" },
  { code: "MX", name: "Mexico", currency: "MXN", region: "North America" },
  
  // Caribbean
  { code: "BB", name: "Barbados", currency: "BBD", region: "Caribbean" },
  { code: "JM", name: "Jamaica", currency: "JMD", region: "Caribbean" },
  { code: "TT", name: "Trinidad and Tobago", currency: "TTD", region: "Caribbean" },
  { code: "BS", name: "Bahamas", currency: "BSD", region: "Caribbean" },
  { code: "DM", name: "Dominica", currency: "XCD", region: "Caribbean" },
  { code: "LC", name: "Saint Lucia", currency: "XCD", region: "Caribbean" },
  { code: "VC", name: "Saint Vincent and the Grenadines", currency: "XCD", region: "Caribbean" },
  { code: "GD", name: "Grenada", currency: "XCD", region: "Caribbean" },
  { code: "AG", name: "Antigua and Barbuda", currency: "XCD", region: "Caribbean" },
  { code: "KN", name: "Saint Kitts and Nevis", currency: "XCD", region: "Caribbean" },
  
  // Latin America
  { code: "BR", name: "Brazil", currency: "BRL", region: "Latin America" },
  { code: "AR", name: "Argentina", currency: "ARS", region: "Latin America" },
  { code: "CL", name: "Chile", currency: "CLP", region: "Latin America" },
  { code: "CO", name: "Colombia", currency: "COP", region: "Latin America" },
  { code: "PE", name: "Peru", currency: "PEN", region: "Latin America" },
  
  // Europe
  { code: "FR", name: "France", currency: "EUR", region: "Europe" },
  { code: "DE", name: "Germany", currency: "EUR", region: "Europe" },
  { code: "IT", name: "Italy", currency: "EUR", region: "Europe" },
  { code: "ES", name: "Spain", currency: "EUR", region: "Europe" },
  { code: "GB", name: "United Kingdom", currency: "GBP", region: "Europe" },
  { code: "CH", name: "Switzerland", currency: "CHF", region: "Europe" },
  { code: "NO", name: "Norway", currency: "NOK", region: "Europe" },
  { code: "SE", name: "Sweden", currency: "SEK", region: "Europe" },
  
  // Asia
  { code: "JP", name: "Japan", currency: "JPY", region: "Asia" },
  { code: "CN", name: "China", currency: "CNY", region: "Asia" },
  { code: "IN", name: "India", currency: "INR", region: "Asia" },
  { code: "SG", name: "Singapore", currency: "SGD", region: "Asia" },
  { code: "KR", name: "South Korea", currency: "KRW", region: "Asia" },
  
  // Africa
  { code: "ZA", name: "South Africa", currency: "ZAR", region: "Africa" },
  { code: "NG", name: "Nigeria", currency: "NGN", region: "Africa" },
  { code: "EG", name: "Egypt", currency: "EGP", region: "Africa" },
  { code: "KE", name: "Kenya", currency: "KES", region: "Africa" },
  { code: "GH", name: "Ghana", currency: "GHS", region: "Africa" },
  
  // Oceania
  { code: "AU", name: "Australia", currency: "AUD", region: "Oceania" },
  { code: "NZ", name: "New Zealand", currency: "NZD", region: "Oceania" },
];

// Get currency by country code
export const getCurrencyByCountryCode = (countryCode: string): string => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.currency || "USD";
};

// Get country by code
export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(c => c.code === code);
};

// Group countries by region
export const getCountriesByRegion = (): Record<string, Country[]> => {
  const regions: Record<string, Country[]> = {};
  
  COUNTRIES.forEach(country => {
    if (!regions[country.region]) {
      regions[country.region] = [];
    }
    regions[country.region].push(country);
  });
  
  return regions;
};

// Convert region name to CurrencyRegion enum
export const regionToCurrencyRegion = (region: string): CurrencyRegion => {
  switch (region) {
    case "North America":
      return CurrencyRegion.NORTH_AMERICA;
    case "Caribbean":
      return CurrencyRegion.CARIBBEAN;
    case "Latin America":
      return CurrencyRegion.LATIN_AMERICA;
    case "Europe":
      return CurrencyRegion.EUROPE;
    case "Asia":
      return CurrencyRegion.ASIA;
    case "Africa":
      return CurrencyRegion.AFRICA;
    case "Oceania":
      return CurrencyRegion.OCEANIA;
    default:
      return CurrencyRegion.NORTH_AMERICA;
  }
};
