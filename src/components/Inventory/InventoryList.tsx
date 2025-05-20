
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { InventoryItem, InventoryFilter } from '@/types/inventory';
import InventoryItemForm from './InventoryItemForm';

interface InventoryListProps {
  inventoryItems: InventoryItem[];
  isLoading: boolean;
  categories: string[];
  suppliers: { id: string; name: string }[];
  filter: InventoryFilter;
  merchantId: string;
  onUpdateItem: (item: Partial<InventoryItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

const InventoryList: React.FC<InventoryListProps> = ({
  inventoryItems,
  isLoading,
  categories,
  suppliers,
  filter,
  merchantId,
  onUpdateItem,
  onDeleteItem
}) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = filter.search 
      ? item.name.toLowerCase().includes(filter.search.toLowerCase()) || 
        item.sku.toLowerCase().includes(filter.search.toLowerCase()) ||
        (item.description?.toLowerCase().includes(filter.search.toLowerCase()))
      : true;

    const matchesCategory = filter.category
      ? item.category === filter.category
      : true;

    let matchesStockStatus = true;
    if (filter.stockStatus === 'in_stock') matchesStockStatus = item.quantity > 5;
    if (filter.stockStatus === 'low_stock') matchesStockStatus = item.quantity > 0 && item.quantity <= 5;
    if (filter.stockStatus === 'out_of_stock') matchesStockStatus = item.quantity <= 0;

    return matchesSearch && matchesCategory && matchesStockStatus;
  });

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    setIsDeletingItem(item);
  };

  const confirmDelete = async () => {
    if (!isDeletingItem) return;
    
    try {
      setIsSubmitting(true);
      await onDeleteItem(isDeletingItem.id);
    } finally {
      setIsSubmitting(false);
      setIsDeletingItem(null);
    }
  };

  const handleSubmit = async (data: Partial<InventoryItem>) => {
    try {
      setIsSubmitting(true);
      await onUpdateItem(data);
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockStatusBadge = (quantity: number) => {
    if (quantity <= 0) return <Badge variant="destructive">Out of stock</Badge>;
    if (quantity <= 5) return <Badge variant="warning" className="bg-yellow-500">Low stock</Badge>;
    return <Badge variant="success" className="bg-green-500">In stock</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No inventory items found</h3>
        <p className="mt-2 text-muted-foreground">
          {filter.search || filter.category || filter.stockStatus !== 'all'
            ? "Try adjusting your filters or add new items to your inventory."
            : "Add some products to your inventory to get started."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-center w-[80px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right">${item.selling_price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${(item.selling_price * item.quantity).toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  {getStockStatusBadge(item.quantity)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditItem(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Inventory Item</DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            item={editingItem || {}}
            categories={categories}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            merchantId={merchantId}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!isDeletingItem}
        onOpenChange={(open) => !open && setIsDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{isDeletingItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InventoryList;
