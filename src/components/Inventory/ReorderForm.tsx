import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ReorderRequest, createReorderExpense } from '@/services/accounting/supplierService';
import { getSuppliers } from '@/services/supplierService';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  inStock: number;
  category: string;
  reorderPoint: number;
}

interface ReorderFormProps {
  lowStockItems: InventoryItem[];
  merchantId: string;
  onReorderComplete: () => void;
}

const ReorderForm: React.FC<ReorderFormProps> = ({
  lowStockItems,
  merchantId,
  onReorderComplete
}) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  
  const watchedQuantities = watch();
  
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const supplierList = await getSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load suppliers",
          variant: "destructive"
        });
      }
    };
    
    loadSuppliers();
  }, [toast]);
  
  useEffect(() => {
    const initialSelected: Record<string, boolean> = {};
    lowStockItems.forEach(item => {
      initialSelected[item.id] = true;
      setValue(`quantity-${item.id}`, Math.max(item.reorderPoint - item.inStock, 5));
    });
    setSelectedItems(initialSelected);
  }, [lowStockItems, setValue]);
  
  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const reorderItems = lowStockItems
        .filter(item => selectedItems[item.id])
        .map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: parseInt(data[`quantity-${item.id}`], 10),
          unitPrice: parseFloat(data[`price-${item.id}`] || item.price.toString())
        }));
      
      if (reorderItems.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one item to reorder",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const reorderRequest: ReorderRequest = {
        supplierId: data.supplier,
        items: reorderItems,
        deliveryDate: data.deliveryDate,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        paymentType: data.paymentMethod
      };
      
      await createReorderExpense(merchantId, reorderRequest);
      
      toast({
        title: "Success",
        description: "Reorder submitted successfully",
      });
      
      reset();
      onReorderComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to submit reorder: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const calculateTotal = () => {
    let total = 0;
    
    lowStockItems.forEach(item => {
      if (selectedItems[item.id]) {
        const quantity = parseInt(watchedQuantities[`quantity-${item.id}`] || '0', 10);
        const price = parseFloat(watchedQuantities[`price-${item.id}`] || item.price.toString());
        total += quantity * price;
      }
    });
    
    return total.toFixed(2);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reorder Low Stock Items</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="reorderForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select 
                {...register("supplier", { required: "Supplier is required" })}
                onValueChange={(value) => setValue("supplier", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplier && (
                <p className="text-sm text-red-500">{errors.supplier.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                {...register("paymentMethod", { required: "Payment method is required" })}
                onValueChange={(value) => setValue("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-sm text-red-500">{errors.paymentMethod.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
              <Input
                type="date"
                id="deliveryDate"
                {...register("deliveryDate", { required: "Delivery date is required" })}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deliveryDate && (
                <p className="text-sm text-red-500">{errors.deliveryDate.message as string}</p>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Items to Reorder</h3>
              <div className="space-y-4">
                {lowStockItems.map(item => (
                  <div key={item.id} className="p-3 border rounded-md">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`select-${item.id}`}
                        checked={selectedItems[item.id] || false}
                        onChange={() => handleItemToggle(item.id)}
                        className="mr-2"
                      />
                      <Label htmlFor={`select-${item.id}`} className="font-medium">
                        {item.name} ({item.sku})
                      </Label>
                    </div>
                    
                    {selectedItems[item.id] && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                          <Input
                            type="number"
                            id={`quantity-${item.id}`}
                            {...register(`quantity-${item.id}`, {
                              required: "Quantity is required",
                              min: { value: 1, message: "Quantity must be at least 1" }
                            })}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`price-${item.id}`}>Unit Price ($)</Label>
                          <Input
                            type="number"
                            id={`price-${item.id}`}
                            {...register(`price-${item.id}`, {
                              required: "Price is required",
                              min: { value: 0.01, message: "Price must be positive" }
                            })}
                            defaultValue={item.price.toFixed(2)}
                            step="0.01"
                            min="0.01"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add any special instructions for the supplier"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-lg font-bold">
          Total: ${calculateTotal()}
        </div>
        <Button 
          type="submit" 
          form="reorderForm"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit Reorder"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReorderForm;
