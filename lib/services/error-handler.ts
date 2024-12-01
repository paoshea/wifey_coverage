class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context?: string): void {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    }
  }

  handleAPIError(error: Error, endpoint: string): void {
    console.error(`API Error (${endpoint}):`, error);

    // Log API-specific errors
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service with API context
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();