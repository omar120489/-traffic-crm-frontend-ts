# Project Checkup Report

Generated: 2025-10-23 00:23:42 UTC
Root: /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

---

## Git Status

```bash
## chore/vite-berry-cleanup-20251023-000400
 D BERRY_FRAME_MASTER_PLAN.md
 D BERRY_FRAME_PROGRESS.md
 D CLEANUP_READY.md
 D CONTRIBUTING.md
 D EXECUTE_CLEANUP.md
 D NEXT_MILESTONES.md
 D PAGE_ARCHITECTURE_PLAN.md
 D PROJECT_ANALYSIS_FULL.md
 D PROJECT_STATUS.md
 D QUICK_MIGRATION_GUIDE.md
 D QUICK_START_CLEANUP.md
 D VALIDATION_CHECKLIST.md
 D VITE_BERRY_STANDARDIZATION.md
 M src/menu-items/pages.js
 M src/routes/MainRoutes.tsx
?? .project_checkup/
?? backup_src_20251023-000400/
?? berry-v3.9.0.fig
?? chat-module-pack-v1/
?? docs/README.md
?? docs/guides/
?? docs/planning/
?? docs/reference/
?? docs_and_support-rwulxu/
?? "javascript_v5.0.0-eaoys0 (2)/"
?? "javascript_v5.0.0-eaoys0 (3)/"
?? scripts/audit_imports.ts
?? scripts/audit_project.sh
?? scripts/audit_routes.ts
?? src/features/
?? src/views/apps/
?? "typescript_v5.0.0-nq4ghb (2)/"
?? "typescript_v5.0.0-nq4ghb (3)/"
```

## Branches & Remotes

```bash
chore/vite-berry-cleanup-20251023-000400
origin	https://github.com/omar120489/servers.git (fetch)
origin	https://github.com/omar120489/servers.git (push)
upstream	https://github.com/modelcontextprotocol/servers.git (fetch)
upstream	https://github.com/modelcontextprotocol/servers.git (push)
8621a6b chore: complete Vite Berry cleanup and add comprehensive project analysis
de73a31 docs: add final execution guide for Vite Berry cleanup
01c68ae chore: add Vite Berry cleanup automation and standards
08600cf fix: resolve linter errors and improve code quality
e459eaa feat: Implement Berry Frame architecture with AppPage component
568ba58 chore(docs): archive migration docs, add .env.example, ignore Playwright artifacts, add CI guard
cf67db7 chore: sync repository state
789e7d7 feat: Complete micro-frontend architecture with production-ready setup
41dfb9a docs: align README status/labels, CRA note, and test wording; normalize best practices formatting - README: Ready for Development status, Deals (Table), CRA maintenance autolink, E2E wording - best_practices: straight apostrophes, backticks for code-ish tokens, 'Dos and Don'ts', provider formatting - markdownlint: add MD022/MD031/MD038 for spacing and backtick hygiene
a41eeef Add comprehensive project best practices documentation
```

## Package Manager & Scripts

Detected package manager:
- pnpm
- yarn
- npm

**package.json scripts:**
{
  "start": "vite",
  "build": "vite build",
  "build:staging": "env-cmd -f .env.qa vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\"",
  "lint:ts": "eslint \"src/**/*.{ts,tsx}\"",
  "lint:fix": "eslint --fix \"src/**/*.{js,jsx,ts,tsx}\"",
  "prettier": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
  "test:e2e": "playwright test",
  "test:smoke": "playwright test e2e/leads-deals-detail.spec.ts",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:unit": "vitest run",
  "e2e:ui": "playwright test --ui",
  "smoke": "./smoke_test.sh",
  "dev:backend": "cd dev-backend && node server.js",
  "dev:reporting": "cd traffic-crm-backend-reporting && npm run start:dev",
  "dev:services": "docker-compose up -d mailhog minio",
  "dev:all": "./scripts/check-ports.sh && npm run dev:services && npm run dev:backend & npm run dev:reporting & npm start",
  "check:ports": "source .env 2>/dev/null || true && ./scripts/check-ports.sh"
}

## TypeScript Check

```bash
src/contexts/jwt-helpers.test.ts(1,10): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/contexts/jwt-helpers.test.ts(1,44): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/contexts/jwt-helpers.test.ts(62,20): error TS2339: Property 'toMatchObject' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(71,20): error TS2339: Property 'toMatchObject' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(79,20): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(80,24): error TS2339: Property 'toHaveBeenCalled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(96,32): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(103,32): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(111,32): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(117,32): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(125,61): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(126,65): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(135,61): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/jwt-helpers.test.ts(136,65): error TS2339: Property 'toBeUndefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(5,10): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/contexts/JWTContext.test.tsx(5,44): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/contexts/JWTContext.test.tsx(9,1): error TS6133: 'React' is declared but its value is never read.
src/contexts/JWTContext.test.tsx(115,26): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(121,22): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(122,61): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(123,65): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(126,30): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(134,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(135,29): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(136,61): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/contexts/JWTContext.test.tsx(137,65): error TS2339: Property 'toBeUndefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/features/api.ts(2,40): error TS2307: Cannot find module './types' or its corresponding type declarations.
src/features/chat/components/MessageItem.tsx(1,1): error TS6133: 'React' is declared but its value is never read.
src/features/chat/components/RoomsList.tsx(1,1): error TS6133: 'React' is declared but its value is never read.
src/features/chat/components/RoomView.tsx(1,1): error TS6133: 'React' is declared but its value is never read.
src/features/chat/hooks/useChatSocket.ts(2,10): error TS2305: Module '"socket.io-client"' has no exported member 'io'.
src/features/chat/hooks/useChatSocket.ts(2,14): error TS6133: 'Socket' is declared but its value is never read.
src/features/chat/hooks/useChatSocket.ts(6,28): error TS2749: 'Socket' refers to a value, but is being used as a type here. Did you mean 'typeof Socket'?
src/hooks/useAttachments.test.tsx(3,8): error TS6133: 'React' is declared but its value is never read.
src/hooks/useAttachments.test.tsx(5,10): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/hooks/useAttachments.test.tsx(5,44): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/hooks/useAttachments.test.tsx(63,55): error TS7006: Parameter 'options' implicitly has an 'any' type.
src/hooks/useAttachments.test.tsx(87,35): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(91,23): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(92,23): error TS2339: Property 'attachments' does not exist on type 'never'.
src/hooks/useAttachments.test.tsx(93,23): error TS2339: Property 'attachments' does not exist on type 'never'.
src/hooks/useAttachments.test.tsx(93,50): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(101,37): error TS2339: Property 'toHaveBeenCalled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(103,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(104,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(105,29): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(106,48): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(108,23): error TS2339: Property 'attachments' does not exist on type 'never'.
src/hooks/useAttachments.test.tsx(109,23): error TS2339: Property 'attachments' does not exist on type 'never'.
src/hooks/useAttachments.test.tsx(110,23): error TS2339: Property 'uploading' does not exist on type 'never'.
src/hooks/useAttachments.test.tsx(110,34): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useAttachments.test.tsx(111,23): error TS2339: Property 'uploadProgress' does not exist on type 'never'.
src/hooks/useAttachments.test.tsx(111,39): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.test.tsx(3,8): error TS6133: 'React' is declared but its value is never read.
src/hooks/useComments.test.tsx(5,10): error TS2305: Module '"vitest"' has no exported member 'beforeAll'.
src/hooks/useComments.test.tsx(5,21): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/hooks/useComments.test.tsx(5,55): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/hooks/useComments.test.tsx(93,32): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.test.tsx(97,23): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.test.tsx(98,23): error TS2339: Property 'comments' does not exist on type 'never'.
src/hooks/useComments.test.tsx(99,23): error TS2339: Property 'comments' does not exist on type 'never'.
src/hooks/useComments.test.tsx(99,46): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.test.tsx(100,23): error TS2339: Property 'total' does not exist on type 'never'.
src/hooks/useComments.test.tsx(100,30): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.test.tsx(106,34): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.test.tsx(112,23): error TS2339: Property 'comments' does not exist on type 'never'.
src/hooks/useComments.test.tsx(113,23): error TS2339: Property 'comments' does not exist on type 'never'.
src/hooks/useComments.test.tsx(114,23): error TS2339: Property 'total' does not exist on type 'never'.
src/hooks/useComments.test.tsx(114,30): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useComments.ts(101,11): error TS2322: Type 'EntityIdentifier[] | undefined' is not assignable to type 'string[] | undefined'.
  Type 'EntityIdentifier[]' is not assignable to type 'string[]'.
    Type 'EntityIdentifier' is not assignable to type 'string'.
      Type 'number' is not assignable to type 'string'.
src/hooks/useDebounced.ts(16,13): error TS2554: Expected 1 arguments, but got 0.
src/hooks/useJourneyEvents.ts(58,22): error TS2554: Expected 0 arguments, but got 2.
src/hooks/useJourneyEvents.ts(80,11): error TS2322: Type 'EntityIdentifier | undefined' is not assignable to type 'EntityIdentifier'.
  Type 'undefined' is not assignable to type 'EntityIdentifier'.
src/hooks/useWebSocketEvents.test.ts(2,32): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/hooks/useWebSocketEvents.test.ts(2,36): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/hooks/useWebSocketEvents.test.ts(2,48): error TS2305: Module '"vitest"' has no exported member 'afterEach'.
src/hooks/useWebSocketEvents.test.ts(3,10): error TS2305: Module '"socket.io-client"' has no exported member 'io'.
src/hooks/useWebSocketEvents.test.ts(3,14): error TS6133: 'Socket' is declared but its value is never read.
src/hooks/useWebSocketEvents.test.ts(13,27): error TS2749: 'Socket' refers to a value, but is being used as a type here. Did you mean 'typeof Socket'?
src/hooks/useWebSocketEvents.test.ts(44,16): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(45,14): error TS2339: Property 'stringContaining' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(46,14): error TS2339: Property 'objectContaining' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(52,20): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(52,59): error TS2339: Property 'any' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(53,20): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(53,62): error TS2339: Property 'any' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(54,38): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(64,40): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(74,20): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(74,62): error TS2339: Property 'any' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(75,32): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(85,21): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(85,63): error TS2339: Property 'any' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(94,22): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(102,28): error TS2339: Property 'toHaveBeenCalled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(113,22): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(114,24): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(115,14): error TS2339: Property 'stringContaining' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(128,21): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(128,60): error TS2339: Property 'any' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(129,21): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(129,63): error TS2339: Property 'any' does not exist on type '(value: unknown) => { toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/hooks/useWebSocketEvents.test.ts(141,54): error TS7006: Parameter 'call' implicitly has an 'any' type.
src/hooks/useWebSocketEvents.ts(2,10): error TS2305: Module '"socket.io-client"' has no exported member 'io'.
src/hooks/useWebSocketEvents.ts(2,14): error TS6133: 'Socket' is declared but its value is never read.
src/hooks/useWebSocketEvents.ts(14,21): error TS2749: 'Socket' refers to a value, but is being used as a type here. Did you mean 'typeof Socket'?
src/hooks/useWebSocketEvents.ts(39,23): error TS2749: 'Socket' refers to a value, but is being used as a type here. Did you mean 'typeof Socket'?
src/hooks/useWebSocketEvents.ts(56,40): error TS7006: Parameter 'reason' implicitly has an 'any' type.
src/hooks/useWebSocketEvents.ts(60,43): error TS7006: Parameter 'error' implicitly has an 'any' type.
src/hooks/useWebSocketEvents.ts(92,28): error TS2749: 'Socket' refers to a value, but is being used as a type here. Did you mean 'typeof Socket'?
src/services/comments.ts(52,5): error TS2322: Type 'EntityIdentifier[] | undefined' is not assignable to type 'string[] | undefined'.
  Type 'EntityIdentifier[]' is not assignable to type 'string[]'.
    Type 'EntityIdentifier' is not assignable to type 'string'.
      Type 'number' is not assignable to type 'string'.
src/services/comments.ts(53,5): error TS2322: Type 'EntityIdentifier | undefined' is not assignable to type 'string | undefined'.
  Type 'number' is not assignable to type 'string'.
src/services/journey.ts(83,20): error TS2345: Argument of type '{ entity_type: "deal" | "lead"; entity_id: EntityIdentifier; type: JourneyEventType; payload: Record<string, unknown> | undefined; occurred_at: string | undefined; }' is not assignable to parameter of type '{ id: string; entity_type: string; entity_id: EntityIdentifier; type: string; payload?: Record<string, unknown> | undefined; occurred_at: string; created_at: string; updated_at?: string | undefined; }'.
  Type '{ entity_type: "deal" | "lead"; entity_id: EntityIdentifier; type: JourneyEventType; payload: Record<string, unknown> | undefined; occurred_at: string | undefined; }' is missing the following properties from type '{ id: string; entity_type: string; entity_id: EntityIdentifier; type: string; payload?: Record<string, unknown> | undefined; occurred_at: string; created_at: string; updated_at?: string | undefined; }': id, created_at
src/ui-component/Comments/CommentsPanel.tsx(126,11): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & StackOwnProps & CommonProps & Omit<any, keyof CommonProps | keyof StackOwnProps>): Element | null', gave the following error.
    Type 'unknown' is not assignable to type 'ReactNode'.
  Overload 2 of 2, '(props: DefaultComponentProps<StackTypeMap<{}, "div">>): Element | null', gave the following error.
    Type 'unknown' is not assignable to type 'ReactNode'.
src/ui-component/deals/LostReasonModal.test.tsx(1,32): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/ui-component/deals/LostReasonModal.test.tsx(16,51): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(17,51): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(18,74): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(30,53): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(43,27): error TS2339: Property 'toBeDisabled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(67,27): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(92,23): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(124,23): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(145,21): error TS2339: Property 'toHaveBeenCalled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(186,27): error TS2339: Property 'toBeDisabled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(205,68): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(206,72): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(207,79): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(208,65): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(209,66): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/deals/LostReasonModal.test.tsx(210,60): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/ui-component/FilterPanel/FilterPanel.tsx(67,14): error TS2345: Argument of type '{ [x: string]: unknown; }' is not assignable to parameter of type 'FilterValues'.
  'string' index signatures are incompatible.
    Type 'unknown' is not assignable to type 'string | number | string[] | undefined'.
src/ui-component/FilterPanel/FilterPanel.tsx(171,20): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/ui-component/FilterPanel/FilterPanel.tsx(185,20): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/ui-component/FilterPanel/FilterPanel.tsx(212,20): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/ui-component/FilterPanel/FilterPanel.tsx(237,20): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/ui-component/FilterPanel/FilterPanel.tsx(261,20): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; sm: number; md: number; key: string; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/utils/attribution.test.ts(1,32): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/utils/attribution.test.ts(1,36): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/utils/attribution.test.ts(1,48): error TS2305: Module '"vitest"' has no exported member 'afterEach'.
src/utils/attribution.test.ts(35,26): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(36,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(37,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(38,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(39,34): error TS2339: Property 'toBeDefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(47,37): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(48,40): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(49,43): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(58,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(59,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(60,37): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(61,43): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(70,22): error TS2339: Property 'toBeTruthy' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(73,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(74,37): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(83,27): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(84,27): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(97,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(98,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(111,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(112,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(120,26): error TS2339: Property 'toBeDefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(121,26): error TS2339: Property 'toBeDefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(122,31): error TS2339: Property 'toBeDefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(123,34): error TS2339: Property 'toBeDefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(134,23): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(135,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(136,39): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(142,23): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(152,23): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(160,23): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(169,20): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(177,22): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(182,21): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(188,40): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(193,40): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(205,57): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(206,65): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(207,70): error TS2339: Property 'toBeNull' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(221,23): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(222,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(233,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(234,35): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(235,34): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(243,33): error TS2339: Property 'toBe' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(244,33): error TS2339: Property 'toBeUndefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(245,35): error TS2339: Property 'toBeUndefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(246,31): error TS2339: Property 'toBeUndefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(247,34): error TS2339: Property 'toBeUndefined' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(255,50): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/utils/attribution.test.ts(256,54): error TS2339: Property 'toBeGreaterThan' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/analytics/PnLAnalytics.backup.tsx(48,10): error TS6133: 'formatPercent' is declared but its value is never read.
src/views/analytics/PnLAnalytics.backup.tsx(457,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(469,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(481,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(491,22): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalytics.backup.tsx(499,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(509,22): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalytics.backup.tsx(517,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(527,22): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalytics.backup.tsx(535,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(557,7): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/views/analytics/PnLAnalytics.backup.tsx(581,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(614,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.backup.tsx(647,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(306,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(317,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(328,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(334,18): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalytics.tsx(339,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(345,18): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalytics.tsx(350,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(356,18): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalytics.tsx(361,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(378,7): error TS2322: Type 'unknown' is not assignable to type 'string | Error | null | undefined'.
src/views/analytics/PnLAnalytics.tsx(386,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(407,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalytics.tsx(426,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(306,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(317,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(328,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(334,18): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalyticsNew.tsx(339,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(345,18): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalyticsNew.tsx(350,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(356,18): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "children" | ... 20 more ... | "selected">): Element', gave the following error.
    Type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' is not assignable to type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
      Property 'value' does not exist on type 'IntrinsicAttributes & { href: string; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>'.
  Overload 2 of 3, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & MenuItemOwnProps & Omit<ButtonBaseOwnProps, "classes"> & CommonProps & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: string | null | undefined; key: string | null | undefined; value: string | null | undefined; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 3 of 3, '(props: DefaultComponentProps<ExtendButtonBaseTypeMap<MenuItemTypeMap<{}, "li">>>): Element | null', gave the following error.
    Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
      Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.
src/views/analytics/PnLAnalyticsNew.tsx(361,10): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(378,7): error TS2322: Type 'unknown' is not assignable to type 'string | Error | null | undefined'.
src/views/analytics/PnLAnalyticsNew.tsx(386,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(407,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/analytics/PnLAnalyticsNew.tsx(426,14): error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; md: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; md: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
src/views/apps/chat/ChatPage.tsx(1,1): error TS6133: 'React' is declared but its value is never read.
src/views/deals/ClosedWonModal.test.tsx(3,32): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/views/deals/ClosedWonModal.test.tsx(13,53): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(14,51): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(15,45): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(32,44): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(36,24): error TS2339: Property 'toBeEnabled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(39,23): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(49,24): error TS2339: Property 'toBeDisabled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(66,24): error TS2339: Property 'toBeDisabled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(81,24): error TS2339: Property 'toBeDisabled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(94,21): error TS2339: Property 'toHaveBeenCalled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(95,23): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/ClosedWonModal.test.tsx(112,45): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/DealDetail.test.tsx(3,8): error TS6133: 'React' is declared but its value is never read.
src/views/deals/DealDetail.test.tsx(6,10): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/views/deals/DealDetail.test.tsx(6,44): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/views/deals/DealDetail.test.tsx(69,30): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/DealDetail.test.tsx(73,35): error TS2339: Property 'toContain' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/DealDetail.test.tsx(74,35): error TS2339: Property 'toContain' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/DealDetail.test.tsx(75,35): error TS2339: Property 'toContain' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/deals/DealDetail.test.tsx(76,35): error TS2339: Property 'toContain' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(2,32): error TS2305: Module '"vitest"' has no exported member 'vi'.
src/views/notifications/Notifications.test.tsx(2,36): error TS2305: Module '"vitest"' has no exported member 'beforeEach'.
src/views/notifications/Notifications.test.tsx(98,51): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(99,64): error TS2339: Property 'toBeGreaterThan' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(125,63): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(126,60): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(152,55): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(155,7): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(181,53): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(182,51): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(183,59): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(184,56): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(212,29): error TS2339: Property 'toBeGreaterThan' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(242,29): error TS2339: Property 'toBeGreaterThan' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(268,71): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(296,73): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(328,30): error TS2339: Property 'toHaveBeenCalledWith' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(361,28): error TS2339: Property 'not' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(393,33): error TS2339: Property 'toHaveBeenCalled' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(420,38): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(421,41): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(447,48): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.test.tsx(448,45): error TS2339: Property 'toBeInTheDocument' does not exist on type '{ toEqual(expected: unknown): void; toHaveLength(expected: number): void; }'.
src/views/notifications/Notifications.tsx(494,7): error TS2322: Type 'unknown' is not assignable to type 'string | Error | null | undefined'.
src/views/notifications/NotificationsNew.tsx(468,7): error TS2322: Type 'unknown' is not assignable to type 'string | Error | null | undefined'.
```

