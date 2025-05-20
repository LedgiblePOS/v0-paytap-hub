
import { AppError, ErrorType } from "@/utils/errorHandler";

/**
 * Specialized error handlers for authentication flows
 */

export const handleAuthenticationError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('Invalid login')) {
    return new AppError("Invalid email or password", ErrorType.AUTHENTICATION_ERROR);
  }
  
  if (errorMessage.includes('rate limit')) {
    return new AppError("Too many login attempts. Please try again later.", ErrorType.RATE_LIMIT_ERROR);
  }
  
  if (errorMessage.includes('already registered')) {
    return new AppError("This email is already registered", ErrorType.CONFLICT_ERROR);
  }
  
  return new AppError(
    errorMessage || "Authentication error occurred",
    ErrorType.AUTHENTICATION_ERROR
  );
};

export const handleProfileError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('not found')) {
    return new AppError("User profile not found", ErrorType.NOT_FOUND);
  }
  
  return new AppError(
    errorMessage || "Profile error occurred",
    ErrorType.SERVER_ERROR
  );
};
