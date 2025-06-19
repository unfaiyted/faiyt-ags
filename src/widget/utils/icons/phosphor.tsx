import { Widget, Gtk } from "astal/gtk4";
import GLib from "gi://GLib?version=2.0";
import Gio from "gi://Gio?version=2.0";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";
import { Binding, Variable } from "astal";
import { PhosphorIcons, PhosphorIconStyle } from "./types";
import { theme } from "../../../utils/color";
import { createLogger } from "../../../utils/logger";
import { ThemeColor } from "../../../styles/themes";
import themeManager from "../../../services/theme-manager";

const log = createLogger("PhosphorIcon");


// Props for the PhosphorSvgIcon component
export interface PhosphorIconProps extends Widget.ImageProps {
  // The name of the icon without extension or style suffix
  iconName: PhosphorIcons | Binding<PhosphorIcons>;
  // The style of the icon (e.g., "regular", "bold", "duotone")
  style?: PhosphorIconStyle;
  // Size of the icon in pixels (width and height)
  size?: number;
  // Color of the icon (CSS color string)
  color?: ThemeColor | Binding<ThemeColor>;
}

/**
 * Join path segments using GLib's path handling
 */
function joinPath(...segments: string[]): string {
  return segments.join('/');
}

/**
 * Check if a file exists using GLib/Gio
 */
function fileExists(path: string): boolean {
  const file = Gio.File.new_for_path(path);
  return file.query_exists(null);
}

/**
 * Get the project's base directory
 */
function getBaseDir(): string {
  // Use GLib to get the user's home config directory
  const configDir = GLib.get_user_config_dir();
  return `${configDir}/ags`;
}

/**
 * Get the path to the icon SVG file in the Phosphor Icons package
 */
function getIconPath(iconName: string, style: PhosphorIconStyle = PhosphorIconStyle.Regular): string {
  // Format the file name: regular style doesn't have suffix, others do
  const fileName = style === PhosphorIconStyle.Regular
    ? `${iconName}.svg`
    : `${iconName}-${style}.svg`;

  // Base directory for the package
  const baseDir = getBaseDir();

  // Complete path to the SVG file
  const iconPath = joinPath(baseDir, "node_modules", "@phosphor-icons", "core", "assets", style, fileName);

  // Verify file exists
  if (!fileExists(iconPath)) {
    log.debug("Icon not found, trying fallback", {
      iconPath,
      iconName,
      style
    });
    if (style !== PhosphorIconStyle.Regular) {
      return getIconPath(iconName, PhosphorIconStyle.Regular);
    }
  }

  return iconPath;
}

/**
 * Load SVG content as string and modify it for color customization
 */
function loadAndColorizeIcon(path: string, color?: string): string | null {
  try {
    const file = Gio.File.new_for_path(path);
    const [success, contents] = file.load_contents(null);

    if (success) {
      // Convert Uint8Array to string
      let svgContent = new TextDecoder().decode(contents);

      // If color is specified, add CSS to the SVG for color customization
      if (color) {
        // Inject a style that sets currentColor to the specified color
        svgContent = svgContent.replace('<svg', `<svg style="color: ${color};"`)
          .replace('fill="currentColor"', `fill="${color}"`);
      }

      return svgContent;
    }
  } catch (error) {
    log.error("Error loading SVG", { path, error });
  }

  return null;
}

/**
 * PhosphorSvgIcon component that displays an SVG icon from the Phosphor Icons library
 */
