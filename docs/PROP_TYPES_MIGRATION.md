# PropTypes → TypeScript Migration Playbook

This guide captures the process, tooling, and conventions for removing runtime `PropTypes` usage from the Traffic CRM frontend and replacing it with static TypeScript typings.

---

## 📌 Why We’re Migrating

- **Type safety:** rely on compile-time checks instead of runtime assertions.
- **Runtime performance:** avoid shipping `prop-types` to production bundles.
- **Consistency:** align with the repository-wide TypeScript-first policy.
- **DX:** enforce a single source of truth for component APIs (TypeScript interfaces / types).

---

## 🧮 Baseline & Progress Tracking

We maintain a repeatable audit via `scripts/audit-proptypes.sh`. It scans the codebase, produces a CSV-style report, and prints migration metrics.

```bash
# One-time permissions
chmod +x scripts/audit-proptypes.sh

# Run the audit (default root/output shown)
./scripts/audit-proptypes.sh apps/frontend/src ./proptypes-audit.txt
```

Example output (from `./proptypes-audit.txt`):

```
File|Line|Match
apps/frontend/src/layout/MainLayout/Header/MegaMenuSection/index.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/layout/MainLayout/Header/MegaMenuSection/index.jsx|238|HeaderAvatar.propTypes = {
apps/frontend/src/layout/MainLayout/Sidebar/MenuCard/index.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/layout/MainLayout/Sidebar/MenuCard/index.jsx|132|LinearProgressWithLabel.propTypes = { value| PropTypes.number, others| PropTypes.any };
apps/frontend/src/layout/NavMotion.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/layout/NavMotion.jsx|43|NavMotion.propTypes = { children| PropTypes.node };
apps/frontend/src/layout/MainLayout/HorizontalBar.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/layout/MainLayout/HorizontalBar.jsx|70|ElevationScroll.propTypes = { children| PropTypes.node, window| PropTypes.any };
apps/frontend/src/layout/MainLayout/Header/SearchSection/index.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/layout/MainLayout/Header/SearchSection/index.jsx|187|HeaderAvatar.propTypes = { children| PropTypes.node, ref| PropTypes.any, others| PropTypes.any };
apps/frontend/src/layout/MainLayout/Header/SearchSection/index.jsx|189|MobileSearch.propTypes = {
apps/frontend/src/views/pages/authentication/jwt/AuthForgotPassword.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/views/pages/authentication/jwt/AuthForgotPassword.jsx|145|AuthForgotPassword.propTypes = { link| PropTypes.string };
apps/frontend/src/views/pages/maintenance/ComingSoon/ComingSoon1/Slider.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/views/pages/maintenance/ComingSoon/ComingSoon1/Slider.jsx|63|Item.propTypes = { item| PropTypes.object };
apps/frontend/src/views/pages/maintenance/ComingSoon/ComingSoon1/Slider.jsx|65|ComingSoonSlider.propTypes = { handleClickOpen| PropTypes.func };
apps/frontend/src/views/pages/authentication/jwt/AuthResetPassword.jsx|1|import PropTypes from 'prop-types';
apps/frontend/src/views/pages/authentication/jwt/AuthResetPassword.jsx|238|AuthResetPassword.propTypes = { link| PropTypes.string };
```

The script also prints progress metrics to STDOUT:

```
Files total: 364
Files with PropTypes: 8
Migration completion: 97%
```

Run this before/after each cleanup batch to quantify progress.

---

## 🛠️ Tooling

- `scripts/audit-proptypes.sh` — scans for imports/assignments; writes audit file and summary stats.
- `scripts/remove-proptypes-legacy.sh` — displays targets and (optionally) auto-removes boilerplate PropTypes syntax.

Usage:

```bash
chmod +x scripts/remove-proptypes-legacy.sh

# Dry-run (no writes)
./scripts/remove-proptypes-legacy.sh apps/frontend/src true

# Apply removals (simple cases only!)
./scripts/remove-proptypes-legacy.sh apps/frontend/src false
```

