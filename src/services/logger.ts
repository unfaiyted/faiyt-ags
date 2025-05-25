import { exec, GLib } from 'astal';
import { Variable } from 'astal';
import { sourceMapReader } from "./source-map-reader";

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4
}

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  white: '\x1b[37m'
};

// Log level configuration
const logLevelNames = {
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.VERBOSE]: 'VERBOSE'
};

const logLevelColors = {
  [LogLevel.ERROR]: colors.red,
  [LogLevel.WARN]: colors.yellow,
  [LogLevel.INFO]: colors.cyan,
  [LogLevel.DEBUG]: colors.gray,
  [LogLevel.VERBOSE]: colors.magenta
};

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  useColors: boolean;
  showTimestamp: boolean;
  showLevel: boolean;
  showComponent: boolean;
  showLocation: boolean;
  timestampFormat: 'full' | 'time' | 'short'; // full: HH:mm:ss.SSS, time: HH:mm:ss, short: HH:mm
  logFile?: string;
}

class Logger {
  private config: LoggerConfig = {
    level: LogLevel.INFO,
    useColors: true,
    showTimestamp: true,
    showLevel: true,
    showComponent: true,
    showLocation: true,
    timestampFormat: 'short'
  };

  private logHistory = Variable<string[]>([]);
  private maxHistorySize = 1000;

  constructor() {
    // Set log level from environment (GJS compatible)
    const envLevel = GLib.getenv('LOG_LEVEL')?.toUpperCase();
    if (envLevel && envLevel in LogLevel) {
      this.config.level = LogLevel[envLevel as keyof typeof LogLevel];
    }

    // Set log file from environment
    const logFile = GLib.getenv('LOG_FILE');
    if (logFile) {
      this.config.logFile = logFile;
    }

    // Configure from environment variables
    if (GLib.getenv('LOG_NO_COLOR') === 'true') this.config.useColors = false;
    if (GLib.getenv('LOG_NO_TIME') === 'true') this.config.showTimestamp = false;
    if (GLib.getenv('LOG_NO_LEVEL') === 'true') this.config.showLevel = false;
    if (GLib.getenv('LOG_NO_COMPONENT') === 'true') this.config.showComponent = false;
    if (GLib.getenv('LOG_NO_LOCATION') === 'true') this.config.showLocation = false;
    
    const timeFormat = GLib.getenv('LOG_TIME_FORMAT');
    if (timeFormat === 'full' || timeFormat === 'time' || timeFormat === 'short') {
      this.config.timestampFormat = timeFormat;
    }

    // Override print function
    this.overridePrint();
  }

  private overridePrint() {
    const originalPrint = globalThis.print;
    globalThis.print = (...args: any[]) => {
      this.info(args.map(arg => String(arg)).join(' '));
    };
    // Store original for restoration
    (globalThis as any).__originalPrint = originalPrint;
  }

  restoreOriginalPrint() {
    if ((globalThis as any).__originalPrint) {
      globalThis.print = (globalThis as any).__originalPrint;
    }
  }

