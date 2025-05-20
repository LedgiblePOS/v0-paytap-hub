
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SecurityNotice from "../Security/SecurityNotice";
import { SecuritySettingsFormValues } from "./types";

const securitySettingsFormSchema = z.object({
  password_min_length: z.number().min(8).max(32),
  password_require_numbers: z.boolean(),
  password_require_special_chars: z.boolean(),
  max_login_attempts: z.number().min(1).max(10),
  session_timeout: z.number().min(15).max(240),
});

interface SecuritySettingsFormProps {
  defaultValues: SecuritySettingsFormValues;
  onSettingsSaved?: () => void;
}

const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({ 
  defaultValues,
  onSettingsSaved 
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsFormSchema),
    defaultValues: {
      password_min_length: defaultValues.password_min_length || 8,
      password_require_numbers: defaultValues.password_require_numbers || true,
      password_require_special_chars: defaultValues.password_require_special_chars || true,
      max_login_attempts: defaultValues.max_login_attempts || 5,
      session_timeout: defaultValues.session_timeout || 60,
    },
  });

  const onSubmit = async (values: SecuritySettingsFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('security_settings')
        .update({
          password_min_length: values.password_min_length,
          password_require_numbers: values.password_require_numbers,
          password_require_special_chars: values.password_require_special_chars,
          max_login_attempts: values.max_login_attempts,
          session_timeout: values.session_timeout,
        })
        .eq('id', 1);
        
      if (error) throw error;
      
      // Log to audit log
      await supabase.from('audit_logs').insert({
        action: 'UPDATE',
        resource: 'security_settings',
        user_id: (await supabase.auth.getUser()).data.user?.id,
        description: 'Updated security settings',
      });

      toast({
        title: "Security settings updated",
        description: "Your security settings have been saved successfully.",
      });
      
      if (onSettingsSaved) {
        onSettingsSaved();
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure password policies and security settings for all users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecurityNotice />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password_min_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Minimum Length</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum required length for user passwords (recommended: 8 or higher).
                    </FormDescription>
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
                        Force passwords to contain at least one number.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
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
                        Force passwords to contain at least one special character (e.g. !@#$%).
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_login_attempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Login Attempts</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of failed login attempts before account is temporarily locked.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="session_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Minutes of inactivity before a user is automatically logged out.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="px-0">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsForm;
