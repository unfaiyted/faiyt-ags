import { DrawingArea, DrawingAreaProps } from "./containers/drawing-area";
import { Gtk } from "astal/gtk4";
import Cairo from "gi://cairo";
import { Binding, Variable, bind } from "astal";
import { theme } from "../../utils/color";

export interface CircularProgressProps extends DrawingAreaProps {
  // Percentage value between 0 and 1
  percentage?: Binding<number>;
  // Size of the circle
  size?: number;
  // Width of the progress line
  lineWidth?: number;
  // Color for the background circle
  backgroundColor?: string | Binding<string>;
  // Color for the progress arc
  foregroundColor?: string | Binding<string>;
  // Whether to display the background circle
  showBackground?: boolean | Binding<boolean>;
}

/**
 * Parses color strings to Cairo color values
 */
function parseColor(colorStr: string = theme.foreground) {
  // Check for rgba format
  const rgbaMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return {
      r: parseInt(r) / 255,
      g: parseInt(g) / 255,
      b: parseInt(b) / 255,
      a: a ? parseFloat(a) : 1,
    };
  }

  // Check for hex format with alpha
  if (colorStr.startsWith('#') && colorStr.length === 9) {
    const r = parseInt(colorStr.substring(1, 3), 16) / 255;
    const g = parseInt(colorStr.substring(3, 5), 16) / 255;
    const b = parseInt(colorStr.substring(5, 7), 16) / 255;
    const a = parseInt(colorStr.substring(7, 9), 16) / 255;
    return { r, g, b, a };
  }

  // Check for hex format without alpha
  if (colorStr.startsWith('#') && (colorStr.length === 7 || colorStr.length === 4)) {
    // For shorthand hex (#rgb)
    if (colorStr.length === 4) {
      const r = parseInt(colorStr[1] + colorStr[1], 16) / 255;
      const g = parseInt(colorStr[2] + colorStr[2], 16) / 255;
      const b = parseInt(colorStr[3] + colorStr[3], 16) / 255;
      return { r, g, b, a: 1 };
    }

    // For regular hex (#rrggbb)
    const r = parseInt(colorStr.substring(1, 3), 16) / 255;
    const g = parseInt(colorStr.substring(3, 5), 16) / 255;
    const b = parseInt(colorStr.substring(5, 7), 16) / 255;
    return { r, g, b, a: 1 };
  }

  // Default color (white)
  return { r: 1, g: 1, b: 1, a: 1 };
}

/**
 * Add alpha to a hex color
 */
function addAlphaToHexColor(color: string, alpha: number): string {
  if (!color.startsWith('#')) return color;

  // Convert alpha to hex
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');

  // Return hex color with alpha
  if (color.length === 7) { // #RRGGBB format
    return `${color}${alphaHex}`;
  } else if (color.length === 4) { // #RGB format
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}${alphaHex}`;
  }

  return color;
}

/**
 * Circular progress component
 */
export const CircularProgress = (props: CircularProgressProps) => {
  // Default values

  const size = props.size ?? 24;
  const lineWidth = props.lineWidth ?? 2;
  const showBackground = props.showBackground ?? true;

  const backgroundColor = new Variable(`${theme.foreground}40`);
  const foregroundColor = new Variable(theme.foreground);

  if (typeof props.foregroundColor === "string") {
    foregroundColor.set(props.foregroundColor);
  }
  else if (props.foregroundColor != undefined) {
    foregroundColor.set(props.foregroundColor.get());
  }
  if (typeof props.backgroundColor === "string") {
    backgroundColor.set(props.backgroundColor);
  } else if (props.backgroundColor != undefined) {
    backgroundColor.set(props.backgroundColor.get());
  }



  const percentage = props.percentage ?? new Variable(0);

  const setupDrawingArea = (widget: Gtk.DrawingArea) => {
    // Set size request
    widget.set_size_request(size, size);

    // Set up the drawing function
    widget.set_draw_func((area, cr, width, height) => {
      // Constants for drawing
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - lineWidth / 2;
      const startAngle = -Math.PI / 2; // Start from top (12 o'clock position)
      const fullCircle = 2 * Math.PI;
      const endAngle = startAngle + percentage.get() * fullCircle;

      // Parse colors
      const bgColor = parseColor(backgroundColor.get());
      const fgColor = parseColor(foregroundColor.get());

      // Clear the surface first
      cr.save();
      cr.setOperator(Cairo.Operator.CLEAR);
      cr.paint();
      cr.restore();

      // Switch to normal drawing mode
      cr.setOperator(Cairo.Operator.OVER);

      // Draw background circle if requested
      if (showBackground) {
        cr.save();
        cr.setLineWidth(lineWidth);
        cr.setSourceRGBA(bgColor.r, bgColor.g, bgColor.b, bgColor.a);
        cr.translate(centerX, centerY);
        cr.arc(0, 0, radius, 0, fullCircle);
        cr.stroke();
        cr.restore();
      }

      // Draw progress arc
      if (percentage.get() > 0.001) {
        cr.save();
        cr.setLineWidth(lineWidth);
        cr.setSourceRGBA(fgColor.r, fgColor.g, fgColor.b, fgColor.a);
        cr.translate(centerX, centerY);
        cr.arc(0, 0, radius, startAngle, endAngle);
        cr.stroke();
        cr.restore();
      }
    });
  };

  const widget = <DrawingArea
    cssName={props.cssName}
    halign={props.halign}
    valign={props.valign}
    setup={setupDrawingArea}
    {...props}
  />

  // Subscribe to percentage to update the progress arc
  percentage.subscribe((value) => {
    // We need to manually update the CircularProgress since we can't bind directly
    if (widget) {
      widget.queue_draw()
    }
  });
  backgroundColor.subscribe(() => {
    if (widget) {
      widget.queue_draw()
    }
  });
  foregroundColor.subscribe(() => {
    if (widget) {
      widget.queue_draw()
    }
  });

  return widget;
};

export default CircularProgress;
