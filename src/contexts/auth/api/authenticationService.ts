
import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";
import { AppError, ErrorType } from "@/utils/errorHandler";
import { loginRateLimiter } from "@/utils/RateLimiter";

/**
 * Enhanced login with additional security checks
 */
export const loginUser = async (email: string, password: string) => {
  // Check for empty values
  if (!email || !password) {
    throw new AppError("Email and password are required", ErrorType.VALIDATION_ERROR);
  }
  
  // Check rate limiting
  if (loginRateLimiter.isRateLimited(email)) {
    throw new AppError("Too many login attempts. Please try again later.", ErrorType.RATE_LIMIT_ERROR);
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Enhanced error handling
    if (error.message.includes('Invalid login')) {
      throw new AppError("Invalid email or password", ErrorType.AUTHENTICATION_ERROR);
    }
    
    if (error.message.includes('rate limit')) {
      throw new AppError("Too many login attempts. Please try again later.", ErrorType.RATE_LIMIT_ERROR);
    }
    
    throw error;
  }

  return data;
};

/**
 * Secure logout with error handling
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AppError(error.message, ErrorType.AUTHENTICATION_ERROR);
  }
};

/**
 * Enhanced registration with validation and role assignment
 */
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole = UserRole.MERCHANT
) => {
  // Input validation
  if (!email || !password) {
    throw new AppError("Email and password are required", ErrorType.VALIDATION_ERROR);
  }
  
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", ErrorType.VALIDATION_ERROR);
  }
  
  if (!firstName || !lastName) {
    throw new AppError("First name and last name are required", ErrorType.VALIDATION_ERROR);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new AppError("This email is already registered", ErrorType.CONFLICT_ERROR);
    }
    throw new AppError(error.message, ErrorType.AUTHENTICATION_ERROR);
  }

  return data;
};

// Add these functions for backward compatibility
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw new AppError(error.message, ErrorType.AUTHENTICATION_ERROR);
  }
  return true;
};

export const sendPasswordResetEmail = resetPassword;
