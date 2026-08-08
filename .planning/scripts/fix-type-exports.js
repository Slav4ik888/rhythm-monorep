// .planning/scripts/fix-type-exports.js

// Скрипт для исправления type-only экспортов/импортов для совместимости с Vite/esbuild
// Использование: node .planning/scripts/fix-type-exports.js
// Два прохода:
//   1. Исправляет экспорты: export { Value, Type } -> export { Value } + export type { Type }
//   2. Исправляет импорты: import { Type } -> import type { Type } (если экспортируется как type)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Рекурсивно ищем, является ли name типом в sourceFile
function findTypeInModule(resolvedFile, name, visited = new Set()) {
  if (!fs.existsSync(resolvedFile) || visited.has(resolvedFile)) return false;
  visited.add(resolvedFile);
  const content = fs.readFileSync(resolvedFile, 'utf8');

  const re = new RegExp(
    'export\\s+(interface|type)\\s+' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b'
  );
  if (re.test(content)) return true;

  const reExportType = new RegExp(
    'export\\s+type\\s+\\{[^}]*\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b[^}]*\\}\\s*from'
  );
  if (reExportType.test(content)) return true;

  const valRe = new RegExp(
    'export\\s+(const|function|class|let|var|enum)\\s+' +
    name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b'
  );
  if (valRe.test(content)) return false;

  const reexportRe = /export\s+\*\s+from\s+['"](.+?)['"]/g;
  let m;
  while ((m = reexportRe.exec(content)) !== null) {
    const dir = path.dirname(resolvedFile);
    for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
      const p = path.resolve(dir, m[1] + ext);
      if (fs.existsSync(p)) {
        const result = findTypeInModule(p, name, new Set(visited));
        if (result === true) return true;
        if (result === false) return false;
      }
    }
  }

  return null;
}

function resolveFile(barrelDir, importPath) {
  for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
    const p = path.resolve(barrelDir, importPath + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const result = execSync(
  'find packages/frontend/src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v "/tests/"',
  { encoding: 'utf8' }
);
const files = result.trim().split('\n');

// === ПРОХОД 1: Исправляем EXPORT'ы ===
let fixedExports = [];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const newLines = [];
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('export type {')) {
      newLines.push(line);
      continue;
    }

    const match = line.match(/^(\s*)export\s*\{\s*([^}]+?)\s*\}\s*from\s*['"](.+?)['"]/);
    if (!match) {
      newLines.push(line);
      continue;
    }

    const namesStr = match[2];
    const importPath = match[3];
    const names = namesStr.split(',').map((n) => n.trim()).filter(Boolean);

    const barrelDir = path.dirname(file);
    const sourceFile = resolveFile(barrelDir, importPath);
    if (!sourceFile) { newLines.push(line); continue; }

    const typeNames = [];
    const valueNames = [];
    for (const name of names) {
      const realName = name.includes(' as ') ? name.split(' as ').pop().trim() : name;
      if (findTypeInModule(sourceFile, realName)) typeNames.push(name);
      else valueNames.push(name);
    }

    if (typeNames.length === 0) { newLines.push(line); continue; }

    modified = true;
    if (valueNames.length === 0) {
      newLines.push(line.replace('export {', 'export type {'));
    } else {
      newLines.push('export type { ' + typeNames.join(', ') + ' } from "' + importPath + '";');
      newLines.push('export { ' + valueNames.join(', ') + ' } from "' + importPath + '";');
    }
  }

  if (modified) {
    fs.writeFileSync(file, newLines.join('\n'));
    fixedExports.push(file);
  }
}

// === ПРОХОД 2: Исправляем ИМПОРТЫ ===
// Снова собираем список файлов (могли измениться)
const result2 = execSync(
  'find packages/frontend/src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v "/tests/"',
  { encoding: 'utf8' }
);
const files2 = result2.trim().split('\n');

let fixedImports = [];

for (const file of files2) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Ищем value-импорты (НЕ import type)
  const importRe = /^import\s+\{([^}]+)\}\s+from\s+['"](.+?)['"]/gm;
  let match;

  // Собираем все замены, потом применяем (чтобы не сбивать позиции)
  const replacements = [];

  while ((match = importRe.exec(content)) !== null) {
    if (match[0].startsWith('import type')) continue;

    const fullMatch = match[0];
    const namesStr = match[1];
    const importPath = match[2];
    const names = namesStr.split(',').map((n) => n.trim()).filter(Boolean);

    const dir = path.dirname(file);
    const sourceFile = resolveFile(dir, importPath);
    if (!sourceFile) continue;

    const typeNames = [];
    const valueNames = [];
    for (const name of names) {
      const realName = name.includes(' as ') ? name.split(' as ').pop().trim() : name;
      if (findTypeInModule(sourceFile, realName)) typeNames.push(name);
      else valueNames.push(name);
    }

    if (typeNames.length === 0) continue;

    const replacement =
      valueNames.length === 0
        ? fullMatch.replace('import {', 'import type {')
        : 'import type { ' +
        typeNames.join(', ') +
        ' } from "' +
        importPath +
        '";\nimport { ' +
        valueNames.join(', ') +
        ' } from "' +
        importPath +
        '";';

    replacements.push({ fullMatch, replacement });
  }

  if (replacements.length > 0) {
    for (const { fullMatch, replacement } of replacements) {
      content = content.replace(fullMatch, replacement);
    }
    fs.writeFileSync(file, content);
    fixedImports.push(file);
  }
}

console.log('EXPORT fixes: ' + fixedExports.length);
fixedExports.forEach((f) => console.log('  ' + f));
console.log('IMPORT fixes: ' + fixedImports.length);
fixedImports.forEach((f) => console.log('  ' + f));
