import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }

export class ColorConverter implements Evaluator {
  name = "ColorConverter";

  private namedColors: { [key: string]: string } = {
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'orange': '#FFA500',
    'purple': '#800080',
    'brown': '#A52A2A',
    'pink': '#FFC0CB',
    'lime': '#00FF00',
    'navy': '#000080',
    'teal': '#008080',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
    'indigo': '#4B0082',
    'violet': '#EE82EE',
  };

  evaluate(input: string): EvaluatorResult | null {
    const result = this.convertColor(input);
    if (result !== null) {
      // Extract the hex color from the result for the preview
      let hexColor: string | null = null;
      
      // First try to find a hex color in the result
      const hexMatch = result.match(/#[0-9A-F]{6}/i);
      if (hexMatch) {
        hexColor = hexMatch[0];
      } else {
        // If no hex in result, try to parse the input and convert to hex
        const trimmed = input.trim().toLowerCase();
        const rgb = this.parseColor(trimmed.split(/\s+(to|as)\s+/)[0]);
        if (rgb) {
          hexColor = this.rgbToHex(rgb);
        }
      }
      
      return {
        value: result,
        hint: "Press Enter to copy result",
        metadata: hexColor ? {
          type: 'color',
          color: hexColor
        } : undefined
      };
    }
    return null;
  }

  private convertColor(input: string): string | null {
    const trimmed = input.trim().toLowerCase();

    // Pattern: color to/as format (e.g., "#FF5733 to rgb", "red as hex", "rgb(255,87,51) to hsl")
    const toFormatPattern = /^(.+?)\s+(to|as)\s+(hex|rgb|hsl)$/;
    const match = trimmed.match(toFormatPattern);
    if (match) {
      const color = match[1].trim();
      const toFormat = match[3];
      return this.convertToFormat(color, toFormat);
    }

    // Pattern: just a color (auto-detect and show all formats)
    const color = this.parseColor(trimmed);
    if (color) {
      return this.getAllFormats(color);
    }

    return null;
  }

  private parseColor(color: string): RGB | null {
    // Named color
    if (this.namedColors[color]) {
      return this.hexToRgb(this.namedColors[color]);
    }

    // Hex color
    const hexMatch = color.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      return this.hexToRgb('#' + hexMatch[1]);
    }

    // RGB color
    const rgbMatch = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }

    // HSL color
    const hslMatch = color.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/);
    if (hslMatch) {
      const hsl = {
        h: parseInt(hslMatch[1]),
        s: parseInt(hslMatch[2]),
        l: parseInt(hslMatch[3])
      };
      return this.hslToRgb(hsl);
    }

    return null;
  }

  private convertToFormat(color: string, format: string): string | null {
    const rgb = this.parseColor(color);
    if (!rgb) return null;

    switch (format) {
      case 'hex':
        const hex = this.rgbToHex(rgb);
        return hex;
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        const hsl = this.rgbToHsl(rgb);
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      default:
        return null;
    }
  }

  private getAllFormats(rgb: RGB): string {
    const hex = this.rgbToHex(rgb);
    const hsl = this.rgbToHsl(rgb);
    return `${hex} | rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) | hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  private hexToRgb(hex: string): RGB | null {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Handle 3-digit hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => {
      const hex = n.toString(16).padStart(2, '0');
      return hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
  }

  private rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  private hslToRgb(hsl: HSL): RGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  getHint(): string {
    return "Convert: #FF5733 to rgb, red as hex, rgb(255,87,51) to hsl";
  }
}