  private formatTimestamp(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    switch (this.config.timestampFormat) {
      case 'short':
        return `${hours}:${minutes}`;
      case 'time': {
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
      case 'full':
      default: {
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ms = now.getMilliseconds().toString().padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${ms}`;
      }
    }
  }

  private getCallerInfo(): { file: string; line: number; fullPath?: string } | null {
    try {
      // Create an error to get stack trace
      const err = new Error();
      const stack = err.stack;
      
      if (!stack) return null;
      
      // Parse stack trace - skip first 4 lines (Error, getCallerInfo, formatMessage, log)
      const lines = stack.split('\n');
      let foundNonLogger = false;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip empty lines
        if (!line.trim()) continue;
        
        // Try multiple patterns for AGS/GJS stack traces
        const patterns = [
          // GJS format: functionName@file:///path/to/file.js:123:45
          /@file:\/\/(.+):(\d+):(\d+)/,
          // Alternative: at functionName (file.ts:123:45)
          /at\s+(?:\w+\s+)?\((.+?):(\d+):(\d+)\)/,
          // Simple: file.ts:123:45
          /^\s*(.+?):(\d+):(\d+)$/,
          // AGS format variations
          /@(.+?):(\d+):(\d+)/,
          /\s+(.+?):(\d+):(\d+)/
        ];
        
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            let filePath = match[1];
            
            // Remove file:// prefix if present
            filePath = filePath.replace(/^file:\/\//, '');
            
            // Get line and column numbers
            const lineNum = parseInt(match[2], 10);
            const colNum = match[3] ? parseInt(match[3], 10) : 0;
            
            // Get just the filename
            const parts = filePath.split('/');
            const fileName = parts[parts.length - 1];
            
            // If this is ags.js, use source map to get the real source
            let sourceFile = fileName;
            let sourceLine = lineNum;
            
            if (fileName === 'ags.js' || filePath.endsWith('/ags.js')) {
              const sourceLocation = sourceMapReader.getSourceLocation(fileName, lineNum, colNum);
              const sourceParts = sourceLocation.split(':');
              if (sourceParts.length >= 2) {
                sourceFile = sourceParts[0];
                sourceLine = parseInt(sourceParts[1], 10);
                
                // Check if this is a logger file - if so, skip it
                if (sourceFile.includes('logger.ts') || 
                    sourceFile.includes('logger.js') ||
                    sourceFile.includes('/services/logger') ||
                    sourceFile.includes('/utils/logger')) {
                  if (!foundNonLogger) continue;
                }
                
                foundNonLogger = true;
                return {
                  file: sourceFile,
                  line: sourceLine,
                  fullPath: filePath
                };
              }
            }
            
            // For non-ags.js files, check if it's a logger file
            if (fileName.includes('logger')) {
              if (!foundNonLogger) continue;
            }
            
            foundNonLogger = true;
            
            // Fallback: Convert .js to .ts for source files
            const sourceFileName = fileName.replace(/\.js$/, '.ts');
            
            return {
              file: sourceFileName,
              line: lineNum,
              fullPath: filePath
            };
          }
        }
      }
    } catch (e) {
      // Silently fail
    }
    return null;
  }

  private formatMessage(level: LogLevel, message: string, component?: string, meta?: any): string {
    const parts: string[] = [];
    const callerInfo = this.config.showLocation ? this.getCallerInfo() : null;
    
    if (this.config.useColors) {
      // Timestamp
      if (this.config.showTimestamp) {
        parts.push(`${colors.dim}${this.formatTimestamp()}${colors.reset}`);
      }
      
      // Level
      if (this.config.showLevel) {
        parts.push(`${logLevelColors[level]}[${logLevelNames[level].padEnd(5)}]${colors.reset}`);
      }
      
      // Component
      if (this.config.showComponent && component) {
        parts.push(`${colors.bright}[${component}]${colors.reset}`);
      }
      
      // Location (file:line)
      if (this.config.showLocation && callerInfo) {
        parts.push(`${colors.blue}${callerInfo.file}:${callerInfo.line}${colors.reset}`);
      }
      
      // Message
      parts.push(message);
      
      // Metadata
      if (meta && Object.keys(meta).length > 0) {
        const metaStr = JSON.stringify(meta, null, 2)
          .split('\n')
          .map((line, i) => i === 0 ? line : `  ${line}`)
          .join('\n');
        parts.push(`\n${colors.dim}${metaStr}${colors.reset}`);
      }
    } else {
      // Plain text format
      if (this.config.showTimestamp) {
        parts.push(this.formatTimestamp());
      }
      if (this.config.showLevel) {
        parts.push(`[${logLevelNames[level].padEnd(5)}]`);
      }
      if (this.config.showComponent && component) {
        parts.push(`[${component}]`);
      }
      if (this.config.showLocation && callerInfo) {
        parts.push(`${callerInfo.file}:${callerInfo.line}`);
      }
      parts.push(message);
      if (meta && Object.keys(meta).length > 0) {
        parts.push(`\n${JSON.stringify(meta, null, 2)}`);
      }
    }
    
    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, component?: string, meta?: any) {
    if (level > this.config.level) return;

    const formattedMessage = this.formatMessage(level, message, component, meta);
    
    // Output to console using GJS print
    if ((globalThis as any).__originalPrint) {
      (globalThis as any).__originalPrint(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
    
    // Add to history
    this.addToHistory(formattedMessage);
    
    // Write to file if configured
    if (this.config.logFile) {
      this.writeToFile(formattedMessage);
    }
  }

  private addToHistory(message: string) {
    const history = this.logHistory.get();
    history.push(message);
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
    this.logHistory.set([...history]);
  }

  private writeToFile(message: string) {
    if (!this.config.logFile) return;
    
    try {
      const plainMessage = message.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI codes
      exec(`echo '${plainMessage.replace(/'/g, "'\\''")}' >> ${this.config.logFile}`);
    } catch (e) {
      // Silently fail to avoid recursive logging
    }
  }

