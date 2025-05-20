
import React from 'react';
import { DialogFooter as BaseDialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditDialogFooterProps {
  onCancel: () => void;
  isLoading: boolean;
}

export const EditDialogFooter: React.FC<EditDialogFooterProps> = ({
  onCancel,
  isLoading
}) => {
  return (
    <BaseDialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update User"}
      </Button>
    </BaseDialogFooter>
  );
};
