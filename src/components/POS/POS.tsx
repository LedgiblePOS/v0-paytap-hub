import { useEffect, useState } from 'react';
import { ProductEntity, CategoryEntity, Customer } from '@/types';
import { toProductModels } from '@/utils/modelConversions/productConverters';
import { toCategoryModels } from '@/utils/modelConversions/categoryConverters';
import { supabase } from '@/lib/supabase';

// Export the Customer type for use in other components
export type { Customer };

export const POS = () => {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productsData } = await supabase
        .from('products')
        .select('*');
        
      if (productsData) {
        // Set products as ProductEntity array directly
        setProducts(productsData as ProductEntity[]);
      }
      
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*');
        
      if (categoriesData) {
        // Set categories as CategoryEntity array directly
        setCategories(categoriesData as CategoryEntity[]);
      }
    };
    
    fetchProducts();
  }, []);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<Array<ProductEntity & { quantity: number }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode ? product.barcode.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    
    return matchesCategory && matchesSearch && product.in_stock;
  });
  
  const addToCart = (product: ProductEntity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = async () => {
    // Implement checkout logic
    console.log('Processing checkout for:', cart);
    
    // Create transaction record
    // Update inventory
    // Clear cart
    setCart([]);
  };
  
  return (
    <div className="flex h-full">
      <div className="w-2/3 p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mb-4 flex space-x-2">
          <button 
            className={`px-4 py-2 rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="border rounded p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => addToCart(product)}
            >
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-32 object-cover mb-2"
                />
              )}
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">In stock: {product.in_stock}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-1/3 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Current Order</h2>
        
        {cart.length === 0 ? (
          <p className="text-gray-500">No items in cart</p>
        ) : (
          <>
            <div className="mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-white rounded">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="px-2 bg-gray-200 rounded"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      className="px-2 bg-gray-200 rounded"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button 
                      className="ml-2 text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              
              <button 
                className="w-full bg-green-500 text-white py-2 rounded font-bold"
                onClick={handleCheckout}
              >
                Complete Sale
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
