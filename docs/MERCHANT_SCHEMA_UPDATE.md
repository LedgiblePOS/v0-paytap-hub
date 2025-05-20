
# Merchant Schema Update

The merchants table needs to be updated to include:
- `country` - to store the country code (e.g., US, CA, etc.)
- `default_currency` - to store the currency code (e.g., USD, EUR, etc.)

Run the following SQL command in the Supabase SQL Editor:

```sql
-- Add country and default_currency columns to merchants table
ALTER TABLE merchants 
ADD COLUMN country TEXT,
ADD COLUMN default_currency TEXT DEFAULT 'USD';
```

This will add the necessary columns to the merchants table to store country and currency information.
