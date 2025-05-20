
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, PlusCircle } from 'lucide-react';

interface EmptySubscriptionPlansProps {
  onCreateClick: () => void;
}

const EmptySubscriptionPlans: React.FC<EmptySubscriptionPlansProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-10">
      <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
      <h3 className="text-lg font-medium">No subscription plans</h3>
      <p className="text-gray-500 mb-4">
        Create your first subscription plan to offer to merchants.
      </p>
      <Button onClick={onCreateClick}>
        <PlusCircle className="h-4 w-4 mr-1" />
        Create Subscription Plan
      </Button>
    </div>
  );
};

export default EmptySubscriptionPlans;
