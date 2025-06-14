#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of CSS properties that GTK4 doesn't support
const unsupportedProperties = [
  'visibility',
  'position',
  'display',
  'cursor',
  'resize',
  'overflow',
  'overflow-y',
  'overflow-x',
  'text-overflow',
  'white-space',
  'vertical-align',
  'width',
  'height',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
  'bottom',
  'top',
  'right',
  'left',
  'text-indent',
  'border-collapse',
  'list-style',
  'backdrop-filter',
  'object-fit',
  'flex',
  'flex-direction',
  'flex-wrap',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'align-items',
  'justify-content',
  'align-content',
  'align-self',
  'justify-self',
  'gap',
  'row-gap',
  'column-gap',
  'text-align',
  'z-index',
  'maring' // typo in CSS
];

// Unsupported pseudo-classes
const unsupportedPseudoClasses = [
  '::placeholder',
  '::-webkit-',
  '::-moz-',
  '::before',
  '::after',
  ':focus-visible',
  ':focus-within',
  ':target',
  ':visited',
  ':link',
  ':any-link',
  ':local-link',
  ':scope',
  ':current',
  ':past',
  ':future',
  ':playing',
  ':paused',
  ':seeking',
  ':buffering',
  ':stalled',
  ':muted',
  ':volume-locked',
  ':fullscreen',
  ':picture-in-picture',
  ':user-invalid',
  ':user-valid',
  ':placeholder-shown',
  ':default',
  ':indeterminate',
  ':blank',
  ':empty',
  ':root',
  ':host',
  ':host-context',
  ':is',
  ':where',
  ':has',
  ':not',
  ':lang',
  ':dir',
  ':first-child',
  ':last-child',
  ':first-of-type',
  ':last-of-type',
  ':only-child',
  ':only-of-type',
  ':nth-child',
  ':nth-last-child',
  ':nth-of-type',
  ':nth-last-of-type'
];

function cleanCSS(cssContent) {
  let cleaned = cssContent;
  
  // Remove @media queries
  cleaned = cleaned.replace(/@media[^{]+\{[\s\S]*?\}\s*\}/g, '');
  
  // Remove @supports queries
  cleaned = cleaned.replace(/@supports[^{]+\{[\s\S]*?\}\s*\}/g, '');
  
  // Remove @keyframes
  cleaned = cleaned.replace(/@keyframes[^{]+\{[\s\S]*?\}\s*\}/g, '');
  
  // Remove unsupported properties
  unsupportedProperties.forEach(prop => {
    // Match property declarations including vendor prefixes
    // Updated regex to match complete property names including any prefix before hyphen
    const regex = new RegExp(`\\s*[\\w-]*?(?:webkit-|moz-|ms-|o-)?${prop}\\s*:[^;]+;`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });
  
  // Remove rules with unsupported pseudo-classes
  unsupportedPseudoClasses.forEach(pseudo => {
    // Remove entire rules that use these pseudo-classes
    const escapedPseudo = pseudo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`[^{]*${escapedPseudo}[^{]*\\{[^}]*\\}`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });
  
  // Remove empty rules - multiple passes to catch nested cases
  let previousLength;
  do {
    previousLength = cleaned.length;
    // Remove rules with empty or whitespace-only content
    cleaned = cleaned.replace(/[^{}]+\{\s*\}/g, '');
    // Remove incomplete rules (opening brace without closing)
    cleaned = cleaned.replace(/[^{}]+\{\s*(?=[^}]*(?:\{|$))/g, '');
  } while (cleaned.length !== previousLength);
  
  // Clean up extra newlines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return cleaned;
}

// Get file paths from command line or use defaults
const inputFile = process.argv[2] || path.join(__dirname, '../src/output.css');
const outputFile = process.argv[3] || inputFile;

// Read CSS file
const cssContent = fs.readFileSync(inputFile, 'utf8');

// Clean CSS
const cleanedCSS = cleanCSS(cssContent);

// Write cleaned CSS
fs.writeFileSync(outputFile, cleanedCSS);

console.log(`Cleaned CSS written to ${outputFile}`);
console.log(`Removed unsupported GTK4 CSS properties and rules`);