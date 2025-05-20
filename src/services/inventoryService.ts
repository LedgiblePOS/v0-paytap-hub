
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { toProductModels } from "@/utils/modelConversions";

// Get inventory items
export const getInventoryItems = async (merchantId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('merchant_id', merchantId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name || 'Unnamed Product',
      sku: item.barcode || `SKU-${item.id.substring(0, 6)}`,
      price: Number(item.price) || 0,
      inStock: item.in_stock || 0,
      category: item.category_id || 'Uncategorized',
      reorderPoint: 5 // Default reorder point
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

// Get inventory summary for a merchant
export const getInventorySummary = async (merchantId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, in_stock, price')
      .eq('merchant_id', merchantId);
    
    if (error) throw error;
    
    const summary = {
      total: data.length,
      inStock: data.filter(item => item.in_stock > 5).length,
      lowStock: data.filter(item => item.in_stock > 0 && item.in_stock <= 5).length,
      outOfStock: data.filter(item => item.in_stock <= 0).length
    };
    
    const totalValue = data.reduce((sum, product) => sum + (product.price * (product.in_stock || 0)), 0);
    
    return {
      totalProducts: summary.total,
      totalValue,
      lowStockItems: summary.lowStock,
      outOfStockItems: summary.outOfStock,
      stockStatusBreakdown: {
        inStock: summary.inStock,
        lowStock: summary.lowStock,
        outOfStock: summary.outOfStock
      }
    };
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    throw error;
  }
};

// Update product stock levels
export const updateProductStock = async (productId: string, newStockLevel: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ in_stock: newStockLevel, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

// Get low stock products (below threshold)
export const getLowStockProducts = async (merchantId: string, threshold: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('merchant_id', merchantId)
      .lt('in_stock', threshold)
      .gt('in_stock', 0)
      .order('in_stock', { ascending: true });
    
    if (error) throw error;
    
    return toProductModels(data as Product[]);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    throw error;
  }
};

// Get inventory analytics
export const getInventoryAnalytics = async (merchantId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category_id, price, in_stock')
      .eq('merchant_id', merchantId);
      
    if (error) throw error;
    
    // Process analytics data
    const categories: Record<string, { value: number, count: number }> = {};
    
    data.forEach(item => {
      const category = item.category_id || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = { value: 0, count: 0 };
      }
      categories[category].value += (item.price * (item.in_stock || 0));
      categories[category].count += 1;
    });
    
    const totalValue = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
    
    return {
      categories: Object.entries(categories).map(([name, data]) => ({
        name,
        value: data.value,
        count: data.count,
        percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0
      })),
      totalValue
    };
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    throw error;
  }
};
