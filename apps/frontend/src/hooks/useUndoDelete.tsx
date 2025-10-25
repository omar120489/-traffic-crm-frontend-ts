import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Pending = {
  readonly id: string;
  readonly label: string;
  // commit returns a promise that resolves when API delete succeeds
  readonly commit: () => Promise<void>;
  // rollback restores UI if commit fails
  readonly rollback: () => void;
};

type Ctx = {
  readonly schedule: (p: Pending, ms?: number) => void;
  // exposed so a list can render the banner
  readonly pending: Pending | null;
  readonly undo: () => void;
};

const UndoCtx = createContext<Ctx | null>(null);

export function UndoDeleteProvider({ children }: { readonly children: React.ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const timer = useRef<number | null>(null);
  const committed = useRef(false);

  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const undo = useCallback(() => {
    if (!pending) return;
    clearTimer();
    setPending(null);
  }, [pending]);

  const schedule = useCallback((p: Pending, ms = 5000) => {
    clearTimer();
    committed.current = false;
    setPending(p);
    timer.current = window.setTimeout(async () => {
      committed.current = true;
      setPending(null);
      try {
        await p.commit();
      } catch (e) {
        // if API delete fails after the window, roll back
        p.rollback();
      }
    }, ms);
  }, []);

  const value = useMemo<Ctx>(() => ({ schedule, pending, undo }), [schedule, pending, undo]);

  return (
    <UndoCtx.Provider value={value}>
      {children}
      {/* Inline banner (bottom-center). Accessible & non-intrusive. */}
      {pending && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto
                     rounded-lg border border-amber-300 bg-white/90 dark:bg-neutral-900/90
                     text-amber-900 dark:text-amber-100 shadow-lg px-4 py-3 flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <span>Deleted "{pending.label}".</span>
          <button
            onClick={() => undo()}
            className="rounded-md px-2 py-1 text-sm font-medium border border-amber-300
                       hover:bg-amber-50 dark:hover:bg-neutral-800"
            aria-label="Undo delete"
          >
            Undo
          </button>
        </div>
      )}
    </UndoCtx.Provider>
  );
}

export function useUndoDelete() {
  const ctx = useContext(UndoCtx);
  if (!ctx) throw new Error("useUndoDelete must be used within <UndoDeleteProvider>");
  return ctx;
}

