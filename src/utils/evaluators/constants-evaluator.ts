import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

interface Constant {
  names: string[];
  value: number;
  description: string;
}

export class ConstantsEvaluator implements Evaluator {
  name = "ConstantsEvaluator";

  private constants: Constant[] = [
    {
      names: ['pi', 'π'],
      value: Math.PI,
      description: 'Ratio of a circle\'s circumference to its diameter'
    },
    {
      names: ['e', 'euler'],
      value: Math.E,
      description: 'Euler\'s number, base of natural logarithm'
    },
    {
      names: ['phi', 'φ', 'golden ratio', 'golden'],
      value: 1.618033988749894,
      description: 'The golden ratio'
    },
    {
      names: ['sqrt2', '√2', 'square root of 2'],
      value: Math.SQRT2,
      description: 'Square root of 2'
    },
    {
      names: ['sqrt3', '√3', 'square root of 3'],
      value: 1.7320508075688772,
      description: 'Square root of 3'
    },
    {
      names: ['ln2', 'natural log of 2'],
      value: Math.LN2,
      description: 'Natural logarithm of 2'
    },
    {
      names: ['ln10', 'natural log of 10'],
      value: Math.LN10,
      description: 'Natural logarithm of 10'
    },
    {
      names: ['log2e', 'log base 2 of e'],
      value: Math.LOG2E,
      description: 'Base 2 logarithm of E'
    },
    {
      names: ['log10e', 'log base 10 of e'],
      value: Math.LOG10E,
      description: 'Base 10 logarithm of E'
    },
    {
      names: ['c', 'speed of light'],
      value: 299792458,
      description: 'Speed of light in m/s'
    },
    {
      names: ['g', 'gravity', 'gravitational acceleration'],
      value: 9.80665,
      description: 'Standard gravity in m/s²'
    },
    {
      names: ['avogadro', 'avogadro\'s number', 'na'],
      value: 6.02214076e23,
      description: 'Avogadro\'s number'
    },
    {
      names: ['planck', 'planck\'s constant', 'h'],
      value: 6.62607015e-34,
      description: 'Planck\'s constant in J⋅s'
    },
    {
      names: ['electron mass', 'me'],
      value: 9.1093837139e-31,
      description: 'Electron mass in kg'
    },
    {
      names: ['proton mass', 'mp'],
      value: 1.67262192595e-27,
      description: 'Proton mass in kg'
    },
    {
      names: ['elementary charge', 'electron charge'],
      value: 1.602176634e-19,
      description: 'Elementary charge in C'
    }
  ];

  evaluate(input: string): EvaluatorResult | null {
    const trimmed = input.trim().toLowerCase();
    
    // Find matching constant
    const constant = this.constants.find(c => 
      c.names.some(name => name === trimmed)
    );

    if (constant) {
      return {
        value: this.formatValue(constant.value),
        hint: constant.description
      };
    }

    return null;
  }

  private formatValue(value: number): string {
    // Handle very large or very small numbers with scientific notation
    if (Math.abs(value) > 1e6 || (Math.abs(value) < 1e-3 && value !== 0)) {
      return value.toExponential(10).replace(/\.?0+e/, 'e');
    }
    
    // For normal numbers, show up to 15 significant digits
    const str = value.toPrecision(15);
    
    // Remove trailing zeros after decimal point
    return str.replace(/\.?0+$/, '');
  }

  getHint(): string {
    return "Constants: pi, e, golden ratio, speed of light, gravity";
  }
}