> ⚠️ `remove-proptypes-legacy.sh` removes straightforward `import PropTypes …` lines and `.propTypes = { … }` assignments. It will **not** convert complex runtime validators. Always review git diffs and add TypeScript typings afterward.

---

## 🔄 Migration Workflow

1. **Pick a batch**  
   Organize by folder and complexity (e.g., `views/pages/authentication/**` first).

2. **Convert file-by-file**
   - Rename `.jsx` → `.tsx` when touching files.
   - Replace PropTypes with TypeScript types:

     ```tsx
     type AuthResetPasswordProps = {
       link?: string;
     };

     export default function AuthResetPassword({ link }: AuthResetPasswordProps) {
       // …
     }
     ```

   - For shared components, prefer `type` aliases for props; `interface` is OK if extending.
   - Remove `PropTypes` import and `.propTypes` assignment (script can help).

3. **Run validations**

   ```bash
   pnpm --filter ./apps/frontend lint
   pnpm --filter ./apps/frontend typecheck
   pnpm --filter ./apps/frontend test:unit -- --runInBand
   ```

4. **Audit the remainder**

   ```bash
   ./scripts/audit-proptypes.sh apps/frontend/src ./proptypes-audit.txt
   ```

   Capture the new “Files with PropTypes” count in your PR description for traceability.

5. **Commit with a consistent prefix**

   ```
   migrate: PropTypes → TS (authentication pages)
   ```

---

## 🗂️ Batching Strategy

Recommended order (adjust as needed):

1. `apps/frontend/src/layout/**` (global wrappers & header components)
2. `apps/frontend/src/views/pages/authentication/**`
3. `apps/frontend/src/views/pages/maintenance/**`
4. Remaining `views/pages/**` legacy Berry components
5. Shared utilities under `ui-component/**`

Track completion in each PR by attaching the audit summary.

- **Automation helpers**
  - `scripts/plan-proptypes-batches.sh proptypes-audit.txt` — builds `scripts/batches/plan-by-folder.txt`, `remaining.csv`, and initial batch file lists (`batch-1-files.txt`, `batch-2-files.txt`).
  - `scripts/run-proptypes-batch.sh ./scripts/batches/batch-1-files.txt batch-1` — runs the legacy removal script against the listed files, executes lint/typecheck/tests, re-audits, and commits with a standardized message (`migrate(prop-types): batch-1 — remaining=N`).

---

## ✅ ESLint & Configuration Notes

- Ensure `react/prop-types` rule stays disabled (already off in `eslint.config.mjs`).  
- Prefer TypeScript generics when wrapping components (e.g., `React.FC<Props>` or `React.ComponentType<Props>`).
- If you touch old files with `// @ts-nocheck`, remove the directive and add minimal typings instead.

---

## 📈 Metrics & Reporting

- The audit script can be wired into CI to post summary metrics (GitHub job summary or Slack).
- Optionally, store historical outputs to track velocity (e.g., commit `proptypes-audit.txt` snapshots per sprint).

---

## 📚 Additional References

- [React PropTypes → TypeScript cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/docblock/)
- [`ts-migrate` `react-prop-types` plugin](https://github.com/airbnb/ts-migrate) for bulk conversions (requires manual review).
- Internal scripts: `scripts/audit-proptypes.sh`, `scripts/remove-proptypes-legacy.sh`

---

## 🚀 Future Enhancements

- Integrate audit script into CI to prevent regressions (fail if new PropTypes appear).
- Add lint rule to flag `prop-types` imports (`no-restricted-imports`).
- Publish a status badge (e.g., GitHub Pages) showing migration completion %.

---

Keep this document updated whenever the tooling changes or new guidelines are introduced. The goal is to make PropTypes removal a predictable, low-friction chore that anyone on the team can execute confidently.
