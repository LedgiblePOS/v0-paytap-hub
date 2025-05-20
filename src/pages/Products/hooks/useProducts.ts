
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ProductModel } from "@/types";
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "@/services/productService";

export const useProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data); // getProducts already returns ProductModel[]
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeTab === "all" || product.categoryId === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (formData: any) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to add products.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newProductData = {
        merchantId: user.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId || undefined,
        imageUrl: formData.imageUrl || undefined,
        barcode: formData.barcode || undefined,
        inStock: parseInt(formData.inStock),
      };
      
      const newProduct = await createProduct(newProductData);
      
      setProducts([...products, newProduct]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Product added successfully.",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: any) => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    try {
      const updatedData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId || undefined,
        imageUrl: formData.imageUrl || undefined,
        barcode: formData.barcode || undefined,
        inStock: parseInt(formData.inStock),
      };
      
      const updatedProduct = await updateProduct(selectedProduct.id, updatedData);
      
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteDialog(false);
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setSelectedProduct(null);
    }
  };

  return {
    products: filteredProducts,
    isLoading,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showViewDialog,
    setShowViewDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedProduct,
    setSelectedProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteConfirm
  };
};
