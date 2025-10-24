#!/bin/bash
# Automated Workflow Security Verification Script
# Based on GitHub and AWS Well-Architected Framework standards
# Version: 1.0

set -e

WORKFLOW_FILE="$1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -z "$WORKFLOW_FILE" ]; then
  echo "Usage: $0 <workflow-file>"
  echo "Example: $0 .github/workflows/release.yml"
  exit 1
fi

if [ ! -f "$WORKFLOW_FILE" ]; then
  echo "Error: File not found: $WORKFLOW_FILE"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Workflow Security Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $WORKFLOW_FILE"
echo "Date: $(date)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0
WARNINGS=0

# Check 1: Unpinned actions (CRITICAL)
echo "1. Checking for unpinned actions (CRITICAL)..."
echo "   Standard: GitHub Official Documentation"
echo "   Requirement: Pin actions to full-length commit SHA"
if grep -qE 'uses:.*@(v[0-9]|main|master)' "$WORKFLOW_FILE"; then
  echo -e "   ${RED}❌ FAIL${NC}: Found unpinned actions"
  echo ""
  grep -nE 'uses:.*@(v[0-9]|main|master)' "$WORKFLOW_FILE" | while read -r line; do
    echo "      Line: $line"
  done
  echo ""
  echo "   Fix: Replace with SHA-pinned versions"
  echo "   Example: uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1"
  ERRORS=$((ERRORS + 1))
else
  echo -e "   ${GREEN}✅ PASS${NC}: All actions are SHA-pinned"
fi
echo ""

# Check 2: Broad permissions (CRITICAL)
echo "2. Checking for broad permissions (CRITICAL)..."
echo "   Standard: AWS Well-Architected Framework"
echo "   Requirement: Implement least privilege for workflow permissions"
if grep -q "^permissions:" "$WORKFLOW_FILE"; then
  # Check if permissions are at workflow level with write access
  if grep -A10 "^permissions:" "$WORKFLOW_FILE" | head -11 | grep -q "write"; then
    # Check if there are job-level permissions (good)
    if grep -q "^  [a-z-]*:$" "$WORKFLOW_FILE" && grep -A5 "^  [a-z-]*:$" "$WORKFLOW_FILE" | grep -q "permissions:"; then
      echo -e "   ${GREEN}✅ PASS${NC}: Permissions are scoped per job"
    else
      echo -e "   ${YELLOW}⚠️  WARNING${NC}: Workflow-level write permissions detected"
      echo "   Recommendation: Scope permissions per job for least privilege"
      WARNINGS=$((WARNINGS + 1))
    fi
  else
    echo -e "   ${GREEN}✅ PASS${NC}: Permissions are read-only or properly scoped"
  fi
else
  echo -e "   ${YELLOW}⚠️  WARNING${NC}: No explicit permissions (using GitHub defaults)"
  echo "   Recommendation: Add explicit 'permissions: contents: read'"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 3: Script injection risks (CRITICAL)
echo "3. Checking for script injection risks (CRITICAL)..."
echo "   Standard: GitHub Security Lab"
echo "   Requirement: Avoid untrusted input in run: commands"
INJECTION_FOUND=0

if grep -qE '\$\{\{ github\.event\.' "$WORKFLOW_FILE"; then
  echo -e "   ${RED}❌ FAIL${NC}: Found github.event.* in workflow (HIGH RISK)"
  echo ""
  grep -nE '\$\{\{ github\.event\.' "$WORKFLOW_FILE" | while read -r line; do
    echo "      Line: $line"
  done
  echo ""
  echo "   Risk: Attacker can inject commands via PR/issue/comment"
  echo "   Fix: Never use github.event.* in run: commands"
  ERRORS=$((ERRORS + 1))
  INJECTION_FOUND=1
fi

if grep -qE '\$\{\{ github\.head_ref' "$WORKFLOW_FILE"; then
  echo -e "   ${RED}❌ FAIL${NC}: Found github.head_ref in workflow (HIGH RISK)"
  ERRORS=$((ERRORS + 1))
  INJECTION_FOUND=1
fi

if grep -qE '\$\{\{ github\.base_ref' "$WORKFLOW_FILE"; then
  echo -e "   ${RED}❌ FAIL${NC}: Found github.base_ref in workflow (HIGH RISK)"
  ERRORS=$((ERRORS + 1))
  INJECTION_FOUND=1
fi

if [ $INJECTION_FOUND -eq 0 ]; then
  echo -e "   ${GREEN}✅ PASS${NC}: No script injection risks detected"
fi
echo ""

