import * as React from "react";
import { format, parseISO } from "date-fns";

type Point = { date: string; count: number };

type Props = Readonly<{
  title?: string;
  data: Point[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  height?: number;
  colorClass?: string;
}>;

const MARGIN = { top: 20, right: 16, bottom: 28, left: 36 };
const TOOLTIP_WIDTH = 140;
const MIN_CONTAINER_WIDTH = 320;
const TICK_COUNTS = { x: 7, y: 5 };

export default function ActivityByDayChart({
  title = "Activity by Day",
  data,
  loading,
  error,
  className = "",
  height = 220,
  colorClass = "stroke-indigo-600 fill-indigo-600/10",
}: Props) {
  // All hooks must be called before any early returns (Rules of Hooks)
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(600);
  const [hover, setHover] = React.useState<number | null>(null);
  const [focusIdx, setFocusIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.max(MIN_CONTAINER_WIDTH, Math.floor(e.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerW = Math.max(0, w - MARGIN.left - MARGIN.right);
  const innerH = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  // Memoize parsed and sorted series (handle empty data gracefully)
  const series = React.useMemo(
    () =>
      data?.length
        ? [...data]
            .map((d) => ({ x: parseISO(d.date).getTime(), y: d.count, date: d.date }))
            .sort((a, b) => a.x - b.x)
        : [],
    [data]
  );

  // Memoize all chart calculations to prevent recomputation on every render
  const { xMin, xMax, xScale, yScale, linePath, areaPath, xTicks, yTicks } = React.useMemo(() => {
    if (!series.length) {
      return {
        xMin: 0,
        xMax: 0,
        xScale: () => 0,
        yScale: () => 0,
        linePath: "",
        areaPath: "",
        xTicks: [],
        yTicks: [],
      };
    }

    const xMin = series[0].x;
    const xMax = series.at(-1)!.x; // Use .at(-1) for cleaner syntax
    const yMax = Math.max(1, Math.max(...series.map((d) => d.y)));

    const xScale = (t: number) =>
      MARGIN.left + ((t - xMin) / Math.max(1, xMax - xMin)) * innerW;
    const yScale = (v: number) => MARGIN.top + innerH - (v / yMax) * innerH;

    const linePath = series
      .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.x)} ${yScale(d.y)}`)
      .join(" ");

    const areaPath =
      `M ${xScale(series[0].x)} ${yScale(0)} ` +
      series.map((d) => `L ${xScale(d.x)} ${yScale(d.y)}`).join(" ") +
      ` L ${xScale(series.at(-1)!.x)} ${yScale(0)} Z`;

    const xTicks = pickTicks(
      series.map((d) => d.x),
      TICK_COUNTS.x
    );
    const yTicks = Array.from({ length: TICK_COUNTS.y }, (_, i) =>
      Math.round((i * yMax) / (TICK_COUNTS.y - 1))
    );

    return { xMin, xMax, xScale, yScale, linePath, areaPath, xTicks, yTicks };
  }, [series, innerW, innerH]);

  // Memoize event handlers to prevent unnecessary re-renders
  const onMove = React.useCallback(
    (evt: React.MouseEvent<SVGSVGElement>) => {
      if (!series.length) return;
      const rect = (evt.currentTarget as SVGSVGElement).getBoundingClientRect();
      const px = evt.clientX - rect.left - MARGIN.left;
      const t = xMin + (px / Math.max(1, innerW)) * (xMax - xMin);
      const idx = nearestIndex(
        series.map((d) => d.x),
        t
      );
      setHover(idx);
    },
    [series, innerW, xMin, xMax]
  );

  const onLeave = React.useCallback(() => {
    setHover(null);
  }, []);

  const focusIndex = focusIdx ?? hover ?? null;
  const focusPoint = focusIndex != null && series[focusIndex] ? series[focusIndex] : null;

  // Memoize tooltip style to avoid recalculation on every render
  const tooltipStyle = React.useMemo(() => {
    if (!focusPoint) return {};

    const left =
      Math.min(Math.max(MARGIN.left, xScale(focusPoint.x)), w - MARGIN.right - TOOLTIP_WIDTH) -
      MARGIN.left;

    return {
      position: "relative" as const,
      left,
      width: TOOLTIP_WIDTH,
    };
  }, [focusPoint, xScale, w]);

  // Early returns AFTER all hooks have been called
  if (loading) {
    return (
      <ChartCard title={title} className={className}>
        <div className="h-[220px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </ChartCard>
    );
  }

  if (error) {
    return (
      <ChartCard title={title} className={className}>
        <div className="flex h-[220px] items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950">
          {error}
        </div>
      </ChartCard>
    );
  }

  if (!series.length) {
    return (
      <ChartCard title={title} className={className}>
        <div className="flex h-[220px] flex-col items-center justify-center rounded-xl border border-slate-200 text-sm text-slate-500 dark:border-slate-800">
          <span>No activity in the selected range.</span>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} className={className}>
      <div ref={containerRef} className="w-full">
        <svg
          role="img"
          aria-label={`${title} line chart`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!series.length) return;
            if (e.key === "ArrowRight") {
              setFocusIdx((i) => (i == null ? 0 : Math.min(series.length - 1, i + 1)));
            } else if (e.key === "ArrowLeft") {
              setFocusIdx((i) => (i == null ? series.length - 1 : Math.max(0, i - 1)));
            }
          }}
          width="100%"
          height={height}
          viewBox={`0 0 ${w} ${height}`}
          className="select-none"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          {yTicks.map((t, i) => (
            <g key={`y-${i}`}>
              <line
                x1={MARGIN.left}
                x2={w - MARGIN.right}
                y1={yScale(t)}
                y2={yScale(t)}
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <text
                x={MARGIN.left - 8}
                y={yScale(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-slate-500 text-[11px]"
              >
                {t}
              </text>
            </g>
          ))}
          {xTicks.map((tx, i) => (
            <g key={`x-${i}`}>
              <line
                x1={xScale(tx)}
                x2={xScale(tx)}
                y1={MARGIN.top}
                y2={height - MARGIN.bottom}
                className="stroke-slate-100 dark:stroke-slate-900"
              />
              <text
                x={xScale(tx)}
                y={height - MARGIN.bottom + 16}
                textAnchor="middle"
                className="fill-slate-500 text-[11px]"
              >
                {format(tx, "MMM d")}
              </text>
            </g>
          ))}

          <path d={areaPath} className={`${colorClass}`} />
          <path
            d={linePath}
            className={`${colorClass} [stroke-width:2]`}
            fill="none"
          />

          {focusPoint && (
            <>
              <line
                x1={xScale(focusPoint.x)}
                x2={xScale(focusPoint.x)}
                y1={MARGIN.top}
                y2={height - MARGIN.bottom}
                className="stroke-indigo-300/60 dark:stroke-indigo-400/60 [stroke-dasharray:3,4]"
              />
              <circle
                cx={xScale(focusPoint.x)}
                cy={yScale(focusPoint.y)}
                r={4.5}
                className="fill-white stroke-indigo-600 dark:fill-slate-900 [stroke-width:2]"
              />
            </>
          )}
        </svg>

        {focusPoint && (
          <div
            className="pointer-events-none -mt-6 translate-x-2 rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200"
            // Inline styles required: dynamic tooltip positioning based on mouse position and chart bounds
            style={tooltipStyle}
            aria-live="polite"
          >
            <div className="font-medium">{format(focusPoint.x, "PPP")}</div>
            <div className="mt-0.5">
              Activities: <span className="font-semibold">{focusPoint.y}</span>
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
}: Readonly<{
  title: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className || ""}`}>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </header>
      {children}
    </section>
  );
}

function pickTicks(xs: number[], desired: number): number[] {
  if (xs.length <= desired) return xs;
  const step = Math.max(1, Math.floor(xs.length / desired));
  const ticks: number[] = [];
  for (let i = 0; i < xs.length; i += step) ticks.push(xs[i]);
  if (ticks.at(-1) !== xs.at(-1)) ticks.push(xs.at(-1)!);
  return ticks;
}

function nearestIndex(xs: number[], target: number): number {
  let lo = 0, hi = xs.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] === target) return mid;
    xs[mid] < target ? (lo = mid) : (hi = mid);
  }
  return Math.abs(xs[lo] - target) <= Math.abs(xs[hi] - target) ? lo : hi;
}

