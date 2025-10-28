#!/usr/bin/env bash
set -euo pipefail

# RIO Travels Logo Installation Script
# Copies your logo to the correct locations in the frontend app

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

LOGO_SOURCE="${1:-}"
PUBLIC_DEST="$PROJECT_ROOT/apps/frontend/public/rio-travels.png"
ASSETS_DEST="$PROJECT_ROOT/apps/frontend/src/assets/images/brand/rio-travels.png"

echo "🎨 RIO Travels Logo Installer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if logo source was provided
if [ -z "$LOGO_SOURCE" ]; then
  echo "❌ Error: Please provide the path to your logo PNG file"
  echo ""
  echo "Usage:"
  echo "  ./scripts/install_logo.sh /path/to/rio-travels.png"
  echo ""
  echo "Example:"
echo "  ./scripts/install_logo.sh ~/Downloads/Berry_Logo.png"
  exit 1
fi

# Check if source file exists
if [ ! -f "$LOGO_SOURCE" ]; then
  echo "❌ Error: Logo file not found: $LOGO_SOURCE"
  exit 1
fi

# Check if it's a PNG
if [[ ! "$LOGO_SOURCE" =~ \.png$ ]]; then
  echo "⚠️  Warning: File doesn't have .png extension"
  echo "   Continuing anyway..."
fi

# Create destination directories
mkdir -p "$(dirname "$PUBLIC_DEST")"
mkdir -p "$(dirname "$ASSETS_DEST")"

# Copy logo to both locations
echo ""
echo "📋 Copying logo..."
echo "   Source: $LOGO_SOURCE"
echo ""

cp "$LOGO_SOURCE" "$PUBLIC_DEST"
echo "✅ Copied to: $PUBLIC_DEST (favicon/PWA)"

cp "$LOGO_SOURCE" "$ASSETS_DEST"
echo "✅ Copied to: $ASSETS_DEST (header logo)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Logo installed successfully!"
echo ""
echo "Next steps:"
echo "  1. Start the dev server: cd apps/frontend && pnpm dev"
echo "  2. Check the browser tab for your logo favicon"
echo "  3. Check the header for your logo"
echo ""
echo "See LOGO_SETUP.md for more details."
