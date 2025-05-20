
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { SubscriptionPlanModel } from '@/types';

interface SubscriptionPlanFormValues {
  name: string;
  description: string;
  isActive: boolean;
  transactionFeePercentage: number;
}

interface SubscriptionPlanFormProps {
  initialValues?: Partial<SubscriptionPlanModel>;
  onSubmit: (values: SubscriptionPlanFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  isDeleting?: boolean;
  mode: 'create' | 'edit';
}

const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  isSubmitting,
  isDeleting = false,
  mode
}) => {
  const [formValues, setFormValues] = useState<SubscriptionPlanFormValues>({
    name: '',
    description: '',
    isActive: true,
    transactionFeePercentage: 0,
  });

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        name: initialValues.name || '',
        description: initialValues.description || '',
        isActive: initialValues.isActive ?? true,
        transactionFeePercentage: initialValues.transactionFeePercentage || 0,
      });
    }
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'transactionFeePercentage' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormValues({
      ...formValues,
      isActive: checked,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Include legacy fields with default values for backward compatibility
    await onSubmit({
      ...formValues,
      // Add these fields with default values to ensure the service works with existing data structure
      monthlyPrice: 0,
      annualPrice: 0,
      productLimit: 999999,
      features: ['Transaction fee based pricing']
    } as any);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="transactionFeePercentage">Transaction Fee (%)</Label>
          <Input
            id="transactionFeePercentage"
            name="transactionFeePercentage"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formValues.transactionFeePercentage}
            onChange={handleInputChange}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Percentage fee charged on all card and CBDC transactions
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="isActive"
            name="isActive"
            checked={formValues.isActive}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="isActive">Active Plan</Label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || isDeleting}
        >
          Cancel
        </Button>
        
        {mode === 'edit' && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Plan'
            )}
          </Button>
        )}
        
        <Button type="submit" disabled={isSubmitting || isDeleting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>{mode === 'create' ? 'Create Plan' : 'Update Plan'}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SubscriptionPlanForm;
