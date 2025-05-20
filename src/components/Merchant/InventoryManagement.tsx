
import React from 'react';
import { useInventory } from '@/hooks/useInventory';
import InventoryDashboard from '../Inventory/InventoryDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const InventoryManagement: React.FC = () => {
  const { stats, isLoading, error } = useInventory();
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading inventory data: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <InventoryDashboard />
    </div>
  );
};

export default InventoryManagement;