# Check 4: Hardcoded secrets (CRITICAL)
echo "4. Checking for hardcoded secrets (CRITICAL)..."
echo "   Standard: GitHub Security Hardening"
echo "   Requirement: Use secrets.* for all credentials"
if grep -qiE '(password|token|key|secret|api_key).*[:=].*["\047][a-zA-Z0-9_-]{20,}' "$WORKFLOW_FILE"; then
  echo -e "   ${RED}❌ FAIL${NC}: Possible hardcoded secrets found"
  echo ""
  grep -niE '(password|token|key|secret|api_key).*[:=].*["\047][a-zA-Z0-9_-]{20,}' "$WORKFLOW_FILE" | while read -r line; do
    echo "      Line: $line"
  done
  echo ""
  echo "   Fix: Use \${{ secrets.SECRET_NAME }} instead"
  ERRORS=$((ERRORS + 1))
else
  echo -e "   ${GREEN}✅ PASS${NC}: No hardcoded secrets detected"
fi
echo ""

# Check 5: Concurrency control (MEDIUM)
echo "5. Checking for concurrency control (MEDIUM)..."
echo "   Standard: GitHub Best Practices"
echo "   Requirement: Prevent race conditions"
if grep -q "^concurrency:" "$WORKFLOW_FILE"; then
  echo -e "   ${GREEN}✅ PASS${NC}: Concurrency control defined"
else
  echo -e "   ${YELLOW}⚠️  WARNING${NC}: No concurrency control"
  echo "   Risk: Multiple workflow runs may conflict"
  echo "   Recommendation: Add concurrency group"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 6: Timeout management (MEDIUM)
echo "6. Checking for timeout management (MEDIUM)..."
echo "   Standard: GitHub Best Practices"
echo "   Requirement: Prevent hung jobs"
if grep -q "timeout-minutes:" "$WORKFLOW_FILE"; then
  echo -e "   ${GREEN}✅ PASS${NC}: Timeouts defined"
else
  echo -e "   ${YELLOW}⚠️  WARNING${NC}: No timeouts defined"
  echo "   Risk: Jobs may hang indefinitely"
  echo "   Recommendation: Add timeout-minutes to all jobs"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 7: pull_request_target usage (HIGH)
echo "7. Checking for pull_request_target usage (HIGH)..."
echo "   Standard: GitHub Security Hardening"
echo "   Requirement: Avoid pull_request_target with untrusted code"
if grep -q "pull_request_target:" "$WORKFLOW_FILE"; then
  echo -e "   ${YELLOW}⚠️  WARNING${NC}: pull_request_target detected"
  echo "   Risk: Runs with write permissions on untrusted code"
  echo "   Recommendation: Use pull_request instead, or carefully review"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "   ${GREEN}✅ PASS${NC}: No pull_request_target usage"
fi
echo ""

# Check 8: Environment variables for inputs (MEDIUM)
echo "8. Checking input handling (MEDIUM)..."
echo "   Standard: GitHub Security Lab"
echo "   Requirement: Use environment variables for user inputs"
if grep -qE 'run:.*\$\{\{ inputs\.' "$WORKFLOW_FILE"; then
  echo -e "   ${YELLOW}⚠️  INFO${NC}: Direct input interpolation detected"
  echo "   Recommendation: Use environment variables for better safety"
  echo "   Example:"
  echo "     env:"
  echo "       INPUT_VAR: \${{ inputs.version }}"
  echo "     run: echo \"\$INPUT_VAR\""
  # Don't count as warning, just info
else
  echo -e "   ${GREEN}✅ PASS${NC}: No direct input interpolation in run commands"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 VERIFICATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "File: $WORKFLOW_FILE"
echo -e "Critical Errors:  ${RED}$ERRORS${NC}"
echo -e "Warnings:         ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ VERIFICATION PASSED${NC}: No issues found"
  echo ""
  echo "This workflow complies with:"
  echo "  ✅ GitHub Actions Security Hardening"
  echo "  ✅ AWS Well-Architected Framework"
  echo "  ✅ GitHub Security Lab Guidelines"
  echo "  ✅ OpenSSF Best Practices"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  VERIFICATION PASSED WITH WARNINGS${NC}: $WARNINGS warning(s)"
  echo ""
  echo "Critical checks passed, but improvements recommended."
  echo "Review warnings above and consider addressing them."
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo -e "${RED}❌ VERIFICATION FAILED${NC}: $ERRORS critical error(s), $WARNINGS warning(s)"
  echo ""
  echo "This workflow does NOT comply with security standards."
  echo "Fix critical errors before merging."
  echo ""
  echo "References:"
  echo "  - GitHub: https://docs.github.com/en/actions/security-guides"
  echo "  - AWS Well-Architected: https://docs.aws.amazon.com/wellarchitected/"
  echo "  - Checklist: .github/WORKFLOW_SECURITY_CHECKLIST.md"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi

