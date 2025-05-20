
import { Product } from '@/types';

// Calculate stock summary stats
export const getStockSummary = (products: Product[]) => {
  return {
    total: products.length,
    inStock: products.filter(item => (item.in_stock || 0) > 5).length,
    lowStock: products.filter(item => (item.in_stock || 0) > 0 && (item.in_stock || 0) <= 5).length,
    outOfStock: products.filter(item => (item.in_stock || 0) <= 0).length
  };
};

// Get low stock products
export const getLowStockProducts = (products: Product[], threshold: number = 5) => {
  return products.filter(item => (item.in_stock || 0) > 0 && (item.in_stock || 0) <= threshold);
};

// Get out of stock products
export const getOutOfStockProducts = (products: Product[]) => {
  return products.filter(item => (item.in_stock || 0) <= 0);
};

// Calculate stock value
export const calculateStockValue = (products: Product[]) => {
  return products.reduce((total, product) => {
    return total + (product.price * (product.in_stock || 0));
  }, 0);
};

// Process products by category
export const getCategoryBreakdown = (products: Product[]) => {
  const categories: Record<string, { count: number, value: number }> = {};
  
  products.forEach(product => {
    const category = product.category_id || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = { count: 0, value: 0 };
    }
    categories[category].count += 1;
    categories[category].value += (product.price * (product.in_stock || 0));
  });
  
  return categories;
};
