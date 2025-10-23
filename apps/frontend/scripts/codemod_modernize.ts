#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = path.join(process.cwd(), 'src');

interface Change {
  file: string;
  type: 'mui-grid' | 'maincard-apppage';
  before: string;
  after: string;
}

const changes: Change[] = [];

function walk(d: string, out: string[] = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d)) {
    const p = path.join(d, e);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(t|j)sx?$/.test(e)) out.push(p);
  }
  return out;
}

function transformMUIGrid(code: string): string {
  // Transform: import Grid from '@mui/material/Grid' → import { Grid } from '@mui/material'
  return code.replaceAll(
    /import\s+Grid\s+from\s+['"]@mui\/material\/Grid['"]/g,
    "import { Grid } from '@mui/material'"
  );
}

function transformMainCard(code: string): string {
  // Simple heuristic: Replace <MainCard title="X"> with <AppPage title="X">
  // This is a safe transformation only when MainCard is a simple wrapper
  // More complex cases should be handled manually
  
  let transformed = code;
  
  // Add AppPage import if MainCard is being replaced and AppPage isn't imported
  if (/import.*MainCard/.test(code) && !/import.*AppPage/.test(code)) {
    // Replace MainCard import with AppPage
    transformed = transformed.replaceAll(
      /import\s+.*MainCard.*from\s+['"].*['"]/g,
      "import { AppPage } from 'layouts/AppPage'"
    );
  }
  
  // Replace JSX usage: <MainCard title="..." → <AppPage title="..."
  transformed = transformed.replaceAll(
    /<MainCard\s+/g,
    '<AppPage '
  );
  
  transformed = transformed.replaceAll(
    /<\/MainCard>/g,
    '</AppPage>'
  );
  
  return transformed;
}

function processFile(filePath: string) {
  const original = fs.readFileSync(filePath, 'utf8');
  let modified = original;
  
  const beforeGrid = modified;
  modified = transformMUIGrid(modified);
  if (modified !== beforeGrid) {
    changes.push({
      file: path.relative(process.cwd(), filePath),
      type: 'mui-grid',
      before: 'import Grid from \'@mui/material/Grid\'',
      after: 'import { Grid } from \'@mui/material\''
    });
  }
  
  const beforeMainCard = modified;
  modified = transformMainCard(modified);
  if (modified !== beforeMainCard) {
    changes.push({
      file: path.relative(process.cwd(), filePath),
      type: 'maincard-apppage',
      before: '<MainCard ...',
      after: '<AppPage ...'
    });
  }
  
  if (modified !== original && APPLY) {
    fs.writeFileSync(filePath, modified, 'utf8');
  }
}

const files = walk(ROOT);

console.log(`Scanning ${files.length} files...`);
console.log(APPLY ? 'MODE: APPLY (will modify files)\n' : 'MODE: DRY-RUN (no files will be modified)\n');

for (const f of files) {
  processFile(f);
}

// Generate report
const report: string[] = [
  '# Codemod Modernization Results\n',
  `Mode: ${APPLY ? '✅ APPLIED' : '🔍 DRY-RUN'}\n`,
  `Scanned: ${files.length} files`,
  `Changes detected: ${changes.length}\n`
];

if (changes.length > 0) {
  report.push('## Changes by Type\n');
  
  const muiGridChanges = changes.filter(c => c.type === 'mui-grid');
  const mainCardChanges = changes.filter(c => c.type === 'maincard-apppage');
  
  report.push(`### MUI Grid Import Normalization (${muiGridChanges.length})\n`);
  for (const c of muiGridChanges.slice(0, 20)) {
    report.push(`- ${c.file}`);
  }
  if (muiGridChanges.length > 20) {
    report.push(`- ... and ${muiGridChanges.length - 20} more`);
  }
  
  report.push(`\n### MainCard → AppPage Transformation (${mainCardChanges.length})\n`);
  for (const c of mainCardChanges.slice(0, 20)) {
    report.push(`- ${c.file}`);
  }
  if (mainCardChanges.length > 20) {
    report.push(`- ... and ${mainCardChanges.length - 20} more`);
  }
} else {
  report.push('✅ No changes needed - codebase is already modernized!\n');
}

if (!APPLY && changes.length > 0) {
  report.push(
    '\n---',
    '\n**To apply these changes, run:**',
    '```bash',
    'npm run codemod:apply',
    '# or',
    'npx ts-node scripts/codemod_modernize.ts --apply',
    '```\n'
  );
}

const reportText = report.join('\n');
console.log(reportText);

// Write report to file
const auditDir = path.join(process.cwd(), '.project_audit');
if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}
fs.writeFileSync(path.join(auditDir, 'codemod_results.md'), reportText);

console.log(`\nReport saved to .project_audit/codemod_results.md`);

