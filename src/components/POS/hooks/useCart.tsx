
import { useState, useCallback, createContext, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';
import { nanoid } from 'nanoid';
import { PaymentProcessor } from '@/services/checkout/PaymentProcessor'; // Fixed casing to match the actual file

// Define cart item type
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0
});

// Export hook for accessing cart context
export const useCart = () => useContext(CartContext);

// Export provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Calculate total from items
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const addItem = useCallback((product: any, quantity: number = 1) => {
    setItems(currentItems => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === product.id
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item to cart
        return [...currentItems, {
          id: nanoid(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageUrl: product.image_url || product.imageUrl
        }];
      }
    });
    
    toast({
      title: "Item added to cart",
      description: `${product.name} x ${quantity} added`,
      duration: 2000
    });
  }, []);
  
  const removeItem = useCallback((itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    
    toast({
      title: "Item removed",
      duration: 2000
    });
  }, []);
  
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
