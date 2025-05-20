
import React from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyTransactionState: React.FC = () => (
  <div className="text-center py-8">
    <List className="h-12 w-12 mx-auto mb-2 text-gray-300" />
    <p className="font-medium text-lg">No transactions yet</p>
    <p className="text-gray-500 mb-4">Transactions will appear here once you start processing payments</p>
    <Button variant="outline" asChild>
      <a href="/pos">Go to POS</a>
    </Button>
  </div>
);

export default EmptyTransactionState;
