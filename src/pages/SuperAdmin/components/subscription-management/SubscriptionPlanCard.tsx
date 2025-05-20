
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit } from 'lucide-react';
import { SubscriptionPlanModel } from '@/types';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlanModel;
  onEdit: (plan: SubscriptionPlanModel) => void;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ plan, onEdit }) => {
  // Parse features array if it's a string
  const features = Array.isArray(plan.features) 
    ? plan.features 
    : (typeof plan.features === 'string' 
      ? JSON.parse(plan.features || '[]') 
      : []);

  return (
    <Card
      className={`overflow-hidden border-t-4 ${
        !plan.isActive
          ? "border-t-gray-300 opacity-70"
          : "border-t-blue-500"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <div className="text-sm text-gray-500 mt-1">
              <span className="text-2xl font-bold">{plan.transactionFeePercentage}%</span>
              <span className="text-gray-500 ml-1">transaction fee</span>
            </div>
          </div>
          <div className="flex gap-1">
            {!plan.isActive && (
              <Badge variant="outline" className="bg-gray-100">
                Inactive
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(plan)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>        
        {plan.description && (
          <p className="text-sm text-gray-500 mb-3">{plan.description}</p>
        )}
        
        <div className="space-y-2">
          {features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanCard;
