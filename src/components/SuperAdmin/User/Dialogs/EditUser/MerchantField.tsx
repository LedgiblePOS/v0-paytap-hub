
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MerchantOption } from '@/types/user';

interface MerchantFieldProps {
  merchantId: string | null;
  merchantOptions: MerchantOption[];
  isLoading: boolean;
  onChange: (value: string) => void;
}

export const MerchantField: React.FC<MerchantFieldProps> = ({
  merchantId,
  merchantOptions,
  isLoading,
  onChange
}) => {
  if (!merchantOptions.length) return null;

  // Ensure merchantOptions have value and label properties
  const normalizedOptions = merchantOptions.map(option => ({
    ...option,
    value: option.value || option.id,
    label: option.label || option.name
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="merchantId">Merchant</Label>
      <Select
        value={merchantId || ""}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger id="merchantId">
          <SelectValue placeholder="Select merchant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None</SelectItem>
          {normalizedOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
