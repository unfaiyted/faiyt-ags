#!/usr/bin/env node
const path = require("node:path");
const fs = require("node:fs");

const executedFrom = process.cwd();
const twFilePath = process.argv[2];

const twFile = path.join(executedFrom, twFilePath);

// add semicolons to the last property in each rule
let content = fs.readFileSync(twFile, "utf8");

// Find CSS rules and add semicolons to the last property if missing
content = content.replace(/(\s*[^{}]+:[^{};\n]+)(\n\s*})/g, "$1;$2");

// Write the updated content back to the file
fs.writeFileSync(twFile, content, "utf8");
