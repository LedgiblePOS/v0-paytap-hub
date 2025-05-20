
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  inStock: number;
  category: string;
}

interface InventorySummaryProps {
  inventoryData: InventoryItem[];
  isLoading: boolean;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ 
  inventoryData = [], // Default to empty array
  isLoading 
}) => {
  // Use useMemo to calculate summary data only when inventoryData changes
  const { totalProducts, lowStockItems, outOfStockItems, totalValue } = useMemo(() => {
    if (!inventoryData || !Array.isArray(inventoryData)) {
      return {
        totalProducts: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        totalValue: 0
      };
    }
    
    const total = inventoryData.length;
    const lowStock = inventoryData.filter(item => item.inStock > 0 && item.inStock < 5).length;
    const outOfStock = inventoryData.filter(item => item.inStock <= 0).length;
    const value = inventoryData.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const inStock = typeof item.inStock === 'number' ? item.inStock : 0;
      return sum + (price * inStock);
    }, 0);
    
    return {
      totalProducts: total,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
      totalValue: value
    };
  }, [inventoryData]);
  
  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-6 w-24 mb-2 bg-gray-200 animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8" data-testid="inventory-summary">
      <CardHeader>
        <CardTitle>Inventory Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-500">{lowStockItems}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-2xl font-bold text-red-500">{outOfStockItems}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Make sure we're using React.memo to prevent unnecessary re-renders
export default React.memo(InventorySummary);
