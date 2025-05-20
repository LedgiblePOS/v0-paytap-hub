
export enum ErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AppError extends Error {
  public type: ErrorType;
  public metadata?: Record<string, any>;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN_ERROR, metadata?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.metadata = metadata;
  }

  public isAuthError(): boolean {
    return this.type === ErrorType.AUTHENTICATION_ERROR;
  }

  public isValidationError(): boolean {
    return this.type === ErrorType.VALIDATION_ERROR;
  }

  public isPermissionError(): boolean {
    return this.type === ErrorType.PERMISSION_ERROR;
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      metadata: this.metadata,
      stack: this.stack
    };
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Try to determine error type from message
    if (error.message.includes('authentication') || error.message.includes('auth') || error.message.includes('login')) {
      return new AppError(error.message, ErrorType.AUTHENTICATION_ERROR);
    }
    
    if (error.message.includes('permission') || error.message.includes('forbidden') || error.message.includes('access')) {
      return new AppError(error.message, ErrorType.PERMISSION_ERROR);
    }
    
    if (error.message.includes('not found') || error.message.includes('missing')) {
      return new AppError(error.message, ErrorType.NOT_FOUND_ERROR);
    }
    
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return new AppError(error.message, ErrorType.VALIDATION_ERROR);
    }
    
    return new AppError(error.message);
  }
  
  return new AppError('An unknown error occurred', ErrorType.UNKNOWN_ERROR);
};
