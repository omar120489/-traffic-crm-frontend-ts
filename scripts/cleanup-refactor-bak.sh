#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="apps/frontend/src"

echo "🧹 Removing .bak files under ${ROOT_DIR} ..."
# Find and delete .bak files, printing each path
find "$ROOT_DIR" -type f -name "*.bak" -print -delete || true

echo "✅ Cleanup complete"
