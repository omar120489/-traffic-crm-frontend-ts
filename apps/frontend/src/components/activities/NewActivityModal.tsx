import * as React from "react";
import { ActivityType, CreateActivityInput } from "@/types/activity";
import { cn } from "@/utils/cn";

type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreate: (payload: CreateActivityInput) => Promise<void> | void;
  // prefill from parent context
  readonly entity: "company" | "contact" | "deal";
  readonly entityId: string;
};

const TYPES: ReadonlyArray<{ readonly label: string; readonly value: ActivityType }> = [
  { label: "📞 Call", value: "call" },
  { label: "📧 Email", value: "email" },
  { label: "📅 Meeting", value: "meeting" },
  { label: "📝 Note", value: "note" },
  { label: "✅ Task", value: "task" },
];

export function NewActivityModal({ open, onClose, onCreate, entity, entityId }: Props) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const firstFieldRef = React.useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [type, setType] = React.useState<ActivityType>("note");
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [dueAt, setDueAt] = React.useState<string>(""); // ISO string or ""
  const [participants, setParticipants] = React.useState<string>(""); // comma-separated

  React.useEffect(() => {
    if (open) {
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    } else {
      // reset on close
      setSubmitting(false);
      setError(null);
      setType("note");
      setTitle("");
      setNotes("");
      setDueAt("");
      setParticipants("");
    }
  }, [open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");

    const payload: CreateActivityInput = {
      type,
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
      participants:
        participants
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [],
      entity,
      entityId,
    };

    try {
      setSubmitting(true);
      await onCreate(payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create activity.");
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-activity-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={dialogRef}
        className="relative z-10 w-[min(96vw,720px)] rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
      >
        <h2 id="new-activity-title" className="mb-3 text-lg font-semibold">
          New Activity
        </h2>

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Due (optional)</span>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Title *</span>
            <input
              ref={firstFieldRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quick summary…"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any useful details…"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Participants (comma-separated)</span>
            <input
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring"
            />
          </label>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700",
                submitting && "opacity-60"
              )}
            >
              {submitting ? "Creating…" : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

