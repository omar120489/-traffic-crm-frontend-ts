#!/bin/bash
# Generate PDF Compliance Bundle
# Combines all security documentation into a single audit-ready PDF

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📄 Traffic CRM - Compliance Bundle PDF Generator${NC}"
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
OUTPUT_FILE="Traffic_CRM_Security_Compliance_Bundle_$(date +%Y-%m-%d).pdf"

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
    echo -e "${YELLOW}❌ Missing $MISSING file(s). Cannot generate PDF.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Generating PDF bundle...${NC}"

# Generate PDF with pandoc (using wkhtmltopdf for simpler setup)
pandoc \
    "${SOURCES[@]}" \
    -o "$OUTPUT_FILE" \
    --toc \
    --toc-depth=3 \
    --number-sections \
    -V geometry:margin=1in \
    -V linkcolor:blue \
    -V urlcolor:blue \
    -V toccolor:blue \
    -V papersize:letter \
    -V fontsize:11pt \
    --metadata title="Traffic CRM - Security & Compliance Bundle" \
    --metadata author="Engineering Team" \
    --metadata date="$(date +%Y-%m-%d)" \
    --metadata subject="Security Audit & Compliance Documentation" \
    --metadata keywords="security,compliance,audit,openssf,github,owasp"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ PDF generated successfully!${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📄 Compliance Bundle Details${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BLUE}File:${NC} $OUTPUT_FILE"
    echo -e "  ${BLUE}Size:${NC} $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo -e "  ${BLUE}Pages:${NC} ~$(pdfinfo "$OUTPUT_FILE" 2>/dev/null | grep Pages | awk '{print $2}' || echo 'N/A')"
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
    echo -e "${YELLOW}📤 Next Steps:${NC}"
    echo "  1. Review the PDF: open $OUTPUT_FILE"
    echo "  2. Distribute to stakeholders (Engineering, Security, Compliance)"
    echo "  3. Archive for audit purposes"
    echo "  4. Schedule next quarterly review"
    echo ""
else
    echo ""
    echo -e "${YELLOW}❌ PDF generation failed. Check errors above.${NC}"
    exit 1
fi

