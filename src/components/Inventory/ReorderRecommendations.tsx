import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ReorderForm from './ReorderForm';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  inStock: number;
  category: string;
  reorderPoint: number;
}

interface ReorderRecommendationsProps {
  lowStockItems: InventoryItem[];
}

const ReorderRecommendations: React.FC<ReorderRecommendationsProps> = ({ lowStockItems }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReorderForm, setShowReorderForm] = useState(false);
  
  const handleReorderClick = () => {
    if (lowStockItems.length === 0) {
      toast({
        title: "No items to reorder",
        description: "There are no items that need to be reordered at this time.",
        variant: "destructive"
      });
      return;
    }
    setShowReorderForm(true);
  };
  
  const handleReorderComplete = () => {
    setShowReorderForm(false);
    toast({
      title: "Reorder Complete",
      description: "Your reorder has been submitted and recorded as an expense",
    });
  };
  
  if (lowStockItems.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No items need to be reordered at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {showReorderForm ? (
            <ReorderForm 
              lowStockItems={lowStockItems}
              merchantId={user?.id || ''}
              onReorderComplete={handleReorderComplete}
            />
          ) : (
            <>
              <div className="space-y-4">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Current Stock: <span className="text-amber-500 font-medium">{item.inStock}</span> / Reorder Point: {item.reorderPoint}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button onClick={handleReorderClick} className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Reorder Selected Items
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ReorderRecommendations;
