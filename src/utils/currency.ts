
/**
 * Formats a number as currency with $ sign and 2 decimal places
 * @param value The numeric value to format as currency
 * @returns A formatted string representing the currency value
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Parses a currency string to a number
 * @param value The currency string to parse
 * @returns A number representing the currency value
 */
export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleanValue) || 0;
};
