# Architecture Diagrams

Visual representations of the Traffic CRM infrastructure, governance flows, and decision processes.

---

## 📦 Dependency Management Flow

```mermaid
graph TB
    subgraph "External Sources"
        NPM[npm Registry]
        GH[GitHub Security Advisories]
    end

    subgraph "Renovate Bot"
        SCAN[Scan Dependencies]
        GROUP[Group by Ecosystem]
        STABLE[Apply Stability Gates]
        CREATE[Create PR]
    end

    subgraph "Grouped Updates"
        FAST[Fastify Core + Plugins]
        NEST[NestJS Core + Modules]
        MUI[MUI + Emotion]
        DEV[Dev Dependencies]
    end

    subgraph "CI Validation"
        LINT[Lint Check]
        TYPE[TypeScript Check]
        TEST[Unit Tests]
        E2E[E2E Tests]
    end

    subgraph "Merge Strategy"
        AUTO[Auto-merge<br/>patch/minor dev deps]
        REVIEW[Manual Review<br/>runtime deps]
        SECURITY[Immediate Review<br/>security patches]
    end

    NPM --> SCAN
    GH --> SCAN
    SCAN --> GROUP
    GROUP --> STABLE
    STABLE --> CREATE

    CREATE --> FAST
    CREATE --> NEST
    CREATE --> MUI
    CREATE --> DEV

    FAST --> LINT
    NEST --> LINT
    MUI --> LINT
    DEV --> AUTO

    LINT --> TYPE
    TYPE --> TEST
    TEST --> E2E

    E2E --> REVIEW
    E2E --> SECURITY

    AUTO --> MERGE[Merged to main]
    REVIEW --> MERGE
    SECURITY --> MERGE

    style FAST fill:#ff6b6b
    style NEST fill:#e74c3c
    style MUI fill:#3498db
    style DEV fill:#2ecc71
    style AUTO fill:#27ae60
    style SECURITY fill:#e67e22
```

---

## 🧭 Architecture Decision Record (ADR) Flow

```mermaid
graph LR
    subgraph "Decision Trigger"
        ISSUE[Technical Issue<br/>or Opportunity]
        DEBATE[Team Discussion]
    end

    subgraph "ADR Creation"
        DRAFT[Draft ADR]
        CONTEXT[Document Context]
        ALTS[List Alternatives]
        DECISION[Make Decision]
    end

    subgraph "Documentation"
        FILE[Create ADR File<br/>docs/adr/NNNN-title.md]
        INDEX[Update ADR Index]
        XREF[Cross-link in<br/>Related Docs]
    end

    subgraph "Implementation"
        CODE[Implement Change]
        COMMIT[Commit with<br/>ADR Reference]
        ISSUE_TRACK[Create GitHub Issue<br/>if needed]
    end

    subgraph "Review & Maintenance"
        REVIEW[Quarterly Review]
        UPDATE[Update Status]
        SUPERSEDE[Supersede if<br/>Decision Changes]
    end

    ISSUE --> DEBATE
    DEBATE --> DRAFT
    DRAFT --> CONTEXT
    CONTEXT --> ALTS
    ALTS --> DECISION

    DECISION --> FILE
    FILE --> INDEX
    INDEX --> XREF

    XREF --> CODE
    CODE --> COMMIT
    COMMIT --> ISSUE_TRACK

    ISSUE_TRACK --> REVIEW
    REVIEW --> UPDATE
    UPDATE --> SUPERSEDE

    style DECISION fill:#e74c3c
    style FILE fill:#3498db
    style COMMIT fill:#2ecc71
    style REVIEW fill:#f39c12
```

---

## 🔄 CI/CD Pipeline with Quality Gates

