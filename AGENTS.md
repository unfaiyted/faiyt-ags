# AGENTS.md - Development Guidelines for AGS Shell

## Build & Development Commands
- `bun build` - Build for production using Vite
- `bun start` - Build and run the application  
- `bun dev` - Start development mode with hot reload
- `bun dev:debug` - Debug mode with GTK inspector
- `bun validate:types` - Run TypeScript type checking
- No test framework configured - verify changes manually

## Code Style Guidelines

### Imports & Structure
- Use ES6 imports: `import { Widget } from "astal/gtk4"`
- Group imports: framework imports first, then local imports
- Use absolute paths from `src/` root for internal imports
- Import types separately when needed: `import * as WorkspaceTypes from "./modules/workspaces/types"`

### TypeScript & Types
- Strict TypeScript enabled - all code must be properly typed
- Use enums for constants: `export enum BarMode { Normal = "normal" }`
- Interface definitions for complex objects with clear property types
- Target ES2022 with JSX support for Astal components

### Naming Conventions
- PascalCase for components, classes, enums, interfaces
- camelCase for variables, functions, properties
- kebab-case for CSS classes and file names where appropriate
- Descriptive names: `initialMonitorShellModes()` not `init()`

### Error Handling & Logging
- Use the centralized logger: `import { log } from "./utils/logger"`
- Log levels: ERROR, WARN, INFO, DEBUG, VERBOSE
- Comprehensive error tracking with source map support
- Always handle async operations with proper error catching