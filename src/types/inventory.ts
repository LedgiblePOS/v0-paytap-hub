
export interface InventoryItem {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  sku: string;
  quantity: number;
  category: string;
  cost: number;
  selling_price: number;
  supplier_id?: string;
  last_restock_date?: string;
  created_at: string;
  updated_at: string;
  // UI-specific properties that should be properly typed
  price: number; // This was optional but is required in components
  inStock: number; // Required by components
  reorderPoint: number; // Required by components
}

export interface InventoryTransaction {
  id: string;
  inventory_item_id: string;
  merchant_id: string;
  transaction_type: 'restock' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  unit_price?: number;
  notes?: string;
  created_at: string;
  created_by: string;
}

export interface CategorySummary {
  name: string;
  itemCount: number;
  totalValue: number;
}

export interface InventoryStats {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
  categories: CategorySummary[];
}

export interface InventoryFilter {
  search: string;
  category: string;
  stockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ImportResult {
  success: boolean;
  rowsProcessed: number;
  errors: string[];
}

export interface CategoryData {
  category: string;
  count: number;
  value: number;
}

// Type for inventory item creation - now uses required UI properties
export type NewInventoryItem = Omit<InventoryItem, "id" | "created_at" | "updated_at"> & {
  name: string;       // Explicitly required
  merchant_id: string; // Explicitly required
  sku: string;        // Explicitly required
  quantity: number;   // Explicitly required
  category: string;   // Explicitly required
  cost: number;       // Explicitly required
  selling_price: number; // Explicitly required
  price: number;      // Explicitly required
  inStock: number;    // Explicitly required
  reorderPoint: number; // Explicitly required
};

// Type for inventory item updates - ensure id is required
export type UpdateInventoryItem = Partial<InventoryItem> & { id: string };

// Type for local UI inventory representation
export interface InventoryItemUI {
  id: string;
  name: string;
  sku: string;
  price: number;
  inStock: number;
  category: string;
  reorderPoint: number;
  description?: string;
}
