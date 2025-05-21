import { Widget, Gtk } from "astal/gtk4";
import GLib from "gi://GLib?version=2.0";
import Gio from "gi://Gio?version=2.0";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";

// Type for icon styles
export type PhosphorIconStyle = "regular" | "bold" | "duotone" | "fill" | "light" | "thin";

// Props for the PhosphorSvgIcon component
export interface PhosphorSvgIconProps extends Widget.ImageProps {
  // The name of the icon without extension or style suffix
  iconName: string;
  // The style of the icon (e.g., "regular", "bold", "duotone")
  style?: PhosphorIconStyle;
  // Size of the icon in pixels (width and height)
  size?: number;
  // Color of the icon (CSS color string)
  color?: string;
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
function getIconPath(iconName: string, style: PhosphorIconStyle = "regular"): string {
  // Format the file name: [icon-name]-[style].svg
  const fileName = `${iconName}-${style}.svg`;

  // Base directory for the package
  const baseDir = getBaseDir();

  // Complete path to the SVG file
  const iconPath = joinPath(baseDir, "node_modules", "@phosphor-icons", "core", "assets", style, fileName);

  // Verify file exists
  if (!fileExists(iconPath)) {
    print(`Icon not found: ${iconPath}`);
    // Fallback to regular style if specified style doesn't exist
    if (style !== "regular") {
      return getIconPath(iconName, "regular");
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
    print(`Error loading SVG: ${error}`);
  }

  return null;
}

/**
 * PhosphorSvgIcon component that displays an SVG icon from the Phosphor Icons library
 */
export function PhosphorSvgIcon(props: PhosphorSvgIconProps) {
  const { iconName, style = "regular", size = 16, color, setup, ...rest } = props;

  // Convert camelCase to kebab-case if needed (e.g., batteryFull -> battery-full)
  const normalizedIconName = iconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

  // Get the path to the icon file
  const iconPath = getIconPath(normalizedIconName, style);

  // Create the setup function to load the SVG
  const imageSetup = (image: Gtk.Image) => {
    try {
      if (color) {
        // Load and modify the SVG content to include color
        const svgContent = loadAndColorizeIcon(iconPath, color);

        if (svgContent) {
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

      // If a custom setup function was provided, call it
      setup?.(image);
    } catch (error) {
      print(`Failed to load icon: ${iconPath}`);

      // Fall back to standard loading if colorizing fails
      try {
        image.set_from_file(iconPath);
        image.set_pixel_size(size);
      } catch (e) {
        // Nothing else we can do
      }
    }
  };

  // Return the image component
  return (
    <image
      {...rest}
      setup={imageSetup}
    />
  );
}

/**
 * Battery icon component with special handling for battery states
 */
export function BatteryIcon(props: Omit<PhosphorSvgIconProps, "iconName"> & { level?: number, charging?: boolean }) {
  const { level = 100, charging = false, ...rest } = props;

  // Determine which battery icon to show based on level and charging state
  let iconName = "battery";

  // Handle charging state
  if (charging) {
    iconName = "battery-charging";
  }
  // Handle different battery levels
  else if (level <= 10) {
    iconName = "battery-low";
  } else if (level <= 30) {
    iconName = "battery-warning";
  } else if (level <= 60) {
    iconName = "battery-medium";
  } else if (level <= 90) {
    iconName = "battery-high";
  } else {
    iconName = "battery-full";
  }

  return <PhosphorSvgIcon iconName={iconName} {...rest} />;
}
