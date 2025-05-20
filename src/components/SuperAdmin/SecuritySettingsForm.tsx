
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PasswordSecuritySettings from "./Security/PasswordSecuritySettings";
import SessionSecuritySettings from "./Security/SessionSecuritySettings";
import SecurityNotice from "./Security/SecurityNotice";
import { SecuritySettingsFormValues } from "./SecuritySettings/types";

export const securitySettingsSchema = z.object({
  password_min_length: z.number().min(6).max(30),
  password_require_special_chars: z.boolean(),
  password_require_numbers: z.boolean(),
  max_login_attempts: z.number().min(1).max(10),
  session_timeout: z.number().min(5).max(1440),
});

const SecuritySettingsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      password_min_length: 8,
      password_require_special_chars: true,
      password_require_numbers: true,
      max_login_attempts: 5,
      session_timeout: 60,
    },
  });

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      setIsFetching(true);
      try {
        const { data, error } = await supabase
          .from("security_settings")
          .select("*")
          .single();

        if (error) throw error;
        
        if (data) {
          form.reset({
            password_min_length: data.password_min_length,
            password_require_special_chars: data.password_require_special_chars,
            password_require_numbers: data.password_require_numbers,
            max_login_attempts: data.max_login_attempts,
            session_timeout: data.session_timeout,
          });
        }
      } catch (error: any) {
        console.error("Error fetching security settings:", error);
        toast({
          title: "Error",
          description: "Failed to load security settings",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchSecuritySettings();
  }, [form, toast]);

  const onSubmit = async (values: SecuritySettingsFormValues) => {
    setIsLoading(true);
    try {
      // Get current user for audit purposes
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("security_settings")
        .update({
          ...values,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1); // There should only be one security settings record

      if (error) throw error;

      // Log this action in audit logs
      await supabase.from("audit_logs").insert({
        action: "UPDATE",
        resource: "security_settings",
        description: "Updated security settings",
        user_id: user?.id
      });
      
      toast({
        title: "Settings saved",
        description: "Security settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating security settings:", error);
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure authentication and security parameters</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Security Settings</CardTitle>
        </div>
        <CardDescription>Configure authentication and security parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordSecuritySettings form={form} />
              <SessionSecuritySettings form={form} />
            </div>

            <SecurityNotice />

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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsForm;
