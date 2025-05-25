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
  '-webkit-backdrop-filter',
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

function cleanCSS(cssContent) {
  let lines = cssContent.split('\n');
  let result = [];
  let inRule = false;
  let braceCount = 0;
  let currentRule = [];
  let currentSelector = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip empty lines
    if (line.trim() === '') {
      if (!inRule) result.push(line);
      continue;
    }
    
    // Handle @ rules (skip them)
    if (line.trim().startsWith('@media') || 
        line.trim().startsWith('@supports') || 
        line.trim().startsWith('@keyframes') ||
        line.trim().startsWith('@-webkit-') ||
        line.trim().startsWith('@-moz-')) {
      // Skip until closing brace
      let skipBraces = 0;
      if (line.includes('{')) skipBraces++;
      i++;
      while (i < lines.length && skipBraces > 0) {
        if (lines[i].includes('{')) skipBraces++;
        if (lines[i].includes('}')) skipBraces--;
        i++;
      }
      i--;
      continue;
    }
    
    // Handle selectors with unsupported pseudo-classes
    if (!inRule && line.includes('{')) {
      currentSelector = line.substring(0, line.indexOf('{'));
      
      // Skip rules with unsupported pseudo-classes
      if (currentSelector.match(/::placeholder|::-webkit-|::-moz-|::before|::after|:focus-visible|:focus-within|:visited|:link|:target|:empty|:root|:not\(|:is\(|:where\(|:has\(/)) {
        // Skip this entire rule
        braceCount = 1;
        i++;
        while (i < lines.length && braceCount > 0) {
          if (lines[i].includes('{')) braceCount++;
          if (lines[i].includes('}')) braceCount--;
          i++;
        }
        i--;
        continue;
      }
      
      inRule = true;
      currentRule = [line];
      continue;
    }
    
    // Handle properties inside rules
    if (inRule) {
      if (line.includes('}')) {
        // End of rule
        currentRule.push(line);
        
        // Filter out unsupported properties
        let filteredRule = currentRule.filter(ruleLine => {
          let trimmed = ruleLine.trim();
          
          // Keep selector and closing brace
          if (trimmed.endsWith('{') || trimmed === '}') return true;
          
          // Check if line contains unsupported property
          for (let prop of unsupportedProperties) {
            if (trimmed.startsWith(prop + ':') || 
                trimmed.startsWith('-webkit-' + prop + ':') ||
                trimmed.startsWith('-moz-' + prop + ':') ||
                trimmed.startsWith('-ms-' + prop + ':')) {
              return false;
            }
          }
          
          return true;
        });
        
        // Only add rule if it has properties
        if (filteredRule.length > 2) {
          result = result.concat(filteredRule);
        }
        
        inRule = false;
        currentRule = [];
      } else {
        currentRule.push(line);
      }
      continue;
    }
    
    // Handle other lines
    result.push(line);
  }
  
  return result.join('\n');
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