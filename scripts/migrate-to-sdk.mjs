#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { glob } from 'glob';

const DRY_RUN = process.argv.includes('--dry-run');

const replacements = [
  // @services imports
  { 
    pattern: /from ['"]@services\/(contacts|leads|deals|companies)['"]/g, 
    replace: (match, module) => `from '@services/${module}.sdk'` 
  },
  // services/ imports (without @)
  { 
    pattern: /from ['"]services\/(contacts|leads|deals|companies)['"]/g, 
    replace: (match, module) => `from '@services/${module}.sdk'` 
  },
  // Relative imports in services/
  { 
    pattern: /from ['"]\.\/(contacts|leads|deals|companies)['"]/g, 
    replace: (match, module) => `from './${module}.sdk'` 
  }
];

async function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let changed = false;
  
  for (const { pattern, replace } of replacements) {
    const newContent = content.replace(pattern, replace);
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }
  
  if (changed) {
    console.log(`   ✏️  ${filePath}`);
    if (!DRY_RUN) {
      writeFileSync(filePath, content, 'utf-8');
    }
  }
  
  return changed;
}

async function main() {
  const files = await glob('apps/frontend/src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.ts', '**/*.test.tsx']
  });
  
  let updatedCount = 0;
  for (const file of files) {
    const wasUpdated = await migrateFile(file);
    if (wasUpdated) updatedCount++;
  }
  
  console.log(`\n   ${DRY_RUN ? '📝 Would update' : '✅ Updated'} ${updatedCount} file(s)`);
}

main().catch(console.error);