## ESLint

```bash

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/contexts/NotificationsContext.tsx
  25:10  warning  Replace `(⏎····<NotificationsContext.Provider·value={value}>{children}</NotificationsContext.Provider>⏎··)` with `<NotificationsContext.Provider·value={value}>{children}</NotificationsContext.Provider>`  prettier/prettier
  53:1   warning  Delete `⏎`                                                                                                                                                                                                  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/contexts/jwt-helpers.ts
  58:20  warning  Delete `⏎···`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/api.ts
   1:19  warning  Replace `"axios"` with `'axios'`                                                                                                                        prettier/prettier
   2:40  warning  Replace `"./types"` with `'./types'`                                                                                                                    prettier/prettier
   5:48  warning  Replace `"/"` with `'/'`                                                                                                                                prettier/prettier
   9:33  warning  Replace `·items:·T[];·total?:·number;·hasMore?:·boolean;·` with `⏎··items:·T[];⏎··total?:·number;⏎··hasMore?:·boolean;⏎`                                prettier/prettier
  11:42  warning  Replace `·search?:·string;·type?:·"dm"|"group";·onlyUnread?:·boolean·` with `⏎··search?:·string;⏎··type?:·'dm'·|·'group';⏎··onlyUnread?:·boolean;⏎`     prettier/prettier
  12:52  warning  Replace `"/chat/rooms"` with `'/chat/rooms'`                                                                                                            prettier/prettier
  21:36  warning  Replace `roomId:·ID,·params:·{·before?:·string;·pageSize?:·number·}·=·{}` with `⏎··roomId:·ID,⏎··params:·{·before?:·string;·pageSize?:·number·}·=·{}⏎`  prettier/prettier
  36:75  warning  Replace ``/chat/attachments/presign`,·input` with `⏎····`/chat/attachments/presign`,⏎····input⏎··`                                                      prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/api.ts
   1:19  warning  Replace `"axios"` with `'axios'`                                                                                                                        prettier/prettier
   2:40  warning  Replace `"./types"` with `'./types'`                                                                                                                    prettier/prettier
   5:48  warning  Replace `"/"` with `'/'`                                                                                                                                prettier/prettier
   9:33  warning  Replace `·items:·T[];·total?:·number;·hasMore?:·boolean;·` with `⏎··items:·T[];⏎··total?:·number;⏎··hasMore?:·boolean;⏎`                                prettier/prettier
  11:42  warning  Replace `·search?:·string;·type?:·"dm"|"group";·onlyUnread?:·boolean·` with `⏎··search?:·string;⏎··type?:·'dm'·|·'group';⏎··onlyUnread?:·boolean;⏎`     prettier/prettier
  12:52  warning  Replace `"/chat/rooms"` with `'/chat/rooms'`                                                                                                            prettier/prettier
  21:36  warning  Replace `roomId:·ID,·params:·{·before?:·string;·pageSize?:·number·}·=·{}` with `⏎··roomId:·ID,⏎··params:·{·before?:·string;·pageSize?:·number·}·=·{}⏎`  prettier/prettier
  36:75  warning  Replace ``/chat/attachments/presign`,·input` with `⏎····`/chat/attachments/presign`,⏎····input⏎··`                                                      prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/components/MessageComposer.tsx
   1:24  warning  Replace `"react"` with `'react'`                                                                                                                                                                                                                                                           prettier/prettier
   2:53  warning  Replace `"@mui/material"` with `'@mui/material'`                                                                                                                                                                                                                                           prettier/prettier
   4:42  warning  Replace `·onSend·}:·{·onSend:·(draft:·{·text?:·string·})·=>·void·` with `⏎··onSend⏎}:·{⏎··onSend:·(draft:·{·text?:·string·})·=>·void;⏎`                                                                                                                                                    prettier/prettier
   5:44  warning  Replace `""` with `''`                                                                                                                                                                                                                                                                     prettier/prettier
  11:14  warning  Replace `""` with `''`                                                                                                                                                                                                                                                                     prettier/prettier
  15:9   warning  Replace `·sx={{·borderTop:·1,·borderColor:·'divider',·p:·1,·display:·'flex',·alignItems:·'center',·gap:·1·}}` with `⏎······sx={{⏎········borderTop:·1,⏎········borderColor:·'divider',⏎········p:·1,⏎········display:·'flex',⏎········alignItems:·'center',⏎········gap:·1⏎······}}⏎····`  prettier/prettier
  20:22  warning  Insert `·`                                                                                                                                                                                                                                                                                 prettier/prettier
  21:23  warning  Replace `=>·{·if·(e.key·===·'Enter'·&&·(e.ctrlKey·||·e.metaKey))·submit();` with `·=>·{⏎··········if·(e.key·===·'Enter'·&&·(e.ctrlKey·||·e.metaKey))·submit();⏎·······`                                                                                                                    prettier/prettier
  24:54  warning  Replace `➡️` with `⏎··········➡️⏎········`                                                                                                                                                                                                                                                 prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/components/MessageItem.tsx
   1:24  warning  Replace `"react"` with `'react'`                                                                                                                                                                                                                                                                                                                                                               prettier/prettier
   2:60  warning  Replace `"@mui/material"` with `'@mui/material'`                                                                                                                                                                                                                                                                                                                                               prettier/prettier
   3:30  warning  Replace `"../types"` with `'../types'`                                                                                                                                                                                                                                                                                                                                                         prettier/prettier
   8:19  warning  Replace `<Avatar·sx={{·width:·28,·height:·28,·mr:·1·}}>{m.sender.name.slice(0,1)}</Avatar>` with `(⏎········<Avatar·sx={{·width:·28,·height:·28,·mr:·1·}}>{m.sender.name.slice(0,·1)}</Avatar>⏎······)`                                                                                                                                                                                        prettier/prettier
   9:12  warning  Replace `·elevation={0}·sx={{·maxWidth:·'75%',·bgcolor:·isMine·?·'primary.main'·:·'background.paper',·color:·isMine·?·'primary.contrastText'·:·'text.primary'·}}` with `⏎········elevation={0}⏎········sx={{⏎··········maxWidth:·'75%',⏎··········bgcolor:·isMine·?·'primary.main'·:·'background.paper',⏎··········color:·isMine·?·'primary.contrastText'·:·'text.primary'⏎········}}⏎······`  prettier/prettier
  11:22  warning  Replace `<Typography·variant="body2"·sx={{·whiteSpace:·'pre-wrap',·wordBreak:·'break-word'·}}>{m.text}</Typography>` with `(⏎············<Typography·variant="body2"·sx={{·whiteSpace:·'pre-wrap',·wordBreak:·'break-word'·}}>⏎··············{m.text}⏎············</Typography>⏎··········)`                                                                                                   prettier/prettier
  14:34  warning  Replace `a` with `(a)`                                                                                                                                                                                                                                                                                                                                                                         prettier/prettier
  16:21  warning  Replace `·<a·href={a.url}·target="_blank"·rel="noreferrer">{a.name}` with `{'·'}⏎··················<a·href={a.url}·target="_blank"·rel="noreferrer">⏎····················{a.name}⏎··················`                                                                                                                                                                                          prettier/prettier
  21:38  warning  Replace `<Typography·variant="caption"·sx={{·opacity:·0.6·}}>sending…</Typography>` with `(⏎············<Typography·variant="caption"·sx={{·opacity:·0.6·}}>⏎··············sending…⏎············</Typography>⏎··········)`                                                                                                                                                                     prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/components/RoomView.tsx
   1:24  warning  Replace `"react"` with `'react'`                                                                                                                                                                                                                                                    prettier/prettier
   2:67  warning  Replace `"@mui/material"` with `'@mui/material'`                                                                                                                                                                                                                                    prettier/prettier
   3:33  warning  Replace `"react-router-dom"` with `'react-router-dom'`                                                                                                                                                                                                                              prettier/prettier
   4:33  warning  Replace `"../hooks/useRoomMessages"` with `'../hooks/useRoomMessages'`                                                                                                                                                                                                              prettier/prettier
   5:25  warning  Replace `"./MessageItem"` with `'./MessageItem'`                                                                                                                                                                                                                                    prettier/prettier
   6:29  warning  Replace `"./MessageComposer"` with `'./MessageComposer'`                                                                                                                                                                                                                            prettier/prettier
  10:29  warning  Replace `"room"` with `'room'`                                                                                                                                                                                                                                                      prettier/prettier
  14:12  warning  Replace `<Box·sx={{·flex:·1,·display:·'grid',·placeItems:·'center',·color:·'text.secondary'·}}>Select·a·conversation</Box>` with `(⏎······<Box·sx={{·flex:·1,·display:·'grid',·placeItems:·'center',·color:·'text.secondary'·}}>⏎········Select·a·conversation⏎······</Box>⏎····)`  prettier/prettier
  31:23  warning  Replace `m` with `(m)`                                                                                                                                                                                                                                                              prettier/prettier
  34:21  warning  Replace `<Box·sx={{·display:·'flex',·justifyContent:·'center',·mt:·1·}}><CircularProgress·size={20}·/></Box>` with `(⏎··········<Box·sx={{·display:·'flex',·justifyContent:·'center',·mt:·1·}}>⏎············<CircularProgress·size={20}·/>⏎··········</Box>⏎········)`              prettier/prettier
  35:19  warning  Replace `<Typography·color="error"·variant="caption">{error}</Typography>` with `(⏎··········<Typography·color="error"·variant="caption">⏎············{error}⏎··········</Typography>⏎········)`                                                                                    prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/components/RoomsList.tsx
   1:24  warning  Replace `"react"` with `'react'`                                                                                                                                                                                                                                                                                                                                                                          prettier/prettier
   2:9   warning  Replace `·Avatar,·Badge,·Box,·Divider,·IconButton,·InputAdornment,·List,·ListItemButton,·ListItemText,·Stack,·TextField,·Tooltip,·Typography·}·from·"@mui/material"` with `⏎··Avatar,⏎··Badge,⏎··Box,⏎··Divider,⏎··IconButton,⏎··InputAdornment,⏎··List,⏎··ListItemButton,⏎··ListItemText,⏎··Stack,⏎··TextField,⏎··Tooltip,⏎··Typography⏎}·from·'@mui/material'`                                          prettier/prettier
   3:26  warning  Replace `"../hooks/useRooms"` with `'../hooks/useRooms'`                                                                                                                                                                                                                                                                                                                                                  prettier/prettier
   4:46  warning  Replace `"react-router-dom"` with `'react-router-dom'`                                                                                                                                                                                                                                                                                                                                                    prettier/prettier
  10:34  warning  Replace `"room"` with `'room'`                                                                                                                                                                                                                                                                                                                                                                            prettier/prettier
  13:9   warning  Replace `·sx={{·width:·360,·borderRight:·1,·borderColor:·'divider',·height:·'100%',·display:·'flex',·flexDirection:·'column'·}}` with `⏎······sx={{⏎········width:·360,⏎········borderRight:·1,⏎········borderColor:·'divider',⏎········height:·'100%',⏎········display:·'flex',⏎········flexDirection:·'column'⏎······}}⏎····`                                                                           prettier/prettier
  20:24  warning  Replace `=>·setFilter("search"` with `·=>·setFilter('search'`                                                                                                                                                                                                                                                                                                                                             prettier/prettier
  25:24  warning  Replace `·onClick={()=>·setFilter("onlyUnread",·!filters.onlyUnread)}·color={filters.onlyUnread·?·"primary"·:·"default"}·size="small">🟣` with `⏎··············onClick={()·=>·setFilter('onlyUnread',·!filters.onlyUnread)}⏎··············color={filters.onlyUnread·?·'primary'·:·'default'}⏎··············size="small"⏎············>⏎··············🟣⏎············`                                      prettier/prettier
  28:24  warning  Replace `·onClick={()=>·setFilter("type",·filters.type·===·"dm"·?·""·:·"dm")}·color={filters.type==="dm"·?·"primary":"default"}·size="small">👤` with `⏎··············onClick={()·=>·setFilter('type',·filters.type·===·'dm'·?·''·:·'dm')}⏎··············color={filters.type·===·'dm'·?·'primary'·:·'default'}⏎··············size="small"⏎············>⏎··············👤⏎············`                    prettier/prettier
  31:24  warning  Replace `·onClick={()=>·setFilter("type",·filters.type·===·"group"·?·""·:·"group")}·color={filters.type==="group"·?·"primary":"default"}·size="small">👥` with `⏎··············onClick={()·=>·setFilter('type',·filters.type·===·'group'·?·''·:·'group')}⏎··············color={filters.type·===·'group'·?·'primary'·:·'default'}⏎··············size="small"⏎············>⏎··············👥⏎············`  prettier/prettier
  38:21  warning  Replace `(r` with `((r)`                                                                                                                                                                                                                                                                                                                                                                                  prettier/prettier
  39:58  warning  Replace `p=>p.name).join(",·"` with `(p)·=>·p.name).join(',·'`                                                                                                                                                                                                                                                                                                                                            prettier/prettier
  45:28  warning  Insert `·`                                                                                                                                                                                                                                                                                                                                                                                                prettier/prettier
  47:23  warning  Replace `·color="primary"·badgeContent={r.unreadCount·||·0}·overlap="circular"·anchorOrigin={{·vertical:·'bottom',·horizontal:·'right'·}}` with `⏎··················color="primary"⏎··················badgeContent={r.unreadCount·||·0}⏎··················overlap="circular"⏎··················anchorOrigin={{·vertical:·'bottom',·horizontal:·'right'·}}⏎················`                               prettier/prettier
  48:59  warning  Insert `·`                                                                                                                                                                                                                                                                                                                                                                                                prettier/prettier
  53:58  warning  Replace `{primary}` with `⏎························{primary}⏎······················`                                                                                                                                                                                                                                                                                                                      prettier/prettier
  54:43  warning  Replace `<Typography·variant="caption"·color="text.secondary">{new·Date(r.lastMessageAt).toLocaleTimeString()}</Typography>` with `(⏎························<Typography·variant="caption"·color="text.secondary">⏎··························{new·Date(r.lastMessageAt).toLocaleTimeString()}⏎························</Typography>⏎······················)`                                              prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/hooks/useChatSocket.ts
   1:44  warning  Replace `"react"` with `'react'`                                                                                                    prettier/prettier
   2:28  warning  Replace `"socket.io-client"` with `'socket.io-client'`                                                                              prettier/prettier
   5:38  warning  Replace `"serviceToken")·||·sessionStorage.getItem("serviceToken"` with `'serviceToken')·||·sessionStorage.getItem('serviceToken'`  prettier/prettier
  10:63  warning  Replace `"/"` with `'/'`                                                                                                            prettier/prettier
  11:13  warning  Replace `"/socket.io"` with `'/socket.io'`                                                                                          prettier/prettier
  12:20  warning  Replace `"websocket"` with `'websocket'`                                                                                            prettier/prettier
  21:1   warning  Insert `··`                                                                                                                         prettier/prettier
  21:3   warning  Unused eslint-disable directive (no problems were reported from 'react-hooks/exhaustive-deps')

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/hooks/useRoomMessages.ts
   1:58  warning  Replace `"react"` with `'react'`                                                                        prettier/prettier
   2:34  warning  Replace `"../types"` with `'../types'`                                                                  prettier/prettier
   3:43  warning  Replace `"../api"` with `'../api'`                                                                      prettier/prettier
   4:31  warning  Replace `"./useChatSocket"` with `'./useChatSocket'`                                                    prettier/prettier
  15:17  warning  Replace `prev` with `(prev)`                                                                            prettier/prettier
  17:23  warning  Replace `(toTop·?·incoming·:·prev)` with `toTop·?·incoming·:·prev`                                      prettier/prettier
  18:23  warning  Replace `(toTop·?·prev·:·incoming)` with `toTop·?·prev·:·incoming`                                      prettier/prettier
  19:47  warning  Insert `·`                                                                                              prettier/prettier
  30:37  warning  Replace `b)=>` with `·b)·=>·`                                                                           prettier/prettier
  33:30  warning  Replace `"Failed·to·load·messages"` with `'Failed·to·load·messages'`                                    prettier/prettier
  48:30  warning  Replace `"Failed·to·load·more·messages"` with `'Failed·to·load·more·messages'`                          prettier/prettier
  54:20  warning  Replace `·loadInitial();` with `⏎····loadInitial();⏎·`                                                  prettier/prettier
  62:15  warning  Replace `"chat.message"` with `'chat.message'`                                                          prettier/prettier
  63:19  warning  Replace `·socket.off("chat.message",·handler);` with `⏎······socket.off('chat.message',·handler);⏎···`  prettier/prettier
  66:28  warning  Insert `⏎····`                                                                                          prettier/prettier
  67:5   warning  Insert `··`                                                                                             prettier/prettier
  68:1   warning  Replace `····` with `······`                                                                            prettier/prettier
  69:7   warning  Replace `id:·"temp_"+` with `··id:·'temp_'·+·`                                                          prettier/prettier
  70:7   warning  Insert `··`                                                                                             prettier/prettier
  71:1   warning  Replace `······sender:·{·id:·"me",·name:·"Me"` with `········sender:·{·id:·'me',·name:·'Me'`            prettier/prettier
  72:1   warning  Insert `··`                                                                                             prettier/prettier
  73:7   warning  Insert `··`                                                                                             prettier/prettier
  74:1   warning  Insert `··`                                                                                             prettier/prettier
  75:7   warning  Replace `status:·"sending"` with `··status:·'sending'`                                                  prettier/prettier
  76:1   warning  Insert `··`                                                                                             prettier/prettier
  77:5   warning  Insert `··`                                                                                             prettier/prettier
  78:5   warning  Insert `··`                                                                                             prettier/prettier
  79:1   warning  Insert `··`                                                                                             prettier/prettier
  80:1   warning  Insert `··`                                                                                             prettier/prettier
  81:5   warning  Insert `··`                                                                                             prettier/prettier
  81:14  error    'e' is defined but never used                                                                           @typescript-eslint/no-unused-vars
  82:1   warning  Insert `··`                                                                                             prettier/prettier
  83:5   warning  Insert `··`                                                                                             prettier/prettier
  84:1   warning  Replace `··},·[roomId,·merge]` with `····},⏎····[roomId,·merge]⏎··`                                     prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/hooks/useRooms.ts
   1:37  warning  Replace `"react"` with `'react'`                                                                                  prettier/prettier
   2:27  warning  Replace `"../api"` with `'../api'`                                                                                prettier/prettier
   3:27  warning  Replace `"../types"` with `'../types'`                                                                            prettier/prettier
   4:33  warning  Replace `"react-router-dom"` with `'react-router-dom'`                                                            prettier/prettier
   5:31  warning  Replace `"./useChatSocket"` with `'./useChatSocket'`                                                              prettier/prettier
  13:29  warning  Replace `"search")·||·""` with `'search')·||·''`                                                                  prettier/prettier
  14:28  warning  Replace `"type")·as·"dm"|"group"|` with `'type')·as·'dm'·|·'group'·|·`                                            prettier/prettier
  15:33  warning  Replace `"onlyUnread")·===·"true"` with `'onlyUnread')·===·'true'`                                                prettier/prettier
  26:30  warning  Replace `"Failed·to·load·rooms"` with `'Failed·to·load·rooms'`                                                    prettier/prettier
  34:1   warning  Replace `··` with `····`                                                                                          prettier/prettier
  42:15  warning  Replace `"chat.message"` with `'chat.message'`                                                                    prettier/prettier
  44:18  warning  Replace `"chat.message"` with `'chat.message'`                                                                    prettier/prettier
  46:6   warning  React Hook useEffect has a missing dependency: 'refresh'. Either include it or remove the dependency array        react-hooks/exhaustive-deps
  48:27  warning  Replace `"search"|"type"|"onlyUnread",·value:·string|` with `'search'·|·'type'·|·'onlyUnread',·value:·string·|·`  prettier/prettier
  50:17  warning  Replace `"onlyUnread"` with `'onlyUnread'`                                                                        prettier/prettier
  57:11  warning  Replace `·loading,·error,` with `⏎····loading,⏎····error,⏎···`                                                    prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/features/chat/index.ts
  1:15  warning  Replace `"./types"` with `'./types'`  prettier/prettier
  2:26  warning  Replace `"./api"` with `'./api'`      prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useAttachments.test.tsx
  12:10  warning  Insert `⏎···`                                                                                         prettier/prettier
  13:1   warning  Replace `····` with `······`                                                                          prettier/prettier
  14:1   warning  Insert `··`                                                                                           prettier/prettier
  15:1   warning  Replace `······` with `········`                                                                      prettier/prettier
  16:7   warning  Insert `··`                                                                                           prettier/prettier
  17:1   warning  Insert `··`                                                                                           prettier/prettier
  18:5   warning  Insert `··`                                                                                           prettier/prettier
  19:1   warning  Insert `··`                                                                                           prettier/prettier
  68:19  warning  Replace `⏎······|·ReturnType<typeof·useAttachments>⏎·····` with `·ReturnType<typeof·useAttachments>`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useAttachments.ts
  35:34  warning  Replace `()·=>·entityType·&&·entityId·!==·undefined,·[entityType,·entityId]` with `⏎····()·=>·entityType·&&·entityId·!==·undefined,⏎····[entityType,·entityId]⏎··`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useAttribution.ts
   7:3  warning  Delete `·`         prettier/prettier
  15:1  warning  Delete `······`    prettier/prettier
  19:1  warning  Delete `········`  prettier/prettier
  33:1  warning  Delete `⏎`         prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useComments.test.tsx
  14:10  warning  Insert `⏎···`                                                                                   prettier/prettier
  15:1   warning  Replace `····` with `······`                                                                    prettier/prettier
  16:1   warning  Insert `··`                                                                                     prettier/prettier
  17:1   warning  Replace `······` with `········`                                                                prettier/prettier
  18:7   warning  Insert `··`                                                                                     prettier/prettier
  19:1   warning  Insert `··`                                                                                     prettier/prettier
  20:5   warning  Insert `··`                                                                                     prettier/prettier
  21:1   warning  Insert `··`                                                                                     prettier/prettier
  74:19  warning  Replace `⏎······|·ReturnType<typeof·useComments>⏎·····` with `·ReturnType<typeof·useComments>`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useComments.ts
   49:34  warning  Replace `()·=>·entityType·&&·entityId·!==·undefined,·[entityType,·entityId]` with `⏎····()·=>·entityType·&&·entityId·!==·undefined,⏎····[entityType,·entityId]⏎··`  prettier/prettier
  114:30  warning  Delete `⏎····`                                                                                                                                                      prettier/prettier
  116:1   warning  Replace `······` with `····`                                                                                                                                        prettier/prettier
  117:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  118:7   warning  Delete `··`                                                                                                                                                         prettier/prettier
  119:1   warning  Replace `········` with `······`                                                                                                                                    prettier/prettier
  120:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  121:5   warning  Delete `··`                                                                                                                                                         prettier/prettier
  122:1   warning  Replace `········` with `······`                                                                                                                                    prettier/prettier
  123:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  124:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  125:5   warning  Delete `··`                                                                                                                                                         prettier/prettier
  126:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  127:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  128:9   warning  Delete `··`                                                                                                                                                         prettier/prettier
  129:9   warning  Delete `··`                                                                                                                                                         prettier/prettier
  130:1   warning  Delete `··`                                                                                                                                                         prettier/prettier
  131:5   warning  Delete `··`                                                                                                                                                         prettier/prettier
  132:1   warning  Replace `····},⏎····[]⏎··` with `··},·[]`                                                                                                                           prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useDebounced.ts
  22:1  warning  Delete `⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useFilterPresets.ts
  69:1  warning  Delete `⏎⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useJourneyEvents.ts
   21:3  warning  Delete `·`   prettier/prettier
  133:1  warning  Delete `⏎⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useNotificationPreferences.ts
   99:43  warning  Replace `'comment',·'attachment',·'notification',·'email',·'mention'` with `⏎······'comment',⏎······'attachment',⏎······'notification',⏎······'email',⏎······'mention'⏎····`  prettier/prettier
  120:1   warning  Delete `⏎`                                                                                                                                                                    prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useNotifications.ts
  171:34  warning  Insert `⏎····`                                                                                                  prettier/prettier
  172:1   warning  Replace `····` with `······`                                                                                    prettier/prettier
  173:1   warning  Insert `··`                                                                                                     prettier/prettier
  174:1   warning  Insert `··`                                                                                                     prettier/prettier
  175:5   warning  Insert `··`                                                                                                     prettier/prettier
  177:1   warning  Insert `··`                                                                                                     prettier/prettier
  178:1   warning  Insert `··`                                                                                                     prettier/prettier
  179:5   warning  Insert `··`                                                                                                     prettier/prettier
  180:1   warning  Insert `··`                                                                                                     prettier/prettier
  181:7   warning  Insert `··`                                                                                                     prettier/prettier
  182:7   warning  Insert `··`                                                                                                     prettier/prettier
  183:1   warning  Replace `······` with `········`                                                                                prettier/prettier
  184:5   warning  Insert `··`                                                                                                     prettier/prettier
  185:1   warning  Replace `··},·[load]` with `····},⏎····[load]⏎··`                                                               prettier/prettier
  188:36  warning  Insert `⏎····`                                                                                                  prettier/prettier
  189:5   warning  Insert `··`                                                                                                     prettier/prettier
  190:1   warning  Replace `····` with `······`                                                                                    prettier/prettier
  191:1   warning  Insert `··`                                                                                                     prettier/prettier
  192:1   warning  Insert `··`                                                                                                     prettier/prettier
  194:5   warning  Insert `··`                                                                                                     prettier/prettier
  195:1   warning  Insert `··`                                                                                                     prettier/prettier
  196:1   warning  Replace `······` with `········`                                                                                prettier/prettier
  197:1   warning  Insert `··`                                                                                                     prettier/prettier
  198:1   warning  Insert `··`                                                                                                     prettier/prettier
  199:7   warning  Insert `··`                                                                                                     prettier/prettier
  200:7   warning  Insert `··`                                                                                                     prettier/prettier
  201:7   warning  Insert `··`                                                                                                     prettier/prettier
  202:7   warning  Insert `··`                                                                                                     prettier/prettier
  203:1   warning  Insert `··`                                                                                                     prettier/prettier
  204:3   warning  Replace `},·[load]` with `··},⏎····[load]⏎··`                                                                   prettier/prettier
  220:6   warning  React Hook useCallback has an unnecessary dependency: 'load'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps
  256:1   warning  Delete `⏎`                                                                                                      prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useWebSocketEvents.test.ts
   22:1  warning  Delete `····`  prettier/prettier
  110:1  warning  Delete `····`  prettier/prettier
  145:1  warning  Delete `⏎`     prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useWebSocketEvents.ts
  198:1  warning  Delete `⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/hooks/useWebSocketToasts.ts
  182:1  warning  Delete `⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/index.jsx
  50:5  warning  Delete `··`  prettier/prettier
  51:7  warning  Delete `··`  prettier/prettier
  52:1  warning  Delete `··`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/layout/MainLayout/MenuList/NavItem/NotificationsBadge.tsx
  21:45  warning  Replace `·icon:·Icon,·size,·stroke,·style·` with `⏎··icon:·Icon,⏎··size,⏎··stroke,⏎··style⏎`  prettier/prettier
  44:1   warning  Delete `⏎`                                                                                    prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/layout/MainLayout/MenuList/NavItem/index.tsx
  74:1   warning  Delete `··`                                                                                                                                                                                                           prettier/prettier
  79:18  warning  Replace `<NotificationsBadge·icon={Icon}·size={iconSize}·stroke={iconStroke}·style={iconStyle}·/>` with `(⏎········<NotificationsBadge·icon={Icon}·size={iconSize}·stroke={iconStroke}·style={iconStyle}·/>⏎······)`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/layouts/AppPage.tsx
    2:9   warning  Replace `⏎··Alert,·Box,·Breadcrumbs,·Button,·Skeleton,·Stack,·Typography⏎` with `·Alert,·Box,·Breadcrumbs,·Button,·Skeleton,·Stack,·Typography·`                                                                                                                                                                                                prettier/prettier
    7:31  warning  Delete `·····`                                                                                                                                                                                                                                                                                                                                  prettier/prettier
    9:23  warning  Delete `············`                                                                                                                                                                                                                                                                                                                           prettier/prettier
   53:30  warning  Replace `·?·error·:·error·instanceof·Error·?·error.message` with `⏎······?·error⏎······:·error·instanceof·Error⏎········?·error.message⏎·······`                                                                                                                                                                                                prettier/prettier
   64:28  warning  Delete `,··········`                                                                                                                                                                                                                                                                                                                            prettier/prettier
   70:36  warning  Delete `,`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
   91:17  warning  Replace `·sx={{·display:·'flex',·justifyContent:·'space-between',·alignItems:·'flex-start',·gap:·2·}}` with `⏎··············sx={{⏎················display:·'flex',⏎················justifyContent:·'space-between',⏎················alignItems:·'flex-start',⏎················gap:·2⏎··············}}⏎············`                             prettier/prettier
   93:33  warning  Replace `<Breadcrumbs·sx={{·mb:·0.25·}}·separator="›">{breadcrumbs}</Breadcrumbs>` with `(⏎··················<Breadcrumbs·sx={{·mb:·0.25·}}·separator="›">⏎····················{breadcrumbs}⏎··················</Breadcrumbs>⏎················)`                                                                                                prettier/prettier
   94:49  warning  Replace `{title}` with `⏎··················{title}⏎················`                                                                                                                                                                                                                                                                            prettier/prettier
   95:30  warning  Replace `<Typography·variant="body2"·color="text.secondary"·noWrap>{subtitle}</Typography>` with `(⏎··················<Typography·variant="body2"·color="text.secondary"·noWrap>⏎····················{subtitle}⏎··················</Typography>⏎················)`                                                                              prettier/prettier
   97:27  warning  Replace `<Box·sx={{·display:·'flex',·alignItems:·'center',·gap:·1,·flexShrink:·0·}}>{actions}</Box>` with `(⏎················<Box·sx={{·display:·'flex',·alignItems:·'center',·gap:·1,·flexShrink:·0·}}>⏎··················{actions}⏎················</Box>⏎··············)`                                                                    prettier/prettier
  105:15  warning  Insert `(`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  107:48  warning  Replace `<Skeleton·key={i}·height={28}·variant="rounded"·/>` with `(⏎····················<Skeleton·key={i}·height={28}·variant="rounded"·/>⏎··················)`                                                                                                                                                                                prettier/prettier
  109:15  warning  Insert `)`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  111:15  warning  Insert `(`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  114:27  warning  Replace `onRetry·?·<Button·color="inherit"·size="small"·onClick={onRetry}>Retry</Button>·:·undefined` with `⏎····················onRetry·?·(⏎······················<Button·color="inherit"·size="small"·onClick={onRetry}>⏎························Retry⏎······················</Button>⏎····················)·:·undefined⏎··················`  prettier/prettier
  118:16  warning  Insert `)`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  120:15  warning  Insert `(`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  122:82  warning  Replace `Nothing·here·yet` with `⏎····················Nothing·here·yet⏎··················`                                                                                                                                                                                                                                                      prettier/prettier
  123:70  warning  Replace `Try·adjusting·filters·or·come·back·later.` with `⏎····················Try·adjusting·filters·or·come·back·later.⏎··················`                                                                                                                                                                                                    prettier/prettier
  125:15  warning  Insert `)`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  138:1   warning  Delete `⏎`                                                                                                                                                                                                                                                                                                                                      prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/services/comments.ts
  90:68  warning  Replace `BASE_URL,·toCreateRequest(payload)` with `⏎····BASE_URL,⏎····toCreateRequest(payload)⏎··`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/services/deals.ts
  76:65  warning  Replace ``${BASE_PATH}/${id}`,·mappedPayload` with `⏎····`${BASE_PATH}/${id}`,⏎····mappedPayload⏎··`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/services/journey.ts
   28:1   warning  Delete `··`                                                                 prettier/prettier
   62:42  warning  Replace `⏎··dto:·JourneyEventCreateDto⏎` with `dto:·JourneyEventCreateDto`  prettier/prettier
  102:1   warning  Delete `⏎⏎`                                                                 prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/services/leads.ts
  26:1   warning  Delete `··`                                                                            prettier/prettier
  28:36  warning  Replace `⏎····?·{·...payload,·attribution·}⏎···` with `?·{·...payload,·attribution·}`  prettier/prettier
  31:1   warning  Delete `··`                                                                            prettier/prettier
  34:1   warning  Delete `··`                                                                            prettier/prettier
  47:1   warning  Delete `··`                                                                            prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/services/notifications.ts
  61:60  warning  Replace `⏎····`/api/v1/notifications/${id}/read`,⏎····{}⏎··` with ``/api/v1/notifications/${id}/read`,·{}`  prettier/prettier
  81:1   warning  Delete `⏎`                                                                                                  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/services/pnl.ts
   8:3  warning  Delete `·`   prettier/prettier
  19:1  warning  Delete `⏎⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/ActivityTimeline/ActivityTimeline.tsx
   75:29  warning  Replace `⏎········?·`Deal·marked·as·Lost:·${payload.reason}`⏎·······` with `·?·`Deal·marked·as·Lost:·${payload.reason}``                                                                                                                     prettier/prettier
   81:30  warning  Replace `⏎········?·`Message·sent:·${payload.subject}`⏎·······` with `·?·`Message·sent:·${payload.subject}``                                                                                                                                 prettier/prettier
   85:28  warning  Replace `⏎········?·`Handed·off·to·${payload.agent}`⏎·······` with `·?·`Handed·off·to·${payload.agent}``                                                                                                                                     prettier/prettier
  232:32  warning  Replace `⏎······················variant="body2"⏎······················color="text.secondary"⏎······················sx={{·mt:·0.5,·mb:·0.5·}}⏎····················` with `·variant="body2"·color="text.secondary"·sx={{·mt:·0.5,·mb:·0.5·}}`  prettier/prettier
  252:1   warning  Delete `⏎⏎`                                                                                                                                                                                                                                  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/Attachments/AttachmentUploader.tsx
  137:28  warning  Replace `<CircularProgress·size={20}·/>·:·<RefreshOutlinedIcon·fontSize="small"·/>` with `(⏎··················<CircularProgress·size={20}·/>⏎················)·:·(⏎··················<RefreshOutlinedIcon·fontSize="small"·/>⏎················)`  prettier/prettier
  228:64  warning  Insert `{'·'}⏎·······················`                                                                                                                                                                                                            prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/Comments/CommentsPanel.tsx
   98:28  warning  Replace `<CircularProgress·size={20}·/>·:·<RefreshOutlinedIcon·fontSize="small"·/>` with `(⏎··················<CircularProgress·size={20}·/>⏎················)·:·(⏎··················<RefreshOutlinedIcon·fontSize="small"·/>⏎················)`  prettier/prettier
  117:20  warning  Replace `⏎··············variant="contained"⏎··············onClick={()·=>·void·handleSubmit()}⏎··············disabled={!canSubmit}⏎············` with `·variant="contained"·onClick={()·=>·void·handleSubmit()}·disabled={!canSubmit}`             prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/ExportMenu.tsx
  72:1  warning  Delete `⏎⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/FilterPanel/FilterPanel.tsx
  126:13  warning  Replace `·sx={{·p:·2,·border:·1,·borderColor:·'divider',·borderRadius:·1,·bgcolor:·'background.paper'·}}` with `⏎··········sx={{⏎············p:·2,⏎············border:·1,⏎············borderColor:·'divider',⏎············borderRadius:·1,⏎············bgcolor:·'background.paper'⏎··········}}⏎········`                                    prettier/prettier
  144:24  warning  Replace `·size="small"·variant="text"·onClick={()·=>·setShowSavePreset(!showSavePreset)}` with `⏎··················size="small"⏎··················variant="text"⏎··················onClick={()·=>·setShowSavePreset(!showSavePreset)}⏎················`                                                                                      prettier/prettier
  158:26  warning  Replace `·size="small"·variant="contained"·onClick={handleSavePreset}·disabled={!presetName.trim()}` with `⏎····················size="small"⏎····················variant="contained"⏎····················onClick={handleSavePreset}⏎····················disabled={!presetName.trim()}⏎··················`                                    prettier/prettier
  220:41  warning  Replace `·handleChange(`${filter.field}_min`,·e.target.value·?·Number(e.target.value)·:·undefined)` with `⏎··························handleChange(⏎····························`${filter.field}_min`,⏎····························e.target.value·?·Number(e.target.value)·:·undefined⏎··························)⏎························`  prettier/prettier
  228:41  warning  Replace `·handleChange(`${filter.field}_max`,·e.target.value·?·Number(e.target.value)·:·undefined)` with `⏎··························handleChange(⏎····························`${filter.field}_max`,⏎····························e.target.value·?·Number(e.target.value)·:·undefined⏎··························)⏎························`  prettier/prettier
  290:20  warning  Replace `·variant="outlined"·startIcon={<IconX·size={18}·/>}·onClick={onClear}·disabled={!hasActiveFilters}` with `⏎··············variant="outlined"⏎··············startIcon={<IconX·size={18}·/>}⏎··············onClick={onClear}⏎··············disabled={!hasActiveFilters}⏎············`                                                  prettier/prettier
  304:1   warning  Delete `⏎⏎`                                                                                                                                                                                                                                                                                                                                  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/FilterPanel/index.ts
  3:1  warning  Delete `⏎⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/deals/LostReasonModal.test.tsx
    8:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`      prettier/prettier
   22:12  warning  Replace `⏎······<LostReasonModal⏎········open={false}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={false}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`    prettier/prettier
   34:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`      prettier/prettier
   48:1   warning  Delete `····`                                                                                                                                                                                               prettier/prettier
   49:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`      prettier/prettier
   73:1   warning  Delete `····`                                                                                                                                                                                               prettier/prettier
   74:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={onConfirm}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={onConfirm}·/>`  prettier/prettier
  101:1   warning  Delete `····`                                                                                                                                                                                               prettier/prettier
  102:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={onConfirm}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={onConfirm}·/>`  prettier/prettier
  133:1   warning  Delete `····`                                                                                                                                                                                               prettier/prettier
  134:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={onClose}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={onClose}·onConfirm={vi.fn()}·/>`      prettier/prettier
  151:23  warning  Replace `⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎·····` with `·open={true}·onClose={vi.fn()}·onConfirm={vi.fn()}`                                                        prettier/prettier
  168:14  warning  Replace `⏎······<LostReasonModal⏎········open={false}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={false}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`    prettier/prettier
  175:1   warning  Delete `····`                                                                                                                                                                                               prettier/prettier
  176:14  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`      prettier/prettier
  191:1   warning  Delete `····`                                                                                                                                                                                               prettier/prettier
  192:12  warning  Replace `⏎······<LostReasonModal⏎········open={true}⏎········onClose={vi.fn()}⏎········onConfirm={vi.fn()}⏎······/>⏎····` with `<LostReasonModal·open={true}·onClose={vi.fn()}·onConfirm={vi.fn()}·/>`      prettier/prettier
  213:1   warning  Delete `⏎⏎`                                                                                                                                                                                                 prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/ui-component/deals/LostReasonModal.tsx
   71:101  warning  Insert `⏎···········`  prettier/prettier
  114:1    warning  Delete `⏎`             prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/utils/analytics.ts
  24:1  warning  Delete `⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/utils/attribution.test.ts
   19:1   warning  Delete `····`      prettier/prettier
   31:40  warning  Insert `⏎·······`  prettier/prettier
   53:40  warning  Delete `·`         prettier/prettier
   71:1   warning  Delete `······`    prettier/prettier
   79:1   warning  Delete `······`    prettier/prettier
  228:40  warning  Delete `·`         prettier/prettier
  260:1   warning  Delete `⏎⏎`        prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/utils/attribution.ts
    3:3   warning  Delete `·`                                                                                                                                                                                      prettier/prettier
    7:3   warning  Delete `·`                                                                                                                                                                                      prettier/prettier
   63:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
   71:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
   77:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
   79:42  warning  Replace `v` with `(v)`                                                                                                                                                                          prettier/prettier
   80:52  warning  Replace `v` with `(v)`                                                                                                                                                                          prettier/prettier
   81:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
   97:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  101:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  109:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  112:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  127:30  warning  Replace `·?·new·Date().toISOString()·:·(existing?.captured_at·||·new·Date().toISOString())` with `⏎······?·new·Date().toISOString()⏎······:·existing?.captured_at·||·new·Date().toISOString()`  prettier/prettier
  129:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  132:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  143:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  147:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  152:1   warning  Delete `··`                                                                                                                                                                                     prettier/prettier
  184:1   warning  Delete `⏎`                                                                                                                                                                                      prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/utils/exporters.ts
   20:24  warning  Replace `⏎····.toISOString()⏎····.slice(0,·16)⏎····.replace('T',·'_')⏎····` with `.toISOString().slice(0,·16).replace('T',·'_')`        prettier/prettier
   25:1   warning  Delete `··`                                                                                                                             prettier/prettier
   37:1   warning  Delete `··`                                                                                                                             prettier/prettier
   41:1   warning  Delete `··`                                                                                                                             prettier/prettier
   45:1   warning  Delete `··`                                                                                                                             prettier/prettier
   49:1   warning  Delete `··`                                                                                                                             prettier/prettier
   53:1   warning  Delete `··`                                                                                                                             prettier/prettier
   60:33  warning  Replace `⏎··data:·any[],⏎··columns:·ExportColumn[]⏎` with `data:·any[],·columns:·ExportColumn[]`                                        prettier/prettier
   77:30  warning  Replace `⏎··data:·any[],⏎··columns:·ExportColumn[],⏎··filename:·string⏎` with `data:·any[],·columns:·ExportColumn[],·filename:·string`  prettier/prettier
   83:1   warning  Delete `··`                                                                                                                             prettier/prettier
   86:1   warning  Delete `··`                                                                                                                             prettier/prettier
   92:1   warning  Delete `··`                                                                                                                             prettier/prettier
   96:1   warning  Delete `··`                                                                                                                             prettier/prettier
  111:1   warning  Delete `··`                                                                                                                             prettier/prettier
  114:1   warning  Delete `··`                                                                                                                             prettier/prettier
  121:1   warning  Delete `··`                                                                                                                             prettier/prettier
  127:1   warning  Delete `··`                                                                                                                             prettier/prettier
  131:1   warning  Delete `··`                                                                                                                             prettier/prettier
  151:1   warning  Delete `··`                                                                                                                             prettier/prettier
  175:1   warning  Delete `··`                                                                                                                             prettier/prettier
  182:1   warning  Delete `⏎`                                                                                                                              prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/utils/notifications.ts
  11:1  warning  Delete `⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/analytics/PnLAnalytics.backup.tsx
   30:9   warning  Replace `·IconRefresh,·IconTrendingUp,·IconCash,·IconReceipt,·IconDownload,·IconFileTypeCsv,·IconFileTypeXls,·IconFileTypePdf·` with `⏎··IconRefresh,⏎··IconTrendingUp,⏎··IconCash,⏎··IconReceipt,⏎··IconDownload,⏎··IconFileTypeCsv,⏎··IconFileTypeXls,⏎··IconFileTypePdf⏎`  prettier/prettier
   48:10  error    'formatPercent' is defined but never used                                                                                                                                                                                                                                     @typescript-eslint/no-unused-vars
   56:1   warning  Delete `··`                                                                                                                                                                                                                                                                   prettier/prettier
   64:1   warning  Delete `··`                                                                                                                                                                                                                                                                   prettier/prettier
   72:1   warning  Delete `····`                                                                                                                                                                                                                                                                 prettier/prettier
  137:35  warning  Replace `row` with `(row)`                                                                                                                                                                                                                                                    prettier/prettier
  151:25  warning  Replace `⏎······headers.join(','),⏎······...csvRows.map(row·=>·row.join(','))⏎····` with `headers.join(','),·...csvRows.map((row)·=>·row.join(','))`                                                                                                                          prettier/prettier
  248:24  warning  Replace `.map(row` with `⏎··············.map(⏎················(row)`                                                                                                                                                                                                          prettier/prettier
  261:14  warning  Replace `)` with `⏎··············)⏎··············`                                                                                                                                                                                                                            prettier/prettier
  269:51  warning  Delete `·`                                                                                                                                                                                                                                                                    prettier/prettier
  270:53  warning  Delete `·`                                                                                                                                                                                                                                                                    prettier/prettier
  353:26  warning  Replace `.map(row` with `⏎················.map(⏎··················(row)`                                                                                                                                                                                                      prettier/prettier
  368:16  warning  Replace `)` with `⏎················)⏎················`                                                                                                                                                                                                                        prettier/prettier
  377:1   warning  Delete `····`                                                                                                                                                                                                                                                                 prettier/prettier
  383:1   warning  Delete `····`                                                                                                                                                                                                                                                                 prettier/prettier
  389:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                        prettier/prettier
  391:1   warning  Delete `··`                                                                                                                                                                                                                                                                   prettier/prettier
  393:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                        prettier/prettier
  395:1   warning  Delete `··`                                                                                                                                                                                                                                                                   prettier/prettier
  397:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                        prettier/prettier
  414:16  warning  Replace `⏎············anchorEl={exportAnchorEl}⏎············open={exportMenuOpen}⏎············onClose={handleExportMenuClose}⏎··········` with `·anchorEl={exportAnchorEl}·open={exportMenuOpen}·onClose={handleExportMenuClose}`                                             prettier/prettier
  537:24  warning  Replace `⏎··················variant="contained"⏎··················onClick={handleApplyFilters}⏎··················size="small"⏎················` with `·variant="contained"·onClick={handleApplyFilters}·size="small"`                                                         prettier/prettier
  544:24  warning  Replace `⏎··················variant="outlined"⏎··················onClick={handleClearFilters}⏎··················size="small"⏎················` with `·variant="outlined"·onClick={handleClearFilters}·size="small"`                                                           prettier/prettier
  737:1   warning  Delete `⏎⏎`                                                                                                                                                                                                                                                                   prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/analytics/PnLAnalytics.tsx
   28:9   warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   29:15  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   30:18  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   31:12  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   32:15  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   33:16  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   34:19  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   35:19  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   36:18  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   59:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
   67:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
   75:1   warning  Delete `····`                                                                                                                                                                                                                                                                                        prettier/prettier
  126:20  warning  Replace `·'UTM·Campaign',·'Ad·ID',·'Leads',` with `⏎······'UTM·Campaign',⏎······'Ad·ID',⏎······'Leads',⏎·····`                                                                                                                                                                                       prettier/prettier
  127:23  warning  Replace `·'Direct·Cost',·'Net·Profit',·'ROAS',` with `⏎······'Direct·Cost',⏎······'Net·Profit',⏎······'ROAS',⏎·····`                                                                                                                                                                                 prettier/prettier
  130:34  warning  Replace `(row` with `((row)`                                                                                                                                                                                                                                                                         prettier/prettier
  131:28  warning  Replace `·row.utm_campaign·||·'',` with `⏎······row.utm_campaign·||·'',⏎·····`                                                                                                                                                                                                                       prettier/prettier
  132:23  warning  Replace `·row.deals_count,·row.gross_revenue,` with `⏎······row.deals_count,⏎······row.gross_revenue,⏎·····`                                                                                                                                                                                         prettier/prettier
  133:22  warning  Replace `·row.roas.toFixed(2),` with `⏎······row.roas.toFixed(2),⏎·····`                                                                                                                                                                                                                             prettier/prettier
  136:25  warning  Replace `⏎······headers.join(','),⏎······...csvRows.map(row·=>·row.join(','))⏎····` with `headers.join(','),·...csvRows.map((row)·=>·row.join(','))`                                                                                                                                                 prettier/prettier
  174:24  warning  Replace `.map(row` with `⏎··············.map(⏎················(row)`                                                                                                                                                                                                                                 prettier/prettier
  182:14  warning  Replace `)` with `⏎··············)⏎··············`                                                                                                                                                                                                                                                   prettier/prettier
  189:51  warning  Replace `·type:·'application/vnd.ms-excel;charset=utf-8'` with `⏎······type:·'application/vnd.ms-excel;charset=utf-8'⏎···`                                                                                                                                                                           prettier/prettier
  229:26  warning  Replace `.map(row` with `⏎················.map(⏎··················(row)`                                                                                                                                                                                                                             prettier/prettier
  237:16  warning  Replace `)` with `⏎················)⏎················`                                                                                                                                                                                                                                               prettier/prettier
  254:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                                               prettier/prettier
  256:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
  258:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                                               prettier/prettier
  260:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
  262:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                                               prettier/prettier
  278:25  warning  Replace `<IconFileTypeCsv·size={20}·/>` with `⏎············<IconFileTypeCsv·size={20}·/>⏎··········`                                                                                                                                                                                                 prettier/prettier
  282:25  warning  Replace `<IconFileTypeXls·size={20}·/>` with `⏎············<IconFileTypeXls·size={20}·/>⏎··········`                                                                                                                                                                                                 prettier/prettier
  286:25  warning  Replace `<IconFileTypePdf·size={20}·/>` with `⏎············<IconFileTypePdf·size={20}·/>⏎··········`                                                                                                                                                                                                 prettier/prettier
  304:47  warning  Replace `Filters` with `⏎········Filters⏎······`                                                                                                                                                                                                                                                     prettier/prettier
  331:20  warning  Replace `·value={utmSource}·onChange={(e:·SelectChangeEvent)·=>·setUtmSource(e.target.value)}·label="UTM·Source"` with `⏎··············value={utmSource}⏎··············onChange={(e:·SelectChangeEvent)·=>·setUtmSource(e.target.value)}⏎··············label="UTM·Source"⏎············`              prettier/prettier
  334:55  warning  Replace `{source}` with `⏎··················{source}⏎················`                                                                                                                                                                                                                               prettier/prettier
  342:20  warning  Replace `·value={utmCampaign}·onChange={(e:·SelectChangeEvent)·=>·setUtmCampaign(e.target.value)}·label="UTM·Campaign"` with `⏎··············value={utmCampaign}⏎··············onChange={(e:·SelectChangeEvent)·=>·setUtmCampaign(e.target.value)}⏎··············label="UTM·Campaign"⏎············`  prettier/prettier
  345:59  warning  Replace `{campaign}` with `⏎··················{campaign}⏎················`                                                                                                                                                                                                                           prettier/prettier
  353:20  warning  Replace `·value={adId}·onChange={(e:·SelectChangeEvent)·=>·setAdId(e.target.value)}·label="Ad·ID"` with `⏎··············value={adId}⏎··············onChange={(e:·SelectChangeEvent)·=>·setAdId(e.target.value)}⏎··············label="Ad·ID"⏎············`                                            prettier/prettier
  356:47  warning  Replace `{id}` with `⏎··················{id}⏎················`                                                                                                                                                                                                                                       prettier/prettier
  363:83  warning  Replace `Apply·Filters` with `⏎··············Apply·Filters⏎············`                                                                                                                                                                                                                             prettier/prettier
  364:82  warning  Replace `Clear·All` with `⏎··············Clear·All⏎············`                                                                                                                                                                                                                                     prettier/prettier
  390:25  warning  Replace `·sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'success.light',·display:·'flex'·}}` with `⏎······················sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'success.light',·display:·'flex'·}}⏎····················`                                                                                prettier/prettier
  394:78  warning  Replace `Total·Net·Profit` with `⏎························Total·Net·Profit⏎······················`                                                                                                                                                                                                   prettier/prettier
  411:25  warning  Replace `·sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'primary.light',·display:·'flex'·}}` with `⏎······················sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'primary.light',·display:·'flex'·}}⏎····················`                                                                                prettier/prettier
  415:78  warning  Replace `Average·ROAS` with `⏎························Average·ROAS⏎······················`                                                                                                                                                                                                           prettier/prettier
  419:76  warning  Replace `Return·on·Ad·Spend` with `⏎························Return·on·Ad·Spend⏎······················`                                                                                                                                                                                               prettier/prettier
  430:25  warning  Replace `·sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'warning.light',·display:·'flex'·}}` with `⏎······················sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'warning.light',·display:·'flex'·}}⏎····················`                                                                                prettier/prettier
  434:78  warning  Replace `Average·CPA` with `⏎························Average·CPA⏎······················`                                                                                                                                                                                                             prettier/prettier
  438:76  warning  Replace `Cost·Per·Acquisition` with `⏎························Cost·Per·Acquisition⏎······················`                                                                                                                                                                                           prettier/prettier
  465:28  warning  Replace `·key={`${row.utm_source}-${row.utm_campaign}-${row.ad_id}-${index}`}·hover` with `⏎····················key={`${row.utm_source}-${row.utm_campaign}-${row.ad_id}-${index}`}⏎····················hover⏎··················`                                                                    prettier/prettier
  473:31  warning  Replace `·align="right"·sx={{·color:·row.net_profit·>=·0·?·'success.main'·:·'error.main'·}}` with `⏎······················align="right"⏎······················sx={{·color:·row.net_profit·>=·0·?·'success.main'·:·'error.main'·}}⏎····················`                                              prettier/prettier
  488:1   warning  Delete `⏎`                                                                                                                                                                                                                                                                                           prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/analytics/PnLAnalyticsNew.tsx
   28:9   warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   29:15  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   30:18  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   31:12  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   32:15  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   33:16  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   34:19  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   35:19  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   36:18  warning  Delete `·`                                                                                                                                                                                                                                                                                           prettier/prettier
   59:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
   67:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
   75:1   warning  Delete `····`                                                                                                                                                                                                                                                                                        prettier/prettier
  126:20  warning  Replace `·'UTM·Campaign',·'Ad·ID',·'Leads',` with `⏎······'UTM·Campaign',⏎······'Ad·ID',⏎······'Leads',⏎·····`                                                                                                                                                                                       prettier/prettier
  127:23  warning  Replace `·'Direct·Cost',·'Net·Profit',·'ROAS',` with `⏎······'Direct·Cost',⏎······'Net·Profit',⏎······'ROAS',⏎·····`                                                                                                                                                                                 prettier/prettier
  130:34  warning  Replace `(row` with `((row)`                                                                                                                                                                                                                                                                         prettier/prettier
  131:28  warning  Replace `·row.utm_campaign·||·'',` with `⏎······row.utm_campaign·||·'',⏎·····`                                                                                                                                                                                                                       prettier/prettier
  132:23  warning  Replace `·row.deals_count,·row.gross_revenue,` with `⏎······row.deals_count,⏎······row.gross_revenue,⏎·····`                                                                                                                                                                                         prettier/prettier
  133:22  warning  Replace `·row.roas.toFixed(2),` with `⏎······row.roas.toFixed(2),⏎·····`                                                                                                                                                                                                                             prettier/prettier
  136:25  warning  Replace `⏎······headers.join(','),⏎······...csvRows.map(row·=>·row.join(','))⏎····` with `headers.join(','),·...csvRows.map((row)·=>·row.join(','))`                                                                                                                                                 prettier/prettier
  174:24  warning  Replace `.map(row` with `⏎··············.map(⏎················(row)`                                                                                                                                                                                                                                 prettier/prettier
  182:14  warning  Replace `)` with `⏎··············)⏎··············`                                                                                                                                                                                                                                                   prettier/prettier
  189:51  warning  Replace `·type:·'application/vnd.ms-excel;charset=utf-8'` with `⏎······type:·'application/vnd.ms-excel;charset=utf-8'⏎···`                                                                                                                                                                           prettier/prettier
  229:26  warning  Replace `.map(row` with `⏎················.map(⏎··················(row)`                                                                                                                                                                                                                             prettier/prettier
  237:16  warning  Replace `)` with `⏎················)⏎················`                                                                                                                                                                                                                                               prettier/prettier
  254:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                                               prettier/prettier
  256:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
  258:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                                               prettier/prettier
  260:1   warning  Delete `··`                                                                                                                                                                                                                                                                                          prettier/prettier
  262:40  warning  Replace `r` with `(r)`                                                                                                                                                                                                                                                                               prettier/prettier
  278:25  warning  Replace `<IconFileTypeCsv·size={20}·/>` with `⏎············<IconFileTypeCsv·size={20}·/>⏎··········`                                                                                                                                                                                                 prettier/prettier
  282:25  warning  Replace `<IconFileTypeXls·size={20}·/>` with `⏎············<IconFileTypeXls·size={20}·/>⏎··········`                                                                                                                                                                                                 prettier/prettier
  286:25  warning  Replace `<IconFileTypePdf·size={20}·/>` with `⏎············<IconFileTypePdf·size={20}·/>⏎··········`                                                                                                                                                                                                 prettier/prettier
  304:47  warning  Replace `Filters` with `⏎········Filters⏎······`                                                                                                                                                                                                                                                     prettier/prettier
  331:20  warning  Replace `·value={utmSource}·onChange={(e:·SelectChangeEvent)·=>·setUtmSource(e.target.value)}·label="UTM·Source"` with `⏎··············value={utmSource}⏎··············onChange={(e:·SelectChangeEvent)·=>·setUtmSource(e.target.value)}⏎··············label="UTM·Source"⏎············`              prettier/prettier
  334:55  warning  Replace `{source}` with `⏎··················{source}⏎················`                                                                                                                                                                                                                               prettier/prettier
  342:20  warning  Replace `·value={utmCampaign}·onChange={(e:·SelectChangeEvent)·=>·setUtmCampaign(e.target.value)}·label="UTM·Campaign"` with `⏎··············value={utmCampaign}⏎··············onChange={(e:·SelectChangeEvent)·=>·setUtmCampaign(e.target.value)}⏎··············label="UTM·Campaign"⏎············`  prettier/prettier
  345:59  warning  Replace `{campaign}` with `⏎··················{campaign}⏎················`                                                                                                                                                                                                                           prettier/prettier
  353:20  warning  Replace `·value={adId}·onChange={(e:·SelectChangeEvent)·=>·setAdId(e.target.value)}·label="Ad·ID"` with `⏎··············value={adId}⏎··············onChange={(e:·SelectChangeEvent)·=>·setAdId(e.target.value)}⏎··············label="Ad·ID"⏎············`                                            prettier/prettier
  356:47  warning  Replace `{id}` with `⏎··················{id}⏎················`                                                                                                                                                                                                                                       prettier/prettier
  363:83  warning  Replace `Apply·Filters` with `⏎··············Apply·Filters⏎············`                                                                                                                                                                                                                             prettier/prettier
  364:82  warning  Replace `Clear·All` with `⏎··············Clear·All⏎············`                                                                                                                                                                                                                                     prettier/prettier
  390:25  warning  Replace `·sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'success.light',·display:·'flex'·}}` with `⏎······················sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'success.light',·display:·'flex'·}}⏎····················`                                                                                prettier/prettier
  394:78  warning  Replace `Total·Net·Profit` with `⏎························Total·Net·Profit⏎······················`                                                                                                                                                                                                   prettier/prettier
  411:25  warning  Replace `·sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'primary.light',·display:·'flex'·}}` with `⏎······················sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'primary.light',·display:·'flex'·}}⏎····················`                                                                                prettier/prettier
  415:78  warning  Replace `Average·ROAS` with `⏎························Average·ROAS⏎······················`                                                                                                                                                                                                           prettier/prettier
  419:76  warning  Replace `Return·on·Ad·Spend` with `⏎························Return·on·Ad·Spend⏎······················`                                                                                                                                                                                               prettier/prettier
  430:25  warning  Replace `·sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'warning.light',·display:·'flex'·}}` with `⏎······················sx={{·p:·1.5,·borderRadius:·2,·bgcolor:·'warning.light',·display:·'flex'·}}⏎····················`                                                                                prettier/prettier
  434:78  warning  Replace `Average·CPA` with `⏎························Average·CPA⏎······················`                                                                                                                                                                                                             prettier/prettier
  438:76  warning  Replace `Cost·Per·Acquisition` with `⏎························Cost·Per·Acquisition⏎······················`                                                                                                                                                                                           prettier/prettier
  465:28  warning  Replace `·key={`${row.utm_source}-${row.utm_campaign}-${row.ad_id}-${index}`}·hover` with `⏎····················key={`${row.utm_source}-${row.utm_campaign}-${row.ad_id}-${index}`}⏎····················hover⏎··················`                                                                    prettier/prettier
  473:31  warning  Replace `·align="right"·sx={{·color:·row.net_profit·>=·0·?·'success.main'·:·'error.main'·}}` with `⏎······················align="right"⏎······················sx={{·color:·row.net_profit·>=·0·?·'success.main'·:·'error.main'·}}⏎····················`                                              prettier/prettier
  488:1   warning  Delete `⏎`                                                                                                                                                                                                                                                                                           prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/apps/chat/ChatPage.tsx
   1:24  warning  Replace `"react"` with `'react'`                                                                                                                                                                                           prettier/prettier
   2:63  warning  Replace `"@mui/material"` with `'@mui/material'`                                                                                                                                                                           prettier/prettier
   3:21  warning  Replace `"../../../layouts/AppPage"` with `'../../../layouts/AppPage'`                                                                                                                                                     prettier/prettier
   4:23  warning  Replace `"../../../features/chat/components/RoomsList"` with `'../../../features/chat/components/RoomsList'`                                                                                                               prettier/prettier
   5:22  warning  Replace `"../../../features/chat/components/RoomView"` with `'../../../features/chat/components/RoomView'`                                                                                                                 prettier/prettier
   6:33  warning  Replace `"react-router-dom"` with `'react-router-dom'`                                                                                                                                                                     prettier/prettier
  12:47  warning  Replace `New·DM` with `⏎········New·DM⏎······`                                                                                                                                                                             prettier/prettier
  13:48  warning  Replace `New·Group` with `⏎········New·Group⏎······`                                                                                                                                                                       prettier/prettier
  22:27  warning  Replace `"search")·||·""` with `'search')·||·''`                                                                                                                                                                           prettier/prettier
  23:22  warning  Insert `·`                                                                                                                                                                                                                 prettier/prettier
  26:24  warning  Replace `"search",·v);·else·p.delete("search"` with `'search',·v);⏎··········else·p.delete('search'`                                                                                                                       prettier/prettier
  35:13  warning  Replace `⏎······title="Chat"⏎······subtitle="Direct·&·group·messaging"⏎······actions={actions}⏎······toolbar={toolbar}⏎····` with `·title="Chat"·subtitle="Direct·&·group·messaging"·actions={actions}·toolbar={toolbar}`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/deals/ClosedWonModal.test.tsx
  115:1  warning  Delete `⏎⏎`  prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/deals/ClosedWonModal.tsx
  27:12   warning  Replace `Number.isFinite(parsedGross)·&&·parsedGross·>·0·&&·Number.isFinite(parsedCost)·&&·parsedCost·>·0` with `(⏎······Number.isFinite(parsedGross)·&&⏎······parsedGross·>·0·&&⏎······Number.isFinite(parsedCost)·&&⏎······parsedCost·>·0⏎····)`  prettier/prettier
  46:100  warning  Insert `⏎···········`                                                                                                                                                                                                                               prettier/prettier
  76:34   warning  Replace `·?·'—'` with `⏎················?·'—'⏎···············`                                                                                                                                                                                      prettier/prettier
  82:51   warning  Replace `Cancel` with `⏎··········Cancel⏎········`                                                                                                                                                                                                  prettier/prettier
  90:1    warning  Delete `⏎`                                                                                                                                                                                                                                          prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/deals/DealDetail.tsx
  133:9   warning  The 'handleMarkClosedWon' function makes the dependencies of useMemo Hook (at line 372) change on every render. Move it inside the useMemo callback. Alternatively, wrap the definition of 'handleMarkClosedWon' in its own useCallback() Hook  react-hooks/exhaustive-deps
  139:1   warning  Delete `····`                                                                                                                                                                                                                                   prettier/prettier
  150:1   warning  Delete `······`                                                                                                                                                                                                                                 prettier/prettier
  176:9   warning  The 'handleMarkLost' function makes the dependencies of useMemo Hook (at line 372) change on every render. Move it inside the useMemo callback. Alternatively, wrap the definition of 'handleMarkLost' in its own useCallback() Hook            react-hooks/exhaustive-deps
  182:1   warning  Delete `····`                                                                                                                                                                                                                                   prettier/prettier
  193:1   warning  Delete `······`                                                                                                                                                                                                                                 prettier/prettier
  274:20  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  275:58  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  276:30  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  277:29  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  333:10  warning  Replace `(deal.grossRevenue·!==·null·&&·deal.grossRevenue·!==·undefined)` with `deal.grossRevenue·!==·null·&&·deal.grossRevenue·!==·undefined`                                                                                                  prettier/prettier
  359:26  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  360:29  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  361:22  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  362:84  warning  Delete `·`                                                                                                                                                                                                                                      prettier/prettier
  471:1   warning  Delete `······`                                                                                                                                                                                                                                 prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/notifications/Notifications.test.tsx
   36:25  warning  Replace `⏎············{ui}⏎··········` with `{ui}`  prettier/prettier
  217:1   warning  Delete `····`                                       prettier/prettier
  273:1   warning  Delete `····`                                       prettier/prettier
  301:1   warning  Delete `····`                                       prettier/prettier
  334:1   warning  Delete `····`                                       prettier/prettier
  366:1   warning  Delete `····`                                       prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/notifications/Notifications.tsx
   37:9   warning  Replace `·useNotificationPreferences,·type·NotificationType·` with `⏎··useNotificationPreferences,⏎··type·NotificationType⏎`                                                                                                               prettier/prettier
  109:33  warning  Replace `·notification,·onMarkAsRead,·onMarkAsUnread·` with `⏎··notification,⏎··onMarkAsRead,⏎··onMarkAsUnread⏎`                                                                                                                           prettier/prettier
  307:20  warning  Replace `⏎··············size="small"⏎··············variant="outlined"⏎··············onClick={unmuteAll}⏎··············disabled={noneMuted}⏎············` with `·size="small"·variant="outlined"·onClick={unmuteAll}·disabled={noneMuted}`  prettier/prettier
  387:21  warning  Replace `·unreadCount·>·0⏎····?·`${unreadCount}·unread·notification${notificationPlural}`⏎···` with `⏎····unreadCount·>·0·?·`${unreadCount}·unread·notification${notificationPlural}``                                                     prettier/prettier
  398:1   warning  Delete `······`                                                                                                                                                                                                                            prettier/prettier
  437:1   warning  Delete `······`                                                                                                                                                                                                                            prettier/prettier
  443:18  warning  Insert `⏎···`                                                                                                                                                                                                                              prettier/prettier
  444:5   warning  Replace `<Button⏎······variant="text"⏎······size="small"⏎······onClick={handleMarkAllAsRead}` with `··<Button·variant="text"·size="small"·onClick={handleMarkAllAsRead}>`                                                                  prettier/prettier
  448:3   warning  Delete `··>⏎`                                                                                                                                                                                                                              prettier/prettier
  450:5   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  451:1   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  477:17  warning  Insert `⏎···`                                                                                                                                                                                                                              prettier/prettier
  478:1   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  479:7   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  480:7   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  481:1   warning  Replace `······` with `········`                                                                                                                                                                                                           prettier/prettier
  482:1   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  483:7   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  484:1   warning  Replace `······` with `········`                                                                                                                                                                                                           prettier/prettier
  485:5   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier
  486:1   warning  Insert `··`                                                                                                                                                                                                                                prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/notifications/NotificationsNew.tsx
   39:9   warning  Replace `·useNotificationPreferences,·type·NotificationType·` with `⏎··useNotificationPreferences,⏎··type·NotificationType⏎`                                                                                                                                                                                                                     prettier/prettier
  111:33  warning  Replace `·notification,·onMarkAsRead,·onMarkAsUnread·` with `⏎··notification,⏎··onMarkAsRead,⏎··onMarkAsUnread⏎`                                                                                                                                                                                                                                 prettier/prettier
  173:21  warning  Replace `·sx={{·display:·'flex',·alignItems:·'center',·gap:·1,·mt:·0.5,·flexWrap:·'wrap'·}}` with `⏎··················sx={{·display:·'flex',·alignItems:·'center',·gap:·1,·mt:·0.5,·flexWrap:·'wrap'·}}⏎················`                                                                                                                        prettier/prettier
  307:20  warning  Replace `·size="small"·variant="outlined"·color="secondary"·onClick={muteAll}·disabled={allMuted}` with `⏎··············size="small"⏎··············variant="outlined"⏎··············color="secondary"⏎··············onClick={muteAll}⏎··············disabled={allMuted}⏎············`                                                            prettier/prettier
  358:19  warning  Replace `·unreadCount·>·0⏎····?·`${unreadCount}·unread·notification${notificationPlural}`⏎···` with `⏎····unreadCount·>·0·?·`${unreadCount}·unread·notification${notificationPlural}``                                                                                                                                                           prettier/prettier
  377:1   warning  Delete `······`                                                                                                                                                                                                                                                                                                                                  prettier/prettier
  380:15  warning  Replace `·sx={{·display:·'flex',·justifyContent:·'space-between',·alignItems:·'center',·gap:·2,·flexWrap:·'wrap'·}}` with `⏎············sx={{⏎··············display:·'flex',⏎··············justifyContent:·'space-between',⏎··············alignItems:·'center',⏎··············gap:·2,⏎··············flexWrap:·'wrap'⏎············}}⏎··········`  prettier/prettier
  450:17  warning  Insert `⏎···`                                                                                                                                                                                                                                                                                                                                    prettier/prettier
  451:1   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  452:7   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  453:7   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  454:1   warning  Replace `······` with `········`                                                                                                                                                                                                                                                                                                                 prettier/prettier
  455:1   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  456:7   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  457:1   warning  Replace `······` with `········`                                                                                                                                                                                                                                                                                                                 prettier/prettier
  458:5   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  459:1   warning  Insert `··`                                                                                                                                                                                                                                                                                                                                      prettier/prettier
  488:1   warning  Delete `⏎`                                                                                                                                                                                                                                                                                                                                       prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/pages/deals/DealsListPage.tsx
  151:49  warning  Replace `·?·Number(searchParams.get('amount_min'))` with `⏎········?·Number(searchParams.get('amount_min'))⏎·······`                                                                                                                      prettier/prettier
  152:49  warning  Replace `·?·Number(searchParams.get('amount_max'))` with `⏎········?·Number(searchParams.get('amount_max'))⏎·······`                                                                                                                      prettier/prettier
  165:49  warning  Replace `·?·Number(searchParams.get('amount_min'))` with `⏎········?·Number(searchParams.get('amount_min'))⏎·······`                                                                                                                      prettier/prettier
  166:49  warning  Replace `·?·Number(searchParams.get('amount_max'))` with `⏎········?·Number(searchParams.get('amount_max'))⏎·······`                                                                                                                      prettier/prettier
  216:8   warning  Replace `·field:·'grossRevenue',·headerName:·'Gross·Revenue',·valueFormatter:·formatCurrencyForExport` with `⏎········field:·'grossRevenue',⏎········headerName:·'Gross·Revenue',⏎········valueFormatter:·formatCurrencyForExport⏎·····`  prettier/prettier
  226:44  warning  Replace `'deals',·'xlsx',·query.search·?·{·search:·query.search·}·:·undefined` with `⏎········'deals',⏎········'xlsx',⏎········query.search·?·{·search:·query.search·}·:·undefined⏎······`                                                prettier/prettier
  229:14  error    'error' is already declared in the upper scope on line 174 column 33                                                                                                                                                                      @typescript-eslint/no-shadow
  237:44  warning  Replace `'deals',·'pdf',·query.search·?·{·search:·query.search·}·:·undefined` with `⏎········'deals',⏎········'pdf',⏎········query.search·?·{·search:·query.search·}·:·undefined⏎······`                                                  prettier/prettier
  240:14  error    'error' is already declared in the upper scope on line 174 column 33                                                                                                                                                                      @typescript-eslint/no-shadow
  295:18  warning  Insert `⏎·······`                                                                                                                                                                                                                         prettier/prettier
  296:18  warning  Insert `⏎·······`                                                                                                                                                                                                                         prettier/prettier
  297:14  warning  Insert `⏎·······`                                                                                                                                                                                                                         prettier/prettier
  298:9   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  299:9   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  300:16  warning  Insert `⏎·······`                                                                                                                                                                                                                         prettier/prettier
  301:9   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  302:1   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  314:14  warning  Insert `⏎·······`                                                                                                                                                                                                                         prettier/prettier
  315:9   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  316:9   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  317:16  warning  Insert `⏎·······`                                                                                                                                                                                                                         prettier/prettier
  318:9   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier
  319:1   warning  Insert `··`                                                                                                                                                                                                                               prettier/prettier

/Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516/src/views/pages/leads/LeadsListPage.tsx
  244:16  warning  Insert `⏎·······`                                                                                                                                                                           prettier/prettier
  245:9   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  246:1   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  247:15  warning  Insert `⏎·······`                                                                                                                                                                           prettier/prettier
  248:9   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  249:1   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  261:16  warning  Insert `⏎·······`                                                                                                                                                                           prettier/prettier
  262:9   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  263:1   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  264:15  warning  Insert `⏎·······`                                                                                                                                                                           prettier/prettier
  265:9   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  266:1   warning  Insert `··`                                                                                                                                                                                 prettier/prettier
  406:8   warning  Delete `·`                                                                                                                                                                                  prettier/prettier
  407:24  warning  Delete `·`                                                                                                                                                                                  prettier/prettier
  418:44  warning  Replace `'leads',·'xlsx',·query.search·?·{·search:·query.search·}·:·undefined` with `⏎········'leads',⏎········'xlsx',⏎········query.search·?·{·search:·query.search·}·:·undefined⏎······`  prettier/prettier
  421:14  error    'error' is already declared in the upper scope on line 164 column 33                                                                                                                        @typescript-eslint/no-shadow
  429:44  warning  Replace `'leads',·'pdf',·query.search·?·{·search:·query.search·}·:·undefined` with `⏎········'leads',⏎········'pdf',⏎········query.search·?·{·search:·query.search·}·:·undefined⏎······`    prettier/prettier
  432:14  error    'error' is already declared in the upper scope on line 164 column 33                                                                                                                        @typescript-eslint/no-shadow

