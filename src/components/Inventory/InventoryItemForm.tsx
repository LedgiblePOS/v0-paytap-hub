
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InventoryItem } from '@/types/inventory';

interface InventoryItemFormProps {
  item?: Partial<InventoryItem>;
  categories: string[];
  suppliers: { id: string; name: string }[];
  onSubmit: (data: Partial<InventoryItem>) => void;
  isSubmitting: boolean;
  merchantId: string;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  item,
  categories,
  suppliers,
  onSubmit,
  isSubmitting,
  merchantId
}) => {
  const isEditing = !!item?.id;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<Partial<InventoryItem>>({
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      category: 'Uncategorized',
      quantity: 0,
      cost: 0,
      selling_price: 0,
      ...item
    }
  });

  // Reset form when item prop changes
  useEffect(() => {
    if (item) {
      reset({
        name: item.name || '',
        sku: item.sku || '',
        description: item.description || '',
        category: item.category || 'Uncategorized',
        quantity: item.quantity || 0,
        cost: item.cost || 0,
        selling_price: item.selling_price || 0,
        supplier_id: item.supplier_id || undefined,
        ...item
      });
    }
  }, [item, reset]);

  const submitForm = (data: Partial<InventoryItem>) => {
    onSubmit({
      ...data,
      merchant_id: merchantId
    });
  };

  const watchCategory = watch('category');
  
  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            {...register('name', { required: 'Product name is required' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            placeholder="Enter SKU"
            {...register('sku', { required: 'SKU is required' })}
          />
          {errors.sku && (
            <p className="text-sm text-red-500">{errors.sku.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          className="min-h-[80px]"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            defaultValue={watchCategory}
            onValueChange={(value) => setValue('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {['Uncategorized', ...categories].map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier_id">Supplier</Label>
          <Select
            defaultValue={item?.supplier_id}
            onValueChange={(value) => setValue('supplier_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            {...register('quantity', { 
              required: 'Quantity is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Quantity cannot be negative' } 
            })}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($) *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            {...register('cost', { 
              required: 'Cost is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Cost cannot be negative' } 
            })}
          />
          {errors.cost && (
            <p className="text-sm text-red-500">{errors.cost.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="selling_price">Selling Price ($) *</Label>
          <Input
            id="selling_price"
            type="number"
            step="0.01"
            min="0"
            {...register('selling_price', { 
              required: 'Selling price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Selling price cannot be negative' } 
            })}
          />
          {errors.selling_price && (
            <p className="text-sm text-red-500">{errors.selling_price.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;
