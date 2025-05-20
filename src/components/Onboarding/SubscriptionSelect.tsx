
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionTier } from '@/types/enums';
import { Check, X } from 'lucide-react';

export interface SubscriptionSelectProps {
  selected: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  onContinue: () => void;
  selectedCountry: string;
}

const SubscriptionSelect: React.FC<SubscriptionSelectProps> = ({ selected, onSelect, onContinue, selectedCountry }) => {
  // Define subscription tiers and their details
  const subscriptionTiers = [
    {
      id: SubscriptionTier.STARTER,
      name: 'Starter',
      price: '19.99',
      description: 'Essential tools for growing businesses',
      features: ['2.5% on all transactions', 'Up to 25 products', 'Basic analytics', 'Email & chat support', 'Custom domain'],
      notIncluded: ['Priority support', 'Advanced reporting', 'API access']
    },
    {
      id: SubscriptionTier.PROFESSIONAL,
      name: 'Professional',
      price: '49.99',
      description: 'Advanced features for established businesses',
      features: ['2.0% on all transactions', 'Up to 100 products', 'Advanced analytics', 'Priority support', 'Custom domain', 'API access'],
      notIncluded: ['Dedicated account manager']
    },
    {
      id: SubscriptionTier.ENTERPRISE,
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large businesses',
      features: ['1.5% on all transactions', 'Unlimited products', 'Enterprise analytics', 'Dedicated account manager', 'Custom integrations', 'Service level agreement', '24/7 premium support'],
      notIncluded: []
    }
  ];

  const getCurrencySymbol = (country: string): string => {
    const currencyMap: Record<string, string> = {
      'US': '$',
      'UK': '£',
      'EU': '€',
      'JP': '¥',
      // Add more countries as needed
    };
    
    return currencyMap[country] || '$'; // Default to $ if country not found
  };

  const currencySymbol = getCurrencySymbol(selectedCountry);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Choose Your Subscription</h2>
        <p className="text-muted-foreground">Select the plan that best fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <Card 
            key={tier.id}
            className={`cursor-pointer transition-all ${selected === tier.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => onSelect(tier.id)}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>
                {tier.price === 'Custom' ? (
                  <span>Contact Sales</span>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{currencySymbol}{tier.price}</span>
                    <span className="ml-1 text-sm text-muted-foreground">/month</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selected === tier.id ? "default" : "outline"}
                className="w-full"
                onClick={() => onSelect(tier.id)}
              >
                {selected === tier.id ? 'Selected' : 'Select'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onContinue} disabled={!selected}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionSelect;
