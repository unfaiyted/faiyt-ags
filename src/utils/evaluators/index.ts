import { EvaluatorManager } from "./types";
import { MathEvaluator } from "./math-evaluator";
import { UnitConverter } from "./unit-converter";
import { PercentageCalculator } from "./percentage-calculator";
import { BaseConverter } from "./base-converter";
import { TimeCalculator } from "./time-calculator";
import { ColorConverter } from "./color-converter";
import { DateCalculator } from "./date-calculator";
import { ConstantsEvaluator } from "./constants-evaluator";

// Create and configure the evaluator manager
export const evaluatorManager = new EvaluatorManager();

// Register all evaluators in order of priority
// Constants should come before math to handle "pi", "e", etc.
evaluatorManager.register(new ConstantsEvaluator());
evaluatorManager.register(new PercentageCalculator());
evaluatorManager.register(new BaseConverter());
evaluatorManager.register(new TimeCalculator());
evaluatorManager.register(new ColorConverter());
evaluatorManager.register(new DateCalculator());
evaluatorManager.register(new UnitConverter());
evaluatorManager.register(new MathEvaluator()); // Math last as it's the most general

// Export for convenience
export { EvaluatorManager, type Evaluator, type EvaluatorResult } from "./types";
export { MathEvaluator } from "./math-evaluator";
export { UnitConverter } from "./unit-converter";
export { PercentageCalculator } from "./percentage-calculator";
export { BaseConverter } from "./base-converter";
export { TimeCalculator } from "./time-calculator";
export { ColorConverter } from "./color-converter";
export { DateCalculator } from "./date-calculator";
export { ConstantsEvaluator } from "./constants-evaluator";