✖ 588 problems (6 errors, 582 warnings)
  0 errors and 578 warnings potentially fixable with the `--fix` option.

```

## Route Map

```bash
Routes detected:
- /  (src/routes/AuthenticationRoutes.tsx)
- /pages/error  (src/routes/AuthenticationRoutes.tsx)
- /pages/500  (src/routes/AuthenticationRoutes.tsx)
- /pages/coming-soon1  (src/routes/AuthenticationRoutes.tsx)
- /pages/coming-soon2  (src/routes/AuthenticationRoutes.tsx)
- /pages/under-construction  (src/routes/AuthenticationRoutes.tsx)
- /  (src/routes/LoginRoutes.tsx)
- /  (src/routes/LoginRoutes.tsx)
- /login  (src/routes/LoginRoutes.tsx)
- /register  (src/routes/LoginRoutes.tsx)
- /forgot-password  (src/routes/LoginRoutes.tsx)
- /reset-password  (src/routes/LoginRoutes.tsx)
- /check-mail  (src/routes/LoginRoutes.tsx)
- /code-verification  (src/routes/LoginRoutes.tsx)
- /  (src/routes/MainRoutes.tsx)
- /sample-page  (src/routes/MainRoutes.tsx)
- /deals  (src/routes/MainRoutes.tsx)
- /deals/:id  (src/routes/MainRoutes.tsx)
- /deals/:id/edit  (src/routes/MainRoutes.tsx)
- /leads  (src/routes/MainRoutes.tsx)
- /leads/:id  (src/routes/MainRoutes.tsx)
- /leads/:id/edit  (src/routes/MainRoutes.tsx)
- /contacts  (src/routes/MainRoutes.tsx)
- /companies  (src/routes/MainRoutes.tsx)
- /analytics  (src/routes/MainRoutes.tsx)
- /analytics/pnl  (src/routes/MainRoutes.tsx)
- /notifications  (src/routes/MainRoutes.tsx)
- /chat  (src/routes/MainRoutes.tsx)
Total: 28
```

## Import Hotspots & Legacy Detection

```bash
Top imports:
129	react
70	@mui/material/Box
69	@mui/material/styles
68	react-router-dom
62	@mui/material/Typography
61	@mui/material/Button
41	config
40	@mui/material/Stack
38	types/api
30	hooks/useAuth
28	prop-types
28	ui-component/extended/AnimateButton
27	@tabler/icons-react
25	hooks/useConfig
24	store
24	@mui/material/Grid
22	@mui/material/OutlinedInput
21	@mui/material/InputAdornment
21	@mui/material/InputLabel
20	@mui/material/FormHelperText
20	yup
20	formik
20	hooks/useScriptRef
19	@mui/material/IconButton
18	store/slices/snackbar

