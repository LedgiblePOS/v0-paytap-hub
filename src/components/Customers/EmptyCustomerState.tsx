
import React from "react";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface EmptyCustomerStateProps {
  onAddCustomer: () => void;
}

const EmptyCustomerState: React.FC<EmptyCustomerStateProps> = ({ onAddCustomer }) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="h-16 w-16 text-gray-300 mb-4" />
        <CardTitle className="mb-2">No Customers Yet</CardTitle>
        <p className="text-gray-500 text-center mb-6">
          Add your first customer to start managing customer relationships
        </p>
        <Button 
          onClick={onAddCustomer}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCustomerState;
