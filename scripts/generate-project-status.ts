import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type StatusRow = {
  area: string;
  description: string;
  status: string;
};

type Phase = {
  title: string;
  subtitle: string;
  rows: StatusRow[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const snapshotDate = new Date().toISOString().split('T')[0];

const phases: Phase[] = [
  {
    title: 'Phase 1: Infrastructure, Setup & Cleanup',
    subtitle: '✅ Completed',
    rows: [
      {
        area: 'Repo Cleanup',
        description: 'Removed deprecated api-dev, redundant packages (tsconfig, eslint-config), and empty infra directories',
        status: '✅ Done'
      },
      {
        area: 'Docs Consolidation',
        description: 'Unified Markdown docs into root `README.md` plus archive',
        status: '✅ Done'
      },
      {
        area: 'Asset Management',
        description: 'Completed deep analysis, cleanup plan, optimization, and branding migration (`ASSETS_DEEP_ANALYSIS.md`)',
        status: '✅ Done'
      },
      {
        area: '.hintrc Configuration',
        description: 'Added rule overrides to silence false-positive `no-inline-styles`',
        status: '✅ Done'
      },
      {
        area: 'Frontend Structure Audit',
        description: 'Snapshot of directory tree and dependencies (`docs/FRONTEND_STRUCTURE.md`)',
        status: '✅ Done'
      },
      {
        area: 'Core API Audit',
        description: 'Verified NestJS + Prisma + Docker architecture (DB, Redis, MailHog)',
        status: '✅ Done'
      },
      {
        area: 'Multi-App Structure',
        description: 'Confirmed layout: Frontend, Core API, Workers, Reporting',
        status: '✅ Done'
      },
      {
        area: 'Docker & Compose',
        description: 'Multi-service stack validated (frontend, api, db, redis, mailhog, minio)',
        status: '✅ Done'
      },
      {
        area: 'Scripts Directory',
        description: 'Centralised and validated shell scripts (build, deploy, test)',
        status: '✅ Done'
      },
      {
        area: 'Lint & Type Safety',
        description: 'ESLint + TypeScript rules updated for TS7 compatibility',
        status: '✅ Done'
      },
      {
        area: 'Testing Infrastructure',
        description: 'Playwright, Vitest, and smoke tests wired into CI',
        status: '✅ Done'
      },
      {
        area: 'CI/CD Pipeline',
        description: 'GitHub Actions configured: lint → typecheck → test → build → release',
        status: '✅ Done'
      }
    ]
  },
  {
    title: 'Phase 2: Frontend Modernization',
    subtitle: '⚙ In Progress',
    rows: [
      {
        area: 'Pages Migration',
        description: 'Converting legacy Berry templates to React + MUI v5 hooks',
        status: '80% ✅'
      },
      {
        area: 'Contacts / Companies / Deals / Analytics',
        description: 'Modernised with TypeScript, hooks, filters, error boundaries',
        status: '✅ Done'
      },
      {
        area: 'Settings (Pipelines)',
        description: 'Functional; minor cleanup on `useCallback` and typing required',
        status: '⚙ Minor Fix'
      },
      {
        area: 'Leads Pages',
        description: 'Partially legacy; refactor to hook-based CRUD',
        status: '🔜 Pending'
      },
      {
        area: 'Auth Pages',
        description: 'Login converted; register/reset flows pending',
        status: '🔜 Pending'
      },
      {
        area: 'Notifications / PnL Analytics',
        description: '`PnLAnalyticsNew.tsx` replacing legacy components',
        status: '⚙ Partial'
      },
      {
        area: 'Assets',
        description: 'Optimised and rebranded to “Traffic CRM”',
        status: '✅ Done'
      },
      {
        area: 'Theme / MUI Upgrade',
        description: 'Migrating to MUI 7, resolving Grid v2 warnings',
        status: '⚙ In Progress'
      },
      {
        area: 'URL-based State Management',
        description: 'React Router + search params implemented',
        status: '✅ Done'
      },
      {
        area: 'Global Contexts',
        description: 'Auth/Toast/Notifications contexts hardened with JWT hydration',
        status: '✅ Done'
      },
      {
        area: 'Error Boundaries & Loading',
        description: 'Implemented across modern modules',
        status: '✅ Done'
      }
    ]
  },
  {
    title: 'Phase 3: Backend Refinement',
    subtitle: '⚙ In Progress',
    rows: [
      {
        area: 'Core API (NestJS)',
        description: 'Stable Fastify + Prisma service',
        status: '✅ Done'
      },
      {
        area: 'Prisma Schema Audit',
        description: '13 models; migrations verified',
        status: '✅ Done'
      },
      {
        area: 'Workers',
        description: 'BullMQ queues defined but minimal business logic',
        status: '⚙ Partial'
      },
      {
        area: 'Reporting Service',
        description: '~75 MB NestJS 11 app; purpose pending clarification',
        status: '🔜 Review'
      },
      {
        area: 'Env & Config',
        description: '`.env.example` updated per service',
        status: '✅ Done'
      },
      {
        area: 'SDK-js Package',
        description: 'Generated via OpenAPI and published',
        status: '✅ Done'
      },
      {
        area: 'Security Audit',
        description: 'Default credentials still present; rotate secrets',
        status: '⚠️ Pending'
      },
      {
        area: 'Backup / Persistence',
        description: 'Redis persistence & DB snapshots not automated',
        status: '🔜 To Do'
      },
      {
        area: 'Monitoring / Logging',
        description: 'Winston + Prisma logging enabled',
        status: '✅ Done'
      },
      {
        area: 'API Docs',
        description: 'Swagger emitted at `/docs`',
        status: '✅ Done'
      }
    ]
  },
  {
    title: 'Phase 4: Testing & QA',
    subtitle: '⚙ In Progress',
    rows: [
      {
        area: 'Unit Tests (Vitest)',
        description: '~60 % coverage; target ≥ 80 %',
        status: '⚙ Ongoing'
      },
      {
        area: 'E2E Tests (Playwright)',
        description: 'Smoke tests for login, dashboard, contacts',
        status: '✅ Done'
      },
      {
        area: 'Integration Tests (API)',
        description: 'Planned for core endpoints',
        status: '🔜 Pending'
      },
      {
        area: 'Performance Testing',
        description: 'Bundle analysis + Lighthouse targets outlined',
        status: '⚙ Partial'
      },
      {
        area: 'Static Analysis',
        description: 'ESLint + Webhint configured',
        status: '✅ Done'
      },
      {
        area: 'Type Safety',
        description: 'TS errors cleared; TS7 migration still underway',
        status: '⚙ Partial'
      }
    ]
  },
  {
    title: 'Phase 5: DevOps & CI/CD',
    subtitle: '⚙ In Progress',
    rows: [
      {
        area: 'Docker Compose',
        description: '5-service stack (frontend, api, db, redis, mailhog, minio)',
        status: '✅ Done'
      },
      {
        area: 'Production Dockerfiles',
        description: 'Multi-stage builds hardened (non-root nginx)',
        status: '✅ Done'
      },
      {
        area: 'CI Workflow',
        description: 'Lint → typecheck → unit → e2e → build → release',
        status: '✅ Done'
      },
      {
        area: 'Release Automation',
        description: '`release-please` handles versioning/changelog',
        status: '✅ Done'
      },
      {
        area: 'Bundle Size Check',
        description: 'Optional workflow not yet enabled',
        status: '🔜 Pending'
      },
      {
        area: 'Monitoring (Optional)',
        description: 'Recommend Lighthouse CI / Web Vitals / Sentry',
        status: '⚙ Optional'
      },
      {
        area: 'K8s / Nginx Directories',
        description: 'Currently empty; populate or remove',
        status: '⚠️ Pending Decision'
      }
    ]
  }
];

const documentationSummary: { doc: string; purpose: string }[] = [
  { doc: '`README.md`', purpose: 'Comprehensive root documentation' },
  { doc: '`PROJECT_STATUS_OVERVIEW.md`', purpose: '(This file) sprint-level status ledger' },
  { doc: '`docs/FRONTEND_STRUCTURE.md`', purpose: 'Detailed frontend directory tree' },
  { doc: '`ASSETS_DEEP_ANALYSIS.md`', purpose: 'Asset optimisation & branding plan' },
  { doc: '`DOCUMENTATION_CONSOLIDATION_SUMMARY.md`', purpose: 'Record of doc cleanup work' },
  { doc: '`ASSETS_CLEANUP_QA.md`', purpose: 'Visual regression QA checklist' },
  { doc: '`ASSETS_CLEANUP_QUICKSTART.md`', purpose: 'Reviewer & merge guide for asset work' },
  { doc: '`Traffic_CRM_Security_Compliance_Bundle_2025-10-25.html`', purpose: 'Security compliance reference' }
];

const remainingWork: StatusRow[] = [
  { area: 'Docker Daemon / Permissions', description: 'Resolve local `docker info` permission denied to enable quick-start script', status: '🔴 Critical' },
  { area: 'Leads Page Migration', description: 'Convert remaining views to hooks + SDK', status: '🔶 High' },
  { area: 'Auth Module Completion', description: 'Modernise register/reset flows', status: '🔶 High' },
  { area: 'API Security', description: 'Rotate credentials; configure secrets in CI', status: '🔶 High' },
  { area: 'Redis Persistence', description: 'Add volume + snapshot strategy', status: '🔶 High' },
  { area: 'Workers Implementation', description: 'Flesh out lead-scoring & enrichment jobs', status: '🟡 Medium' },
  { area: 'Reporting Service', description: 'Clarify purpose or remove from workspace', status: '🟡 Medium' },
  { area: 'MUI v7 Migration', description: 'Fix Grid v2 prop warnings', status: '🟡 Medium' },
  { area: 'Bundle Size Workflow', description: 'Add automated size regression check', status: '🟢 Optional' },
  { area: 'Monitoring', description: 'Integrate Lighthouse CI / Web Vitals / Sentry', status: '🟢 Optional' },
  { area: 'Wiki / Docs Split', description: 'Decide on wiki vs multi-README structure', status: '🟢 Optional' }
];

const metrics: { metric: string; value: string }[] = [
  { metric: 'Frontend LOC', value: '~44,700' },
  { metric: 'Frontend Build Size', value: '~99 MB' },
  { metric: 'Core API Bundle', value: '~1.3 MB' },
  { metric: 'Repo Size (post-cleanup)', value: '~100 MB' },
  { metric: 'Frontend Test Coverage', value: '~60 %' },
  { metric: 'Lint Errors', value: '0' },
  { metric: 'TypeScript Errors', value: '0 (post-migration)' },
  { metric: 'Documentation Coverage', value: '100 %' }
];

const nextActionsChecklist: string[] = [
  '🐳 Start Docker Desktop and rerun `bash scripts/quick-start.sh`',
  '🔧 Update `apps/core-api/tsconfig.json` `moduleResolution` to `"Bundler"`',
  '🔄 Finish Leads + Auth page refactors',
  '🧪 Add API integration tests for contacts, deals, P&L',
  '📦 Enable Redis persistence and rotate secrets',
  '🚀 Smoke test CI/CD release pipeline end-to-end',
  '🧭 Decide on wiki vs multi-README documentation layout'
];

function renderTable(rows: StatusRow[]): string {
  const header = '| Area | Description | Status |\n| --- | --- | --- |';
  const body = rows.map((row) => `| ${row.area} | ${row.description} | ${row.status} |`).join('\n');
  return `${header}\n${body}`;
}

function renderSimpleTable(rows: { doc: string; purpose: string }[]): string {
  const header = '| Document | Purpose |\n| --- | --- |';
  const body = rows.map((row) => `| ${row.doc} | ${row.purpose} |`).join('\n');
  return `${header}\n${body}`;
}

function renderMetricsTable(): string {
  const header = '| Metric | Value |\n| --- | --- |';
  const body = metrics.map((row) => `| ${row.metric} | ${row.value} |`).join('\n');
  return `${header}\n${body}`;
}

function renderChecklist(items: string[]): string {
  return items.map((item) => `- [ ] ${item}`).join('\n');
}

const markdownSections = phases
  .map(
    (phase) =>
      `## ${phase.title} — ${phase.subtitle}\n\n${renderTable(phase.rows)}`
  )
  .join('\n\n---\n\n');

const content = `# Traffic CRM – Development Status Overview

> Snapshot generated on ${snapshotDate}. Update after each major milestone or sprint review.

---

${markdownSections}

---

## 📚 Documentation Summary — ✅ Complete

${renderSimpleTable(documentationSummary)}

---

## 🔜 Remaining Work (Final Development Phase)

${renderTable(remainingWork)}

---

## 📈 Current Metrics

${renderMetricsTable()}

---

## 🧾 Next Actions Checklist

${renderChecklist(nextActionsChecklist)}

---

**Maintenance tip:** Revisit this ledger at the close of each sprint. Move items from “Remaining Work” into the phase tables once they reach ✅, and archive completed milestones to keep the overview concise.
`;

async function main() {
  const outputPath = path.join(projectRoot, 'PROJECT_STATUS_OVERVIEW.md');
  await writeFile(outputPath, content, 'utf8');
  console.log(`PROJECT_STATUS_OVERVIEW.md updated (${snapshotDate})`);
}

void main();
