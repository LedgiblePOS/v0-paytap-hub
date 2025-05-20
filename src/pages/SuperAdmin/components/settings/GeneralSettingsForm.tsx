
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
import { Loader2 } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  supportEmail: z.string().email("Please enter a valid email address"),
  apiRequestLimit: z.coerce.number().int().min(1, "Limit must be at least 1"),
  allowPublicRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  maintenanceMode: z.boolean(),
});

export type SystemSettingsFormValues = z.infer<typeof formSchema>;

interface GeneralSettingsFormProps {
  defaultValues: SystemSettingsFormValues;
  isLoading: boolean;
  onSubmit: (values: SystemSettingsFormValues) => void;
}

const GeneralSettingsForm = ({ defaultValues, isLoading, onSubmit }: GeneralSettingsFormProps) => {
  const form = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Name */}
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ledgible Go" {...field} />
                </FormControl>
                <FormDescription>
                  The name displayed in the browser title and emails
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Support Email */}
          <FormField
            control={form.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="support@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Contact email displayed to users for support
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* API Request Limit */}
          <FormField
            control={form.control}
            name="apiRequestLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Request Limit (per day)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum API requests allowed per day per merchant
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Access Controls</h3>

          {/* Allow Public Registration */}
          <FormField
            control={form.control}
            name="allowPublicRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow Public Registration</FormLabel>
                  <FormDescription>
                    When enabled, new users can sign up through the registration page
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

          {/* Require Email Verification */}
          <FormField
            control={form.control}
            name="requireEmailVerification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Email Verification</FormLabel>
                  <FormDescription>
                    New accounts must verify their email before accessing the system
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

          {/* Maintenance Mode */}
          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-yellow-200 bg-yellow-50">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-yellow-800">Maintenance Mode</FormLabel>
                  <FormDescription className="text-yellow-700">
                    When enabled, only super admins can access the system. Use with caution!
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

        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default GeneralSettingsForm;
