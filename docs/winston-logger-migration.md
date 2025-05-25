# Winston Logger Migration Guide

This guide explains how to use the new Winston logger in your AGS GTK4 application.

## Quick Start

### 1. Import the logger

```typescript
import { log } from "./utils/logger";

// For component-specific loggers
import { barLogger, launcherLogger, sidebarLogger } from "./utils/logger";

// For creating custom loggers
import { createLogger } from "./utils/logger";
```

### 2. Basic Usage

Replace `print()` statements with logger methods:

```typescript
// Before
print("SideBar - screenSide: " + screenSide);

// After
sidebarLogger.info(`screenSide: ${screenSide}`);
```

### 3. Log Levels

```typescript
// Different log levels
log.error("Critical error occurred");
log.warn("This might be a problem");
log.info("Normal information");
log.debug("Detailed debug info");
log.verbose("Very detailed info");
```

### 4. Logging with Metadata

```typescript
// Log with additional context
launcherLogger.info("User search", { 
  query: searchText, 
  resultCount: results.length 
});

// Log errors with stack traces
try {
  // some code
} catch (error) {
  log.error(error); // Automatically includes stack trace
}
```

### 5. Performance Monitoring

```typescript
// Time operations
const timer = logger.time("Widget creation");
// ... do work ...
timer.end(); // Logs: [INFO] Widget creation completed - 123ms

// Measure async operations
await perf.measure("API call", async () => {
  return await fetchData();
});
```

### 6. Class and Method Decorators

```typescript
import { LogClass, LogMethod } from "./utils/logger";

@LogClass()
class MyWidget {
  @LogMethod()
  async loadData() {
    // Method calls are automatically logged
  }
}
```

### 7. Environment Configuration

Set log level via environment variable:

```bash
LOG_LEVEL=debug ags

# Or in your shell config
export LOG_LEVEL=debug
```

### 8. File Logging

Enable file logging:

```bash
LOG_FILE=~/.config/ags/logs/app.log ags
```

## Migration Examples

### Example 1: Simple print statement

```typescript
// Before
print("Window opened");

// After
log.info("Window opened");
```

### Example 2: Debug information

```typescript
// Before
print(`Setting up monitor ${index}`);

// After
log.debug(`Setting up monitor ${index}`);
```

### Example 3: Error handling

```typescript
// Before
try {
  // code
} catch (e) {
  print("Error: " + e.message);
}

// After
try {
  // code
} catch (error) {
  log.error("Operation failed", { error });
}
```

### Example 4: Component logging

```typescript
// Before (in launcher/index.tsx)
print("Launcher opened");
print("Search text: " + text);

// After
import { launcherLogger } from "../../utils/logger";

launcherLogger.info("Launcher opened");
launcherLogger.debug("Search text changed", { text });
```

## Pretty Output Examples

The logger provides colored, formatted output:

```
[INFO] 10:23:45 AM - AGS Application Starting
[INFO] 10:23:45 AM - System Information
└─ {
     "platform": "linux",
     "arch": "x64",
     "memory": { "rss": 123456, "heapTotal": 789012 }
   }
[DEBUG] 10:23:45 AM - [Launcher] Search text changed
└─ { "text": "firefox" }
[ERROR] 10:23:46 AM - [Service] API call failed
└─ {
     "error": "Network timeout",
     "stack": "Error: Network timeout\n    at apiCall..."
   }
```

## Tips

1. **Use component loggers** for better organization
2. **Set appropriate log levels** - use `debug` for development, `info` for production
3. **Include metadata** for better debugging context
4. **Use timers** for performance monitoring
5. **Keep the original print()** - it's overridden but can be restored with `restoreOriginalPrint()`

## Backward Compatibility

The logger automatically overrides the global `print()` function, so existing code will continue to work and output through Winston.