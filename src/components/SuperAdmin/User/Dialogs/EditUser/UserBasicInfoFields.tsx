
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserBasicInfoFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
}

export const UserBasicInfoFields: React.FC<UserBasicInfoFieldsProps> = ({
  firstName,
  lastName,
  email,
  isLoading,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled={true}
        />
      </div>
    </>
  );
};
