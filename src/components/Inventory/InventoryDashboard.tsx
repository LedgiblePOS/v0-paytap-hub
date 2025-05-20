import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/hooks/useInventory';
import { Package, AlertTriangle, XCircle, DollarSign, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { InventoryFilter as InventoryFilterType, ImportResult, InventoryItem, NewInventoryItem, UpdateInventoryItem } from '@/types/inventory';
import InventoryFilter from './InventoryFilter';
import InventoryList from './InventoryList';
import InventoryItemForm from './InventoryItemForm';
import InventoryImportExport from './InventoryImportExport';
import ReorderRecommendations from './ReorderRecommendations';

const InventoryDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    inventoryItems, 
    stats, 
    lowStockItems, 
    isLoading, 
    error, 
    addItem, 
    updateItem, 
    deleteItem,
    refetch
  } = useInventory();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<InventoryFilterType>({
    search: '',
    category: '',
    stockStatus: 'all'
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading inventory data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Get unique categories from inventory items
  const categories = Array.from(new Set(
    inventoryItems.map(item => item.category)
  )).filter(Boolean);

  // Organize suppliers from inventory items
  const suppliers = Array.from(new Set(
    inventoryItems
      .filter(item => item.supplier_id)
      .map(item => item.supplier_id)
  )).map(id => {
    const item = inventoryItems.find(i => i.supplier_id === id);
    return {
      id: id as string,
      name: `Supplier for ${item?.name || 'Unknown'}`
    };
  });

  const handleAddItem = async (data: NewInventoryItem) => {
    try {
      setIsSubmitting(true);
      await addItem.mutateAsync(data);
      setIsAddDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure the return type matches ImportResult exactly
  const handleImport = async (items: Partial<NewInventoryItem>[]): Promise<ImportResult> => {
    try {
      // Process each item in the array
      const results = await Promise.allSettled(
        items.map(item => {
          // Ensure the item has all required fields for NewInventoryItem
          const newItem = {
            merchant_id: user?.id || '',
            name: item.name || '',
            sku: item.sku || '',
            quantity: item.quantity || 0,
            inStock: item.inStock || 0,
            category: item.category || '',
            cost: item.cost || 0,
            selling_price: item.selling_price || 0,
            price: item.price || 0,
            reorderPoint: item.reorderPoint || 5,
          } as NewInventoryItem;
          
          return addItem.mutateAsync(newItem);
        })
      );
      
      // Count successful and failed imports
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected');
      
      // Collect error messages - ensure this is a string[]
      const errors = failures.map((f, i) => {
        if (f.status === 'rejected') {
          return `Row ${i+1}: ${f.reason.message || 'Unknown error'}`;
        }
        return '';
      }).filter(Boolean);
      
      return {
        success: failures.length === 0,
        rowsProcessed: successes,
        errors: errors
      };
    } catch (error) {
      console.error("Import error:", error);
      return {
        success: false,
        rowsProcessed: 0,
        errors: [(error as Error).message || 'Unknown error during import']
      };
    }
  };

  const handleFilterChange = (newFilter: InventoryFilterType) => {
    setFilter(newFilter);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Add/Import/Export Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Inventory Management</h1>
        <div className="flex flex-wrap gap-2">
          <InventoryImportExport 
            inventoryItems={inventoryItems}
            onImport={handleImport}
            merchantId={user?.id || ''}
          />
          <Button 
            className="flex items-center gap-2"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.lowStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.outOfStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reorder Recommendations */}
      {lowStockItems.length > 0 && (
        <ReorderRecommendations lowStockItems={lowStockItems} />
      )}

      {/* Filter Controls */}
      <InventoryFilter 
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Inventory List */}
      <InventoryList 
        inventoryItems={inventoryItems as any[]} // Type assertion to fix incompatible type error
        isLoading={isLoading}
        categories={categories}
        suppliers={suppliers}
        filter={filter}
        merchantId={user?.id || ''}
        onUpdateItem={async (item: UpdateInventoryItem) => {
          if (!item.id) {
            throw new Error("ID is required for updating an item");
          }
          await updateItem.mutateAsync(item);
        }}
        onDeleteItem={async (id: string) => {
          await deleteItem.mutateAsync(id);
        }}
      />

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            categories={categories}
            suppliers={suppliers}
            onSubmit={handleAddItem}
            isSubmitting={isSubmitting}
            merchantId={user?.id || ''}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryDashboard;
