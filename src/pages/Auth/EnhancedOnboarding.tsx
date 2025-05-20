
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { extendedSubscriptionTiers, SubscriptionTier } from '@/types';

interface PlanFeature {
  title: string;
  starter: boolean;
  scaleUp: boolean;
  goGlobal: boolean;
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    tier: SubscriptionTier.STARTER,
    description: 'Essential features for new businesses',
  },
  {
    id: 'scale_up',
    name: 'Scale Up',
    price: 29,
    tier: extendedSubscriptionTiers.SCALE_UP,
    description: 'Grow your business with advanced features',
  },
  {
    id: 'go_global',
    name: 'Go Global',
    price: 99,
    tier: extendedSubscriptionTiers.GO_GLOBAL,
    description: 'Enterprise-grade tools for global businesses',
  }
];

const features: PlanFeature[] = [
  { title: 'Multi-currency support', starter: false, scaleUp: true, goGlobal: true },
  { title: 'Online Checkout Page', starter: true, scaleUp: true, goGlobal: true },
  { title: '24/7 Customer Support', starter: false, scaleUp: false, goGlobal: true },
  { title: 'Custom Branding', starter: false, scaleUp: true, goGlobal: true },
  { title: 'Custom Domain', starter: false, scaleUp: false, goGlobal: true },
  { title: 'Payment Analytics', starter: false, scaleUp: true, goGlobal: true },
  { title: 'API Access', starter: false, scaleUp: true, goGlobal: true },
  { title: 'Multiple Payment Methods', starter: true, scaleUp: true, goGlobal: true },
  { title: 'Fraud Protection', starter: false, scaleUp: true, goGlobal: true },
];

interface EnhancedOnboardingProps {
  onSelectPlan: (plan: string) => void;
  nextStep: () => void;
}

const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({ onSelectPlan, nextStep }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
      nextStep();
    }
  };

  const getPlanClass = (planId: string) => {
    return selectedPlan === planId 
      ? 'border-2 border-primary shadow-md' 
      : 'border hover:border-primary transition-all';
  };

  return (
    <div className="mb-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600">Select the plan that best fits your business needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`${getPlanClass(plan.id)} cursor-pointer`} onClick={() => handlePlanSelect(plan.id)}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature, index) => {
                  let included = false;
                  
                  if (plan.id === 'starter') {
                    included = feature.starter;
                  } else if (plan.id === 'scale_up') {
                    included = feature.scaleUp;
                  } else if (plan.id === 'go_global') {
                    included = feature.goGlobal;
                  }
                  
                  return (
                    <li key={index} className="flex items-center">
                      {included ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <div className="h-4 w-4 border-2 rounded-full border-gray-300 mr-2"></div>
                      )}
                      <span className={included ? '' : 'text-gray-400'}>{feature.title}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedPlan === plan.id ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => handlePlanSelect(plan.id)}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleContinue} 
          disabled={!selectedPlan}
          className="gap-2"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedOnboarding;
