import { exec, GLib } from "astal";
import { Variable } from "astal";
import { sourceMapReader } from "./source-map-reader";

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  white: "\x1b[37m",
};

// Log level configuration
const logLevelNames = {
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.WARN]: "WARN",
  [LogLevel.INFO]: "INFO",
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.VERBOSE]: "VERBOSE",
};

const logLevelColors = {
  [LogLevel.ERROR]: colors.red,
  [LogLevel.WARN]: colors.yellow,
  [LogLevel.INFO]: colors.cyan,
  [LogLevel.DEBUG]: colors.gray,
  [LogLevel.VERBOSE]: colors.magenta,
};

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  useColors: boolean;
  showTimestamp: boolean;
  showLevel: boolean;
  showComponent: boolean;
  showLocation: boolean;
  timestampFormat: "full" | "time" | "short"; // full: HH:mm:ss.SSS, time: HH:mm:ss, short: HH:mm
  logFile?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  useColors: boolean;
  showTimestamp: boolean;
  showLevel: boolean;
  showComponent: boolean;
  showLocation: boolean;
  timestampFormat: "full" | "time" | "short";
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
    timestampFormat: "short",
  };

  private logHistory = Variable<string[]>([]);
  private maxHistorySize = 1000;
  private componentWhitelist: Set<string> | null = null;

  constructor() {
    // Set log level from environment (GJS compatible)
    const envLevel = GLib.getenv("LOG_LEVEL")?.toUpperCase();
    if (envLevel && envLevel in LogLevel) {
      this.config.level = LogLevel[envLevel as keyof typeof LogLevel];
    }

    // Set log file from environment
    const logFile = GLib.getenv("LOG_FILE");
    if (logFile) {
      this.config.logFile = logFile;
    }

    // Configure from environment variables
    if (GLib.getenv("LOG_NO_COLOR") === "true") this.config.useColors = false;
    if (GLib.getenv("LOG_NO_TIME") === "true")
      this.config.showTimestamp = false;
    if (GLib.getenv("LOG_NO_LEVEL") === "true") this.config.showLevel = false;
    if (GLib.getenv("LOG_NO_COMPONENT") === "true")
      this.config.showComponent = false;
    if (GLib.getenv("LOG_NO_LOCATION") === "true")
      this.config.showLocation = false;

    const timeFormat = GLib.getenv("LOG_TIME_FORMAT");
    if (
      timeFormat === "full" ||
      timeFormat === "time" ||
      timeFormat === "short"
    ) {
      this.config.timestampFormat = timeFormat;
    }

    // Override print function
    this.overridePrint();
  }

  private overridePrint() {
    const originalPrint = globalThis.print;
    globalThis.print = (...args: any[]) => {
      this.info(args.map((arg) => String(arg)).join(" "));
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
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    switch (this.config.timestampFormat) {
      case "short":
        return `${hours}:${minutes}`;
      case "time": {
        const seconds = now.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      }
      case "full":
      default: {
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const ms = now.getMilliseconds().toString().padStart(3, "0");
        return `${hours}:${minutes}:${seconds}.${ms}`;
      }
    }
  }

  private getCallerInfo(): {
    file: string;
    line: number;
    fullPath?: string;
  } | null {
    try {
      // Create an error to get stack trace
      const err = new Error();
      const stack = err.stack;

      if (!stack) return null;

      // Parse stack trace - skip first 4 lines (Error, getCallerInfo, formatMessage, log)
      const lines = stack.split("\n");
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
          /\s+(.+?):(\d+):(\d+)/,
        ];

        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            let filePath = match[1];

            // Remove file:// prefix if present
            filePath = filePath.replace(/^file:\/\//, "");

            // Get line and column numbers
            const lineNum = parseInt(match[2], 10);
            const colNum = match[3] ? parseInt(match[3], 10) : 0;

            // Get just the filename
            const parts = filePath.split("/");
            const fileName = parts[parts.length - 1];

            // If this is ags.js, use source map to get the real source
            let sourceFile = fileName;
            let sourceLine = lineNum;

            if (fileName === "ags.js" || filePath.endsWith("/ags.js")) {
              const sourceLocation = sourceMapReader.getSourceLocation(
                fileName,
                lineNum,
                colNum,
              );
              const sourceParts = sourceLocation.split(":");
              if (sourceParts.length >= 2) {
                sourceFile = sourceParts[0];
                sourceLine = parseInt(sourceParts[1], 10);

                // Check if this is a logger file - if so, skip it
                if (
                  sourceFile.includes("logger.ts") ||
                  sourceFile.includes("logger.js") ||
                  sourceFile.includes("/services/logger") ||
                  sourceFile.includes("/utils/logger")
                ) {
                  if (!foundNonLogger) continue;
                }

                foundNonLogger = true;
                return {
                  file: sourceFile,
                  line: sourceLine,
                  fullPath: filePath,
                };
              }
            }

            // For non-ags.js files, check if it's a logger file
            if (fileName.includes("logger")) {
              if (!foundNonLogger) continue;
            }

            foundNonLogger = true;

            // Fallback: Convert .js to .ts for source files
            const sourceFileName = fileName.replace(/\.js$/, ".ts");

            return {
              file: sourceFileName,
              line: lineNum,
              fullPath: filePath,
            };
          }
        }
      }
    } catch (e) {
      // Silently fail
    }
    return null;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    component?: string,
    meta?: any,
    subclass?: string,
  ): string {
    const parts: string[] = [];
    const callerInfo = this.config.showLocation ? this.getCallerInfo() : null;

    if (this.config.useColors) {
      // Timestamp
      if (this.config.showTimestamp) {
        parts.push(`${colors.dim}${this.formatTimestamp()}${colors.reset}`);
      }

      // Level
      if (this.config.showLevel) {
        parts.push(
          `${logLevelColors[level]}[${logLevelNames[level].padEnd(5)}]${colors.reset}`,
        );
      }

      // Component
      if (this.config.showComponent && component) {
        const componentDisplay = subclass ? `${component}/${subclass}` : component;
        parts.push(`${colors.bright}[${componentDisplay}]${colors.reset}`);
      }

      // Message
      parts.push(message);

      // Location (file:line) - show after message with arrow for errors
      if (this.config.showLocation && callerInfo) {
        if (level === LogLevel.ERROR) {
          parts.push(
            `\n  ${colors.cyan}→ ${callerInfo.file}:${callerInfo.line}${colors.reset}`,
          );
        } else {
          parts.push(
            ` ${colors.blue}@${callerInfo.file}:${callerInfo.line}${colors.reset}`,
          );
        }
      }

      // Metadata
      if (meta && Object.keys(meta).length > 0) {
        // Special handling for stack traces
        if (meta.stack && typeof meta.stack === "string") {
          const stackLines = meta.stack
            .split("\n")
            .filter((line) => line.trim());

          // Format stack trace with proper newlines
          parts.push(`\n${colors.dim}Stack trace:${colors.reset}`);

          stackLines.forEach((line, index) => {
            // Clean up the line - remove extra spaces
            const cleanedLine = line.trim().replace(/\s+/g, " ");

            // Try to parse the stack frame
            const frameMatch = cleanedLine.match(/^(.+?)\s+(.+?):(\d+):(\d+)$/);
            if (frameMatch) {
              const [, func, file, lineNum, col] = frameMatch;
              parts.push(
                `\n  ${colors.yellow}${index + 1}.${colors.reset} ${colors.cyan}${func}${colors.reset}`,
              );
              parts.push(
                `\n     ${colors.dim}at${colors.reset} ${colors.blue}${file}:${lineNum}:${col}${colors.reset}`,
              );
            } else {
              // Fallback for unparseable lines
              parts.push(
                `\n  ${colors.yellow}${index + 1}.${colors.reset} ${colors.dim}${cleanedLine}${colors.reset}`,
              );
            }
          });

          // Add other metadata if present, but filter out numeric keys
          const otherMeta = { ...meta };
          delete otherMeta.stack;

          // Filter out numeric string keys (like "0", "1", "2")
          const filteredMeta = Object.keys(otherMeta)
            .filter((key) => isNaN(Number(key)))
            .reduce((obj, key) => {
              obj[key] = otherMeta[key];
              return obj;
            }, {} as any);

          if (Object.keys(filteredMeta).length > 0) {
            const metaStr = JSON.stringify(filteredMeta, null, 2)
              .split("\n")
              .map((line, i) => (i === 0 ? `\n${line}` : `  ${line}`))
              .join("\n");
            parts.push(`${colors.dim}${metaStr}${colors.reset}`);
          }
        } else {
          // Filter out numeric string keys from regular metadata too
          const filteredMeta = Object.keys(meta)
            .filter((key) => isNaN(Number(key)))
            .reduce((obj, key) => {
              obj[key] = meta[key];
              return obj;
            }, {} as any);

          if (Object.keys(filteredMeta).length > 0) {
            const metaStr = JSON.stringify(filteredMeta, null, 2)
              .split("\n")
              .map((line, i) => (i === 0 ? line : `  ${line}`))
              .join("\n");
            parts.push(`\n${colors.dim}${metaStr}${colors.reset}`);
          }
        }
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
        const componentDisplay = subclass ? `${component}/${subclass}` : component;
        parts.push(`[${componentDisplay}]`);
      }
      parts.push(message);
      if (this.config.showLocation && callerInfo) {
        parts.push(` @${callerInfo.file}:${callerInfo.line}`);
      }
      if (meta && Object.keys(meta).length > 0) {
        // Handle stack traces in plain text format too
        if (meta.stack && typeof meta.stack === "string") {
          const stackLines = meta.stack
            .split("\n")
            .filter((line) => line.trim());
          const stackObject: Record<string, string> = {};

          stackLines.forEach((line, index) => {
            const cleanedLine = line.trim().replace(/\s+/g, " ");
            stackObject[index.toString()] = cleanedLine;
          });

          const otherMeta = { ...meta };
          delete otherMeta.stack;

          // Filter out numeric string keys
          const filteredMeta = Object.keys(otherMeta)
            .filter((key) => isNaN(Number(key)))
            .reduce((obj, key) => {
              obj[key] = otherMeta[key];
              return obj;
            }, {} as any);

          const fullMeta =
            Object.keys(filteredMeta).length > 0
              ? { ...filteredMeta, stackTrace: stackObject }
              : { stackTrace: stackObject };

          parts.push(`\n${JSON.stringify(fullMeta, null, 2)}`);
        } else {
          // Filter out numeric string keys from regular metadata too
          const filteredMeta = Object.keys(meta)
            .filter((key) => isNaN(Number(key)))
            .reduce((obj, key) => {
              obj[key] = meta[key];
              return obj;
            }, {} as any);

          if (Object.keys(filteredMeta).length > 0) {
            parts.push(`\n${JSON.stringify(filteredMeta, null, 2)}`);
          }
        }
      }
    }

    // Join parts intelligently - single line for basic messages, multi-line for complex ones
    if (parts.some((part) => part.includes("\n"))) {
      // For multi-line output, join major sections with newlines
      return parts.join("");
    } else {
      // For single-line output, join with spaces
      return parts.join(" ");
    }
  }

  private log(
    level: LogLevel,
    message: string,
    component?: string,
    meta?: any,
    subclass?: string,
  ) {
    if (level > this.config.level) return;

    // Check whitelist if configured
    if (this.componentWhitelist !== null && component) {
      const fullComponent = subclass ? `${component}/${subclass}` : component;
      if (!this.componentWhitelist.has(fullComponent) && !this.componentWhitelist.has(component)) {
        return;
      }
    }

    const formattedMessage = this.formatMessage(
      level,
      message,
      component,
      meta,
      subclass,
    );

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
      const plainMessage = message.replace(/\x1b\[[0-9;]*m/g, ""); // Remove ANSI codes
      exec(
        `echo '${plainMessage.replace(/'/g, "'\\''")}' >> ${this.config.logFile}`,
      );
    } catch (e) {
      // Silently fail to avoid recursive logging
    }
  }

  // Helper function to parse and source-map a stack trace
  private parseStackTrace(stackString: string): string[] {
    const formattedStack: string[] = [];

    try {
      const stackLines = stackString
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of stackLines) {
        // Skip error message lines
        if (
          line.startsWith("Error:") ||
          line.startsWith("TypeError:") ||
          line.includes(" Error")
        )
          continue;

        // Try to parse the stack frame
        const patterns = [
          // GJS format: functionName@file:///path/to/file.js:123:45
          /^(.+?)@file:\/\/(.+?):(\d+):(\d+)$/,
          // Alternative format without function name
          /@file:\/\/(.+?):(\d+):(\d+)$/,
          // Simple format: functionName@path:line:col
          /^(.+?)@(.+?):(\d+):(\d+)$/,
          // Format with just line:col
          /^(.+?)@(.+?):(\d+)$/,
        ];

        let matched = false;
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            matched = true;
            const hasFunction = pattern.source.startsWith("^(.+?)@");
            const functionName = hasFunction ? match[1] : undefined;
            const filePath = hasFunction ? match[2] : match[1];
            const lineNum = parseInt(hasFunction ? match[3] : match[2], 10);
            const colNum = match[hasFunction ? 4 : 3]
              ? parseInt(match[hasFunction ? 4 : 3], 10)
              : undefined;

            // Check if this is ags.js and needs source mapping
            if (filePath.endsWith("/ags.js") || filePath.includes("ags.js")) {
              const sourceLocation = sourceMapReader.getSourceLocation(
                "ags.js",
                lineNum,
                colNum || 0,
              );
              const parts = sourceLocation.split(":");
              if (parts.length >= 2 && !sourceLocation.includes("ags.js")) {
                const sourceFile = parts[0];
                const sourceLine = parseInt(parts[1], 10);
                const sourceCol = parts[2] ? parseInt(parts[2], 10) : undefined;

                formattedStack.push(
                  `${functionName || "anonymous"}@${sourceFile}:${sourceLine}${sourceCol ? ":" + sourceCol : ""}`,
                );
              } else {
                // Fallback if source mapping fails
                formattedStack.push(line);
              }
            } else {
              // For non-ags.js files, clean up the path
              const cleanPath = filePath.replace(/^file:\/\//, "");
              formattedStack.push(
                `${functionName || "anonymous"}@${cleanPath}:${lineNum}${colNum ? ":" + colNum : ""}`,
              );
            }
            break;
          }
        }

        if (!matched) {
          // If we can't parse it, include the original line
          formattedStack.push(line);
        }
      }
    } catch (e) {
      // If parsing fails, return original stack lines
      return stackString
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }

    return formattedStack;
  }

  // Helper to process metadata and source-map any stack traces
  private processMetadata(meta: any): any {
    if (!meta || typeof meta !== "object") return meta;

    const processed = { ...meta };

    // Process any stack traces in the metadata
    for (const key in processed) {
      const value = processed[key];

      // Check if this is a stack trace string
      if (
        typeof value === "string" &&
        (key === "stack" || value.includes("@file://"))
      ) {
        processed[key] = this.parseStackTrace(value).join("\n");
      }
      // Recursively process nested objects
      else if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Date) &&
        !(value instanceof RegExp)
      ) {
        processed[key] = this.processMetadata(value);
      }
    }

    return processed;
  }

  // Public API
  error(message: string | Error, component?: string, meta?: any, subclass?: string) {
    // Process metadata to source-map any embedded stack traces
    const processedMeta = this.processMetadata(meta);

    if (message instanceof Error) {
      // Parse and format the main stack trace
      const formattedStack = this.parseStackTrace(message.stack || "");

      // Create clean metadata object
      const errorMeta: any = {};

      // Add the formatted stack trace
      if (formattedStack.length > 0) {
        errorMeta.stack = formattedStack.join("\n");
      }

      // Check if the error object has additional properties (besides standard Error properties)
      const errorKeys = Object.keys(message).filter(
        (key) =>
          key !== "message" &&
          key !== "stack" &&
          key !== "name" &&
          key !== "cause" &&
          isNaN(Number(key)), // Filter out numeric string keys
      );

      // Add non-standard error properties
      errorKeys.forEach((key) => {
        errorMeta[key] = (message as any)[key];
      });

      // Add any additional metadata
      if (processedMeta) {
        // Filter out numeric keys from processed metadata too
        const filteredProcessedMeta = Object.keys(processedMeta)
          .filter((key) => isNaN(Number(key)))
          .reduce((obj, key) => {
            obj[key] = processedMeta[key];
            return obj;
          }, {} as any);

        Object.assign(errorMeta, filteredProcessedMeta);
      }

      // Log with formatted stack
      this.log(LogLevel.ERROR, message.message, component, errorMeta, subclass);
    } else {
      this.log(LogLevel.ERROR, message, component, processedMeta, subclass);
    }
  }

  warn(message: string, component?: string, meta?: any, subclass?: string) {
    this.log(LogLevel.WARN, message, component, meta, subclass);
  }

  info(message: string, component?: string, meta?: any, subclass?: string) {
    this.log(LogLevel.INFO, message, component, meta, subclass);
  }

  debug(message: string, component?: string, meta?: any, subclass?: string) {
    this.log(LogLevel.DEBUG, message, component, meta, subclass);
  }

  verbose(message: string, component?: string, meta?: any, subclass?: string) {
    this.log(LogLevel.VERBOSE, message, component, meta, subclass);
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

  // Set component whitelist for filtering
  setComponentWhitelist(components: string[] | null) {
    if (components === null) {
      this.componentWhitelist = null;
    } else {
      this.componentWhitelist = new Set(components);
    }
  }

  getComponentWhitelist(): string[] | null {
    return this.componentWhitelist ? Array.from(this.componentWhitelist) : null;
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
      },
    };
  }
}