```mermaid
graph TB
    subgraph "Developer Workflow"
        DEV[Developer Commits]
        STAGE[Git Add]
    end

    subgraph "Pre-commit Hook"
        LINT_STAGED[lint-staged]
        ESLINT[ESLint<br/>Frontend TS/TSX]
        TSC_SPRINT2[TypeScript Check<br/>Sprint 2 Only]
        MD_FIX[Markdown Auto-fix]
    end

    subgraph "Pre-push Hook"
        NODE_CHECK[Node 20 Version Check]
        TSC_FULL[TypeScript Check<br/>Full Sprint 2]
    end

    subgraph "GitHub Actions CI"
        DOCS_LINT[Lint Documentation]
        TYPECHECK[TypeCheck Sprint 2]
        MIGRATION[Track Migration Progress]
    end

    subgraph "Merge Gates"
        BRANCH_PROTECT[Branch Protection]
        REVIEW_REQ[Required Reviews]
        STATUS_CHECK[Status Checks Pass]
    end

    DEV --> STAGE
    STAGE --> LINT_STAGED

    LINT_STAGED --> ESLINT
    LINT_STAGED --> TSC_SPRINT2
    LINT_STAGED --> MD_FIX

    ESLINT --> COMMIT[Commit]
    TSC_SPRINT2 --> COMMIT
    MD_FIX --> COMMIT

    COMMIT --> PUSH[Git Push]
    PUSH --> NODE_CHECK
    NODE_CHECK --> TSC_FULL

    TSC_FULL --> GH_PUSH[Push to GitHub]

    GH_PUSH --> DOCS_LINT
    GH_PUSH --> TYPECHECK

    DOCS_LINT --> MIGRATION
    TYPECHECK --> MIGRATION

    MIGRATION --> BRANCH_PROTECT
    BRANCH_PROTECT --> REVIEW_REQ
    REVIEW_REQ --> STATUS_CHECK

    STATUS_CHECK --> MERGE[Merge to main]

    style ESLINT fill:#3498db
    style TSC_SPRINT2 fill:#3498db
    style TSC_FULL fill:#e74c3c
    style DOCS_LINT fill:#2ecc71
    style TYPECHECK fill:#e74c3c
    style MERGE fill:#27ae60
```

---

## 🏗️ Infrastructure Layers

```mermaid
graph TB
    subgraph "Developer Experience Layer"
        LOCAL[Local Development]
        HOOKS[Git Hooks<br/>Husky]
        SCRIPTS[NPM Scripts]
    end

    subgraph "Code Quality Layer"
        ESLINT_L[ESLint]
        TSC_L[TypeScript]
        PRETTIER[Prettier]
        MDLINT[Markdownlint]
    end

    subgraph "Automation Layer"
        RENOVATE_L[Renovate Bot]
        LINT_STAGED_L[lint-staged]
        COMMITLINT[Commitlint]
    end

    subgraph "CI/CD Layer"
        GH_ACTIONS[GitHub Actions]
        BRANCH_RULES[Branch Protection]
        CODEOWNERS[CODEOWNERS]
    end

    subgraph "Documentation Layer"
        ADR_L[ADRs]
        GUIDES[Technical Guides]
        ISSUE_TEMPLATES[Issue Templates]
        README_L[README + Index]
    end

    subgraph "Governance Layer"
        SEMVER[SemVer Policy]
        STABILITY[Stability Gates]
        SECURITY_L[Security Alerts]
        REVIEW_PROCESS[Review Process]
    end

    LOCAL --> HOOKS
    HOOKS --> SCRIPTS

    SCRIPTS --> ESLINT_L
    SCRIPTS --> TSC_L
    SCRIPTS --> PRETTIER
    SCRIPTS --> MDLINT

    ESLINT_L --> LINT_STAGED_L
    TSC_L --> LINT_STAGED_L
    MDLINT --> LINT_STAGED_L

    LINT_STAGED_L --> COMMITLINT
    COMMITLINT --> GH_ACTIONS

    GH_ACTIONS --> BRANCH_RULES
    BRANCH_RULES --> CODEOWNERS

    RENOVATE_L --> GH_ACTIONS
    RENOVATE_L --> STABILITY

    ADR_L --> GUIDES
    GUIDES --> ISSUE_TEMPLATES
    ISSUE_TEMPLATES --> README_L

    SEMVER --> STABILITY
    STABILITY --> SECURITY_L
    SECURITY_L --> REVIEW_PROCESS

    style LOCAL fill:#3498db
    style GH_ACTIONS fill:#e74c3c
    style ADR_L fill:#f39c12
    style RENOVATE_L fill:#9b59b6
    style REVIEW_PROCESS fill:#27ae60
```

---

## 🔀 Fastify v5 Migration Decision Tree

