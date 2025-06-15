import GObject from "gi://GObject";
import { Gtk, Gdk } from "astal/gtk4";
import { App } from "astal/gtk4";
import configManager from "./config-manager";
import { log } from "../utils/logger";

interface ThemeColors {
  // Base Colors
  base: string;
  surface: string;
  overlay: string;

  // Text Colors
  muted: string;
  subtle: string;
  text: string;

  // Accent Colors
  love: string;
  gold: string;
  rose: string;
  pine: string;
  foam: string;
  iris: string;

  // Semantic Color Roles
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI Component Colors
  background: string;
  backgroundAlt: string;
  backgroundElevated: string;
  foreground: string;
  foregroundAlt: string;
  foregroundMuted: string;
  border: string;
  borderAlt: string;

  // State Colors
  hover: string;
  active: string;
  focus: string;
  disabled: string;
}

interface Theme {
  name: string;
  displayName: string;
  colors: ThemeColors;
}

const themes: Record<string, Theme> = {
  "rose-pine": {
    name: "rose-pine",
    displayName: "Rosé Pine",
    colors: {
      // Base Colors
      base: "#191724",
      surface: "#1f1d2e",
      overlay: "#26233a",

      // Text Colors
      muted: "#6e6a86",
      subtle: "#908caa",
      text: "#e0def4",

      // Accent Colors
      love: "#eb6f92",
      gold: "#f6c177",
      rose: "#ebbcba",
      pine: "#31748f",
      foam: "#9ccfd8",
      iris: "#c4a7e7",

      // Semantic Color Roles
      primary: "#c4a7e7",
      secondary: "#31748f",
      accent: "#eb6f92",
      success: "#9ccfd8",
      warning: "#f6c177",
      error: "#eb6f92",
      info: "#31748f",

      // UI Component Colors
      background: "#191724",
      backgroundAlt: "#1f1d2e",
      backgroundElevated: "#26233a",
      foreground: "#e0def4",
      foregroundAlt: "#908caa",
      foregroundMuted: "#6e6a86",
      border: "#26233a",
      borderAlt: "#6e6a86",

      // State Colors
      hover: "#26233a",
      active: "#393552",
      focus: "#c4a7e7",
      disabled: "#6e6a86",
    },
  },
  "rose-pine-moon": {
    name: "rose-pine-moon",
    displayName: "Rosé Pine Moon",
    colors: {
      // Base Colors
      base: "#232136",
      surface: "#2a273f",
      overlay: "#393552",

      // Text Colors
      muted: "#6e6a86",
      subtle: "#908caa",
      text: "#e0def4",

      // Accent Colors
      love: "#eb6f92",
      gold: "#f6c177",
      rose: "#ea9a97",
      pine: "#3e8fb0",
      foam: "#9ccfd8",
      iris: "#c4a7e7",

      // Semantic Color Roles
      primary: "#c4a7e7",
      secondary: "#3e8fb0",
      accent: "#eb6f92",
      success: "#9ccfd8",
      warning: "#f6c177",
      error: "#eb6f92",
      info: "#3e8fb0",

      // UI Component Colors
      background: "#232136",
      backgroundAlt: "#2a273f",
      backgroundElevated: "#393552",
      foreground: "#e0def4",
      foregroundAlt: "#908caa",
      foregroundMuted: "#6e6a86",
      border: "#393552",
      borderAlt: "#6e6a86",

      // State Colors
      hover: "#393552",
      active: "#44415a",
      focus: "#c4a7e7",
      disabled: "#6e6a86",
    },
  },
  "rose-pine-dawn": {
    name: "rose-pine-dawn",
    displayName: "Rosé Pine Dawn",
    colors: {
      // Base Colors
      base: "#faf4ed",
      surface: "#fffaf3",
      overlay: "#f2e9e1",

      // Text Colors
      muted: "#9893a5",
      subtle: "#797593",
      text: "#575279",

      // Accent Colors
      love: "#b4637a",
      gold: "#ea9d34",
      rose: "#d7827e",
      pine: "#286983",
      foam: "#56949f",
      iris: "#907aa9",

      // Semantic Color Roles
      primary: "#907aa9",
      secondary: "#286983",
      accent: "#b4637a",
      success: "#56949f",
      warning: "#ea9d34",
      error: "#b4637a",
      info: "#286983",

      // UI Component Colors
      background: "#faf4ed",
      backgroundAlt: "#fffaf3",
      backgroundElevated: "#f2e9e1",
      foreground: "#575279",
      foregroundAlt: "#797593",
      foregroundMuted: "#9893a5",
      border: "#f2e9e1",
      borderAlt: "#9893a5",

      // State Colors
      hover: "#f2e9e1",
      active: "#ede4d3",
      focus: "#907aa9",
      disabled: "#9893a5",
    },
  },
};

class ThemeManager extends GObject.Object {
  static {
    GObject.registerClass(
      {
        GTypeName: "ThemeManager",
        Signals: {
          "theme-changed": {
            param_types: [GObject.TYPE_STRING],
          },
        },
      },
      this,
    );
  }

  private cssProvider: Gtk.CssProvider;
  private currentTheme: string;

