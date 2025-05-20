import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProductEntity } from '@/types/product';
import { CategoryModel } from '@/types/category';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProductFormProps {
  product?: Partial<ProductEntity>;
  onSubmit?: (product: Partial<ProductEntity>) => Promise<void>;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product = {}, 
  onSubmit,
  isEdit = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Partial<ProductEntity>>({
    name: '',
    description: '',
    price: 0,
    in_stock: 0,
    category_id: '',
    image_url: '',
    barcode: '',
    ...product
  });
  
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('merchant_id', user?.merchantId);
          
        if (error) throw error;
        
        // Convert snake_case to camelCase for CategoryModel
        const formattedCategories = data?.map(category => ({
          id: category.id,
          merchantId: category.merchant_id,
          name: category.name,
          description: category.description,
          createdAt: category.created_at,
          updatedAt: category.updated_at
        })) || [];
        
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      }
    };
    
    fetchCategories();
  }, [user?.merchantId, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category_id: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.name) {
        throw new Error('Product name is required');
      }
      
      if (formData.price === undefined || formData.price < 0) {
        throw new Error('Valid price is required');
      }
      
      if (!user?.merchantId) {
        throw new Error('Merchant ID is required');
      }
      
      const productData: Partial<ProductEntity> = {
        ...formData,
        merchant_id: user.merchantId,
      };
      
      if (onSubmit) {
        await onSubmit(productData);
      } else {
        // Default submission logic - Fixed the insert operation
        if (isEdit) {
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', product.id);
          
          if (error) throw error;
        } else {
          // Fix: Pass a single object, not an array wrapped in brackets
          const { error } = await supabase
            .from('products')
            .insert(productData);
          
          if (error) throw error;
        }
        
        toast({
          title: 'Success',
          description: `Product ${isEdit ? 'updated' : 'created'} successfully`,
        });
        
        navigate('/products');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''}
              onChange={handleNumberChange}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="in_stock">Stock Quantity</Label>
            <Input
              id="in_stock"
              name="in_stock"
              type="number"
              step="1"
              min="0"
              value={formData.in_stock || ''}
              onChange={handleNumberChange}
              placeholder="0"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category_id || ''} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Category</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div>
          <Label htmlFor="barcode">Barcode / SKU</Label>
          <Input
            id="barcode"
            name="barcode"
            value={formData.barcode || ''}
            onChange={handleChange}
            placeholder="Enter barcode or SKU"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/products')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
