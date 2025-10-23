#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function read(p: string) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }
function list(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...list(p));
    else if (/\.(t|j)sx?$/.test(f)) out.push(p);
  }
  return out;
}

const menusDir = path.join(process.cwd(), 'src', 'menu-items');
const files = list(menusDir);
const urls = new Set<string>();

for (const f of files) {
  const src = read(f);
  const rx = /url\s*:\s*['"`]([^'"`]+)['"`]/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(src))) urls.add(m[1]);
}

for (const u of urls) console.log(u);

