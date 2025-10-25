export interface KpiStatProps {
  readonly label: string;
  readonly value: string | number;
  readonly loading?: boolean;
  readonly tooltip?: string;
}

export function KpiStat({ label, value, loading, tooltip }: KpiStatProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur" 
      title={tooltip}
    >
      <dl>
        <dt className="text-sm text-slate-500">{label}</dt>
        <dd className="mt-1 text-2xl font-semibold">{value}</dd>
      </dl>
    </div>
  );
}

