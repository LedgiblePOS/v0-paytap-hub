
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  onBack: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isLoading, onBack }) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isLoading}
      >
        Back
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up business...
          </>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </div>
  );
};

export default FormActions;
