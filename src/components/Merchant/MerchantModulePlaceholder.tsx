
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MerchantModulePlaceholderProps {
  title?: string;
  description?: string;
  routePath?: string;
}

/**
 * Placeholder component for merchant modules that are still under development
 */
const MerchantModulePlaceholder: React.FC<MerchantModulePlaceholderProps> = ({
  title = "Module Under Development",
  description = "This feature is coming soon. We're working hard to bring you the best experience.",
  routePath
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>{description}</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            
            {routePath && (
              <Button 
                variant="default" 
                onClick={() => navigate(routePath)}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantModulePlaceholder;
