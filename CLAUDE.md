# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Primary Commands
- `bun build` - Build for production using Vite
- `bun start` - Build and run the application
- `bun dev` - Start development mode with hot reload
- `bun dev:watch` - Development mode with file watching (nodemon)
- `bun dev:debug` - Debug mode with GTK inspector enabled
- `bun validate:types` - Run TypeScript type checking

### Build Process
1. Tailwind CSS compilation happens automatically via `dev.sh` script
2. Vite handles TypeScript/TSX compilation and bundling
3. Source maps are generated for debugging
4. No minification in builds for better debugging

## Architecture Overview

### Technology Stack
- **Framework**: AGS (Astal GTK Shell) - A GTK4-based shell framework for Wayland
- **UI Runtime**: GJS (GNOME JavaScript bindings)
- **Language**: TypeScript with TSX/JSX support
- **Styling**: Tailwind CSS + Sass/SCSS
- **Build Tool**: Vite (configured for GJS compatibility)
- **Package Manager**: Bun (with npm fallback)

### Project Structure
- `/src/widget/` - All UI components (bar, launcher, sidebar, overlays)
- `/src/services/` - Core services (logger, bluetooth, claude AI, overlay manager)
- `/src/utils/` - Utility functions and helpers
- `/src/handlers/` - Command handlers for CLI and AI integrations
- `/src/app.ts` - Main application entry point
- `/src/app.scss` - Global styles and theme

### Key Architectural Patterns

1. **Component Architecture**: 
   - TSX components using Astal's reactive framework
   - Components receive window parameter for proper display management
   - Extensive use of GTK4 widgets wrapped in TSX

2. **Window Management**:
   - Each major component (bar, launcher, sidebar) is a separate window
   - Windows are positioned using GTK Layer Shell
   - Multi-monitor support with windows spawned per monitor

3. **Service Layer**:
   - Services are singleton instances managing specific functionality
   - Logger service with comprehensive configuration via environment variables
   - Source map support for enhanced error tracking

4. **Event Handling**:
   - Hyprland IPC integration for workspace and window events
   - Click-outside detection using overlay regions
   - Keyboard shortcuts handled at window level

5. **State Management**:
   - Astal's reactive variables for state
   - Service-level state management
   - No global state store

### Development Considerations

1. **GJS Compatibility**:
   - Code must be compatible with GJS runtime (not Node.js)
   - Limited to ES2022 features
   - No native Node.js modules

2. **GTK4 Constraints**:
   - Must use GTK4 widgets and patterns
   - Layer shell for window positioning
   - CSS styling with GTK4 limitations

3. **Type Definitions**:
   - Custom type definitions in `@types/` for GIR bindings
   - Astal framework types for reactive components

4. **Error Handling**:
   - Custom error tracking system with source map support
   - Comprehensive logging with configurable levels
   - Stack trace enhancement for debugging

### Environment Variables

Logger configuration:
- `AGS_LOG_LEVEL` - Set logging level (error, warn, info, debug)
- `AGS_LOG_FORMAT` - Log format (json, simple, pretty)
- `AGS_LOG_FILE` - Enable file logging
- `AGS_LOG_CONSOLE` - Enable console logging
- `AGS_LOG_MAX_FILES` - Maximum log files to keep
- `AGS_LOG_MAX_SIZE` - Maximum size per log file