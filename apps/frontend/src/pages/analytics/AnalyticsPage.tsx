import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { AppPage } from '@traffic-crm/ui-kit';
import { KpiStat, AnalyticsFilters } from '@/components/analytics';
import ActivityByDayChart from '@/components/analytics/ActivityByDayChart';
import ActivityMixChart from '@/components/analytics/ActivityMixChart';
import TopContributorsChart from '@/components/analytics/TopContributorsChart';
import { getAnalytics } from '@/services/analytics.service';
import type { AnalyticsResponse, AnalyticsFilters as Filters } from '@/types/analytics';

export default function AnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize filters from URL or defaults
  const filters: Filters = {
    from: searchParams.get('from') || format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: searchParams.get('to') || format(new Date(), 'yyyy-MM-dd'),
    users: searchParams.get('users')?.split(',').filter(Boolean),
    types: searchParams.get('types')?.split(',').filter(Boolean) as any
  };

    // Load data
  useEffect(() => {
    setLoading(true);
    setError(null);
    getAnalytics(filters)
      .then(setData)
      .catch((err) => setError(err?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [filters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    const params = new URLSearchParams();
    params.set('from', newFilters.from);
    params.set('to', newFilters.to);
    if (newFilters.users && newFilters.users.length > 0) {
      params.set('users', newFilters.users.join(','));
    }
    if (newFilters.types && newFilters.types.length > 0) {
      params.set('types', newFilters.types.join(','));
    }
    setSearchParams(params);
  };

  // Format KPI values
  const formatNumber = (n: number) => n.toLocaleString();
  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <AppPage title="Analytics" breadcrumbs={[{ label: 'Analytics', href: '/analytics' }]}>
      <div className="space-y-6">
        {/* Filters */}
        <AnalyticsFilters value={filters} onChange={handleFiltersChange} />

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-900">
            <p className="font-medium">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* KPIs */}
        <section className="grid gap-4 md:grid-cols-4">
          <KpiStat
            label="Total Activities"
            value={loading ? '—' : formatNumber(data?.kpis.totalActivities || 0)}
            loading={loading}
          />
          <KpiStat
            label="Active Users"
            value={loading ? '—' : formatNumber(data?.kpis.activeUsers || 0)}
            loading={loading}
          />
          <KpiStat
            label="Avg Daily"
            value={loading ? '—' : data?.kpis.avgDailyActivities.toFixed(1) || '0'}
            loading={loading}
          />
          <KpiStat
            label="Median TTF Response"
            value={loading ? '—' : formatDuration(data?.kpis.medianTimeToFirstResponseMs || 0)}
            loading={loading}
            tooltip="Median time to first response"
          />
        </section>

        {/* Charts */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityByDayChart
              data={[...(data?.byDay ?? [])]}
              loading={loading}
              error={error}
              height={260}
            />
          </div>
          <div>
            <ActivityMixChart data={[...(data?.mix ?? [])]} loading={loading} error={error} />
          </div>
        </section>

        <section>
          <TopContributorsChart
            data={[...(data?.topContributors ?? [])]}
            loading={loading}
            error={error}
          />
        </section>

        {/* Empty State */}
        {!loading && !error && data && data.kpis.totalActivities === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium text-slate-900">No data for this period</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </AppPage>
  );
}