Legacy matches:
ui-component/Locales	src/App.jsx
ui-component/extended/Snackbar	src/App.jsx
ui-component/third-party/Notistack	src/App.jsx
ui-component/Loader	src/contexts/AWSCognitoContext.tsx
ui-component/Loader	src/contexts/Auth0Context.tsx
ui-component/Loader	src/contexts/FirebaseContext.tsx
ui-component/Loader	src/contexts/JWTContext.tsx
ui-component/Loader	src/contexts/SupabaseContext.tsx
@tabler/icons-react	src/layout/MainLayout/Header/FullScreenSection/index.jsx
ui-component/extended/Transitions	src/layout/MainLayout/Header/LocalizationSection/index.jsx
ui-component/cards/MainCard	src/layout/MainLayout/Header/MegaMenuSection/index.jsx
ui-component/extended/Transitions	src/layout/MainLayout/Header/MegaMenuSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/MegaMenuSection/index.jsx
ui-component/extended/Transitions	src/layout/MainLayout/Header/MobileSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/MobileSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/NotificationSection/NotificationList.jsx
ui-component/cards/MainCard	src/layout/MainLayout/Header/NotificationSection/index.jsx
ui-component/extended/Transitions	src/layout/MainLayout/Header/NotificationSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/NotificationSection/index.jsx
ui-component/extended/AnimateButton	src/layout/MainLayout/Header/ProfileSection/UpgradePlanCard.jsx
ui-component/cards/MainCard	src/layout/MainLayout/Header/ProfileSection/index.jsx
ui-component/extended/Transitions	src/layout/MainLayout/Header/ProfileSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/ProfileSection/index.jsx
ui-component/extended/Transitions	src/layout/MainLayout/Header/SearchSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/SearchSection/index.jsx
@tabler/icons-react	src/layout/MainLayout/Header/index.tsx
ui-component/Logo	src/layout/MainLayout/LogoSection/index.tsx
ui-component/extended/Transitions	src/layout/MainLayout/MenuList/NavCollapse/index.tsx
@tabler/icons-react	src/layout/MainLayout/MenuList/NavCollapse/index.tsx
ui-component/extended/Transitions	src/layout/MainLayout/MenuList/NavGroup/index.tsx
@tabler/icons-react	src/layout/MainLayout/MenuList/NavGroup/index.tsx
ui-component/third-party/SimpleBar	src/layout/MainLayout/Sidebar/index.tsx
ui-component/Loader	src/layout/MainLayout/index.tsx
ui-component/extended/Breadcrumbs	src/layout/MainLayout/index.tsx
ui-component/extended/AppBar	src/layout/SimpleLayout/index.jsx
ui-component/cards/MainCard	src/layouts/AppPage.tsx
@tabler/icons-react	src/menu-items/other.js
@tabler/icons-react	src/menu-items/pages.js
@tabler/icons-react	src/menu-items/sample-page.js
@tabler/icons-react	src/menu-items/sample-page.ts
ui-component/Loadable	src/routes/AuthenticationRoutes.tsx
ui-component/Loadable	src/routes/LoginRoutes.tsx
ui-component/Loadable	src/routes/MainRoutes.tsx
@tabler/icons-react	src/ui-component/ActivityTimeline/ActivityTimeline.tsx
@tabler/icons-react	src/ui-component/ExportMenu.tsx
@tabler/icons-react	src/ui-component/FilterPanel/FilterPanel.tsx
ui-component/Logo	src/ui-component/extended/AppBar.jsx
@tabler/icons-react	src/ui-component/extended/AppBar.jsx
@tabler/icons-react	src/ui-component/extended/Breadcrumbs.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/ColorVariants.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/CustomComponent.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/Dense.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/DismissSnackBar.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/HideDuration.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/IconVariants.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/MaxSnackbar.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/PositioningSnackbar.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/PreventDuplicate.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/SnackBarAction.jsx
ui-component/cards/SubCard	src/ui-component/extended/notistack/TransitionBar.jsx
@tabler/icons-react	src/ui-component/third-party/Notistack.jsx
@tabler/icons-react	src/views/analytics/PnLAnalytics.backup.tsx
ui-component/cards/MainCard	src/views/analytics/PnLAnalytics.backup.tsx
@tabler/icons-react	src/views/analytics/PnLAnalytics.tsx
@tabler/icons-react	src/views/analytics/PnLAnalyticsNew.tsx
ui-component/Attachments/AttachmentUploader	src/views/deals/DealDetail.tsx
ui-component/Comments/CommentsPanel	src/views/deals/DealDetail.tsx
ui-component/cards/MainCard	src/views/deals/DealDetail.tsx
ui-component/ActivityTimeline/ActivityTimeline	src/views/deals/DealDetail.tsx
ui-component/deals/LostReasonModal	src/views/deals/DealDetail.tsx
ui-component/Attachments/AttachmentUploader	src/views/leads/LeadDetail.tsx
ui-component/Comments/CommentsPanel	src/views/leads/LeadDetail.tsx
ui-component/cards/MainCard	src/views/leads/LeadDetail.tsx
ui-component/ActivityTimeline/ActivityTimeline	src/views/leads/LeadDetail.tsx
@tabler/icons-react	src/views/notifications/Notifications.tsx
@tabler/icons-react	src/views/notifications/NotificationsNew.tsx
ui-component/cards/MainCard	src/views/pages/analytics/AnalyticsDashboard.tsx
ui-component/cards/MainCard	src/views/pages/authentication/AuthCardWrapper.jsx
ui-component/Logo	src/views/pages/authentication/CheckMail.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/CheckMail.jsx
ui-component/cards/AuthFooter	src/views/pages/authentication/CheckMail.jsx
ui-component/Logo	src/views/pages/authentication/CodeVerification.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/CodeVerification.jsx
ui-component/cards/AuthFooter	src/views/pages/authentication/CodeVerification.jsx
ui-component/Logo	src/views/pages/authentication/ForgotPassword.jsx
ui-component/cards/AuthFooter	src/views/pages/authentication/ForgotPassword.jsx
ui-component/Logo	src/views/pages/authentication/Login.jsx
ui-component/cards/AuthFooter	src/views/pages/authentication/Login.jsx
ui-component/Logo	src/views/pages/authentication/Register.jsx
ui-component/cards/AuthFooter	src/views/pages/authentication/Register.jsx
ui-component/Logo	src/views/pages/authentication/ResetPassword.jsx
ui-component/cards/AuthFooter	src/views/pages/authentication/ResetPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/auth0/AuthForgotPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/auth0/AuthForgotPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/auth0/AuthLogin.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/auth0/AuthRegister.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/auth0/AuthResetPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/auth0/AuthResetPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/aws/AuthForgotPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/aws/AuthForgotPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/aws/AuthLogin.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/aws/AuthLogin.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/aws/AuthRegister.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/aws/AuthRegister.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/aws/AuthResetPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/aws/AuthResetPassword.jsx
@tabler/icons-react	src/views/pages/authentication/aws/AuthResetPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/firebase/AuthForgotPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/firebase/AuthForgotPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/firebase/AuthLogin.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/firebase/AuthLogin.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/firebase/AuthRegister.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/firebase/AuthRegister.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/firebase/AuthResetPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/firebase/AuthResetPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/jwt/AuthForgotPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/jwt/AuthForgotPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/jwt/AuthLogin.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/jwt/AuthLogin.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/jwt/AuthRegister.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/jwt/AuthRegister.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/jwt/AuthResetPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/jwt/AuthResetPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/supabase/AuthForgotPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/supabase/AuthForgotPassword.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/supabase/AuthLogin.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/supabase/AuthLogin.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/supabase/AuthRegister.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/supabase/AuthRegister.jsx
ui-component/extended/AnimateButton	src/views/pages/authentication/supabase/AuthResetPassword.jsx
ui-component/extended/Form/CustomFormControl	src/views/pages/authentication/supabase/AuthResetPassword.jsx
ui-component/cards/MainCard	src/views/pages/companies/CompaniesListPage.tsx
ui-component/cards/MainCard	src/views/pages/contacts/ContactsListPage.tsx
ui-component/cards/MainCard	src/views/pages/deals/DealEditPage.tsx
ui-component/cards/MainCard	src/views/pages/deals/DealsListPage.tsx
ui-component/ExportMenu	src/views/pages/deals/DealsListPage.tsx
ui-component/FilterPanel	src/views/pages/deals/DealsListPage.tsx
ui-component/cards/MainCard	src/views/pages/leads/LeadEditPage.tsx
ui-component/cards/MainCard	src/views/pages/leads/LeadsListPage.tsx
ui-component/ExportMenu	src/views/pages/leads/LeadsListPage.tsx
ui-component/FilterPanel	src/views/pages/leads/LeadsListPage.tsx
ui-component/extended/AnimateButton	src/views/pages/maintenance/ComingSoon/ComingSoon1/MailerSubscriber.jsx
@tabler/icons-react	src/views/pages/maintenance/ComingSoon/ComingSoon1/index.jsx
ui-component/extended/AnimateButton	src/views/pages/maintenance/ComingSoon/ComingSoon2.jsx
ui-component/extended/AnimateButton	src/views/pages/maintenance/Error.jsx
ui-component/extended/AnimateButton	src/views/pages/maintenance/Error500.jsx
ui-component/extended/AnimateButton	src/views/pages/maintenance/UnderConstruction.jsx
ui-component/cards/MainCard	src/views/sample-page/index.jsx

