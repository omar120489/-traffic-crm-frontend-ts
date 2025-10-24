// .markdownlint-cli2.cjs
// Focused markdownlint config: skip vendors/artifacts, pragmatic rules

module.exports = {
  // Only lint our sources/docs; skip vendors/artifacts & legacy completion docs
  globs: [
    "**/*.md",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/build/**",
    "!**/.git/**",
    "!**/.project_audit/**",
    "!docs/archive/**",
    "!apps/frontend/docs/archive/**",
    "!apps/frontend/docs/planning/**",
    "!apps/frontend/docs/reference/**",
    "!apps/frontend/docs/guides/**",
    "!.github/ISSUE_TEMPLATE/**",
    "!*_COMPLETE*.md",
    "!SYNC_*.md",
    "!FIXES_*.md",
    "!ENTERPRISE_*.md",
    "!EXAMPLES_*.md",
    "!SPRINT_*.md",
    "!REFACTOR_*.md",
    "!SETUP_*.md",
    "!HANDOFF.md",
    "!WORKFLOW_SCRIPTS.md",
    "!UI_KIT_EXAMPLES.md"
  ],
  // Rule tweaks: keep style strict but pragmatic
  config: {
    "default": true,
    "MD013": false,             // line length (let Prettier handle it)
    "MD024": false,             // duplicate headings (OK in long docs)
    "MD025": false,             // multiple h1 (OK in planning docs)
    "MD026": false,             // trailing punctuation in headings
    "MD029": false,             // ordered list prefix style
    "MD031": false,             // fenced code spacing
    "MD032": false,             // list spacing
    "MD036": false,             // emphasis-as-heading (common in callouts)
    "MD040": false,             // fenced code language (nice-to-have)
    "MD041": false,             // first line heading (README exceptions)
    "MD051": false,             // TOC link fragments (false positives)
    "MD012": false,             // multiple blank lines (stylistic)
    "MD022": false,             // heading spacing (auto-fixable)
  }
};