  constructor() {
    super();
    this.cssProvider = new Gtk.CssProvider();
    this.currentTheme =
      configManager.getValue("appearance.theme") || "rose-pine";

    // Apply theme on startup
    this.applyTheme(this.currentTheme);

    // Listen for config changes
    configManager.connect("config-changed", (self, path: string) => {
      if (path === "appearance.theme") {
        const newTheme = configManager.getValue("appearance.theme");
        if (newTheme && newTheme !== this.currentTheme) {
          this.setTheme(newTheme);
        }
      }
    });
  }

  private generateCssVariables(theme: Theme): string {
    const colors = theme.colors;
    return `
/* Dynamic Theme Variables - ${theme.displayName} */
:root {
  /* Base Colors */
  --theme-base: ${colors.base};
  --theme-surface: ${colors.surface};
  --theme-overlay: ${colors.overlay};
  
  /* Text Colors */
  --theme-muted: ${colors.muted};
  --theme-subtle: ${colors.subtle};
  --theme-text: ${colors.text};
  
  /* Accent Colors */
  --theme-love: ${colors.love};
  --theme-gold: ${colors.gold};
  --theme-rose: ${colors.rose};
  --theme-pine: ${colors.pine};
  --theme-foam: ${colors.foam};
  --theme-iris: ${colors.iris};
  
  /* Semantic Color Roles */
  --theme-primary: ${colors.primary};
  --theme-secondary: ${colors.secondary};
  --theme-accent: ${colors.accent};
  --theme-success: ${colors.success};
  --theme-warning: ${colors.warning};
  --theme-error: ${colors.error};
  --theme-info: ${colors.info};
  
  /* UI Component Colors */
  --theme-background: ${colors.background};
  --theme-background-alt: ${colors.backgroundAlt};
  --theme-background-elevated: ${colors.backgroundElevated};
  --theme-foreground: ${colors.foreground};
  --theme-foreground-alt: ${colors.foregroundAlt};
  --theme-foreground-muted: ${colors.foregroundMuted};
  --theme-border: ${colors.border};
  --theme-border-alt: ${colors.borderAlt};
  
  /* State Colors */
  --theme-hover: ${colors.hover};
  --theme-active: ${colors.active};
  --theme-focus: ${colors.focus};
  --theme-disabled: ${colors.disabled};
}

/* Helper classes */
.theme-bg { background-color: var(--theme-background); }
.theme-bg-alt { background-color: var(--theme-background-alt); }
.theme-bg-elevated { background-color: var(--theme-background-elevated); }
.theme-text { color: var(--theme-foreground); }
.theme-text-alt { color: var(--theme-foreground-alt); }
.theme-text-muted { color: var(--theme-foreground-muted); }
.theme-primary { color: var(--theme-primary); }
.theme-accent { color: var(--theme-accent); }
.theme-border { border-color: var(--theme-border); }
`;
  }

  private applyTheme(themeName: string) {
    const theme = themes[themeName];
    if (!theme) {
      log.warn(`Theme "${themeName}" not found, falling back to rose-pine`);
      this.applyTheme("rose-pine");
      return;
    }

    try {
      const css = this.generateCssVariables(theme);

      // Remove old provider first
      const display = Gdk.Display.get_default();
      if (display) {
        Gtk.StyleContext.remove_provider_for_display(display, this.cssProvider);
      }

      // Load new CSS - convert string to Uint8Array
      const encoder = new TextEncoder();
      const cssBytes = encoder.encode(css);

      try {
        this.cssProvider.load_from_bytes(cssBytes);
      } catch (loadError) {
        log.error("Failed to load CSS data", {
          error: String(loadError),
          cssLength: css.length,
          cssPreview: css.substring(0, 100),
        });
        throw loadError;
      }

      // Add provider with higher priority
      if (display) {
        Gtk.StyleContext.add_provider_for_display(
          display,
          this.cssProvider,
          Gtk.STYLE_PROVIDER_PRIORITY_USER,
        );
      }

      log.info(`Applied theme: ${theme.displayName}`, {
        css: css.substring(0, 200),
      });
    } catch (error) {
      log.error("Failed to apply theme", {
        error: String(error),
        theme: themeName,
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  setTheme(themeName: string) {
    if (!themes[themeName]) {
      log.warn(`Theme "${themeName}" not found`);
      return;
    }

    this.currentTheme = themeName;
    this.applyTheme(themeName);

    // Save to config
    configManager.setValue("appearance.theme", themeName);

    // Emit signal
    this.emit("theme-changed", themeName);
  }

  getTheme(): string {
    return this.currentTheme;
  }

  getAvailableThemes(): Array<{ name: string; displayName: string }> {
    return Object.values(themes).map((theme) => ({
      name: theme.name,
      displayName: theme.displayName,
    }));
  }

  getThemeColors(themeName?: string): ThemeColors | null {
    const theme = themes[themeName || this.currentTheme];
    return theme ? theme.colors : null;
  }

  // Helper method to get a specific color
  getColor(colorName: keyof ThemeColors, themeName?: string): string {
    const colors = this.getThemeColors(themeName);
    return colors ? colors[colorName] : "#000000";
  }

  // Apply theme with transition
  async setThemeWithTransition(themeName: string, duration: number = 300) {
    // This would require more complex implementation with fade effects
    // For now, just switch instantly
    this.setTheme(themeName);
  }
}

const themeManager = new ThemeManager();
export default themeManager;
