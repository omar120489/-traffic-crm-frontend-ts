#!/usr/bin/env node
/**
 * Emit OpenAPI spec from running NestJS app
 * Usage: node scripts/emit-openapi.mjs
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const OUTPUT = resolve(process.cwd(), 'openapi.json');

console.log('📡 Fetching OpenAPI spec from', API_URL);

try {
  const response = await fetch(`${API_URL}/openapi.json`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const spec = await response.json();
  writeFileSync(OUTPUT, JSON.stringify(spec, null, 2));
  console.log('✅ OpenAPI spec written to', OUTPUT);
} catch (err) {
  console.error('❌ Failed to fetch OpenAPI spec:', err.message);
  console.error('   Make sure the API is running: pnpm --filter @apps/core-api start:dev');
  process.exit(1);
}


