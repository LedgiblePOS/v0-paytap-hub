
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryStats, NewInventoryItem, UpdateInventoryItem, InventoryItemUI } from '@/types/inventory';
import { useAuth } from '@/contexts/AuthContext';

export const useInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch inventory items
  const {
    data: inventoryItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Transform database records to include UI-required fields
      return (data as any[]).map(item => ({
        ...item,
        price: item.selling_price, // Map selling_price to price for UI
        inStock: item.quantity,    // Map quantity to inStock for UI
        reorderPoint: 5,          // Default reorderPoint
      })) as InventoryItem[];
    },
  });

  // Calculate inventory stats
  const stats: InventoryStats = {
    totalProducts: inventoryItems.length,
    lowStockCount: inventoryItems.filter(item => item.inStock > 0 && item.inStock <= 5).length,
    outOfStockCount: inventoryItems.filter(item => item.inStock <= 0).length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0),
    categories: Object.entries(
      inventoryItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { count: 0, value: 0 };
        }
        acc[item.category].count++;
        acc[item.category].value += item.selling_price * item.quantity;
        return acc;
      }, {} as Record<string, { count: number; value: number }>)
    ).map(([name, { count, value }]) => ({
      name,
      itemCount: count,
      totalValue: value,
    })),
  };

  // Add inventory item
  const addItem = useMutation({
    mutationFn: async (newItem: NewInventoryItem) => {
      // Make sure to transform UI fields back to database fields
      const dbItem = {
        ...newItem,
        quantity: newItem.inStock,
        selling_price: newItem.price,
      };
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([dbItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Item Added",
        description: "Inventory item has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update inventory item - ensure we require the id property
  const updateItem = useMutation({
    mutationFn: async (item: UpdateInventoryItem) => {
      // If UI fields are present, map them to DB fields
      const updates: any = { ...item };
      if ('inStock' in item) {
        updates.quantity = item.inStock;
      }
      if ('price' in item) {
        updates.selling_price = item.price;
      }
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Item Updated",
        description: "Inventory item has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete inventory item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Item Deleted",
        description: "Inventory item has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const lowStockItems = inventoryItems.filter(item => item.inStock > 0 && item.inStock <= 5);
  const outOfStockItems = inventoryItems.filter(item => item.inStock <= 0);

  return {
    inventoryItems,
    stats,
    lowStockItems,
    outOfStockItems,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['inventory'] })
  };
};
