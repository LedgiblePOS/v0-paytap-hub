import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CategoryData } from '@/types/inventory';
import performanceMonitoringService from '@/services/performanceMonitoringService';
import errorTrackingService from '@/services/errorTrackingService';

/**
 * Hook for fetching and processing inventory data for the dashboard
 */
export const useInventoryData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  
  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);
  
  // Use a ref to prevent multiple simultaneous fetch calls
  const isLoadingRef = useRef(false);
  
  // Use a ref to track if data has been fetched
  const dataFetchedRef = useRef(false);

  // Memoize functions to prevent recreation on each render
  const processCategoryData = useCallback((data: any[]): CategoryData[] => {
    const categoryMap: Record<string, { count: number, value: number }> = {};
    
    data.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, value: 0 };
      }
      categoryMap[category].count += 1;
      categoryMap[category].value += (item.price * item.inStock);
    });
    
    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      value: data.value
    }));
  }, []);

  // Mock data generators with useCallback to maintain referential equality
  const generateMockInventoryData = useCallback(() => {
    return [
      { 
        id: '1',
        name: 'Product A', 
        sku: 'SKU-001', 
        price: 29.99, 
        inStock: 25, 
        category: 'Electronics',
        barcode: 'SKU-001',
        category_id: 'electronics-1',
        created_at: new Date().toISOString(),
        description: 'Product A description',
        image_url: '',
        in_stock: 25,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'Product B', 
        sku: 'SKU-002', 
        price: 19.99, 
        inStock: 3, 
        category: 'Office',
        barcode: 'SKU-002',
        category_id: 'office-1',
        created_at: new Date().toISOString(),
        description: 'Product B description',
        image_url: '',
        in_stock: 3,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '3', 
        name: 'Product C', 
        sku: 'SKU-003', 
        price: 49.99, 
        inStock: 10, 
        category: 'Electronics',
        barcode: 'SKU-003',
        category_id: 'electronics-1',
        created_at: new Date().toISOString(),
        description: 'Product C description',
        image_url: '',
        in_stock: 10,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '4', 
        name: 'Product D', 
        sku: 'SKU-004', 
        price: 9.99, 
        inStock: 2, 
        category: 'Accessories',
        barcode: 'SKU-004',
        category_id: 'accessories-1',
        created_at: new Date().toISOString(),
        description: 'Product D description',
        image_url: '',
        in_stock: 2,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '5', 
        name: 'Product E', 
        sku: 'SKU-005', 
        price: 39.99, 
        inStock: 15, 
        category: 'Clothing',
        barcode: 'SKU-005',
        category_id: 'clothing-1',
        created_at: new Date().toISOString(),
        description: 'Product E description',
        image_url: '',
        in_stock: 15,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '6', 
        name: 'Product F', 
        sku: 'SKU-006', 
        price: 59.99, 
        inStock: 8, 
        category: 'Electronics',
        barcode: 'SKU-006',
        category_id: 'electronics-1',
        created_at: new Date().toISOString(),
        description: 'Product F description',
        image_url: '',
        in_stock: 8,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '7', 
        name: 'Product G', 
        sku: 'SKU-007', 
        price: 14.99, 
        inStock: 4, 
        category: 'Office',
        barcode: 'SKU-007',
        category_id: 'office-1',
        created_at: new Date().toISOString(),
        description: 'Product G description',
        image_url: '',
        in_stock: 4,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
      { 
        id: '8', 
        name: 'Product H', 
        sku: 'SKU-008', 
        price: 24.99, 
        inStock: 12, 
        category: 'Accessories',
        barcode: 'SKU-008',
        category_id: 'accessories-1',
        created_at: new Date().toISOString(),
        description: 'Product H description',
        image_url: '',
        in_stock: 12,
        merchant_id: 'mock-merchant-id',
        updated_at: new Date().toISOString()
      },
    ];
  }, []);

  const generateMockCategoryData = useCallback((): CategoryData[] => [
    { category: 'Electronics', count: 3, value: 1199.85 },
    { category: 'Office', count: 2, value: 174.94 },
    { category: 'Accessories', count: 2, value: 319.86 },
    { category: 'Clothing', count: 1, value: 599.85 },
  ], []);

  const fetchInventoryData = useCallback(async () => {
    // Don't fetch if already loading or no user or if already fetched
    if (isLoadingRef.current || !user || !isMountedRef.current || dataFetchedRef.current) return;
    
    // Mark as loading
    isLoadingRef.current = true;
    
    // Only update state if component is still mounted
    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      // Track API performance
      performanceMonitoringService.startApiTimer('fetchInventory');
      
      // Fetch products from Supabase
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('merchant_id', user.id);
      
      performanceMonitoringService.endApiTimer('fetchInventory');
      
      if (productsError) throw productsError;
      
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;
      
      let dataToProcess = products || [];
      
      if (!products || products.length === 0) {
        // Generate mock data for development/demo if no products exist
        dataToProcess = generateMockInventoryData();
      }
      
      // Map database products to the format needed by the UI
      const mappedData = dataToProcess.map((product: any) => ({
        id: product.id,
        name: product.name || 'Unnamed Product',
        sku: product.barcode || `SKU-${product.id.substring(0, 6)}`,
        price: product.price || 0,
        inStock: product.in_stock || 0,
        category: product.category_id || 'Uncategorized',
        reorderPoint: 5, // Default reorder point
        imageUrl: product.image_url,
        description: product.description,
        barcode: product.barcode || `SKU-${product.id.substring(0, 6)}`,
        category_id: product.category_id || 'Uncategorized',
        created_at: product.created_at || new Date().toISOString(),
        image_url: product.image_url || '',
        in_stock: product.in_stock || 0,
        merchant_id: product.merchant_id || user.id,
        updated_at: product.updated_at || new Date().toISOString()
      }));
      
      // Important: Only update state if still mounted
      if (isMountedRef.current) {
        setInventoryData(mappedData);
        
        // Process low stock items - below 5 units
        const lowStock = mappedData.filter(item => item.inStock > 0 && item.inStock < 5);
        setLowStockItems(lowStock);
        
        // Calculate total inventory value
        const totalValue = mappedData.reduce((sum, item) => sum + (item.price * item.inStock), 0);
        setTotalValue(totalValue);
        
        // Process category data
        const categories = processCategoryData(mappedData);
        setCategoryData(categories);
        
        // Mark as fetched
        dataFetchedRef.current = true;
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch inventory data'));
        
        // Track the error
        if (err instanceof Error) {
          errorTrackingService.trackError(err, { 
            module: 'inventory',
            function: 'useInventoryData.fetchInventoryData'
          });
        }
        
        // Use mock data as fallback
        const mockData = generateMockInventoryData();
        
        if (isMountedRef.current) {
          setInventoryData(mockData);
          setLowStockItems(mockData.filter(item => item.inStock < 5));
          setTotalValue(mockData.reduce((sum, item) => sum + (item.price * item.inStock), 0));
          setCategoryData(generateMockCategoryData());
          
          // Mark as fetched even with mock data
          dataFetchedRef.current = true;
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, [user, generateMockInventoryData, generateMockCategoryData, processCategoryData, toast]);
  
  // Function to safely refetch data
  const refetch = useCallback(() => {
    if (!isMountedRef.current || isLoadingRef.current) return;
    
    // Reset the fetched flag to force a new fetch
    dataFetchedRef.current = false;
    
    // Only fetch if we have all required dependencies
    if (user) {
      fetchInventoryData();
    }
  }, [fetchInventoryData, user]);
  
  // FIX: Using a separate effect for cleanup to avoid dependency cycles
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // FIX: Main effect for data fetching with stable dependencies
  useEffect(() => {
    // Reset mount state on component mount
    isMountedRef.current = true;
    
    console.log("Inventory data hook mounting, user:", user?.id);
    
    // Only fetch if we have a user and haven't fetched yet
    if (user && !dataFetchedRef.current && !isLoadingRef.current) {
      // Add a small delay to prevent rapid consecutive calls
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          fetchInventoryData();
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [user, fetchInventoryData]);

  return {
    inventoryData,
    lowStockItems,
    isLoading,
    error,
    totalValue,
    categoryData,
    refetch
  };
};

export default useInventoryData;
