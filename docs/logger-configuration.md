# Logger Configuration Guide

## Output Format

The logger now provides a cleaner, more informative output:

```
10:58 [INFO ] [Bar] app.ts:42 Monitor 0 setup complete
│     │       │     │         └─ Message
│     │       │     └─ File location (file:line)
│     │       └─ Component name
│     └─ Log level
└─ Timestamp (HH:mm)
```

## Configuration Options

### Environment Variables

```bash
# Log level
LOG_LEVEL=debug         # Options: ERROR, WARN, INFO, DEBUG, VERBOSE

# Timestamp format
LOG_TIME_FORMAT=short   # Options: short (HH:mm), time (HH:mm:ss), full (HH:mm:ss.SSS)

# Toggle features
LOG_NO_COLOR=true       # Disable colors
LOG_NO_TIME=true        # Hide timestamps
LOG_NO_LEVEL=true       # Hide log levels
LOG_NO_COMPONENT=true   # Hide component names
LOG_NO_LOCATION=true    # Hide file:line info

# File logging
LOG_FILE=/path/to/logfile.log
```

### Programmatic Configuration

```typescript
import { configureLogger, LogLevel } from './utils/logger';

// Configure logger options
configureLogger({
  level: LogLevel.DEBUG,
  useColors: true,
  showTimestamp: true,
  showLevel: true,
  showComponent: true,
  showLocation: true,
  timestampFormat: 'short', // 'short' | 'time' | 'full'
  logFile: '/path/to/log.txt'
});

// Get current configuration
const config = getLoggerConfig();
console.log(config);
```

## Examples

### Minimal Output
```bash
LOG_NO_LEVEL=true LOG_NO_LOCATION=true ags
# Output: 10:58 [Bar] Monitor 0 setup complete
```

### Debug Mode with Full Details
```bash
LOG_LEVEL=debug LOG_TIME_FORMAT=full ags
# Output: 10:58:23.456 [DEBUG] [System] app.ts:28 Timer "App Initialization" started
```

### Production Mode (Errors Only, No Colors)
```bash
LOG_LEVEL=error LOG_NO_COLOR=true LOG_NO_LOCATION=true ags
# Output: 10:58 [ERROR] [App] Failed to setup monitor 1
```

### File Logging
```bash
LOG_FILE=~/.config/ags/logs/app.log LOG_NO_COLOR=true ags
# Logs to file without ANSI colors
```

## Component-Specific Logging

Each component has its own logger with the component name automatically included:

```typescript
import { barLogger, launcherLogger, sidebarLogger } from './utils/logger';

barLogger.info("Bar initialized");        // 10:58 [INFO ] [Bar] bar.tsx:15 Bar initialized
launcherLogger.debug("Search started");   // 10:58 [DEBUG] [Launcher] launcher.tsx:42 Search started
sidebarLogger.error("Failed to load");    // 10:58 [ERROR] [Sidebar] sidebar.tsx:31 Failed to load
```

## Performance Monitoring

The logger includes built-in performance monitoring:

```typescript
const timer = logger.time("Widget creation");
// ... do work ...
timer.end(); // 10:58 [INFO ] [App] app.ts:50 Widget creation completed in 123ms
```

## Custom Components

Create loggers for your own components:

```typescript
import { createLogger } from './utils/logger';

const myLogger = createLogger('MyComponent');
myLogger.info("Component started"); // 10:58 [INFO ] [MyComponent] my-file.ts:10 Component started
```