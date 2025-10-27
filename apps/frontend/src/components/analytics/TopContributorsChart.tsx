import * as React from 'react';

type Contributor = { userId: string; name: string; avatarUrl?: string; count: number };

type Props = {
  title?: string;
  data: Contributor[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  maxBars?: number;
};

export default function TopContributorsChart({
  title = 'Top Contributors',
  data,
  loading,
  error,
  className = '',
  maxBars = 10
}: Props) {
  const [focusIdx, setFocusIdx] = React.useState<number | null>(null);

  if (loading) {
    return (
      <ChartCard title={title} className={className}>
        <div className="h-[320px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </ChartCard>
    );
  }
  if (error) {
    return (
      <ChartCard title={title} className={className}>
        <div className="flex h-[320px] items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950">
          {error}
        </div>
      </ChartCard>
    );
  }
  if (!data?.length) {
    return (
      <ChartCard title={title} className={className}>
        <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 text-sm text-slate-500 dark:border-slate-800">
          <span>No contributors found.</span>
        </div>
      </ChartCard>
    );
  }

  const topN = data.slice(0, maxBars);
  const maxCount = Math.max(...topN.map((d) => d.count), 1);

  return (
    <ChartCard title={title} className={className}>
      <div className="space-y-3">
        {topN.map((contributor, i) => {
          const widthPercent = (contributor.count / maxCount) * 100;
          const isFocused = focusIdx === i;

          return (
            <div
              key={contributor.userId}
              className="group relative cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              onMouseEnter={() => setFocusIdx(i)}
              onMouseLeave={() => setFocusIdx(null)}
              onFocus={() => setFocusIdx(i)}
              onBlur={() => setFocusIdx(null)}
              tabIndex={0}
              role="button"
              aria-label={`${contributor.name}: ${contributor.count} activities`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar or Initials */}
                <div className="flex-shrink-0">
                  {contributor.avatarUrl ? (
                    <img
                      src={contributor.avatarUrl}
                      alt={contributor.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                      {getInitials(contributor.name)}
                    </div>
                  )}
                </div>

                {/* Name + Bar */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className="truncate font-medium text-slate-900 dark:text-slate-100"
                      title={contributor.name}
                    >
                      {contributor.name}
                    </span>
                    <span className="ml-2 flex-shrink-0 text-xs text-slate-600 dark:text-slate-400">
                      {contributor.count.toLocaleString()}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="relative h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out dark:from-indigo-400 dark:to-indigo-500"
                      style={{
                        width: `${widthPercent}%`,
                        opacity: isFocused ? 1 : 0.85
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tooltip on hover/focus */}
              {isFocused && (
                <div
                  className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-md border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
                  aria-live="polite"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {contributor.name}
                  </div>
                  <div className="mt-1 text-slate-600 dark:text-slate-400">
                    {contributor.count.toLocaleString()} activities
                  </div>
                  <div className="text-slate-500 dark:text-slate-500">
                    {widthPercent.toFixed(1)}% of top contributor
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

function ChartCard({
  title,
  className,
  children
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className || ''}`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </header>
      {children}
    </section>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
