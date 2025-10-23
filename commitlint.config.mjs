export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only
        'style',    // Code style (formatting, whitespace)
        'refactor', // Code refactoring
        'perf',     // Performance improvement
        'test',     // Adding or updating tests
        'chore',    // Maintenance, tooling, dependencies
        'ci',       // CI/CD changes
        'revert',   // Revert a previous commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'frontend',
        'core-api',
        'workers',
        'reporting',
        'sdk',
        'shared-types',
        'contacts',
        'leads',
        'deals',
        'companies',
        'auth',
        'deps',
        'config',
        'docs',
        'ci',
      ],
    ],
    'scope-empty': [0], // Allow empty scope
    'subject-case': [0], // Allow any case for subject
  },
};

