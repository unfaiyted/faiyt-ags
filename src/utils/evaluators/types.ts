/**
 * Base interface for all evaluators
 */
export interface Evaluator {
  /**
   * Name of the evaluator (for debugging/logging)
   */
  name: string;

  /**
   * Evaluate the input and return a result if applicable
   * @param input The user's input string
   * @returns The evaluated result or null if not applicable
   */
  evaluate(input: string): EvaluatorResult | null;

  /**
   * Optional hint text for the action bar
   */
  getHint?(): string;
}

/**
 * Result from an evaluator
 */
export interface EvaluatorResult {
  /**
   * The main result to display
   */
  value: string;

  /**
   * Optional action when Enter is pressed (e.g., copy to clipboard)
   * If not provided, the value will be copied to clipboard by default
   */
  onActivate?: () => void;

  /**
   * Optional hint for the action bar
   */
  hint?: string;

  /**
   * Optional metadata for special rendering (e.g., color preview)
   */
  metadata?: {
    type: 'color';
    color: string; // hex color value
  };
}

/**
 * Manager for all evaluators
 */
export class EvaluatorManager {
  private evaluators: Evaluator[] = [];

  /**
   * Register an evaluator
   */
  register(evaluator: Evaluator) {
    this.evaluators.push(evaluator);
  }

  /**
   * Clear all registered evaluators
   */
  clear() {
    this.evaluators = [];
  }

  /**
   * Evaluate input against all registered evaluators
   * Returns the first matching result
   */
  evaluate(input: string): EvaluatorResult | null {
    for (const evaluator of this.evaluators) {
      const result = evaluator.evaluate(input);
      if (result) {
        return result;
      }
    }
    return null;
  }
}