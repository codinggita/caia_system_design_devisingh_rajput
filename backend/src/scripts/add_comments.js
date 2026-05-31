// add_comments.js – automatically prepend short comments to every .js file in the project
#!/usr/bin/env node

/*
  This script scans the project root (process.cwd()) recursively and adds beginner‑friendly comments
  to each JavaScript source file. It:
  • Skips heavy directories like node_modules, .git, and artifacts.
  • Prepends a header comment if the file does not already start with `//`.
  • Inserts a one‑line placeholder comment before each function or arrow‑function declaration.
  • Prints a short log line for each processed file.

  Run it once after the codebase is generated:
  ```bash
  node scripts/add_comments.js
  ```
  Afterwards you can manually edit the generated placeholder comments to make them more specific.
*/

const fs = require('fs');
const path = require('path');

// Directories we do not want to walk into
const ignoreDirs = new Set(['node_modules', '.git', 'artifacts']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      addComments(fullPath);
    }
  }
}

function addComments(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 1️⃣ Add a header comment if missing
  if (!lines[0].startsWith('//')) {
    const rel = path.relative(process.cwd(), filePath);
    lines.unshift(`// ${rel} – core module of the CAIA backend`);
  }

  // 2️⃣ Insert a simple placeholder before each function definition
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const funcMatch = line.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) ||
                      line.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*\(.*\)\s*=>/);
    if (funcMatch) {
      const name = funcMatch[1];
      lines.splice(i, 0, `// ${name}: brief description – what this function does`);
      i++; // skip over the comment we just added
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`📝 Commented ${filePath}`);
}

// Start scanning from the project root
walk(process.cwd());
