import { 
  createLogger, 
  LogLevel, 
  setLogLevel as setLevel, 
  getLogLevel,
  configureLogger,
  getLoggerConfig,
  setLogWhitelist,
  getLogWhitelist,
  type LoggerConfig
} from '../services/logger';

// Pre-configured loggers for common components
export const barLogger = createLogger('Bar');
export const launcherLogger = createLogger('Launcher');
export const sidebarLogger = createLogger('Sidebar');
export const overlayLogger = createLogger('Overlay');
export const serviceLogger = createLogger('Service');
export const widgetLogger = createLogger('Widget');
export const systemLogger = createLogger('System');

// Re-export useful functions and types
export { createLogger, LogLevel, getLogLevel, configureLogger, getLoggerConfig, setLogWhitelist, getLogWhitelist, type LoggerConfig };

// Re-export setLogLevel with proper type
export const setLogLevel = (level: LogLevel | string) => {
  if (typeof level === 'string') {
    const levelKey = level.toUpperCase() as keyof typeof LogLevel;
    if (levelKey in LogLevel) {
      setLevel(LogLevel[levelKey]);
    }
  } else {
    setLevel(level);
  }
};

// Global log helper for quick debugging
export const log = {
  info: (message: string, meta?: any) => createLogger('App').info(message, meta),
  warn: (message: string, meta?: any) => createLogger('App').warn(message, meta),
  error: (message: string | Error, meta?: any) => createLogger('App').error(message, meta),
  debug: (message: string, meta?: any) => createLogger('App').debug(message, meta),
  verbose: (message: string, meta?: any) => createLogger('App').verbose(message, meta),
};

// Decorator for logging method calls
export function LogMethod(level: LogLevel = LogLevel.DEBUG) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const logger = createLogger(target.constructor.name);

    descriptor.value = function (...args: any[]) {
      const timer = logger.time(propertyKey);
      
      try {
        const result = originalMethod.apply(this, args);
        
        if (result instanceof Promise) {
          return result
            .then((value) => {
              timer.end('completed successfully');
              return value;
            })
            .catch((error) => {
              logger.error(`${propertyKey} failed`, { error });
              throw error;
            });
        }
        
        timer.end('completed successfully');
        return result;
      } catch (error) {
        logger.error(`${propertyKey} failed`, { error });
        throw error;
      }
    };

    return descriptor;
  };
}

// Decorator for logging class instantiation
export function LogClass(component?: string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const logger = createLogger(component || constructor.name);
    
    return class extends constructor {
      constructor(...args: any[]) {
        logger.debug(`Creating new instance`, { args: args.length });
        super(...args);
      }
    };
  };
}

// Performance monitoring helper
export class PerformanceMonitor {
  private static instances = new Map<string, number>();
  private logger: any;

  constructor(component: string) {
    this.logger = createLogger(`Perf:${component}`);
  }

  start(operation: string): () => void {
    const startTime = performance.now();
    const key = `${operation}-${Date.now()}`;
    
    PerformanceMonitor.instances.set(key, startTime);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.logger.debug(`${operation}`, { 
        duration: `${duration.toFixed(2)}ms`,
        slow: duration > 100 
      });
      
      PerformanceMonitor.instances.delete(key);
    };
  }

  async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const end = this.start(operation);
    try {
      return await fn();
    } finally {
      end();
    }
  }
}

// Create a global performance monitor
export const perf = new PerformanceMonitor('Global');

// Helper to wrap functions with automatic logging
export function withLogging<T extends (...args: any[]) => any>(
  fn: T,
  component: string,
  fnName?: string
): T {
  const logger = createLogger(component);
  const name = fnName || fn.name || 'anonymous';
  
  return ((...args: any[]) => {
    logger.debug(`${name} called`, { argCount: args.length });
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result
          .then(value => {
            logger.debug(`${name} resolved`, { hasValue: value !== undefined });
            return value;
          })
          .catch(error => {
            logger.error(`${name} rejected`, { error });
            throw error;
          });
      }
      
      logger.debug(`${name} returned`, { hasValue: result !== undefined });
      return result;
    } catch (error) {
      logger.error(`${name} threw error`, { error });
      throw error;
    }
  }) as T;
}