import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

export class BaseConverter implements Evaluator {
  name = "BaseConverter";

  evaluate(input: string): EvaluatorResult | null {
    const result = this.convertBase(input);
    if (result !== null) {
      return {
        value: result,
        hint: "Press Enter to copy result"
      };
    }
    return null;
  }

  private convertBase(input: string): string | null {
    const trimmed = input.trim().toLowerCase();

    // Pattern: number to base (e.g., "255 to hex", "42 to binary")
    const toBasePattern = /^(.+?)\s+to\s+(hex|binary|bin|octal|oct|decimal|dec)$/;
    let match = trimmed.match(toBasePattern);
    if (match) {
      const value = match[1].trim();
      const toBase = match[2];
      return this.convertToBase(value, toBase);
    }

    // Pattern: just a hex/binary/octal number (auto-detect and show decimal)
    if (trimmed.startsWith('0x') || trimmed.startsWith('0b') || (trimmed.startsWith('0') && trimmed.length > 1 && /^0[0-7]+$/.test(trimmed))) {
      return this.convertToBase(trimmed, 'decimal');
    }

    return null;
  }

  private convertToBase(value: string, toBase: string): string | null {
    let decimalValue: number;

    // Parse the input value
    try {
      if (value.startsWith('0x')) {
        // Hexadecimal
        decimalValue = parseInt(value, 16);
      } else if (value.startsWith('0b')) {
        // Binary
        decimalValue = parseInt(value.substring(2), 2);
      } else if (value.startsWith('0') && value.length > 1 && /^0[0-7]+$/.test(value)) {
        // Octal
        decimalValue = parseInt(value, 8);
      } else {
        // Try to parse as decimal
        decimalValue = parseInt(value, 10);
        
        // If that fails, try parsing as hex without prefix
        if (isNaN(decimalValue) && /^[0-9a-f]+$/i.test(value)) {
          decimalValue = parseInt(value, 16);
        }
      }

      if (isNaN(decimalValue)) {
        return null;
      }
    } catch (e) {
      return null;
    }

    // Convert to target base
    switch (toBase) {
      case 'hex':
      case 'hexadecimal':
        return '0x' + decimalValue.toString(16).toUpperCase();
      
      case 'bin':
      case 'binary':
        return '0b' + decimalValue.toString(2);
      
      case 'oct':
      case 'octal':
        return '0' + decimalValue.toString(8);
      
      case 'dec':
      case 'decimal':
      default:
        return decimalValue.toString();
    }
  }

  getHint(): string {
    return "Convert: 255 to hex, 0xFF to dec, 42 to binary";
  }
}