// Create singleton instance
const logger = new Logger();

// Component logger wrapper
export class ComponentLogger {
  constructor(private component: string, private subclass?: string) {}

  error(message: string | Error, meta?: any) {
    logger.error(message, this.component, meta, this.subclass);
  }

  warn(message: string, meta?: any) {
    logger.warn(message, this.component, meta, this.subclass);
  }

  info(message: string, meta?: any) {
    logger.info(message, this.component, meta, this.subclass);
  }

  debug(message: string, meta?: any) {
    logger.debug(message, this.component, meta, this.subclass);
  }

  verbose(message: string, meta?: any) {
    logger.verbose(message, this.component, meta, this.subclass);
  }

  time(label: string) {
    return logger.time(label, this.component);
  }

  // Create a subclass logger
  subClass(subclass: string): ComponentLogger {
    return new ComponentLogger(this.component, subclass);
  }
}

// Export default logger and functions
export default logger;

export const createLogger = (component: string) =>
  new ComponentLogger(component);

export const setLogLevel = (level: LogLevel) => logger.setLevel(level);

export const getLogLevel = () => logger.getLevel();

export const restoreOriginalPrint = () => logger.restoreOriginalPrint();

export const getLogHistory = () => logger.getHistory();

export const clearLogHistory = () => logger.clearHistory();

export const configureLogger = (options: Partial<LoggerConfig>) =>
  logger.configure(options);

export const getLoggerConfig = () => logger.getConfig();

export const setLogWhitelist = (components: string[] | null) => 
  logger.setComponentWhitelist(components);

export const getLogWhitelist = () => logger.getComponentWhitelist();

// Export LoggerConfig type
export type { LoggerConfig };

// System info logger
export const logSystemInfo = () => {
  const info = {
    platform: "linux",
    arch: GLib.getenv("HOSTTYPE") || "unknown",
    gjs: true,
    timestamp: new Date().toISOString(),
  };

  logger.info("System Information", "System", info);
};

// AGS error logger
export const logAgsError = (error: Error, context?: string) => {
  logger.error(error, "AGS", { context });

  // Try to write to error log
  try {
    const home = GLib.getenv("HOME") || GLib.get_home_dir();
    const logDir = `${home}/.config/ags/logs`;
    exec(`mkdir -p ${logDir}`);

    const errorLog = `${logDir}/errors.log`;
    const errorEntry =
      JSON.stringify({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        context,
      }) + "\n";

    exec(`echo '${errorEntry.replace(/'/g, "'\\''")}' >> ${errorLog}`);
  } catch (e) {
    // Silently fail
  }
};

