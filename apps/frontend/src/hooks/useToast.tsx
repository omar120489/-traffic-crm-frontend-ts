import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { readonly id: string; readonly type: ToastType; readonly message: string };

type ToastContextValue = {
  readonly notify: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { readonly children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const ref = timeoutRefs.current[id];
    if (ref) {
      window.clearTimeout(ref);
      delete timeoutRefs.current[id];
    }
  }, []);

  const notify = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts((t) => [{ id, type, message }, ...t]);
    timeoutRefs.current[id] = window.setTimeout(() => remove(id), 3000);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div className="fixed z-[100] top-4 right-4 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto rounded-lg shadow-lg px-4 py-3 min-w-[260px] max-w-[420px]
              border text-sm backdrop-blur bg-white/85 dark:bg-neutral-900/85
              ${t.type === "success" ? "border-emerald-300 text-emerald-900 dark:text-emerald-200" : ""}
              ${t.type === "error" ? "border-rose-300 text-rose-900 dark:text-rose-200" : ""}
              ${t.type === "info" ? "border-sky-300 text-sky-900 dark:text-sky-200" : ""}
            `}
            role="status"
            aria-live={t.type === "error" ? "assertive" : "polite"}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"}
              </span>
              <div className="flex-1">{t.message}</div>
              <button
                onClick={() => remove(t.id)}
                className="ml-2 text-xs opacity-70 hover:opacity-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