```mermaid
graph TD
    START[Fastify v4 + static@6]
    
    Q1{Node 20+<br/>everywhere?}
    Q2{Sprint<br/>allocated?}
    Q3{E2E tests<br/>ready?}
    Q4{Rollback<br/>plan tested?}
    
    PREPARE[Preparation Phase]
    AUDIT[Audit Schemas]
    REFACTOR[Refactor listen calls]
    UPGRADE[Upgrade Dependencies]
    
    TEST_LOCAL[Test Locally]
    TEST_STAGING[Deploy to Staging]
    SOAK[24h Soak Test]
    
    CANARY[Canary Deploy<br/>10% traffic]
    MONITOR[Monitor Metrics]
    
    DECISION{Metrics<br/>healthy?}
    
    ROLLOUT[Full Rollout]
    ROLLBACK[Rollback]
    
    COMPLETE[Migration Complete<br/>Fastify v5 + static@8]
    RETRY[Fix Issues<br/>Retry Later]
    
    START --> Q1
    Q1 -->|No| WAIT1[Wait for Node 20]
    Q1 -->|Yes| Q2
    
    Q2 -->|No| WAIT2[Schedule Sprint]
    Q2 -->|Yes| Q3
    
    Q3 -->|No| BUILD_TESTS[Build E2E Suite]
    Q3 -->|Yes| Q4
    
    Q4 -->|No| PLAN_ROLLBACK[Document Rollback]
    Q4 -->|Yes| PREPARE
    
    PREPARE --> AUDIT
    AUDIT --> REFACTOR
    REFACTOR --> UPGRADE
    
    UPGRADE --> TEST_LOCAL
    TEST_LOCAL --> TEST_STAGING
    TEST_STAGING --> SOAK
    
    SOAK --> CANARY
    CANARY --> MONITOR
    
    MONITOR --> DECISION
    
    DECISION -->|Yes| ROLLOUT
    DECISION -->|No| ROLLBACK
    
    ROLLOUT --> COMPLETE
    ROLLBACK --> RETRY
    
    RETRY --> Q1
    
    WAIT1 --> Q1
    WAIT2 --> Q2
    BUILD_TESTS --> Q3
    PLAN_ROLLBACK --> Q4
    
    style START fill:#3498db
    style COMPLETE fill:#27ae60
    style ROLLBACK fill:#e74c3c
    style CANARY fill:#f39c12
    style DECISION fill:#9b59b6
```

---

## 🔐 Security & Compliance Flow

```mermaid
graph LR
    subgraph "Detection"
        RENOVATE_SEC[Renovate<br/>Security Scan]
        GH_SEC[GitHub<br/>Dependabot]
        NPM_AUDIT[npm audit]
    end

    subgraph "Triage"
        SEVERITY[Assess Severity]
        IMPACT[Analyze Impact]
        PRIORITY[Set Priority]
    end

    subgraph "Response"
        CRITICAL[Critical<br/>Immediate Fix]
        HIGH[High<br/>Next Sprint]
        MEDIUM[Medium<br/>Backlog]
    end

    subgraph "Implementation"
        PATCH[Apply Patch]
        TEST_SEC[Security Test]
        DEPLOY[Deploy Fix]
    end

    subgraph "Verification"
        VERIFY[Verify Fix]
        AUDIT_LOG[Audit Log]
        CLOSE[Close Alert]
    end

    RENOVATE_SEC --> SEVERITY
    GH_SEC --> SEVERITY
    NPM_AUDIT --> SEVERITY

    SEVERITY --> IMPACT
    IMPACT --> PRIORITY

    PRIORITY --> CRITICAL
    PRIORITY --> HIGH
    PRIORITY --> MEDIUM

    CRITICAL --> PATCH
    HIGH --> PATCH
    MEDIUM --> PATCH

    PATCH --> TEST_SEC
    TEST_SEC --> DEPLOY

    DEPLOY --> VERIFY
    VERIFY --> AUDIT_LOG
    AUDIT_LOG --> CLOSE

    style CRITICAL fill:#e74c3c
    style HIGH fill:#f39c12
    style MEDIUM fill:#3498db
    style VERIFY fill:#27ae60
```

---

## 📊 Documentation Ecosystem

