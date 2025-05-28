import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

interface UnitConversion {
  from: string;
  to: string;
  factor: number;
  offset?: number; // For temperature conversions
}

interface UnitCategory {
  name: string;
  units: Set<string>;
  conversions: UnitConversion[];
}

export class UnitConverter implements Evaluator {
  name = "UnitConverter";
  
  private categories: UnitCategory[] = [
    // Length
    {
      name: "length",
      units: new Set(["mm", "cm", "m", "km", "in", "ft", "yd", "mi", "inch", "inches", "foot", "feet", "yard", "yards", "mile", "miles", "meter", "meters", "kilometer", "kilometers"]),
      conversions: [
        // Metric
        { from: "mm", to: "m", factor: 0.001 },
        { from: "cm", to: "m", factor: 0.01 },
        { from: "m", to: "m", factor: 1 },
        { from: "km", to: "m", factor: 1000 },
        // Imperial
        { from: "in", to: "m", factor: 0.0254 },
        { from: "inch", to: "m", factor: 0.0254 },
        { from: "inches", to: "m", factor: 0.0254 },
        { from: "ft", to: "m", factor: 0.3048 },
        { from: "foot", to: "m", factor: 0.3048 },
        { from: "feet", to: "m", factor: 0.3048 },
        { from: "yd", to: "m", factor: 0.9144 },
        { from: "yard", to: "m", factor: 0.9144 },
        { from: "yards", to: "m", factor: 0.9144 },
        { from: "mi", to: "m", factor: 1609.344 },
        { from: "mile", to: "m", factor: 1609.344 },
        { from: "miles", to: "m", factor: 1609.344 },
        { from: "meter", to: "m", factor: 1 },
        { from: "meters", to: "m", factor: 1 },
        { from: "kilometer", to: "m", factor: 1000 },
        { from: "kilometers", to: "m", factor: 1000 },
      ]
    },
    // Weight/Mass
    {
      name: "mass",
      units: new Set(["mg", "g", "kg", "oz", "lb", "lbs", "pound", "pounds", "ounce", "ounces", "gram", "grams", "kilogram", "kilograms"]),
      conversions: [
        // Metric
        { from: "mg", to: "kg", factor: 0.000001 },
        { from: "g", to: "kg", factor: 0.001 },
        { from: "gram", to: "kg", factor: 0.001 },
        { from: "grams", to: "kg", factor: 0.001 },
        { from: "kg", to: "kg", factor: 1 },
        { from: "kilogram", to: "kg", factor: 1 },
        { from: "kilograms", to: "kg", factor: 1 },
        // Imperial
        { from: "oz", to: "kg", factor: 0.0283495 },
        { from: "ounce", to: "kg", factor: 0.0283495 },
        { from: "ounces", to: "kg", factor: 0.0283495 },
        { from: "lb", to: "kg", factor: 0.453592 },
        { from: "lbs", to: "kg", factor: 0.453592 },
        { from: "pound", to: "kg", factor: 0.453592 },
        { from: "pounds", to: "kg", factor: 0.453592 },
      ]
    },
    // Temperature
    {
      name: "temperature",
      units: new Set(["c", "f", "k", "celsius", "fahrenheit", "kelvin"]),
      conversions: [
        { from: "c", to: "c", factor: 1 },
        { from: "celsius", to: "c", factor: 1 },
        { from: "f", to: "c", factor: 5/9, offset: -32 },
        { from: "fahrenheit", to: "c", factor: 5/9, offset: -32 },
        { from: "k", to: "c", factor: 1, offset: -273.15 },
        { from: "kelvin", to: "c", factor: 1, offset: -273.15 },
      ]
    },
    // Volume
    {
      name: "volume",
      units: new Set(["ml", "l", "gal", "qt", "pt", "cup", "cups", "fl oz", "floz", "oz", "liter", "liters", "gallon", "gallons", "quart", "quarts", "pint", "pints", "ounce", "ounces", "tsp", "tbsp", "teaspoon", "teaspoons", "tablespoon", "tablespoons"]),
      conversions: [
        // Metric
        { from: "ml", to: "l", factor: 0.001 },
        { from: "l", to: "l", factor: 1 },
        { from: "liter", to: "l", factor: 1 },
        { from: "liters", to: "l", factor: 1 },
        // Imperial
        { from: "gal", to: "l", factor: 3.78541 },
        { from: "gallon", to: "l", factor: 3.78541 },
        { from: "gallons", to: "l", factor: 3.78541 },
        { from: "qt", to: "l", factor: 0.946353 },
        { from: "quart", to: "l", factor: 0.946353 },
        { from: "quarts", to: "l", factor: 0.946353 },
        { from: "pt", to: "l", factor: 0.473176 },
        { from: "pint", to: "l", factor: 0.473176 },
        { from: "pints", to: "l", factor: 0.473176 },
        { from: "cup", to: "l", factor: 0.236588 },
        { from: "cups", to: "l", factor: 0.236588 },
        { from: "fl oz", to: "l", factor: 0.0295735 },
        { from: "floz", to: "l", factor: 0.0295735 },
        { from: "oz", to: "l", factor: 0.0295735 }, // oz for fluid ounces in volume context
        { from: "ounce", to: "l", factor: 0.0295735 },
        { from: "ounces", to: "l", factor: 0.0295735 },
        // Cooking/Baking measurements
        { from: "tsp", to: "l", factor: 0.00492892 },
        { from: "teaspoon", to: "l", factor: 0.00492892 },
        { from: "teaspoons", to: "l", factor: 0.00492892 },
        { from: "tbsp", to: "l", factor: 0.0147868 },
        { from: "tablespoon", to: "l", factor: 0.0147868 },
        { from: "tablespoons", to: "l", factor: 0.0147868 },
      ]
    },
    // Data
    {
      name: "data",
      units: new Set(["b", "kb", "mb", "gb", "tb", "pb", "byte", "bytes", "kilobyte", "kilobytes", "megabyte", "megabytes", "gigabyte", "gigabytes", "terabyte", "terabytes"]),
      conversions: [
        { from: "b", to: "b", factor: 1 },
        { from: "byte", to: "b", factor: 1 },
        { from: "bytes", to: "b", factor: 1 },
        { from: "kb", to: "b", factor: 1024 },
        { from: "kilobyte", to: "b", factor: 1024 },
        { from: "kilobytes", to: "b", factor: 1024 },
        { from: "mb", to: "b", factor: 1024 * 1024 },
        { from: "megabyte", to: "b", factor: 1024 * 1024 },
        { from: "megabytes", to: "b", factor: 1024 * 1024 },
        { from: "gb", to: "b", factor: 1024 * 1024 * 1024 },
        { from: "gigabyte", to: "b", factor: 1024 * 1024 * 1024 },
        { from: "gigabytes", to: "b", factor: 1024 * 1024 * 1024 },
        { from: "tb", to: "b", factor: 1024 * 1024 * 1024 * 1024 },
        { from: "terabyte", to: "b", factor: 1024 * 1024 * 1024 * 1024 },
        { from: "terabytes", to: "b", factor: 1024 * 1024 * 1024 * 1024 },
        { from: "pb", to: "b", factor: 1024 * 1024 * 1024 * 1024 * 1024 },
      ]
    },
    // Cooking/Baking Special Measurements
    {
      name: "cooking",
      units: new Set(["stick", "sticks", "stick of butter", "sticks of butter", "pinch", "pinches", "dash", "dashes", "smidgen", "drop", "drops"]),
      conversions: [
        // Butter measurements (US stick of butter = 1/2 cup = 8 tbsp)
        { from: "stick", to: "l", factor: 0.118294 }, // 1/2 cup in liters
        { from: "sticks", to: "l", factor: 0.118294 },
        { from: "stick of butter", to: "l", factor: 0.118294 },
        { from: "sticks of butter", to: "l", factor: 0.118294 },
        // Small measurements (approximate)
        { from: "pinch", to: "l", factor: 0.000308 }, // ~1/16 tsp
        { from: "pinches", to: "l", factor: 0.000308 },
        { from: "dash", to: "l", factor: 0.000616 }, // ~1/8 tsp
        { from: "dashes", to: "l", factor: 0.000616 },
        { from: "smidgen", to: "l", factor: 0.000154 }, // ~1/32 tsp
        { from: "drop", to: "l", factor: 0.00005 }, // ~0.05 ml
        { from: "drops", to: "l", factor: 0.00005 },
      ]
    }
  ];

