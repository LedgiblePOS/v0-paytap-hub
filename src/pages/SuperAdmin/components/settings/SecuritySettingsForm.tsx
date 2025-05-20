
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  passwordMinLength: z.coerce.number().int().min(6, "Minimum length must be at least 6").max(32, "Maximum length should not exceed 32"),
  passwordRequireSpecialChars: z.boolean(),
  passwordRequireNumbers: z.boolean(),
  maxLoginAttempts: z.coerce.number().int().min(1, "Min 1 attempt").max(10, "Max 10 attempts"),
  sessionTimeout: z.coerce.number().int().min(5, "Min 5 minutes").max(1440, "Max 24 hours (1440 minutes)")
});

export type SecuritySettingsFormValues = z.infer<typeof formSchema>;

interface SecuritySettingsFormProps {
  defaultValues: SecuritySettingsFormValues;
  isLoading: boolean;
  onSubmit: (values: SecuritySettingsFormValues) => void;
}

const SecuritySettingsForm = ({ defaultValues, isLoading, onSubmit }: SecuritySettingsFormProps) => {
  const form = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Password Requirements
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure the password requirements for all users on the platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Min Length */}
            <FormField
              control={form.control}
              name="passwordMinLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Password Length</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum number of characters required for passwords
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Login Attempts */}
            <FormField
              control={form.control}
              name="maxLoginAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Login Attempts</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of failed attempts before account is temporarily locked
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Session Timeout */}
            <FormField
              control={form.control}
              name="sessionTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Timeout (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Duration of user sessions before requiring re-authentication
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-4">
            {/* Require Special Characters */}
            <FormField
              control={form.control}
              name="passwordRequireSpecialChars"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Special Characters</FormLabel>
                    <FormDescription>
                      Passwords must contain at least one special character
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Require Numbers */}
            <FormField
              control={form.control}
              name="passwordRequireNumbers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Numbers</FormLabel>
                    <FormDescription>
                      Passwords must contain at least one number
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-800">Security Notice</h4>
          <p className="text-sm text-blue-700 mt-1">
            Changes to security settings will apply to all new accounts and password resets.
            Existing passwords will not be affected until users change them.
          </p>
        </div>

        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Security Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SecuritySettingsForm;
