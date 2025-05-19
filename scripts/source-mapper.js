#!/usr/bin/env node

/**
 * source-mapper.js
 *
 * This tool helps map runtime AGS errors back to their source TypeScript files
 * by building a mapping of exported classes, functions and variables.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const SRC_DIR = path.join(__dirname, "../src");
const OUTPUT_FILE = path.join(__dirname, "logs/source-map.json");

// Create logs directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "logs"))) {
  fs.mkdirSync(path.join(__dirname, "logs"), { recursive: true });
}

// Data structures for storing the mappings
const sourceMap = {
  variables: {}, // Variable3 -> src/path/to/file.ts:line
  functions: {}, // someFunction2 -> src/path/to/file.ts:line
  classes: {}, // ClassName -> src/path/to/file.ts:line
  components: {}, // React/JSX components -> src/path/to/file.ts:line
  imports: {}, // Import statements and what they import -> path/to/file.ts:line
  hotspots: {}, // Common error locations -> path/to/file.ts:line
  jsxAttributes: {}, // JSX attributes like "onClick", "onDraw" -> src/path/to/file.ts:line
  jsxTagnames: {}, // JSX tag names like "box", "window", "DrawingArea" -> src/path/to/file.ts:line
};

// Function to recursively scan directories
function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) {
      processFile(filePath);
    }
  }
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = path.relative(__dirname, filePath);

  // Look for class declarations
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Find class declarations
    const classMatch = line.match(
      /^(export\s+)?(default\s+)?(abstract\s+)?class\s+(\w+)/,
    );
    if (classMatch) {
      const className = classMatch[4];
      sourceMap.classes[className] = `${relPath}:${i + 1}`;
    }

    // Find function declarations
    const functionMatch = line.match(
      /^(export\s+)?(default\s+)?function\s+(\w+)/,
    );
    if (functionMatch) {
      const functionName = functionMatch[3];
      sourceMap.functions[functionName] = `${relPath}:${i + 1}`;
    }

    // Find function components (React)
    const componentMatch = line.match(
      /^(export\s+)?(default\s+)?function\s+(\w+).*\(\s*(\w+Props|props)/,
    );
    if (componentMatch) {
      const componentName = componentMatch[3];
      sourceMap.components[componentName] = `${relPath}:${i + 1}`;
    }

    // Find variable declarations with Variable
    const varMatch = line.match(/(\w+)\s*=\s*(new\s+)?Variable[<(]/);
    if (varMatch) {
      const varName = varMatch[1];
      sourceMap.variables[varName] = `${relPath}:${i + 1}`;
    }

    // Find import statements
    const importMatch = line.match(/^import\s+.*?from\s+['"](.+)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      if (!sourceMap.imports[importPath]) {
        sourceMap.imports[importPath] = [];
      }
      sourceMap.imports[importPath].push(`${relPath}:${i + 1}`);
    }

    // Find common error hotspots - bind usage
    if (line.includes("bind(") || line.includes(".bind(")) {
      if (!sourceMap.hotspots["bind"]) {
        sourceMap.hotspots["bind"] = [];
      }
      sourceMap.hotspots["bind"].push(`${relPath}:${i + 1}`);
    }

    // Find State/Variable usage
    if (line.includes("Variable") || line.includes("new Variable")) {
      if (!sourceMap.hotspots["Variable"]) {
        sourceMap.hotspots["Variable"] = [];
      }
      sourceMap.hotspots["Variable"].push(`${relPath}:${i + 1}`);
    }

    // Find JSX attributes like onClick, onDraw, etc.
    const jsxAttributeMatch = line.match(/\b(on[A-Z]\w+)=/g);
    if (jsxAttributeMatch) {
      jsxAttributeMatch.forEach(attr => {
        const attributeName = attr.slice(0, -1); // Remove the '=' at the end
        if (!sourceMap.jsxAttributes[attributeName]) {
          sourceMap.jsxAttributes[attributeName] = [];
        }
        sourceMap.jsxAttributes[attributeName].push(`${relPath}:${i + 1}`);
      });
    }

    // Find JSX tag names like <box>, <DrawingArea>, etc.
    const jsxTagMatch = line.match(/<(\w+)[ >]/);
    if (jsxTagMatch && !jsxTagMatch[1].includes("/")) {
      const tagName = jsxTagMatch[1];
      
      // Skip HTML tags and focus on custom components
      if (!["div", "span", "p", "h1", "h2", "h3", "button", "input"].includes(tagName.toLowerCase())) {
        if (!sourceMap.jsxTagnames[tagName]) {
          sourceMap.jsxTagnames[tagName] = [];
        }
        sourceMap.jsxTagnames[tagName].push(`${relPath}:${i + 1}`);
      }
    }

    // Track "connect" calls that might be error-prone
    if (line.includes(".connect(") && line.includes("draw")) {
      if (!sourceMap.hotspots["draw-connect"]) {
        sourceMap.hotspots["draw-connect"] = [];
      }
      sourceMap.hotspots["draw-connect"].push(`${relPath}:${i + 1}`);
    }

    // Track signal connections in general
    if (line.includes(".connect(")) {
      if (!sourceMap.hotspots["connect"]) {
        sourceMap.hotspots["connect"] = [];
      }
      sourceMap.hotspots["connect"].push(`${relPath}:${i + 1}`);
    }
  }
}

// Main function
function buildSourceMap() {
  console.log("Building source map...");
  scanDirectory(SRC_DIR);

  // Write the source map to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sourceMap, null, 2));
  console.log(`Source map written to ${OUTPUT_FILE}`);
}

// Execute
buildSourceMap();

