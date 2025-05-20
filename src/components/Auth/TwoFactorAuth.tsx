
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const twoFactorSchema = z.object({
  code: z.string().min(6).max(6).regex(/^\d+$/, "Code must only contain numbers"),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  email?: string;
  actionDescription: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  onVerify,
  onCancel,
  email,
  actionDescription
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: TwoFactorFormValues) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const isVerified = await onVerify(values.code);
      
      if (isVerified) {
        toast({
          title: "Verification successful",
          description: "You have been successfully verified.",
        });
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      console.error("2FA verification error:", err);
      setError(err.message || "Verification failed. Please try again.");
      toast({
        title: "Verification failed",
        description: "An error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Two-Factor Verification</CardTitle>
        </div>
        <CardDescription>
          Additional verification is required for {actionDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm text-gray-600 mb-4">
          <p>
            A verification code has been sent to your email
            {email && <strong> ({email})</strong>}.
          </p>
          <p className="mt-2">
            Please enter the 6-digit code to continue.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      {...field}
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the 6-digit code sent to your email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3">
              <Button type="submit" disabled={isVerifying} className="flex-1">
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isVerifying}
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg border-t flex justify-center">
        <div className="flex items-center text-sm text-gray-500">
          <Lock className="h-3 w-3 mr-1" />
          Secured by two-factor authentication
        </div>
      </CardFooter>
    </Card>
  );
};

export default TwoFactorAuth;