  evaluate(input: string): EvaluatorResult | null {
    const result = this.convertUnits(input);
    if (result) {
      return {
        value: result,
        hint: "Press Enter to copy result"
      };
    }
    return null;
  }

  getHint(): string {
    return "Convert units: 100 km to miles, 72f to c";
  }

  private convertUnits(input: string): string | null {
    // Pattern to match conversions like "100 km to miles" or "72f to c"
    const patterns = [
      /^([\d\.\-]+)\s*([a-zA-Z\s]+?)\s+(?:to|in)\s+([a-zA-Z\s]+?)$/i,
      /^([\d\.\-]+)\s*([a-zA-Z]+)\s+(?:to|in)\s+([a-zA-Z\s]+?)$/i,
      /^([\d\.\-]+)([a-zA-Z]+)\s+(?:to|in)\s+([a-zA-Z\s]+?)$/i,
    ];

    let match = null;
    for (const pattern of patterns) {
      match = input.trim().match(pattern);
      if (match) break;
    }

    if (!match) return null;

    const value = parseFloat(match[1]);
    if (isNaN(value)) return null;

    const fromUnit = match[2].toLowerCase().trim();
    const toUnit = match[3].toLowerCase().trim();

    // Find the category for both units
    const category = this.findCategory(fromUnit, toUnit);
    if (!category) return null;

    // Convert the value
    const result = this.convert(value, fromUnit, toUnit, category);
    if (result === null) return null;

    // Format the result
    return this.formatResult(result, toUnit);
  }

