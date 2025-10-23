#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'src');
const HEADERS = [/MIT/i, /Apache/i, /Copyright/i];

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

const files = walk(ROOT).slice(0, 2000);
const misses: string[] = [];

for (const f of files) {
  const head = fs.readFileSync(f, 'utf8').slice(0, 400);
  const ok = HEADERS.some(rx => rx.test(head));
  if (!ok) misses.push(path.relative(process.cwd(), f));
}

process.stdout.write(`# License Header Check\n\nMissing headers in ${misses.length} files (first 50 shown):\n\n`);
for (const m of misses.slice(0, 50)) process.stdout.write(`- ${m}\n`);