export function PhosphorIcon(props: PhosphorIconProps) {
  const { iconName: propIconName, style = PhosphorIconStyle.Regular, size = 16, color: propColor, setup, ...rest } = props;

  log.verbose("Creating PhosphorIcon", {
    iconName: typeof propIconName === "string" ? propIconName : "[Binding]",
    style,
    size
  });

  const iconName = Variable(PhosphorIcons.QuestionMark);
  // Create a reactive variable for the color that updates with theme changes
  const themeColor = Variable("");

  if (typeof propIconName === "string") {
    iconName.set(propIconName);
  } else if (propIconName && typeof propIconName.get === "function") {
    iconName.set(propIconName.get());
  }
  // Create the setup function to handle dynamic updates
  const imageSetup = (image: Gtk.Image) => {

    // Get initial values
    const getIconName = () => {
      if (typeof propIconName === "string") {
        return propIconName;
      } else if (propIconName && typeof propIconName.get === "function") {
        return propIconName.get();
      }
      return "thermometer"; // default
    };

    const getColor = () => {
      if (typeof propColor === "string") {
        // If it's a ThemeColor enum value, get the actual color from theme manager
        const themeColors = Object.values(ThemeColor);
        if (themeColors.includes(propColor as ThemeColor)) {
          return themeManager.getColor(propColor as any);
        }
        return propColor;
      } else if (propColor && typeof propColor.get === "function") {
        const colorValue = propColor.get();
        // Check if it's a ThemeColor enum value
        const themeColors = Object.values(ThemeColor);
        if (themeColors.includes(colorValue as ThemeColor)) {
          return themeManager.getColor(colorValue as any);
        }
        return colorValue;
      }
      // Default to foreground color from theme
      return themeManager.getColor('foreground');
    };

    // Update color from theme
    const updateColorFromTheme = () => {
      const color = getColor();
      themeColor.set(color);
      loadIcon(image, getIconName(), color);
    };

    // Load icon initially
    updateColorFromTheme();

    // Subscribe to theme changes
    const themeChangedHandler = themeManager.connect('theme-changed', () => {
      log.debug("Theme changed, updating icon color");
      updateColorFromTheme();
    });

    // Subscribe to changes if props are Variables/Bindings
    if (propIconName && typeof propIconName.subscribe === "function") {
      propIconName.subscribe((newIconName) => {
        log.debug("Icon name changed", { newIconName });
        loadIcon(image, newIconName, themeColor.get());
      });
    }

    if (propColor && typeof propColor.subscribe === "function") {
      propColor.subscribe(() => {
        updateColorFromTheme();
      });
    }

    // Cleanup on destroy
    image.connect('destroy', () => {
      if (themeChangedHandler) {
        themeManager.disconnect(themeChangedHandler);
      }
    });

    // If a custom setup function was provided, call it
    setup?.(image);
  };

  // Function to load the icon
  const loadIcon = (image: Gtk.Image, iconNameValue: string | Binding<string>, colorValue: string) => {
    log.verbose("Loading icon", { iconName: iconNameValue, color: colorValue });


    let value = (typeof iconNameValue === "string" ? iconNameValue : "");
    // if binding and has get function get value
    if (typeof iconNameValue !== "string" && typeof iconNameValue.get === "function") {
      value = iconNameValue.get();
    }


    // Convert camelCase to kebab-case if needed (e.g., batteryFull -> battery-full)
    const normalizedIconName = value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    // Get the path to the icon file
    const iconPath = getIconPath(normalizedIconName, style);

    try {

      if (colorValue && colorValue !== '') {
        // Load and modify the SVG content to include color
        const svgContent = loadAndColorizeIcon(iconPath, colorValue);

        if (svgContent) {
          log.verbose("Loading colorized SVG", { iconName: iconNameValue, color: colorValue });
          // Create a new GdkPixbuf from the SVG content
          const loader = GdkPixbuf.PixbufLoader.new_with_type("svg");

          // Set the desired size
          loader.set_size(size, size);

          // Load the SVG content
          loader.write(new TextEncoder().encode(svgContent));
          loader.close();

          // Get the pixbuf and set it to the image
          const pixbuf = loader.get_pixbuf();
          if (pixbuf) {
            image.set_from_pixbuf(pixbuf);
          }
        }
      } else {
        // Use standard loading for non-colored icons
        image.set_from_file(iconPath);
      }

      // Set icon size
      image.set_pixel_size(size);
    } catch (error) {
      log.error("Failed to load icon", {
        iconName: iconNameValue,
        path: iconPath,
        error: error instanceof Error ? error.message : String(error)
      });
      // Try fallback to a basic icon
      try {
        const fallbackPath = getIconPath("circle", style);
        log.debug("Attempting fallback icon", { fallbackPath });
        image.set_from_file(fallbackPath);
        image.set_pixel_size(size);
      } catch (e) {
        log.error("Failed to load fallback icon", { error: e });
      }
    }
  };

  // Return the image component
  return <image
    name={rest.name || ""}
    cssName={rest.cssName || ""}
    cssClasses={rest.cssClasses || []}
    {...rest}
    setup={imageSetup}
  />
}

/**
 * Battery icon component with special handling for battery states
 */
export function BatteryIcon(props: Omit<PhosphorIconProps, "iconName"> & { level?: number, charging?: boolean }) {
  const { level = 100, charging = false, ...rest } = props;

  log.verbose("Creating BatteryIcon", { level, charging });

  // Determine which battery icon to show based on level and charging state
  let iconName = PhosphorIcons.BatteryEmpty;

  // Handle charging state
  if (charging) {
    iconName = PhosphorIcons.BatteryCharging;
  }
  // Handle different battery levels
  else if (level <= 10) {
    iconName = PhosphorIcons.BatteryLow;
  } else if (level <= 30) {
    iconName = PhosphorIcons.BatteryWarning;
  } else if (level <= 60) {
    iconName = PhosphorIcons.BatteryMedium;
  } else if (level <= 90) {
    iconName = PhosphorIcons.BatteryHigh;
  } else {
    iconName = PhosphorIcons.BatteryFull;
  }

  log.verbose("Battery icon selected", { iconName, level, charging });

  return <PhosphorIcon iconName={iconName} {...rest} />;
}

export default PhosphorIcon;
