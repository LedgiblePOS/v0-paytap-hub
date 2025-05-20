
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (pwd: string): number => {
    let strength = 0;
    
    if (pwd.length >= 8) strength += 20;
    if (pwd.match(/[A-Z]/)) strength += 20;
    if (pwd.match(/[a-z]/)) strength += 20;
    if (pwd.match(/[0-9]/)) strength += 20;
    if (pwd.match(/[^A-Za-z0-9]/)) strength += 20;
    
    return strength;
  };

  const strength = calculateStrength(password);
  
  const getColorClass = (strength: number): string => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <Progress value={strength} className={getColorClass(strength)} />
      <p className="text-sm text-gray-500">
        {strength <= 20 && 'Very Weak'}
        {strength > 20 && strength <= 40 && 'Weak'}
        {strength > 40 && strength <= 60 && 'Fair'}
        {strength > 60 && strength <= 80 && 'Strong'}
        {strength > 80 && 'Very Strong'}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
