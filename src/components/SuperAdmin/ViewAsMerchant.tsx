
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useMerchantContext from '@/hooks/useMerchantContext';

export interface MerchantOption {
  id: string;
  name: string;
}

interface ViewAsMerchantProps {
  merchants: MerchantOption[];
}

/**
 * Component to allow super admins to view the application as a specific merchant
 */
const ViewAsMerchant: React.FC<ViewAsMerchantProps> = ({ merchants }) => {
  const { toast } = useToast();
  const { selectedMerchantId, setSelectedMerchantId } = useMerchantContext();

  const handleSelectMerchant = (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    
    const selectedMerchant = merchants.find(m => m.id === merchantId);
    
    toast({
      title: "Merchant View Changed",
      description: selectedMerchant 
        ? `Now viewing as: ${selectedMerchant.name}`
        : "Now viewing with no merchant selected",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">View as:</span>
      <Select
        value={selectedMerchantId || ''}
        onValueChange={handleSelectMerchant}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a merchant to view as" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Merchants</SelectLabel>
            <SelectItem value="">Super Admin (No Merchant)</SelectItem>
            {merchants.map((merchant) => (
              <SelectItem key={merchant.id} value={merchant.id}>
                {merchant.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ViewAsMerchant;
