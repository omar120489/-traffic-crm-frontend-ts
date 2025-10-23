#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function walk(dir: string, acc: any[] = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (p.includes('node_modules') || p.includes('/.git/')) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else {
      const ext = path.extname(name).toLowerCase().replace(/^\./, '');
      const size = st.size;
      const isText = /\.(t|j)sx?$|\.json$|\.md$|\.css$|\.scss$|\.y(a)?ml$/.test(name.toLowerCase());
      acc.push({ path: p, ext, size, kind: isText ? 'text' : 'binary' });
    }
  }
  return acc;
}

const data = walk(process.cwd());
process.stdout.write(JSON.stringify({ generatedAt: new Date().toISOString(), root: process.cwd(), files: data }, null, 2));

