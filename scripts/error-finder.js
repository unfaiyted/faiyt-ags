#!/usr/bin/env node

// This script helps locate error  by extracting function names from AGS compiled JS errors
// Usage: cat logs/your-log-file.log | node error-finder.js

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Function to search for a function name in source files
function findFunctionInFiles(funcName) {
  // Source directories to search
  const searchDirs = ["src", "."];

  // Log what we're searching for
  console.log(`\nSearching for: ${funcName}`);

  // Use grep to find the function definition
  const grepCmd = `grep -r --include="*.ts" --include="*.tsx" --include="*.js" "${funcName}" ${searchDirs.join(" ")}`;

  exec(grepCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`Couldn't find "${funcName}" in source files.`);
      return;
    }

    console.log(`\nPotential matches for "${funcName}":`);
    console.log(stdout);
  });
}

// Process the input line by line
rl.on("line", (line) => {
  // Match common GJS error patterns
  const errorMatch = line.match(/TypeError: (.*) is not a function/);
  const errorLocMatch = line.match(/@file:\/\/.*:(\d+):(\d+)/);

  if (errorMatch) {
    const funcName = errorMatch[1];
    console.log(`\n=== ERROR DETECTED: "${funcName} is not a function" ===`);
    findFunctionInFiles(funcName);
  }

  if (errorLocMatch) {
    console.log(
      `\nError location in compiled file: Line ${errorLocMatch[1]}, Column ${errorLocMatch[2]}`,
    );
  }

  // Look for common Variable declarations or usage errors
  const varMatch = line.match(/Variable(\d+)/);
  if (varMatch) {
    console.log(
      `\n=== Variable usage issue detected: "Variable${varMatch[1]}" ===`,
    );
    console.log(
      `This suggests an issue with a Variable() declaration or binding in your code.`,
    );

    // Search for Variable declarations
    findFunctionInFiles("Variable");
  }
});

rl.on("close", () => {
  console.log("\n=== Error Analysis Complete ===");
  console.log("Check your Variable declarations and method bindings.");
  console.log("Common issues:");
  console.log(
    "1. Using Variable() as a function but it's imported incorrectly",
  );
  console.log('2. Missing "new" before Variable() if it\'s a constructor');
  console.log("3. Issues with destructuring imports from astal packages");
  console.log("4. Confusion between class and function calls");
});