```mermaid
graph TB
    subgraph "Entry Points"
        README_E[README.md]
        INDEX_E[docs/INDEX.md]
    end

    subgraph "Architecture"
        ARCH[Architecture Overview]
        ADR_E[ADRs]
        DIAGRAMS[This Document]
    end

    subgraph "Guides"
        LOCAL_WF[Local Workflow]
        SDK_MIG[SDK Migration]
        FASTIFY_GUIDE[Fastify Analysis]
        BRANCH_PROT[Branch Protection]
    end

    subgraph "Reference"
        SCRIPTS_REF[Scripts Reference]
        INFRA[Infrastructure Complete]
        CHANGELOG_E[Changelog]
        CONTRIBUTING_E[Contributing]
    end

    subgraph "Templates"
        ISSUE_T[Issue Templates]
        PR_T[PR Template]
        ADR_T[ADR Template]
    end

    subgraph "Maintenance"
        REVIEW_Q[Quarterly Review]
        UPDATE_D[Update Docs]
        ARCHIVE[Archive Outdated]
    end

    README_E --> INDEX_E
    INDEX_E --> ARCH
    INDEX_E --> GUIDES
    INDEX_E --> REFERENCE

    ARCH --> ADR_E
    ARCH --> DIAGRAMS

    ADR_E --> FASTIFY_GUIDE

    GUIDES --> LOCAL_WF
    GUIDES --> SDK_MIG
    GUIDES --> FASTIFY_GUIDE
    GUIDES --> BRANCH_PROT

    REFERENCE --> SCRIPTS_REF
    REFERENCE --> INFRA
    REFERENCE --> CHANGELOG_E
    REFERENCE --> CONTRIBUTING_E

    ISSUE_T --> ADR_T
    PR_T --> CONTRIBUTING_E

    REVIEW_Q --> UPDATE_D
    UPDATE_D --> ARCHIVE

    style README_E fill:#3498db
    style ADR_E fill:#e74c3c
    style DIAGRAMS fill:#9b59b6
    style REVIEW_Q fill:#f39c12
```

---

## 🎯 Sprint 2 TypeScript Migration Strategy

```mermaid
graph TB
    subgraph "Legacy Codebase"
        LEGACY[~500 TS files<br/>Mixed quality]
        SHIMS[ambient.d.ts<br/>~50 module shims]
    end

    subgraph "Sprint 2 Code"
        NEW_CODE[New Components<br/>Strict TypeScript]
        REFACTORED[Refactored Pages<br/>Type-safe]
    end

    subgraph "Isolation Strategy"
        TSCONFIG_S2[tsconfig.sprint2.json<br/>Include only Sprint 2]
        TSCONFIG_LEGACY[tsconfig.json<br/>Include all + shims]
    end

    subgraph "Quality Gates"
        PRE_COMMIT[Pre-commit<br/>Sprint 2 only]
        PRE_PUSH[Pre-push<br/>Sprint 2 only]
        CI[CI<br/>Sprint 2 only]
    end

    subgraph "Migration Tracking"
        SHIM_COUNT[Count Shims]
        PROGRESS[Calculate %]
        REPORT[CI Summary]
    end

    subgraph "End Goal"
        ZERO_SHIMS[Zero Shims]
        FULL_STRICT[Full Strict Mode]
        MERGE_CONFIGS[Merge Configs]
    end

    LEGACY --> SHIMS
    SHIMS --> TSCONFIG_LEGACY

    NEW_CODE --> TSCONFIG_S2
    REFACTORED --> TSCONFIG_S2

    TSCONFIG_S2 --> PRE_COMMIT
    TSCONFIG_S2 --> PRE_PUSH
    TSCONFIG_S2 --> CI

    CI --> SHIM_COUNT
    SHIM_COUNT --> PROGRESS
    PROGRESS --> REPORT

    REPORT --> DECISION{Shims = 0?}
    DECISION -->|No| CONTINUE[Continue Migration]
    DECISION -->|Yes| ZERO_SHIMS

    CONTINUE --> NEW_CODE
    CONTINUE --> REFACTORED

    ZERO_SHIMS --> FULL_STRICT
    FULL_STRICT --> MERGE_CONFIGS

    style NEW_CODE fill:#27ae60
    style TSCONFIG_S2 fill:#3498db
    style CI fill:#e74c3c
    style ZERO_SHIMS fill:#f39c12
    style MERGE_CONFIGS fill:#9b59b6
```

---

## 🔄 Continuous Improvement Cycle