Files scanned: 283
```

## Large Files (>= 1.5 MB)

```bash
./typescript_v5.0.0-nq4ghb (2)/berry-material-react-ts-5.0.0.zip
./typescript_v5.0.0-nq4ghb (2)/berry-react-material-next-ts-5.0.0.zip
./javascript_v5.0.0-eaoys0 (2)/berry-react-material-next-js-5.0.0.zip
./javascript_v5.0.0-eaoys0 (2)/berry-material-react-5.0.0.zip
./javascript_v5.0.0-eaoys0 (3)/berry-react-material-next-js-5.0.0.zip
./javascript_v5.0.0-eaoys0 (3)/berry-material-react-5.0.0.zip
./typescript_v5.0.0-nq4ghb (3)/berry-material-react-ts-5.0.0.zip
./typescript_v5.0.0-nq4ghb (3)/berry-react-material-next-ts-5.0.0.zip
```

## Dependency Scan (best-effort)

```bash
Unused dependencies
* chance
Unused devDependencies
* @types/jsdom
* prettier-eslint-cli
Missing dependencies
* @typescript-eslint/parser: ./eslint.config.mjs
* routes: ./src/App.jsx
* ui-component: ./src/App.jsx
* layout: ./src/App.jsx
* themes: ./src/App.jsx
* contexts: ./src/App.jsx
* hooks: ./src/App.jsx
* App: ./src/index.jsx
* store: ./src/index.jsx
* serviceWorker: ./src/index.jsx
* reportWebVitals: ./src/index.jsx
* assets: ./src/index.jsx
* config: ./src/views/pages/maintenance/Error.jsx
* prop-types: ./src/views/pages/maintenance/ComingSoon/ComingSoon1/Slider.jsx
* services: ./src/views/pages/leads/LeadEditPage.tsx
* types: ./src/views/pages/leads/LeadEditPage.tsx
* utils: ./src/views/pages/leads/LeadsListPage.tsx
* layouts: ./src/views/notifications/Notifications.tsx
* menu-items: ./src/ui-component/extended/Breadcrumbs.jsx
* views: ./src/routes/AuthenticationRoutes.tsx
* api: ./src/layout/MainLayout/index.tsx
* @emotion/is-prop-valid: ./dist/assets/AnimateButton-CtU13Uu0.js
```

## Build (optional)

_Run manually if desired:_
```bash
pnpm build  # or: npm run build
```
