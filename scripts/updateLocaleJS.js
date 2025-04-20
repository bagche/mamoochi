import fs from 'fs';
import path from 'path';

/**
 * Finds the matching ']' bracket for an array starting at `startPos`.
 * Uses bracket counting to handle nested arrays.
 */
function findMatchingBracket(content, startPos) {
    let bracketCount = 0;
    for (let i = startPos; i < content.length; i++) {
        if (content[i] === '[') bracketCount++;
        else if (content[i] === ']') {
            bracketCount--;
            if (bracketCount === 0) return i;
        }
    }
    return -1;
}

/**
 * Extracts `label` values from "*Menu" properties in app.config.ts.
 */
export function extractMenuTitles(configPath) {
    if (!fs.existsSync(configPath)) return [];
    const content = fs.readFileSync(configPath, 'utf8');
    const titles = [];
    const menuStartRegex = /(\w+Menu)\s*:\s*\[/g;
    const labelRegex = /label\s*:\s*(['"])(.*?)\1/g;
    let match;
    while ((match = menuStartRegex.exec(content)) !== null) {
        const startPos = match.index + match[0].length - 1;
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
 * Recursively retrieves files with specified extensions, excluding certain directories.
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
 * Extracts I18n keys from content using regex for $t() or t() functions.
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
 * Reads and parses a locale JavaScript file.
 */
const readLocaleJs = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return {};
        const content = fs.readFileSync(filePath, 'utf8');
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start === -1 || end === -1) return {};
        const jsonString = content.slice(start, end + 1);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Error reading locale JS at ${filePath}:`, error);
        return {};
    }
};

/**
 * Updates an existing locale object with new keys, defaulting to the key itself if absent.
 */
const updateKeys = (existing, keys) => {
    const updated = {};
    keys.forEach((key) => {
        updated[key] = key in existing ? existing[key] : key;
    });
    return updated;
};

/**
 * Sorts object keys alphabetically.
 */
const sortKeys = (obj) =>
    Object.keys(obj)
        .sort()
        .reduce((sorted, key) => {
            sorted[key] = obj[key];
            return sorted;
        }, {});

/**
 * Main function to generate locale JavaScript files.
 */
const main = () => {
    const projectDir = process.cwd();
    const localeDir = path.join(projectDir, 'i18n', 'locales');
    const faJsPath = path.join(localeDir, 'fa.js');
    const enJsPath = path.join(localeDir, 'en.js');
    const appConfigPath = path.join(projectDir, 'app/app.config.ts');

    // Collect all I18n keys
    const files = getAllFiles(projectDir, ['.ts', '.vue']);
    const allKeys = new Set();
    files.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        extractI18Keys(content).forEach((key) => allKeys.add(key));
    });

    // Add menu titles from app.config.ts
    extractMenuTitles(appConfigPath).forEach((title) => allKeys.add(title));

    // Add cats items from app.config.ts
    const appConfigContent = fs.readFileSync(appConfigPath, 'utf8');
    const catsRegex = /cats\s*:\s*\[([^\]]+)\]/;
    const catsMatch = appConfigContent.match(catsRegex);
    if (catsMatch) {
        const catsItems = catsMatch[1]
            .split(',')
            .map((item) => item.replace(/['"]/g, '').trim())
            .filter(Boolean);
        catsItems.forEach((item) => allKeys.add(item));
    }

    // Process locales
    const faLocale = readLocaleJs(faJsPath);
    const enLocale = readLocaleJs(enJsPath);
    const updatedFaLocale = sortKeys(updateKeys(faLocale, allKeys));
    const updatedEnLocale = sortKeys(updateKeys(enLocale, allKeys));

    // Generate and write JavaScript files
    const faContent = `export default ${JSON.stringify(updatedFaLocale, null, 2)};`;
    const enContent = `export default ${JSON.stringify(updatedEnLocale, null, 2)};`;
    fs.writeFileSync(faJsPath, faContent, 'utf8');
    fs.writeFileSync(enJsPath, enContent, 'utf8');

    console.log(`Updated locale files: ${allKeys.size} keys processed.`);
};

main();