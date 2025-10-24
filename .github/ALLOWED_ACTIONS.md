# Allowed GitHub Actions Policy

**Version**: 1.0  
**Last Updated**: October 24, 2025  
**Owner**: Security Team (@omar120489)

---

## 📋 Purpose

This document defines the approved GitHub Actions that can be used in workflows within this repository. This policy helps:
- ✅ Prevent supply-chain attacks
- ✅ Ensure consistent security practices
- ✅ Maintain audit trail for action usage
- ✅ Facilitate security reviews

---

## ✅ Approved Actions

### **Core Actions** (Always Allowed)

#### **Repository Management**
- `actions/checkout@*`
  - **Purpose**: Clone repository
  - **Security**: Official GitHub action
  - **Pinning**: Required (SHA)

#### **Environment Setup**
- `actions/setup-node@*`
  - **Purpose**: Set up Node.js environment
  - **Security**: Official GitHub action
  - **Pinning**: Required (SHA)

- `actions/setup-python@*`
  - **Purpose**: Set up Python environment
  - **Security**: Official GitHub action
  - **Pinning**: Required (SHA)

#### **Caching**
- `actions/cache@*`
  - **Purpose**: Cache dependencies
  - **Security**: Official GitHub action
  - **Pinning**: Required (SHA)

#### **Artifact Management**
- `actions/upload-artifact@*`
  - **Purpose**: Upload build artifacts
  - **Security**: Official GitHub action
  - **Pinning**: Required (SHA)

- `actions/download-artifact@*`
  - **Purpose**: Download build artifacts
  - **Security**: Official GitHub action
  - **Pinning**: Required (SHA)

#### **GitHub API**
- `actions/github-script@*`
  - **Purpose**: Interact with GitHub API
  - **Security**: Official GitHub action, sandboxed
  - **Pinning**: Required (SHA)

---

### **Package Managers** (Approved)

#### **PNPM**
- `pnpm/action-setup@*`
  - **Purpose**: Set up PNPM package manager
  - **Security**: Official PNPM action, verified creator
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

---

### **Release & Deployment** (Approved)

#### **GitHub Releases**
- `softprops/action-gh-release@*`
  - **Purpose**: Create GitHub releases
  - **Security**: Verified creator, widely used
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

---

### **Notifications** (Approved)

#### **Slack**
- `slackapi/slack-github-action@*`
  - **Purpose**: Send Slack notifications
  - **Security**: Official Slack action
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

---

### **Security Scanning** (Approved)

#### **Runtime Security**
- `step-security/harden-runner@*`
  - **Purpose**: Runtime security monitoring
  - **Security**: Specialized security vendor
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

#### **Vulnerability Scanning**
- `aquasecurity/trivy-action@*`
  - **Purpose**: Container and code scanning
  - **Security**: Verified security vendor
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

- `snyk/actions/*`
  - **Purpose**: Security vulnerability scanning
  - **Security**: Verified security vendor
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

#### **Secret Scanning**
- `trufflesecurity/trufflehog@*`
  - **Purpose**: Scan for leaked secrets
  - **Security**: Verified security vendor
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

#### **SBOM Generation**
- `anchore/sbom-action@*`
  - **Purpose**: Generate Software Bill of Materials
  - **Security**: Verified security vendor
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

---

### **Cloud Providers** (Approved)

#### **AWS**
- `aws-actions/configure-aws-credentials@*`
  - **Purpose**: Configure AWS credentials (OIDC)
  - **Security**: Official AWS action
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

#### **Azure**
- `azure/login@*`
  - **Purpose**: Azure login (OIDC)
  - **Security**: Official Azure action
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

#### **Google Cloud**
- `google-github-actions/auth@*`
  - **Purpose**: GCP authentication (OIDC)
  - **Security**: Official Google action
  - **Pinning**: Required (SHA)
  - **Review Date**: 2025-10-24
  - **Next Review**: 2026-01-24

---

## ❌ Prohibited Actions

### **Categories Not Allowed**
- ❌ Actions from unverified creators
- ❌ Actions without recent maintenance (>6 months)
- ❌ Actions with known security vulnerabilities
- ❌ Actions that require excessive permissions
- ❌ Actions that execute arbitrary code from external sources

### **Specific Examples**
- ❌ `random-user/some-action` - Unverified creator
- ❌ `abandoned-project/old-action` - No recent updates
- ❌ Any action using `docker://` without approval

---

## 🔍 Review Process

### **Adding New Actions**

#### **Step 1: Request**
```markdown
## New Action Request

**Action**: `owner/action-name@version`
**Purpose**: Brief description
**Justification**: Why is this needed?
**Alternatives Considered**: What else was evaluated?
**Security Review**: Initial security assessment
**Requestor**: @username
```

#### **Step 2: Security Review**
Security team reviews:
1. ✅ Creator verification (GitHub verified badge)
2. ✅ Maintenance status (updated within 6 months)
3. ✅ Security vulnerabilities (GitHub Security Advisories)
4. ✅ Permission requirements (minimal necessary)
5. ✅ Code review (if not from verified creator)
6. ✅ Community adoption (usage statistics)

#### **Step 3: Approval**
- **Approval Authority**: @omar120489 (Security Team)
- **SLA**: 2 business days
- **Documentation**: Update this file with approval

#### **Step 4: Implementation**
1. Add action to approved list
2. Pin to specific SHA
3. Document in workflow
4. Communicate to team

---

## 📅 Maintenance

### **Quarterly Reviews**
- **Frequency**: Every 3 months
- **Owner**: Security Team
- **Process**:
  1. Review all approved actions
  2. Check for security advisories
  3. Verify maintenance status
  4. Update SHA pins if needed
  5. Remove abandoned actions

### **Next Review Dates**
- **Q1 2026**: January 24, 2026
- **Q2 2026**: April 24, 2026
- **Q3 2026**: July 24, 2026
- **Q4 2026**: October 24, 2026

---

## 🚨 Incident Response

### **If Unauthorized Action Detected**

1. **Immediate Action**:
   - Cancel running workflow
   - Disable workflow file
   - Notify security team

2. **Investigation**:
   - Review workflow changes
   - Identify who added the action
   - Assess potential impact

3. **Remediation**:
   - Remove unauthorized action
   - Update workflow with approved action
   - Document incident

4. **Prevention**:
   - Review with team
   - Update training if needed
   - Strengthen controls

---

## 📚 References

### **Official Documentation**
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [GitHub Marketplace](https://github.com/marketplace?type=actions)
- [OpenSSF Scorecard](https://github.com/ossf/scorecard)

### **Internal Documentation**
- `WORKFLOW_SECURITY_AUDIT.md` - Security audit
- `SECURITY_GAP_ANALYSIS.md` - Gap analysis
- `.github/CODEOWNERS` - Code ownership

---

## ✅ Compliance

### **Standards Met**
- ✅ GitHub Security Hardening Guide
- ✅ OpenSSF Best Practices
- ✅ OWASP CI/CD Security
- ✅ SLSA Framework

---

## 📞 Contact

**Security Team**: @omar120489  
**Questions**: Open an issue with label `security`  
**Urgent**: Contact security team directly

---

**Policy Version**: 1.0  
**Effective Date**: October 24, 2025  
**Next Review**: January 24, 2026

