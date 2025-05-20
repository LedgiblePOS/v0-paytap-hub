
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserRole } from '@/types/enums';
import { UserFormProps } from '@/types/user';

const UserForm: React.FC<UserFormProps> = ({
  userData,
  onChange,
  isNewUser = false,
  errors = {}
}) => {
  const handleStringChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...userData, [field]: e.target.value });
  };

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    onChange({ ...userData, [field]: checked });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    onChange({ ...userData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={userData.firstName}
            onChange={handleStringChange('firstName')}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={userData.lastName}
            onChange={handleStringChange('lastName')}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={userData.email || ''}
          onChange={handleStringChange('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={userData.role}
          onValueChange={handleSelectChange('role')}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.MERCHANT}>Merchant</SelectItem>
            <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
            <SelectItem value={UserRole.USER}>User</SelectItem>
            <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isActive" 
          checked={userData.isActive}
          onCheckedChange={handleSwitchChange('isActive')}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
    </div>
  );
};

export default UserForm;
