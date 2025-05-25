import { createLogger } from './logger';

const log = createLogger('ErrorTracker');

interface ErrorLocation {
  file: string;
  line: number;
  column?: number;
  functionName?: string;
}

interface ErrorInfo {
  message: string;
  stack?: string;
  location?: ErrorLocation;
  timestamp: Date;
  component?: string;
}

/**
 * Enhanced error tracking for AGS/GJS environment
 * This works with TypeScript files run directly by AGS
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errorMap = new Map<string, ErrorInfo[]>();

  private constructor() {
    this.installGlobalHandler();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Parse GJS/AGS stack traces to extract location info
   */
  private parseStackTrace(stack: string): ErrorLocation[] {
    const locations: ErrorLocation[] = [];
    const lines = stack.split('\n');

    for (const line of lines) {
      // Match AGS/GJS stack trace patterns:
      // at functionName (file.ts:123:45)
      // at file.ts:123:45
      // @file.ts:123:45
      const patterns = [
        /at\s+(\w+)?\s*\(?(.*?):(\d+):?(\d+)?\)?/,
        /@(.*?):(\d+):?(\d+)?/,
        /^\s*(.*?):(\d+):?(\d+)?$/
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const [, functionName, file, lineStr, columnStr] = match;
          
          // Skip internal AGS/GJS files
          if (file && !file.includes('resource://') && !file.includes('gi://')) {
            locations.push({
              functionName: functionName || undefined,
              file: file.trim(),
              line: parseInt(lineStr, 10),
              column: columnStr ? parseInt(columnStr, 10) : undefined
            });
          }
          break;
        }
      }
    }

    return locations;
  }

  /**
   * Track an error with enhanced information
   */
  trackError(error: Error | string, component?: string): ErrorInfo {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'object' ? error.stack : undefined;

    const locations = stack ? this.parseStackTrace(stack) : [];
    const primaryLocation = locations[0];

    const errorInfo: ErrorInfo = {
      message: errorMessage,
      stack,
      location: primaryLocation,
      timestamp: new Date(),
      component
    };

    // Store by file for easy lookup
    if (primaryLocation?.file) {
      const fileErrors = this.errorMap.get(primaryLocation.file) || [];
      fileErrors.push(errorInfo);
      this.errorMap.set(primaryLocation.file, fileErrors);
    }

    // Log with enhanced formatting
    this.logError(errorInfo);

    return errorInfo;
  }

  /**
   * Format and log error with source context
   */
  private logError(errorInfo: ErrorInfo) {
    const { message, location, component, stack } = errorInfo;

    log.error(`${message}`, {
      component,
      location: location ? `${location.file}:${location.line}${location.column ? ':' + location.column : ''}` : 'unknown',
      function: location?.functionName,
      // Add clickable link format for VSCode
      source: location ? `${location.file}:${location.line}:${location.column || 1}` : undefined
    });

    // Log full stack trace in debug mode
    if (stack) {
      log.debug('Stack trace:', { stack: stack.split('\n').map(line => line.trim()).filter(Boolean) });
    }
  }

  /**
   * Install global error handler
   */
  private installGlobalHandler() {
    try {
      // Capture unhandled promise rejections
      if (typeof process !== 'undefined' && process.on) {
        process.on('unhandledRejection', (reason, promise) => {
          this.trackError(
            reason instanceof Error ? reason : new Error(String(reason)),
            'UnhandledPromiseRejection'
          );
        });
      }

      // Try to override console.error to track errors
      const originalConsoleError = console.error;
      if (originalConsoleError && typeof originalConsoleError === 'function') {
        try {
          console.error = (...args: any[]) => {
            // Call original
            originalConsoleError.apply(console, args);
            
            // Track if it looks like an error
            const firstArg = args[0];
            if (firstArg instanceof Error || (typeof firstArg === 'string' && firstArg.includes('Error'))) {
              this.trackError(firstArg, 'Console.error');
            }
          };
        } catch (e) {
          // If we can't override console.error, that's okay
          log.debug('Could not override console.error for error tracking');
        }
      }
    } catch (e) {
      // If global handler installation fails, continue without it
      log.debug('Could not install global error handler:', e);
    }
  }

  /**
   * Get errors for a specific file
   */
  getErrorsForFile(file: string): ErrorInfo[] {
    return this.errorMap.get(file) || [];
  }

  /**
   * Get all tracked errors
   */
  getAllErrors(): Map<string, ErrorInfo[]> {
    return new Map(this.errorMap);
  }

  /**
   * Clear error history
   */
  clearErrors() {
    this.errorMap.clear();
  }

  /**
   * Create a wrapped function that tracks errors
   */
  static wrap<T extends (...args: any[]) => any>(
    fn: T,
    component?: string
  ): T {
    const tracker = ErrorTracker.getInstance();
    
    return ((...args: Parameters<T>) => {
      try {
        const result = fn(...args);
        
        if (result instanceof Promise) {
          return result.catch((error) => {
            tracker.trackError(error, component || fn.name);
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        tracker.trackError(error as Error, component || fn.name);
        throw error;
      }
    }) as T;
  }
}

// Create singleton instance
export const errorTracker = ErrorTracker.getInstance();

// Export wrap function for convenience
export const wrapWithErrorTracking = ErrorTracker.wrap;