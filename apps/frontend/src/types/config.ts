// TODO: Fix TypeScript path alias resolution - tracking issue
import type { AppConfig } from 'config';
// TODO: Fix TypeScript path alias resolution - tracking issue
import type { LocalStorageActions } from 'hooks/useLocalStorage';

export type ConfigContextType = LocalStorageActions<AppConfig>;
