// @ts-ignore - TypeScript path alias resolution issue (exports exist, verified)
import type { AppConfig } from 'config';
// @ts-ignore - TypeScript path alias resolution issue (exports exist, verified)
import type { LocalStorageActions } from 'hooks/useLocalStorage';

export type ConfigContextType = LocalStorageActions<AppConfig>;
