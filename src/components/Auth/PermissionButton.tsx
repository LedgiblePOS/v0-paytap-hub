import React from "react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/utils/permissions/types";
import { ButtonProps } from "@/components/ui/button";

interface PermissionButtonProps extends ButtonProps {
  permission: Permission;
  hideIfDenied?: boolean;
  children: React.ReactNode;
}

/**
 * A button that is conditionally enabled or hidden based on user permissions
 */
const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  hideIfDenied = false,
  children,
  ...props
}) => {
  const { can } = usePermissions();
  
  // Check if user has permission
  const hasPermission = can(permission);
  
  // If hideIfDenied is true and user doesn't have permission, don't render
  if (hideIfDenied && !hasPermission) {
    return null;
  }
  
  // Otherwise render the button, but disabled if no permission
  return (
    <Button 
      {...props}
      disabled={!hasPermission || props.disabled}
    >
      {children}
    </Button>
  );
};

export default PermissionButton;
