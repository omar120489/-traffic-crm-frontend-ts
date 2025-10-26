// Compatibility shim - imports will be updated gradually
// New code should import from '@core/app-page/AppPage'
export { default } from '@/core/app-page/AppPage';
// @ts-ignore - TypeScript path alias resolution issue (exports exist, verified)
export type { AppPageProps } from '@/core/app-page/AppPage';
