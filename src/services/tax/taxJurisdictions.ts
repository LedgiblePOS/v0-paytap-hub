
export interface TaxJurisdiction {
  id: string;
  name: string;
  country: string;
  region: string;
  salesTaxRate: number;
  stateTaxRate: number;
  localTaxRate: number;
}

// Common tax jurisdictions with preset rates
export const taxJurisdictions: TaxJurisdiction[] = [
  {
    id: "us-ca",
    name: "California",
    country: "United States",
    region: "West",
    salesTaxRate: 7.25,
    stateTaxRate: 6.0,
    localTaxRate: 1.25,
  },
  {
    id: "us-ny",
    name: "New York",
    country: "United States",
    region: "Northeast",
    salesTaxRate: 8.875,
    stateTaxRate: 4.0,
    localTaxRate: 4.875,
  },
  {
    id: "us-tx",
    name: "Texas",
    country: "United States",
    region: "South",
    salesTaxRate: 6.25,
    stateTaxRate: 6.25,
    localTaxRate: 0,
  },
  {
    id: "us-fl",
    name: "Florida",
    country: "United States",
    region: "Southeast",
    salesTaxRate: 6.0,
    stateTaxRate: 6.0,
    localTaxRate: 0,
  },
  {
    id: "us-wa",
    name: "Washington",
    country: "United States",
    region: "Northwest",
    salesTaxRate: 6.5,
    stateTaxRate: 6.5,
    localTaxRate: 0,
  },
  {
    id: "us-il",
    name: "Illinois",
    country: "United States",
    region: "Midwest",
    salesTaxRate: 8.0,
    stateTaxRate: 6.25,
    localTaxRate: 1.75,
  },
  {
    id: "ca-on",
    name: "Ontario",
    country: "Canada",
    region: "Central",
    salesTaxRate: 13.0,
    stateTaxRate: 8.0,
    localTaxRate: 5.0,
  },
  {
    id: "ca-bc",
    name: "British Columbia",
    country: "Canada",
    region: "West",
    salesTaxRate: 12.0,
    stateTaxRate: 7.0,
    localTaxRate: 5.0,
  },
  {
    id: "uk-gb",
    name: "Great Britain",
    country: "United Kingdom",
    region: "Europe",
    salesTaxRate: 20.0,
    stateTaxRate: 20.0,
    localTaxRate: 0,
  },
  {
    id: "custom",
    name: "Custom",
    country: "",
    region: "",
    salesTaxRate: 0,
    stateTaxRate: 0,
    localTaxRate: 0,
  },
];

export const getJurisdictionById = (id: string): TaxJurisdiction | undefined => {
  return taxJurisdictions.find(jurisdiction => jurisdiction.id === id);
};

export const getJurisdictionsByCountry = (country: string): TaxJurisdiction[] => {
  return taxJurisdictions.filter(jurisdiction => jurisdiction.country === country);
};