  // Public API
  error(message: string | Error, component?: string, meta?: any) {
    if (message instanceof Error) {
      // Format stack trace for better readability
      const stackLines = message.stack?.split('\n').map(line => line.trim()).filter(Boolean);
      
      this.log(LogLevel.ERROR, message.message, component, { 
        stack: stackLines, 
        name: message.name,
        ...meta 
      });
    } else {
      this.log(LogLevel.ERROR, message, component, meta);
    }
  }

  warn(message: string, component?: string, meta?: any) {
    this.log(LogLevel.WARN, message, component, meta);
  }

  info(message: string, component?: string, meta?: any) {
    this.log(LogLevel.INFO, message, component, meta);
  }

  debug(message: string, component?: string, meta?: any) {
    this.log(LogLevel.DEBUG, message, component, meta);
  }

  verbose(message: string, component?: string, meta?: any) {
    this.log(LogLevel.VERBOSE, message, component, meta);
  }

  setLevel(level: LogLevel) {
    this.config.level = level;
  }

  getLevel(): LogLevel {
    return this.config.level;
  }

  configure(options: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...options };
  }

  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  getHistory(): string[] {
    return this.logHistory.get();
  }

  clearHistory() {
    this.logHistory.set([]);
  }

  // Performance timer
  time(label: string, component?: string) {
    const start = Date.now();
    this.debug(`Timer "${label}" started`, component);
    
    return {
      end: (message?: string) => {
        const duration = Date.now() - start;
        const msg = message ? `${label} - ${message}` : label;
        this.info(`${msg} completed in ${duration}ms`, component, { duration });
      }
    };
  }
}

// Create singleton instance
const logger = new Logger();

// Component logger wrapper
export class ComponentLogger {
  constructor(private component: string) {}

  error(message: string | Error, meta?: any) {
    logger.error(message, this.component, meta);
  }

  warn(message: string, meta?: any) {
    logger.warn(message, this.component, meta);
  }

  info(message: string, meta?: any) {
    logger.info(message, this.component, meta);
  }

  debug(message: string, meta?: any) {
    logger.debug(message, this.component, meta);
  }

  verbose(message: string, meta?: any) {
    logger.verbose(message, this.component, meta);
  }

  time(label: string) {
    return logger.time(label, this.component);
  }
}

// Export default logger and functions
export default logger;

export const createLogger = (component: string) => new ComponentLogger(component);

export const setLogLevel = (level: LogLevel) => logger.setLevel(level);

export const getLogLevel = () => logger.getLevel();

export const restoreOriginalPrint = () => logger.restoreOriginalPrint();

export const getLogHistory = () => logger.getHistory();

export const clearLogHistory = () => logger.clearHistory();

export const configureLogger = (options: Partial<LoggerConfig>) => logger.configure(options);

export const getLoggerConfig = () => logger.getConfig();

// Export LoggerConfig type
export type { LoggerConfig };

// System info logger
export const logSystemInfo = () => {
  const info = {
    platform: 'linux',
    arch: GLib.getenv('HOSTTYPE') || 'unknown',
    gjs: true,
    timestamp: new Date().toISOString()
  };
  
  logger.info('System Information', 'System', info);
};

// AGS error logger
export const logAgsError = (error: Error, context?: string) => {
  logger.error(error, 'AGS', { context });
  
  // Try to write to error log
  try {
    const home = GLib.getenv('HOME') || GLib.get_home_dir();
    const logDir = `${home}/.config/ags/logs`;
    exec(`mkdir -p ${logDir}`);
    
    const errorLog = `${logDir}/errors.log`;
    const errorEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context
    }) + '\n';
    
    exec(`echo '${errorEntry.replace(/'/g, "'\\''")}' >> ${errorLog}`);
  } catch (e) {
    // Silently fail
  }
};