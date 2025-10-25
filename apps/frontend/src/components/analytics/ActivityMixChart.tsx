import * as React from "react";

type Slice = { type: string; count: number; percent: number };

type Props = {
  title?: string;
  data: Slice[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  size?: number;
};

const TYPE_COLORS: Record<string, string> = {
  call: "#6366f1",      // indigo
  email: "#8b5cf6",     // violet
  meeting: "#ec4899",   // pink
  note: "#f59e0b",      // amber
  task: "#10b981",      // emerald
};

const TYPE_LABELS: Record<string, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  note: "Note",
  task: "Task",
};

export default function ActivityMixChart({
  title = "Activity Mix",
  data,
  loading,
  error,
  className = "",
  size = 200,
}: Props) {
  const [focusIdx, setFocusIdx] = React.useState<number | null>(null);

  if (loading) {
    return (
      <ChartCard title={title} className={className}>
        <div className="h-[280px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </ChartCard>
    );
  }
  if (error) {
    return (
      <ChartCard title={title} className={className}>
        <div className="flex h-[280px] items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950">
          {error}
        </div>
      </ChartCard>
    );
  }
  if (!data?.length) {
    return (
      <ChartCard title={title} className={className}>
        <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 text-sm text-slate-500 dark:border-slate-800">
          <span>No activity types found.</span>
        </div>
      </ChartCard>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const slices = data.map((d, i) => {
    const percent = total > 0 ? (d.count / total) * 100 : 0;
    return { ...d, percent, color: TYPE_COLORS[d.type] || "#94a3b8" };
  });

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;
  const innerR = r * 0.55;

  let cumulativePercent = 0;
  const paths = slices.map((slice, i) => {
    const startAngle = (cumulativePercent / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((cumulativePercent + slice.percent) / 100) * 2 * Math.PI - Math.PI / 2;
    cumulativePercent += slice.percent;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const x1Inner = cx + innerR * Math.cos(startAngle);
    const y1Inner = cy + innerR * Math.sin(startAngle);
    const x2Inner = cx + innerR * Math.cos(endAngle);
    const y2Inner = cy + innerR * Math.sin(endAngle);

    const largeArc = slice.percent > 50 ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x2Inner} ${y2Inner}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}`,
      `Z`,
    ].join(" ");

    return { path, slice, index: i };
  });

  const focusedSlice = focusIdx != null ? slices[focusIdx] : null;

  return (
    <ChartCard title={title} className={className}>
      <div className="flex flex-col items-center gap-4">
        {/* Donut SVG */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${title} donut chart`}
          className="select-none"
        >
          {paths.map(({ path, slice, index }) => (
            <path
              key={index}
              d={path}
              fill={slice.color}
              stroke="white"
              strokeWidth={2}
              className="transition-opacity cursor-pointer"
              style={{
                opacity: focusIdx == null || focusIdx === index ? 1 : 0.4,
              }}
              onMouseEnter={() => setFocusIdx(index)}
              onMouseLeave={() => setFocusIdx(null)}
              onFocus={() => setFocusIdx(index)}
              onBlur={() => setFocusIdx(null)}
              tabIndex={0}
              role="button"
              aria-label={`${TYPE_LABELS[slice.type] || slice.type}: ${slice.count} (${slice.percent.toFixed(1)}%)`}
            />
          ))}
          {/* Center label */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className="fill-slate-700 text-xs font-medium dark:fill-slate-200"
          >
            Total
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            className="fill-slate-900 text-lg font-semibold dark:fill-slate-100"
          >
            {total.toLocaleString()}
          </text>
        </svg>

        {/* Legend */}
        <div className="w-full space-y-1.5">
          {slices.map((slice, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs cursor-pointer rounded px-2 py-1 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              onMouseEnter={() => setFocusIdx(i)}
              onMouseLeave={() => setFocusIdx(null)}
              style={{
                opacity: focusIdx == null || focusIdx === i ? 1 : 0.5,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {TYPE_LABELS[slice.type] || slice.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span>{slice.count.toLocaleString()}</span>
                <span className="text-slate-400 dark:text-slate-500">
                  ({slice.percent.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {focusedSlice && (
          <div
            className="rounded-md border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
            aria-live="polite"
          >
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {TYPE_LABELS[focusedSlice.type] || focusedSlice.type}
            </div>
            <div className="mt-1 text-slate-600 dark:text-slate-400">
              {focusedSlice.count.toLocaleString()} activities ({focusedSlice.percent.toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}

function ChartCard({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className || ""}`}>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </header>
      {children}
    </section>
  );
}

