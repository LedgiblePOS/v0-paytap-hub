
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: CurrencyRegion;
  isDefault?: boolean;
}

export enum CurrencyRegion {
  CARIBBEAN = "Caribbean",
  NORTH_AMERICA = "North America",
  LATIN_AMERICA = "Latin America",
  EUROPE = "Europe",
  ASIA = "Asia",
  AFRICA = "Africa",
  OCEANIA = "Oceania"
}

// Common currencies across regions
export const CURRENCIES: Currency[] = [
  // North America
  { code: "USD", name: "US Dollar", symbol: "$", region: CurrencyRegion.NORTH_AMERICA, isDefault: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "$", region: CurrencyRegion.NORTH_AMERICA },
  { code: "MXN", name: "Mexican Peso", symbol: "$", region: CurrencyRegion.NORTH_AMERICA },
  
  // Caribbean
  { code: "BBD", name: "Barbadian Dollar", symbol: "$", region: CurrencyRegion.CARIBBEAN },
  { code: "JMD", name: "Jamaican Dollar", symbol: "J$", region: CurrencyRegion.CARIBBEAN },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$", region: CurrencyRegion.CARIBBEAN },
  { code: "XCD", name: "East Caribbean Dollar", symbol: "EC$", region: CurrencyRegion.CARIBBEAN },
  { code: "BSD", name: "Bahamian Dollar", symbol: "B$", region: CurrencyRegion.CARIBBEAN },
  
  // Latin America
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: CurrencyRegion.LATIN_AMERICA },
  { code: "ARS", name: "Argentine Peso", symbol: "$", region: CurrencyRegion.LATIN_AMERICA },
  { code: "CLP", name: "Chilean Peso", symbol: "$", region: CurrencyRegion.LATIN_AMERICA },
  { code: "COP", name: "Colombian Peso", symbol: "$", region: CurrencyRegion.LATIN_AMERICA },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", region: CurrencyRegion.LATIN_AMERICA },
  
  // Europe
  { code: "EUR", name: "Euro", symbol: "€", region: CurrencyRegion.EUROPE },
  { code: "GBP", name: "British Pound", symbol: "£", region: CurrencyRegion.EUROPE },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", region: CurrencyRegion.EUROPE },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", region: CurrencyRegion.EUROPE },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: CurrencyRegion.EUROPE },
  
  // Asia
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: CurrencyRegion.ASIA },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: CurrencyRegion.ASIA },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: CurrencyRegion.ASIA },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: CurrencyRegion.ASIA },
  { code: "KRW", name: "South Korean Won", symbol: "₩", region: CurrencyRegion.ASIA },
  
  // Africa
  { code: "ZAR", name: "South African Rand", symbol: "R", region: CurrencyRegion.AFRICA },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: CurrencyRegion.AFRICA },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", region: CurrencyRegion.AFRICA },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: CurrencyRegion.AFRICA },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", region: CurrencyRegion.AFRICA },
  
  // Oceania
  { code: "AUD", name: "Australian Dollar", symbol: "$", region: CurrencyRegion.OCEANIA },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$", region: CurrencyRegion.OCEANIA },
];

// Function to get currencies by region
export const getCurrenciesByRegion = (region: CurrencyRegion): Currency[] => {
  return CURRENCIES.filter(currency => currency.region === region);
};

// Function to get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find(currency => currency.code === code);
};

// Function to get default currency
export const getDefaultCurrency = (): Currency => {
  return CURRENCIES.find(currency => currency.isDefault) || CURRENCIES[0];
};

// Function to group currencies by region
export const getCurrenciesByRegionMap = (): Record<CurrencyRegion, Currency[]> => {
  const map: Record<CurrencyRegion, Currency[]> = {
    [CurrencyRegion.NORTH_AMERICA]: [],
    [CurrencyRegion.CARIBBEAN]: [],
    [CurrencyRegion.LATIN_AMERICA]: [],
    [CurrencyRegion.EUROPE]: [],
    [CurrencyRegion.ASIA]: [],
    [CurrencyRegion.AFRICA]: [],
    [CurrencyRegion.OCEANIA]: []
  };
  
  CURRENCIES.forEach(currency => {
    map[currency.region].push(currency);
  });
  
  return map;
};