```mermaid
graph LR
    subgraph "Measure"
        METRICS[Collect Metrics]
        FEEDBACK[Developer Feedback]
        INCIDENTS[Track Incidents]
    end

    subgraph "Analyze"
        PATTERNS[Identify Patterns]
        BOTTLENECKS[Find Bottlenecks]
        OPPORTUNITIES[Spot Opportunities]
    end

    subgraph "Plan"
        ADR_PLAN[Create ADR if needed]
        ISSUE_PLAN[Create GitHub Issue]
        PRIORITIZE[Prioritize Work]
    end

    subgraph "Implement"
        CODE_IMPL[Implement Change]
        TEST_IMPL[Test Thoroughly]
        DOCUMENT[Update Docs]
    end

    subgraph "Deploy"
        STAGE_DEPLOY[Deploy to Staging]
        PROD_DEPLOY[Deploy to Prod]
        MONITOR_DEPLOY[Monitor Impact]
    end

    subgraph "Review"
        RETRO[Retrospective]
        LESSONS[Document Lessons]
        ITERATE[Plan Next Iteration]
    end

    METRICS --> PATTERNS
    FEEDBACK --> PATTERNS
    INCIDENTS --> PATTERNS

    PATTERNS --> BOTTLENECKS
    BOTTLENECKS --> OPPORTUNITIES

    OPPORTUNITIES --> ADR_PLAN
    ADR_PLAN --> ISSUE_PLAN
    ISSUE_PLAN --> PRIORITIZE

    PRIORITIZE --> CODE_IMPL
    CODE_IMPL --> TEST_IMPL
    TEST_IMPL --> DOCUMENT

    DOCUMENT --> STAGE_DEPLOY
    STAGE_DEPLOY --> PROD_DEPLOY
    PROD_DEPLOY --> MONITOR_DEPLOY

    MONITOR_DEPLOY --> RETRO
    RETRO --> LESSONS
    LESSONS --> ITERATE

    ITERATE --> METRICS

    style PATTERNS fill:#3498db
    style ADR_PLAN fill:#e74c3c
    style DOCUMENT fill:#f39c12
    style MONITOR_DEPLOY fill:#9b59b6
    style ITERATE fill:#27ae60
```

---

## 📈 Maturity Model

```mermaid
graph LR
    subgraph "Level 1: Ad Hoc"
        L1_DEP[Manual dependency updates]
        L1_DOCS[Scattered documentation]
        L1_DEBT[Implicit tech debt]
    end

    subgraph "Level 2: Managed"
        L2_DEP[Grouped dependency PRs]
        L2_DOCS[Indexed documentation]
        L2_DEBT[TODOs with owners]
    end

    subgraph "Level 3: Defined"
        L3_DEP[Automated Renovate]
        L3_DOCS[Cross-linked guides]
        L3_DEBT[ADRs with review dates]
    end

    subgraph "Level 4: Measured"
        L4_DEP[Stability gates]
        L4_DOCS[CI-enforced quality]
        L4_DEBT[Migration tracking]
    end

    subgraph "Level 5: Optimized"
        L5_DEP[Auto-merge safe updates]
        L5_DOCS[Living architecture]
        L5_DEBT[Proactive refactoring]
    end

    L1_DEP --> L2_DEP
    L2_DEP --> L3_DEP
    L3_DEP --> L4_DEP
    L4_DEP --> L5_DEP

    L1_DOCS --> L2_DOCS
    L2_DOCS --> L3_DOCS
    L3_DOCS --> L4_DOCS
    L4_DOCS --> L5_DOCS

    L1_DEBT --> L2_DEBT
    L2_DEBT --> L3_DEBT
    L3_DEBT --> L4_DEBT
    L4_DEBT --> L5_DEBT

    style L1_DEP fill:#e74c3c
    style L2_DEP fill:#f39c12
    style L3_DEP fill:#f1c40f
    style L4_DEP fill:#2ecc71
    style L5_DEP fill:#27ae60

    style L5_DOCS fill:#27ae60
    style L5_DEBT fill:#27ae60
```

**Current State**: Level 4 (Measured) → Level 5 (Optimized)

---

## 🎓 How to Use These Diagrams

### For Onboarding

- Start with **Infrastructure Layers** to understand the stack
- Review **CI/CD Pipeline** to see quality gates
- Study **Documentation Ecosystem** to navigate docs

### For Architecture Reviews

- Reference **Dependency Management Flow** for update strategy
- Use **ADR Flow** when making decisions
- Consult **Fastify v5 Migration Decision Tree** for planning

### For Troubleshooting

- Check **Security & Compliance Flow** for vulnerability response
- Review **Sprint 2 TypeScript Migration** for type errors
- Follow **Continuous Improvement Cycle** for systemic issues

### For Presentations

- **Maturity Model** shows progress over time
- **Infrastructure Layers** explains the system holistically
- **Dependency Management Flow** demonstrates automation

---

## 📚 Related Documentation

- [Infrastructure Hardening Complete](../INFRASTRUCTURE_HARDENING_COMPLETE.md)
- [Fastify Dependency Analysis](./FASTIFY_DEPENDENCY_ANALYSIS.md)
- [ADR Index](./adr/README.md)
- [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)

---

**Last Updated**: October 24, 2025  
**Maintained By**: Engineering Team  
**Diagrams**: Mermaid (GitHub-native rendering)
