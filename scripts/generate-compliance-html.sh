#!/bin/bash
# Generate HTML Compliance Bundle
# Combines all security documentation into a single audit-ready HTML file
# Can be printed to PDF from any browser (File → Print → Save as PDF)

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📄 Traffic CRM - Compliance Bundle HTML Generator${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check for pandoc
if ! command -v pandoc &> /dev/null; then
    echo -e "${YELLOW}⚠️  Pandoc not found. Installing...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing via Homebrew..."
        brew install pandoc
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing via apt..."
        sudo apt-get update && sudo apt-get install -y pandoc
    else
        echo -e "${YELLOW}❌ Unsupported OS. Please install pandoc manually:${NC}"
        echo "   https://pandoc.org/installing.html"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Pandoc found: $(pandoc --version | head -n1)${NC}"
echo ""

# Define output file
OUTPUT_FILE="Traffic_CRM_Security_Compliance_Bundle_$(date +%Y-%m-%d).html"

# Define source files
SOURCES=(
    "COMPLIANCE_BUNDLE_EXECUTIVE_SUMMARY.md"
    "WORKFLOW_SECURITY_AUDIT.md"
    "SECURITY_GAP_ANALYSIS.md"
    "docs/WORKFLOW_SECURITY_HARDENING.md"
    "WORKFLOW_SECURITY_SCAN.md"
    "SECURITY_COMPLIANCE_SUMMARY.md"
    "WORKFLOW_COMPARISON.md"
    ".github/WORKFLOW_SECURITY_CHECKLIST.md"
)

# Verify all source files exist
echo -e "${BLUE}🔍 Verifying source files...${NC}"
MISSING=0
for file in "${SOURCES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${YELLOW}✗${NC} $file (missing)"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}❌ Missing $MISSING file(s). Cannot generate HTML.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Generating HTML bundle...${NC}"

# Generate HTML with pandoc
pandoc \
    "${SOURCES[@]}" \
    -o "$OUTPUT_FILE" \
    --toc \
    --toc-depth=3 \
    --number-sections \
    --standalone \
    --self-contained \
    --css=<(cat <<'EOF'
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
}
h1, h2, h3, h4, h5, h6 {
    color: #2c3e50;
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
}
h1 { font-size: 2em; border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
code {
    background-color: #f6f8fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 85%;
}
pre {
    background-color: #f6f8fa;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
}
pre code {
    background-color: transparent;
    padding: 0;
}
table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
}
th, td {
    border: 1px solid #dfe2e5;
    padding: 8px 12px;
    text-align: left;
}
th {
    background-color: #f6f8fa;
    font-weight: 600;
}
tr:nth-child(even) {
    background-color: #f6f8fa;
}
a {
    color: #0366d6;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
blockquote {
    border-left: 4px solid #dfe2e5;
    padding-left: 16px;
    color: #6a737d;
    margin: 16px 0;
}
#TOC {
    background-color: #f6f8fa;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 30px;
}
#TOC ul {
    list-style-type: none;
    padding-left: 20px;
}
#TOC > ul {
    padding-left: 0;
}
#TOC a {
    color: #0366d6;
}
@media print {
    body {
        max-width: 100%;
        padding: 0;
    }
    #TOC {
        page-break-after: always;
    }
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
    }
    pre, table {
        page-break-inside: avoid;
    }
}
EOF
) \
    --metadata title="Traffic CRM - Security & Compliance Bundle" \
    --metadata author="Engineering Team" \
    --metadata date="$(date +%Y-%m-%d)" \
    --metadata description="Security Audit & Compliance Documentation"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ HTML generated successfully!${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📄 Compliance Bundle Details${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BLUE}File:${NC} $OUTPUT_FILE"
    echo -e "  ${BLUE}Size:${NC} $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo -e "  ${BLUE}Date:${NC} $(date +"%Y-%m-%d %H:%M:%S")"
    echo ""
    echo -e "${BLUE}📚 Included Documents:${NC}"
    for file in "${SOURCES[@]}"; do
        echo -e "  ${GREEN}✓${NC} $file"
    done
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 Ready for distribution!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}📤 To convert to PDF:${NC}"
    echo "  1. Open in browser: open $OUTPUT_FILE"
    echo "  2. Print (Cmd+P or Ctrl+P)"
    echo "  3. Save as PDF"
    echo ""
    echo -e "${YELLOW}   Or use this command (if wkhtmltopdf installed):${NC}"
    echo "     wkhtmltopdf $OUTPUT_FILE ${OUTPUT_FILE%.html}.pdf"
    echo ""
else
    echo ""
    echo -e "${YELLOW}❌ HTML generation failed. Check errors above.${NC}"
    exit 1
fi

