
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface SecuritySettingsFormValues {
  password_min_length: number;
  password_require_special_chars: boolean;
  password_require_numbers: boolean;
  max_login_attempts: number;
  session_timeout: number;
}

interface PasswordSecuritySettingsProps {
  form: UseFormReturn<SecuritySettingsFormValues>;
}

const PasswordSecuritySettings: React.FC<PasswordSecuritySettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="password_min_length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Password Length</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Minimum number of characters required for passwords
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="password_require_special_chars"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Require Special Characters</FormLabel>
                <FormDescription>
                  Passwords must include special characters (e.g., !@#$%)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_require_numbers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Require Numbers</FormLabel>
                <FormDescription>
                  Passwords must include at least one number
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PasswordSecuritySettings;
