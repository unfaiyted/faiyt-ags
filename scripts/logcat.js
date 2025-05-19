#!/usr/bin/env node

// Simple tool to help format GJS error messages better
// Usage: ags run src/app.ts 2>&1 | node logcat.js

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// ANSI colors for formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bright: '\x1b[1m',
};

// Track error state
let inErrorBlock = false;
let errorLines = [];

rl.on('line', (line) => {
  // Detect start of error
  if (line.includes('Gjs-CRITICAL') || line.includes('JS ERROR')) {
    inErrorBlock = true;
    errorLines = [line];
    // Print in red and bold
    console.log(`${colors.red}${colors.bright}${line}${colors.reset}`);
    return;
  }
  
  // Continue collecting error lines
  if (inErrorBlock && (line.trim().startsWith('@') || line.includes('file://'))) {
    errorLines.push(line);
    // Print in red
    console.log(`${colors.red}${line}${colors.reset}`);
    return;
  }
  
  // End of error block
  if (inErrorBlock && line.includes('Module') && line.includes('threw an exception')) {
    inErrorBlock = false;
    // Print in red
    console.log(`${colors.red}${line}${colors.reset}`);
    
    // Print error analysis hint
    console.log(`\n${colors.yellow}Hint: Save this error and analyze it with:${colors.reset}`);
    console.log(`${colors.cyan}node error-finder.js${colors.reset}`);
    return;
  }
  
  // Normal lines
  if (!inErrorBlock) {
    // Add colors to specific types of lines
    if (line.includes('[nodemon]')) {
      console.log(`${colors.cyan}${line}${colors.reset}`);
    } else if (line.includes('Starting AGS') || line.includes('Watching')) {
      console.log(`${colors.green}${line}${colors.reset}`);
    } else if (line.includes('error:')) {
      console.log(`${colors.red}${line}${colors.reset}`);
    } else {
      console.log(line);
    }
  }
});

rl.on('close', () => {
  if (errorLines.length > 0) {
    console.log(`\n${colors.yellow}Session ended with errors. Use error-finder.js to analyze them.${colors.reset}`);
  }
});