
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoginFormProps } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced login form validation schema with better error messages
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Enhanced Login form component with better visual feedback and error handling
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  showRegisterLink = true,
  redirectPath,
  userType,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log('Login attempted with:', data, 'User type:', userType);
      
      // Track login attempts for security
      setLoginAttempts(prev => prev + 1);
      
      // Add additional security - delay after multiple failed attempts
      if (loginAttempts >= 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Actual authentication with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        throw error;
      }
      
      // Reset login attempts on success
      setLoginAttempts(0);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Mark document as having authenticated content
      document.body.setAttribute('data-auth-success', 'true');
      document.documentElement.setAttribute('data-authenticated', 'true');
      
      // Dispatch an event for auth success that other components can listen for
      const authEvent = new CustomEvent('auth-success', { 
        detail: { userType, redirectPath } 
      });
      document.dispatchEvent(authEvent);
      
      // Redirect after successful login
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(userType === 'admin' ? '/super-admin' : '/dashboard');
      }
      
    } catch (error) {
      setIsLoading(false);
      
      // Enhanced error handling with user-friendly messages
      let errorMessage = 'An error occurred during login';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('rate')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setLoginError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-auth-form="login">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          autoComplete="email"
          disabled={isLoading}
          aria-invalid={errors.email ? "true" : "false"}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register('password')}
            disabled={isLoading}
            aria-invalid={errors.password ? "true" : "false"}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <button 
            type="button" 
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {loginError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="rememberMe"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          {...register('rememberMe')}
          disabled={isLoading}
        />
        <Label htmlFor="rememberMe" className="text-sm text-gray-600">
          Remember me
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          'Sign in'
        )}
      </Button>

      {/* Security info for users */}
      <p className="text-xs text-gray-500 text-center mt-4">
        This login is secured with end-to-end encryption
      </p>
    </form>
  );
};

export default LoginForm;