  private findCategory(fromUnit: string, toUnit: string): UnitCategory | null {
    // First check if both units are in the same category
    for (const category of this.categories) {
      if (category.units.has(fromUnit) && category.units.has(toUnit)) {
        return category;
      }
    }
    
    // Allow conversions between volume and cooking categories
    const volumeCategory = this.categories.find(c => c.name === "volume");
    const cookingCategory = this.categories.find(c => c.name === "cooking");
    
    if (volumeCategory && cookingCategory) {
      const fromInVolume = volumeCategory.units.has(fromUnit);
      const fromInCooking = cookingCategory.units.has(fromUnit);
      const toInVolume = volumeCategory.units.has(toUnit);
      const toInCooking = cookingCategory.units.has(toUnit);
      
      // If one unit is in volume and the other in cooking, we can convert
      if ((fromInVolume && toInCooking) || (fromInCooking && toInVolume)) {
        // Return volume category as base since both categories convert to liters
        return volumeCategory;
      }
    }
    
    return null;
  }

  private convert(value: number, fromUnit: string, toUnit: string, category: UnitCategory): number | null {
    // Special handling for temperature
    if (category.name === "temperature") {
      return this.convertTemperature(value, fromUnit, toUnit);
    }

    // Find conversion factors - check both volume and cooking categories if needed
    let fromConversion = category.conversions.find(c => c.from === fromUnit);
    let toConversion = category.conversions.find(c => c.from === toUnit);

    // If we don't find conversions in the given category, check related categories
    if (!fromConversion || !toConversion) {
      const volumeCategory = this.categories.find(c => c.name === "volume");
      const cookingCategory = this.categories.find(c => c.name === "cooking");
      
      if (!fromConversion) {
        fromConversion = volumeCategory?.conversions.find(c => c.from === fromUnit) || 
                        cookingCategory?.conversions.find(c => c.from === fromUnit);
      }
      
      if (!toConversion) {
        toConversion = volumeCategory?.conversions.find(c => c.from === toUnit) || 
                      cookingCategory?.conversions.find(c => c.from === toUnit);
      }
    }

    if (!fromConversion || !toConversion) return null;

    // Convert to base unit then to target unit
    const baseValue = value * fromConversion.factor;
    const result = baseValue / toConversion.factor;

    return result;
  }

  private convertTemperature(value: number, fromUnit: string, toUnit: string): number | null {
    // Normalize to Celsius first
    let celsius = value;
    
    if (fromUnit === "f" || fromUnit === "fahrenheit") {
      celsius = (value - 32) * 5/9;
    } else if (fromUnit === "k" || fromUnit === "kelvin") {
      celsius = value - 273.15;
    }

    // Convert from Celsius to target
    if (toUnit === "f" || toUnit === "fahrenheit") {
      return celsius * 9/5 + 32;
    } else if (toUnit === "k" || toUnit === "kelvin") {
      return celsius + 273.15;
    } else {
      return celsius;
    }
  }

  private formatResult(value: number, unit: string): string {
    // Round to reasonable precision
    let rounded = Math.round(value * 10000) / 10000;
    
    // Remove trailing zeros
    let formatted = rounded.toString();
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '');
    }

    // Add the unit
    return `${formatted} ${unit}`;
  }
}