import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

export class MathEvaluator implements Evaluator {
  name = "MathEvaluator";

  evaluate(input: string): EvaluatorResult | null {
    const result = this.evaluateMathExpression(input);
    if (result) {
      return {
        value: result,
        hint: "Press Enter to copy result"
      };
    }
    return null;
  }

  getHint(): string {
    return "Supports: + - * / % ^ ( )";
  }

  private evaluateMathExpression(expression: string): string | null {
    if (!expression || expression.trim().length === 0) {
      return null;
    }

    // Check if it looks like a math expression
    if (!this.isMathExpression(expression)) {
      return null;
    }

    try {
      // Preprocess the expression
      const processedExpr = this.preprocessExpression(expression);
      
      // Use Function constructor for safer evaluation
      const func = new Function('return ' + processedExpr);
      const result = func();
      
      // Validate and format the result
      return this.formatResult(result);
    } catch (e) {
      // Not a valid math expression - this is expected for non-math input
      log.debug("Math evaluation failed", { expression, error: e });
      return null;
    }
  }

  private isMathExpression(expression: string): boolean {
    const trimmed = expression.trim();
    
    // Must contain at least one number
    if (!/\d/.test(trimmed)) {
      return false;
    }
    
    // Only allow numbers, operators, parentheses, and whitespace
    const mathPattern = /^[\d\s\+\-\*\/\(\)\.\%\^]+$/;
    if (!mathPattern.test(trimmed)) {
      return false;
    }
    
    // Must contain at least one operator to be considered a math expression
    // This prevents single numbers from being evaluated
    const hasOperator = /[\+\-\*\/\%\^]/.test(trimmed);
    
    // Also consider parentheses as an operation (e.g., "(5)" should evaluate)
    const hasParentheses = /\(.*\)/.test(trimmed);
    
    return hasOperator || hasParentheses;
  }

  private preprocessExpression(expression: string): string {
    let processed = expression.trim();
    
    // Replace ^ with ** for exponentiation
    processed = processed.replace(/\^/g, '**');
    
    // Add multiplication for implicit multiplication (e.g., "2(3)" -> "2*(3)")
    processed = processed.replace(/(\d)\(/g, '$1*(');
    processed = processed.replace(/\)(\d)/g, ')*$1');
    
    return processed;
  }

  private formatResult(result: any): string | null {
    // Check if result is a valid number
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return null;
    }
    
    // Format based on the type of number
    if (Number.isInteger(result)) {
      // For integers, just convert to string
      return result.toString();
    } else {
      // For decimals, round to avoid floating point issues
      const rounded = Math.round(result * 10000000000) / 10000000000;
      
      // Convert to string and remove trailing zeros
      let formatted = rounded.toString();
      
      // Handle scientific notation for very large/small numbers
      if (formatted.includes('e')) {
        return formatted;
      }
      
      // Remove trailing zeros after decimal point
      if (formatted.includes('.')) {
        formatted = formatted.replace(/\.?0+$/, '');
      }
      
      return formatted;
    }
  }
}