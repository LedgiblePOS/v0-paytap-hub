
// Error handling utilities

/**
 * Structured error handler that logs errors and can perform additional actions
 */
export const handleError = (
  message: string, 
  error: unknown, 
  options: { 
    silent?: boolean;
    rethrow?: boolean;
    context?: Record<string, any>;
  } = {}
) => {
  const { silent = false, rethrow = false, context = {} } = options;
  
  // Extract details from the error
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Format the complete error message
  const formattedMessage = `${message}: ${errorMessage}`;
  
  // Log the error unless silent mode is enabled
  if (!silent) {
    console.error(formattedMessage);
    if (errorStack) console.error(errorStack);
    if (Object.keys(context).length > 0) console.error('Context:', context);
  }
  
  // Optionally rethrow the error
  if (rethrow) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(formattedMessage);
    }
  }
  
  return {
    message: formattedMessage,
    originalError: error,
    stack: errorStack,
    context
  };
};

/**
 * Safely executes a function and handles any errors
 */
export const safeExecute = async <T>(
  fn: () => Promise<T>,
  errorMessage: string,
  options: {
    fallback?: T;
    silent?: boolean;
    rethrow?: boolean;
    context?: Record<string, any>;
  } = {}
): Promise<T> => {
  const { fallback, silent = false, rethrow = false, context = {} } = options;
  
  try {
    return await fn();
  } catch (error) {
    handleError(errorMessage, error, { silent, rethrow, context });
    
    if (fallback !== undefined) {
      return fallback as T;
    }
    
    throw error;
  }
};
