#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const LEGACY = ['ui-component','@tabler/icons-react','apexcharts','react-perfect-scrollbar','fullcalendar','moment','MainCard'];

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

const root = path.join(process.cwd(), 'src');
const files = walk(root);
const count = new Map<string, number>();
const legacy: string[] = [];

for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  const rx = /import\s+[^'"]*from\s+['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(code))) {
    const spec = m[1];
    count.set(spec, (count.get(spec) || 0) + 1);
    if (LEGACY.some(l => spec === l || spec.startsWith(l + '/'))) legacy.push(`${spec}\t${path.relative(process.cwd(), f)}`);
  }
}

console.log('Top imports:');
for (const [s, n] of Array.from(count.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 50)) {
  console.log(`${n}\t${s}`);
}

console.log('\nLegacy matches:');
for (const line of legacy) console.log(line);
console.log(`\nFiles scanned: ${files.length}`);
