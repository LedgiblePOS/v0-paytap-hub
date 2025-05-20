
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CountrySelector from "./CountrySelector";
import CurrencySelector from "./CurrencySelector";
import { Country } from "@/types/countries";
import { Currency } from "@/types/currency";
import { MerchantFormValues } from "./MerchantFormSchema";

interface BusinessInfoSectionProps {
  form: UseFormReturn<MerchantFormValues>;
  isLoading: boolean;
  onCountryChange: (country: Country) => void;
  onCurrencyChange: (currency: Currency) => void;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({
  form,
  isLoading,
  onCountryChange,
  onCurrencyChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Business Name" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Name" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="your@email.com" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="(123) 456-7890" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessDescription"
        render={({ field }) => (
          <FormItem className="col-span-1 md:col-span-2">
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe your business"
                className="resize-none"
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <CountrySelector 
                onCountryChange={onCountryChange}
                onCurrencyChange={onCurrencyChange}
                initialCountryCode={field.value}
                disabled={isLoading}
              />
            </FormControl>
            <FormDescription>
              Select your country to set your default currency
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Currency</FormLabel>
            <FormControl>
              <CurrencySelector 
                onCurrencyChange={onCurrencyChange}
                initialCurrencyCode={field.value}
                disabled={isLoading}
              />
            </FormControl>
            <FormDescription>
              Select the currency you'll use for transactions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessInfoSection;
