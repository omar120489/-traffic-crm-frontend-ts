/*
 Transform Tokens Studio / Figma Tokens JSON into:
 1) build/tokens.css  (CSS variables)
 2) build/tokens.ts   (typed JS object)
 3) build/muiTokens.ts (MUI-friendly palette/shape/typography + shadows)

 Run via:
   pnpm --filter ./apps/frontend tokens:build
*/

import fs from 'node:fs';
import path from 'node:path';

// ---------- Types ----------

type Token = {
  $type?: string;
  $value?: unknown;
  value?: unknown; // older exports
  type?: string;   // older exports
};

type TokenGroup = {
  [key: string]: Token | TokenGroup;
};

type RawTokens = {
  color?: TokenGroup;
  font?: TokenGroup;
  size?: TokenGroup;
  spacing?: TokenGroup;
  radius?: TokenGroup;
  shadow?: TokenGroup;
  typography?: TokenGroup;
  [key: string]: unknown;
};

// ---------- Config ----------

const ROOT = path.resolve(__dirname, '..');
const RAW_FILE = path.join(ROOT, 'raw', 'figma-tokens.json');
const BUILD_DIR = path.join(ROOT, 'build');
const CSS_OUT = path.join(BUILD_DIR, 'tokens.css');
const TS_OUT = path.join(BUILD_DIR, 'tokens.ts');
const MUI_OUT = path.join(BUILD_DIR, 'muiTokens.ts');

if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true });

// ---------- Helpers ----------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function readRawTokens(filePath: string): RawTokens {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Tokens input not found at ${filePath}. Drop your JSON there and re-run.`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as RawTokens;
}

function extractLeafValue(node: Token | TokenGroup | unknown): string | number | undefined {
  if (!node || typeof node !== 'object') return undefined;
  const t = node as Token;
  const val = (t.$value ?? t.value) as unknown;
  if (typeof val === 'string' || typeof val === 'number') return val;
  return undefined;
}

// Walk tokens and build CSS variables + a flat map of key -> value
function walkTokens(
  obj: TokenGroup,
  prefix: string[] = [],
  outCss: string[] = [],
  flat: Record<string, string | number> = {}
) {
  for (const [key, child] of Object.entries(obj)) {
    const nextPath = [...prefix, key];
    if (isPlainObject(child)) {
      const leaf = extractLeafValue(child as Token);
      if (leaf !== undefined) {
        const varName = `--${nextPath.map(toKebabCase).join('-')}`;
        outCss.push(`${varName}: ${leaf};`);
        flat[nextPath.join('.')] = leaf;
      } else {
        // recurse
        walkTokens(child as TokenGroup, nextPath, outCss, flat);
      }
    }
  }
  return { outCss, flat };
}

// Map to MUI-ish structure (palette/shape/typography/shadows)
function toMuiTokens(flat: Record<string, string | number>) {
  // Palette mapping heuristics
  const palette: any = { mode: 'light' };

  const mapColor = (srcPrefix: string, targetKey: string) => {
    const entries = Object.entries(flat).filter(([k]) => k.startsWith(srcPrefix));
    if (!entries.length) return;
    const obj: Record<string, string | number> = {};
    for (const [k, v] of entries) {
      const suffix = k.slice(srcPrefix.length).replace(/^\./, '');
      obj[suffix] = v;
    }
    palette[targetKey] = obj;
  };

  // Adjust these prefixes to your token naming scheme
  mapColor('color.primary', 'primary');
  mapColor('color.secondary', 'secondary');
  mapColor('color.error', 'error');
  mapColor('color.warning', 'warning');
  mapColor('color.info', 'info');
  mapColor('color.success', 'success');
  mapColor('color.text', 'text');
  mapColor('color.background', 'background');
  mapColor('color.divider', 'divider');

  // Shape
  const shape = {
    borderRadius: Number(flat['radius.md'] ?? 8)
  };

  // Typography (simplified)
  const typography = {
    fontFamily: String(flat['font.family.base'] ?? 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'),
    h1: { fontSize: String(flat['typography.h1.fontSize'] ?? '2.25rem'), fontWeight: Number(flat['typography.h1.fontWeight'] ?? 700) },
    h2: { fontSize: String(flat['typography.h2.fontSize'] ?? '1.875rem'), fontWeight: Number(flat['typography.h2.fontWeight'] ?? 700) },
    h3: { fontSize: String(flat['typography.h3.fontSize'] ?? '1.5rem'), fontWeight: Number(flat['typography.h3.fontWeight'] ?? 600) },
    body1: { fontSize: String(flat['typography.body1.fontSize'] ?? '1rem'), fontWeight: Number(flat['typography.body1.fontWeight'] ?? 400) },
    body2: { fontSize: String(flat['typography.body2.fontSize'] ?? '0.875rem'), fontWeight: Number(flat['typography.body2.fontWeight'] ?? 400) }
  } as const;

  // Shadows: expect shadow.elevation.1..24
  const shadows: string[] = Array.from({ length: 25 }, (_, i) => {
    if (i === 0) return 'none';
    const val = flat[`shadow.elevation.${i}`];
    return (typeof val === 'string' ? val : undefined) ?? '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)';
  });

  return { palette, shape, typography, shadows };
}

function writeCss(vars: string[]) {
  const css = `:root{\n  ${vars.join('\n  ')}\n}`;
  fs.writeFileSync(CSS_OUT, css);
}

function writeTs(flat: Record<string, string | number>) {
  const lines = [
    '/* Auto-generated from Figma tokens. Do not edit directly. */',
    'export const tokens = ' + JSON.stringify(flat, null, 2) + ' as const;',
    '',
    'export type Tokens = typeof tokens;'
  ];
  fs.writeFileSync(TS_OUT, lines.join('\n'));
}

function writeMuiTs(mui: ReturnType<typeof toMuiTokens>) {
  const lines = [
    '/* Auto-generated MUI token mapping. Do not edit directly. */',
    'export const muiTokens = ' + JSON.stringify(mui, null, 2) + ' as const;',
    '',
    'export type MuiTokens = typeof muiTokens;'
  ];
  fs.writeFileSync(MUI_OUT, lines.join('\n'));
}

// ---------- Main ----------

function main() {
  const json = readRawTokens(RAW_FILE);

  const allCss: string[] = [];
  const flat: Record<string, string | number> = {};

  const knownRoots: (keyof RawTokens)[] = ['color', 'font', 'size', 'spacing', 'radius', 'shadow', 'typography'];
  for (const root of knownRoots) {
    const group = json[root];
    if (group && isPlainObject(group)) {
      const { outCss, flat: map } = walkTokens(group as TokenGroup, [root]);
      allCss.push(...outCss);
      Object.assign(flat, map);
    }
  }

  writeCss(allCss);
  writeTs(flat);
  const mui = toMuiTokens(flat);
  writeMuiTs(mui);

  // Also emit a tiny re-export index for convenience
  const indexOut = path.join(BUILD_DIR, 'index.ts');
  fs.writeFileSync(
    indexOut,
    [
      "export * from './tokens';",
      "export * from './muiTokens';"
    ].join('\n')
  );

  console.log(`Tokens generated:`, { css: CSS_OUT, ts: TS_OUT, mui: MUI_OUT });
}

main();
