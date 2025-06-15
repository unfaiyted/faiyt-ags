# CSS/SCSS Handling Patterns in AGS

## Overview

This document explains how CSS and SCSS files are imported and used in the AGS (Astal GTK Shell) codebase, particularly focusing on patterns that work with both the AGS runtime and Vite builds.

## CSS Import Patterns

### 1. Global CSS Import (App Level)

The main application CSS is imported in `src/app.ts` as a regular import:

```typescript
import appCSS from "./app.scss";

App.start({
  css: appCSS,
  main() {
    // Application initialization
  }
});
```

**Key Points:**
- AGS runtime expects CSS content as a string to pass to GTK's styling system
- The import works differently in development (AGS runtime) vs production (Vite build)
- A custom Vite plugin handles the transformation needed for production builds

### Vite Plugin for CSS Compatibility

To handle the different requirements between AGS runtime and Vite builds, we use a custom plugin in `vite.config.ts`:

```typescript
const agsScssPlugin = () => {
  return {
    name: 'ags-scss-inline',
    transform(code: string, id: string) {
      // Only transform TypeScript files
      if (!id.endsWith('.ts') && !id.endsWith('.tsx')) return;
      
      // Add ?inline to app.scss import during build
      const transformed = code.replace(
        /from\s+["']\.\/app\.scss["']/g,
        'from "./app.scss?inline"'
      );
      
      if (transformed !== code) {
        return { code: transformed, map: null };
      }
    }
  };
};
```

**How it works:**
- During development: AGS processes the SCSS import directly
- During build: The plugin transforms `from "./app.scss"` to `from "./app.scss?inline"`
- The `?inline` query parameter tells Vite to import the CSS as a string rather than injecting it into the DOM
- This allows the same import syntax to work in both environments

### 2. Component-Level CSS Imports

Individual components import their SCSS files directly without the `?inline` parameter:

```typescript
// In src/widget/bar/index.tsx
import "./bar.scss";

// In src/widget/sidebar/index.tsx
import "./sidebars.scss";
```

**Key Points:**
- These imports are processed by Vite during build time
- Vite compiles SCSS to CSS and bundles all component styles into a single CSS file
- The bundled CSS is output as a separate file (e.g., `dist/app-[hash].css`)

### 3. Dynamic Theme System

The theme manager (`src/services/theme-manager.ts`) creates CSS at runtime using CSS variables:

```typescript
private generateCssVariables(theme: Theme): string {
  return `
    :root {
      --theme-base: ${colors.base};
      --theme-surface: ${colors.surface};
      // ... more variables
    }
  `;
}

// Applied using GTK's CssProvider
this.cssProvider.load_from_bytes(cssBytes);
Gtk.StyleContext.add_provider_for_display(
  display,
  this.cssProvider,
  Gtk.STYLE_PROVIDER_PRIORITY_USER
);
```

## Build Process

### Development Mode

1. **Tailwind CSS Compilation**: The `dev.sh` script first compiles Tailwind CSS:
   ```bash
   bunx tailwindcss -i ./input.css -o ./src/output.css
   ```

2. **CSS Patching**: Custom scripts patch the CSS for GTK4 compatibility:
   ```bash
   ./scripts/tailwind-patch.js ./src/output.css
   ./scripts/fix-gtk4-css.js ./src/output.css
   ```

3. **AGS Runtime**: AGS runs the TypeScript directly without bundling

### Production Build

1. **Vite Build**: Processes all TypeScript and SCSS files:
   - SCSS files are compiled to CSS using the `sass` package
   - All CSS is bundled into a single file with a content hash
   - The main `app.scss` with `?inline` is embedded in the JavaScript bundle

2. **Output Structure**:
   ```
   dist/
   ├── app.js          # Main JavaScript bundle with inline CSS
   ├── app.js.map      # Source map for debugging
   └── app-[hash].css  # Bundled component styles
   ```

## File Organization

### Main Style Entry Point

`src/app.scss` serves as the main entry point that:
- Imports theme variables and colors
- Forwards the compiled Tailwind CSS output
- Forwards all component-specific styles using `@forward`

### Component Styles

Each major component has its own SCSS file:
- `src/widget/bar/bar.scss`
- `src/widget/sidebar/sidebars.scss`
- `src/widget/launcher/launcher.scss`
- etc.

### Shared Styles

- `src/styles/colors.scss` - Color utility functions
- `src/styles/theme-variables.scss` - CSS custom properties for theming

## GTK4 Compatibility

### CSS Limitations

GTK4's CSS implementation has limitations compared to web CSS:
- Limited pseudo-selectors
- No CSS Grid or Flexbox
- Custom widget selectors (e.g., `top-bar`, `bar-group`)
- Requires specific property names for GTK widgets

### Workarounds

1. **Custom Scripts**: The build process includes scripts to fix incompatible CSS
2. **Theme Variables**: Using CSS custom properties for dynamic theming
3. **Widget Classes**: Using GTK-specific widget names as selectors

## Best Practices

1. **Global Styles**: Use `app.scss` with `?inline` for application-wide styles
2. **Component Styles**: Import SCSS directly in components for scoped styles
3. **Theme Variables**: Use CSS custom properties for theme-able values
4. **GTK Selectors**: Use widget type names for targeting GTK widgets
5. **Build Testing**: Always test both development and production builds

## Example: Adding a New Component with Styles

```typescript
// src/widget/my-component/index.tsx
import "./my-component.scss";
import { Widget } from "astal/gtk4";

export default function MyComponent() {
  return (
    <box className="my-component">
      <label className="my-component-title">Hello</label>
    </box>
  );
}
```

```scss
// src/widget/my-component/my-component.scss
@use "../../styles/colors";

.my-component {
  background-color: colors.c(background);
  padding: 12px;
  
  &-title {
    color: colors.c(foreground);
    font-weight: bold;
  }
}
```

```scss
// Add to src/app.scss
@forward "./widget/my-component/my-component.scss";
```

This ensures the styles are included in both development and production builds.