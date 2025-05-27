import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

export class PercentageCalculator implements Evaluator {
  name = "PercentageCalculator";

  evaluate(input: string): EvaluatorResult | null {
    const result = this.calculatePercentage(input);
    if (result !== null) {
      return {
        value: result,
        hint: "Press Enter to copy result"
      };
    }
    return null;
  }

  private calculatePercentage(input: string): string | null {
    const trimmed = input.trim().toLowerCase();

    // Pattern: X% of Y
    const percentOfPattern = /^([\d.]+)%\s+of\s+([\d.]+)$/;
    let match = trimmed.match(percentOfPattern);
    if (match) {
      const percent = parseFloat(match[1]);
      const value = parseFloat(match[2]);
      if (!isNaN(percent) && !isNaN(value)) {
        const result = (percent / 100) * value;
        return this.formatNumber(result);
      }
    }

    // Pattern: X% off Y or Y - X%
    const percentOffPattern = /^([\d.]+)%\s+off\s+([\d.]+)$/;
    match = trimmed.match(percentOffPattern);
    if (match) {
      const percent = parseFloat(match[1]);
      const value = parseFloat(match[2]);
      if (!isNaN(percent) && !isNaN(value)) {
        const discount = (percent / 100) * value;
        const result = value - discount;
        return this.formatNumber(result);
      }
    }

    // Pattern: X + Y% or X - Y%
    const addPercentPattern = /^([\d.]+)\s*([\+\-])\s*([\d.]+)%$/;
    match = trimmed.match(addPercentPattern);
    if (match) {
      const value = parseFloat(match[1]);
      const operator = match[2];
      const percent = parseFloat(match[3]);
      if (!isNaN(value) && !isNaN(percent)) {
        const percentValue = (percent / 100) * value;
        const result = operator === '+' ? value + percentValue : value - percentValue;
        return this.formatNumber(result);
      }
    }

    // Pattern: what is X% of Y
    const whatIsPattern = /^what\s+is\s+([\d.]+)%\s+of\s+([\d.]+)$/;
    match = trimmed.match(whatIsPattern);
    if (match) {
      const percent = parseFloat(match[1]);
      const value = parseFloat(match[2]);
      if (!isNaN(percent) && !isNaN(value)) {
        const result = (percent / 100) * value;
        return this.formatNumber(result);
      }
    }

    // Pattern: X is what % of Y
    const whatPercentPattern = /^([\d.]+)\s+is\s+what\s*%?\s+of\s+([\d.]+)$/;
    match = trimmed.match(whatPercentPattern);
    if (match) {
      const value1 = parseFloat(match[1]);
      const value2 = parseFloat(match[2]);
      if (!isNaN(value1) && !isNaN(value2) && value2 !== 0) {
        const result = (value1 / value2) * 100;
        return this.formatNumber(result) + '%';
      }
    }

    return null;
  }

  private formatNumber(num: number): string {
    // Round to reasonable precision
    const rounded = Math.round(num * 10000) / 10000;
    
    // Convert to string and remove trailing zeros
    let formatted = rounded.toString();
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '');
    }
    
    return formatted;
  }

  getHint(): string {
    return "Calculate: 20% of 150, 15% off 80, 120 + 15%";
  }
}