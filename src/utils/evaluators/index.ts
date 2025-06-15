import { EvaluatorManager } from "./types";
import { MathEvaluator } from "./math-evaluator";
import { UnitConverter } from "./unit-converter";
import { PercentageCalculator } from "./percentage-calculator";
import { BaseConverter } from "./base-converter";
import { TimeCalculator } from "./time-calculator";
import { ColorConverter } from "./color-converter";
import { DateCalculator } from "./date-calculator";
import { ConstantsEvaluator } from "./constants-evaluator";
import configManager from "../../services/config-manager";

// Create and configure the evaluator manager
export const evaluatorManager = new EvaluatorManager();

// Function to register evaluators based on config
function registerEvaluators() {
  const evaluators = configManager.getValue("search.evaluators");
  const mathEnabled = configManager.getValue("search.enableFeatures.mathResults");
  
  // Constants should come before math to handle "pi", "e", etc.
  // Only register if math is enabled
  if (mathEnabled) {
    evaluatorManager.register(new ConstantsEvaluator());
  }
  
  // Register evaluators based on config
  if (evaluators?.percentageCalculator) {
    evaluatorManager.register(new PercentageCalculator());
  }
  
  if (evaluators?.baseConverter) {
    evaluatorManager.register(new BaseConverter());
  }
  
  if (evaluators?.timeCalculator) {
    evaluatorManager.register(new TimeCalculator());
  }
  
  if (evaluators?.colorConverter) {
    evaluatorManager.register(new ColorConverter());
  }
  
  if (evaluators?.dateCalculator) {
    evaluatorManager.register(new DateCalculator());
  }
  
  if (evaluators?.unitConverter) {
    evaluatorManager.register(new UnitConverter());
  }
  
  // Math evaluator last as it's the most general
  if (evaluators?.mathEvaluator && mathEnabled) {
    evaluatorManager.register(new MathEvaluator());
  }
}

// Register evaluators on startup
registerEvaluators();

// Re-register when config changes
configManager.connect("config-changed", (self, path: string) => {
  if (path.startsWith("search.evaluators") || path === "search.enableFeatures.mathResults") {
    // Clear existing evaluators
    evaluatorManager.clear();
    // Re-register based on new config
    registerEvaluators();
  }
});

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