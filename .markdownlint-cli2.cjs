// .markdownlint-cli2.cjs
// Focused markdownlint config: skip vendors/artifacts, pragmatic rules

module.exports = {
  // Only lint our sources/docs; skip vendors/artifacts
  globs: [
    "**/*.md",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/build/**",
    "!**/.git/**",
    "!**/.project_audit/**",
    "!docs/archive/**"
  ],
  // Rule tweaks: keep style strict but pragmatic
  config: {
    "default": true,
    "MD013": false,             // line length (let Prettier handle it)
    "MD036": false,             // emphasis-as-heading (common in callouts)
    "MD041": false,             // first line heading (README exceptions)
    "MD051": { "level": 2 },    // TOC link fragments: warn, not fail
  }
};

