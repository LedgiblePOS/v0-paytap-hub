import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionTier } from '@/types/enums';
import SubscriptionSelect from './SubscriptionSelect';
import CountrySelect from './CountrySelect';

// Define the form schema
const formSchema = z.object({
  businessName: z.string().min(2, { message: 'Business name must be at least 2 characters' }),
  businessEmail: z.string().email({ message: 'Please enter a valid email address' }),
  businessPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  businessAddress: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  businessWebsite: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  country: z.string().min(1, { message: 'Please select a country' }),
  city: z.string().min(1, { message: 'Please enter a city' }),
  zipCode: z.string().min(1, { message: 'Please enter a ZIP/Postal code' })
});

type FormValues = z.infer<typeof formSchema>;

interface MerchantFormProps {
  onComplete: (data: FormValues & { subscriptionTier: SubscriptionTier }) => void;
}

const MerchantForm: React.FC<MerchantFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'subscription'>('details');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.STARTER);
  const [formData, setFormData] = useState<FormValues | null>(null);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      businessEmail: '',
      businessPhone: '',
      businessAddress: '',
      businessWebsite: '',
      country: 'US',
      city: '',
      zipCode: ''
    }
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    toast({
      title: 'Business details saved',
      description: 'Please select your subscription plan'
    });
    
    setFormData(data);
    setStep('subscription');
  };

  // Handle subscription selection
  const handleSubscriptionSelect = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
  };

  // Handle final submission
  const handleContinue = () => {
    if (formData) {
      onComplete({
        ...formData,
        subscriptionTier: selectedTier
      });
    }
  };

  // Render business details form
  if (step === 'details') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Enter your business details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Suite 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Country</FormLabel>
                        <CountrySelect value={field.value} onChange={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="businessWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your business website URL if available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">
                  Continue to Select Subscription
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  // Render subscription selection
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Choose Your Subscription</CardTitle>
        <CardDescription>
          Select the plan that best fits your business needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionSelect
          selected={selectedTier}
          onSelect={handleSubscriptionSelect}
          onContinue={handleContinue}
          selectedCountry={formData?.country || 'US'}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('details')}>
          Back to Business Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MerchantForm;
