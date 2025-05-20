
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  onAdd,
  onRemove,
}) => {
  const handleAdd = () => onAdd(id);
  const handleRemove = () => onRemove(id);

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">
          ${price.toFixed(2)} x {quantity}
        </p>
      </div>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="mx-2 w-6 text-center">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleAdd}
          aria-label="Add item"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
