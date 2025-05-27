import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

interface TimeUnit {
  names: string[];
  toSeconds: number;
}

export class TimeCalculator implements Evaluator {
  name = "TimeCalculator";

  private units: TimeUnit[] = [
    { names: ['s', 'sec', 'secs', 'second', 'seconds'], toSeconds: 1 },
    { names: ['m', 'min', 'mins', 'minute', 'minutes'], toSeconds: 60 },
    { names: ['h', 'hr', 'hrs', 'hour', 'hours'], toSeconds: 3600 },
    { names: ['d', 'day', 'days'], toSeconds: 86400 },
    { names: ['w', 'wk', 'week', 'weeks'], toSeconds: 604800 },
    { names: ['mo', 'month', 'months'], toSeconds: 2592000 }, // 30 days
    { names: ['y', 'yr', 'year', 'years'], toSeconds: 31536000 }, // 365 days
  ];

  evaluate(input: string): EvaluatorResult | null {
    const result = this.calculateTime(input);
    if (result !== null) {
      return {
        value: result,
        hint: "Press Enter to copy result"
      };
    }
    return null;
  }

  private calculateTime(input: string): string | null {
    const trimmed = input.trim().toLowerCase();

    // Pattern: duration to unit (e.g., "2h 30m to minutes", "150 min to hours")
    const toUnitPattern = /^(.+?)\s+to\s+(\w+)$/;
    const match = trimmed.match(toUnitPattern);
    if (match) {
      const duration = match[1].trim();
      const toUnit = match[2].trim();
      
      const seconds = this.parseDuration(duration);
      if (seconds !== null) {
        return this.convertFromSeconds(seconds, toUnit);
      }
    }

    // Pattern: simple duration calculation (e.g., "2h + 30m")
    if (trimmed.includes('+') || trimmed.includes('-')) {
      const result = this.calculateDurationExpression(trimmed);
      if (result !== null) {
        return this.formatDuration(result);
      }
    }

    return null;
  }

  private parseDuration(duration: string): number | null {
    let totalSeconds = 0;
    
    // Pattern to match number + unit pairs
    const pattern = /([\d.]+)\s*([a-zA-Z]+)/g;
    let match;
    let hasMatch = false;

    while ((match = pattern.exec(duration)) !== null) {
      hasMatch = true;
      const value = parseFloat(match[1]);
      const unitName = match[2].toLowerCase();
      
      if (isNaN(value)) continue;
      
      // Find the unit
      const unit = this.units.find(u => u.names.includes(unitName));
      if (unit) {
        totalSeconds += value * unit.toSeconds;
      } else {
        return null; // Unknown unit
      }
    }

    return hasMatch ? totalSeconds : null;
  }

  private calculateDurationExpression(expression: string): number | null {
    // Split by + and - while keeping the operators
    const parts = expression.split(/([+-])/);
    let totalSeconds = 0;
    let operator = '+';

    for (const part of parts) {
      const trimmedPart = part.trim();
      if (trimmedPart === '+' || trimmedPart === '-') {
        operator = trimmedPart;
      } else if (trimmedPart) {
        const seconds = this.parseDuration(trimmedPart);
        if (seconds === null) return null;
        
        if (operator === '+') {
          totalSeconds += seconds;
        } else {
          totalSeconds -= seconds;
        }
      }
    }

    return totalSeconds;
  }

  private convertFromSeconds(seconds: number, toUnit: string): string | null {
    // Find the target unit
    const unit = this.units.find(u => u.names.includes(toUnit));
    if (!unit) return null;

    const value = seconds / unit.toSeconds;
    
    // Format the result
    const rounded = Math.round(value * 100) / 100;
    return `${rounded} ${toUnit}`;
  }

  private formatDuration(seconds: number): string {
    if (seconds < 0) {
      return '-' + this.formatDuration(-seconds);
    }

    const parts: string[] = [];
    
    // Calculate each unit
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Add parts
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
  }

  getHint(): string {
    return "Convert: 2h 30m to minutes, 150 min to hours";
  }
}