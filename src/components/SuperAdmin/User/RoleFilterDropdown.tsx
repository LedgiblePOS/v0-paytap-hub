
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from '@/types/enums';

interface RoleFilterDropdownProps {
  selectedRoles: UserRole[];
  onChange: (roles: UserRole[]) => void;
}

const RoleFilterDropdown: React.FC<RoleFilterDropdownProps> = ({
  selectedRoles,
  onChange,
}) => {
  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter(r => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  const allRoles = [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MERCHANT,
    UserRole.USER,
    UserRole.STAFF,
    UserRole.CUSTOMER,
  ];

  const selectAll = () => {
    onChange(allRoles);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Role: {selectedRoles.length === 0
            ? "All"
            : selectedRoles.length === allRoles.length
              ? "All"
              : `${selectedRoles.length} selected`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allRoles.map((role) => (
          <DropdownMenuCheckboxItem
            key={role}
            checked={selectedRoles.includes(role)}
            onCheckedChange={() => toggleRole(role)}
          >
            {role}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="flex justify-between p-2">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleFilterDropdown;
