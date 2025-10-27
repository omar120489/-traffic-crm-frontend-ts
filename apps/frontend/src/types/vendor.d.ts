// Ambient module declarations for untyped/third-party modules or local virtual modules
// Prefer installing @types/* from DefinitelyTyped when available. These are temporary shims.

// MUI v7 type augmentation - provides namespace compatibility for theme overrides
// In MUI v7, Theme, Components, and SxProps are types, not namespaces
// This augmentation allows the old `Components['MuiButton']` syntax to work

// If specific ESM-only packages are missing types, declare them explicitly, e.g.:
// declare module 'some-esm-only-package';

// Declarations for locally referenced CSS modules or other virtual modules can go here as needed.
// declare module '*.css';
// declare module '*.svg' {
//   const content: any;
//   export default content;
// }

// ============================================================================
// Phase 1: Boot Path Declarations (P0 Critical)
// ============================================================================
// These declarations provide type coverage for internal modules during the
// migration to full TypeScript. Remove as modules are converted to .ts/.tsx.

// UI Components (layout, routes, pages)
declare module 'ui-component/*' {
  const defaultExport: any;
  export default defaultExport;
}

declare module 'layout/*' {
  const defaultExport: any;
  export default defaultExport;
}

declare module 'layouts/*' {
  const defaultExport: any;
  export default defaultExport;
}

declare module 'menu-items' {
  const defaultExport: any;
  export default defaultExport;
}

declare module 'menu-items/*' {
  const defaultExport: any;
  export default defaultExport;
}

// Utilities and helpers
declare module 'utils/*' {
  const defaultExport: any;
  export default defaultExport;
}

declare module 'store/*' {
  const defaultExport: any;
  export default defaultExport;
}

// Constants
declare module 'constants/*' {
  const defaultExport: any;
  export default defaultExport;
}

declare module '*.jsx' {
  const component: any;
  export default component;
}

// Services
declare module 'services/*' {
  const defaultExport: any;
  export default defaultExport;
}

// Types
declare module 'types/*' {
  const defaultExport: any;
  export default defaultExport;
}

// Views and pages
declare module 'views/*' {
  const defaultExport: any;
  export default defaultExport;
}

declare module 'pages/*' {
  const defaultExport: any;
  export default defaultExport;
}

// Assets
declare module 'assets/*' {
  const defaultExport: any;
  export default defaultExport;
}

// Contexts (will be refined with proper types)
declare module 'contexts/*' {
  const defaultExport: any;
  export default defaultExport;
}
