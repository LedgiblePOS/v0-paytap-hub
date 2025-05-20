
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecuritySettingsFormValues } from "../SecuritySettings/types";

interface SessionSecuritySettingsProps {
  form: UseFormReturn<SecuritySettingsFormValues>;
}

const SessionSecuritySettings: React.FC<SessionSecuritySettingsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="max_login_attempts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Login Attempts</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={10}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                />
              </FormControl>
              <FormDescription>
                Number of failed attempts before account is locked
              </FormDescription>
              <FormMessage />
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
                  {...field}
                  type="number"
                  min={5}
                  max={1440}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 5)}
                />
              </FormControl>
              <FormDescription>
                Time in minutes before user is automatically logged out
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default SessionSecuritySettings;
