
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PaymentMethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "Active" | "Inactive" | "Available" | "Coming Soon";
  onActivate?: () => void;
  onConfigure?: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  title,
  description,
  icon,
  status,
  onActivate,
  onConfigure
}) => {
  // Determine badge color based on status
  const getBadgeVariant = () => {
    switch (status) {
      case "Active": return "success";
      case "Available": return "outline";
      case "Coming Soon": return "secondary";
      case "Inactive": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-md">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge variant={getBadgeVariant()}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {status === "Available" && onActivate && (
          <button 
            onClick={onActivate}
            className="text-sm text-primary hover:underline mt-2"
          >
            Activate
          </button>
        )}
        
        {status === "Active" && onConfigure && (
          <button 
            onClick={onConfigure}
            className="text-sm text-primary hover:underline mt-2"
          >
            Configure
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
