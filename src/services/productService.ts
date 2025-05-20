
import { Product, ProductModel } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toProductEntity, toProductModel, toProductModels } from "@/utils/modelConversions";

// Get all products for a merchant
export const getProducts = async (): Promise<ProductModel[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    
    // Convert database entities to UI models
    return toProductModels(products as Product[]);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a specific product by ID
export const getProductById = async (id: string): Promise<ProductModel | undefined> => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Convert database entity to UI model
    return toProductModel(product as Product);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (
  productData: Omit<ProductModel, "id" | "createdAt" | "updatedAt">
): Promise<ProductModel> => {
  try {
    // Convert UI model to database entity
    const productEntity = toProductEntity({
      ...productData,
      id: '',  // Placeholder, will be replaced by database
      createdAt: '',  // Placeholder
      updatedAt: ''   // Placeholder
    });
    
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert(productEntity)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert database entity to UI model
    return toProductModel(newProduct as Product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: Partial<ProductModel>
): Promise<ProductModel> => {
  try {
    // Convert partial UI model to partial database entity
    const updateData: Partial<Product> = {};
    
    if (productData.merchantId !== undefined) updateData.merchant_id = productData.merchantId;
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.price !== undefined) updateData.price = productData.price;
    if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId;
    if (productData.imageUrl !== undefined) updateData.image_url = productData.imageUrl;
    if (productData.barcode !== undefined) updateData.barcode = productData.barcode;
    if (productData.inStock !== undefined) updateData.in_stock = productData.inStock;
    
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert database entity to UI model
    return toProductModel(updatedProduct as Product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
