import fs from 'fs';
import path from 'path';

/**
 * Find the matching ']' bracket for an array starting at `startPos`.
 * Uses bracket counting to handle nested arrays.
 */
function findMatchingBracket(content, startPos) {
  let bracketCount = 0;
  for (let i = startPos; i < content.length; i++) {
    if (content[i] === "[") {
      bracketCount++;
    } else if (content[i] === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        return i; // Found the matching bracket
      }
    }
  }
  return -1; // No matching bracket found
}

/**
 * Extracts all `label` values from any "*Menu" property (e.g., mainMenu, dashMenu)
 * in the given app.config.ts file.
 */
export function extractMenuTitles(configPath) {
  if (!fs.existsSync(configPath)) return [];
  const content = fs.readFileSync(configPath, "utf-8");
  const titles = [];
  // Regex to find any property ending with "Menu" (e.g., "mainMenu: [")
  const menuStartRegex = /(\w+Menu)\s*:\s*\[/g;
  // Regex for extracting label: "SomeLabel" or label: 'SomeLabel'
  const labelRegex = /label\s*:\s*(['"])(.*?)\1/g;
  let match;
  while ((match = menuStartRegex.exec(content)) !== null) {
    const startPos = match.index + match[0].length - 1; // position of the first '['
    const endPos = findMatchingBracket(content, startPos);
    if (endPos === -1) continue;
    const menuBlock = content.slice(startPos, endPos + 1);
    let labelMatch;
    while ((labelMatch = labelRegex.exec(menuBlock)) !== null) {
      titles.push(labelMatch[2]);
    }
  }
  return titles;
}

/**
 * Recursively retrieves all files with the specified extensions from a directory,
 * excluding given directories.
 */
const getAllFiles = (dir, extensions, excludeDirs = ['node_modules', '.git', 'dist'], files = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      getAllFiles(fullPath, extensions, excludeDirs, files);
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
};

/**
 * Extracts I18n keys from file content using regex.
 */
const extractI18Keys = (content) => {
  const regex = /(?:\$t|t)\(\s*(['"])(.*?)\1\s*\)/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[2];
    if (
      !key.includes('/') &&
      !key.startsWith('#') &&
      !key.startsWith('nuxt-') &&
      key.length > 1 &&
      !/^[^a-zA-Z0-9]+$/.test(key) &&
      !/\b(dd|MMM|yyyy)\b/.test(key) &&
      !key.includes('\\') &&
      !/(vue-router|sig)/.test(key) &&
      !key.includes('scope')
    ) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Reads and parses JSON content from a file.
 */
const readJson = (filePath) => {
  try {
    return fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
      : {};
  } catch (error) {
    console.error(`Error reading JSON at ${filePath}:`, error);
    return {};
  }
};

/**
 * Updates an existing JSON object with a set of keys.
 * If a key does not exist in the original object, it defaults to the key itself.
 */
const updateKeys = (existing, keys) => {
  const updated = {};
  keys.forEach((key) => {
    updated[key] = key in existing ? existing[key] : key;
  });
  return updated;
};

/**
 * Returns a new object with keys sorted alphabetically.
 */
const sortKeys = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key];
      return sorted;
    }, {});

/**
 * Main function to update and sort locale files.
 */
const main = () => {
  const projectDir = process.cwd();
  const localeDir = path.join(projectDir, 'i18n', 'locales');
  const faJsonPath = path.join(localeDir, 'fa.json');
  const enJsonPath = path.join(localeDir, 'en.json');
  const appConfigPath = path.join(projectDir, "app/app.config.ts");

  // Gather all I18n keys from .ts and .vue files.
  const files = getAllFiles(projectDir, ['.ts', '.vue']);
  const allKeys = new Set();
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    extractI18Keys(content).forEach((key) => allKeys.add(key));
  });

  // Extract menu titles from app.config.ts and add to keys.
  const menuTitles = extractMenuTitles(appConfigPath);
  menuTitles.forEach((title) => allKeys.add(title));

  // Extract cats items from app.config.ts.
  const appConfigContent = fs.readFileSync(appConfigPath, "utf-8");
  const catsRegex = /cats\s*:\s*\[([^\]]+)\]/;
  const catsMatch = appConfigContent.match(catsRegex);
  if (catsMatch) {
    const catsItems = catsMatch[1]
      .split(',')
      .map((item) => item.replace(/['"]/g, '').trim())
      .filter((item) => item);
    catsItems.forEach((item) => allKeys.add(item));
  }

  // Read, update, and sort locale JSON files.
  const faJson = readJson(faJsonPath);
  const enJson = readJson(enJsonPath);
  const updatedFaJson = sortKeys(updateKeys(faJson, allKeys));
  const updatedEnJson = sortKeys(updateKeys(enJson, allKeys));
  fs.writeFileSync(faJsonPath, JSON.stringify(updatedFaJson, null, 2), 'utf8');
  fs.writeFileSync(enJsonPath, JSON.stringify(updatedEnJson, null, 2), 'utf8');

  console.log(`Updated locale files: ${allKeys.size} keys processed.`);
};

// Execute the update process.
main();
