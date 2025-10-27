import type { AnalyticsFilters as Filters } from '@/types/analytics';

export interface AnalyticsFiltersProps {
  readonly value: Filters;
  readonly onChange: (filters: Filters) => void;
}

export function AnalyticsFilters({ value, onChange }: AnalyticsFiltersProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, from: e.target.value });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, to: e.target.value });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="date"
            id="from-date"
            value={value.from}
            onChange={handleFromChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="date"
            id="to-date"
            value={value.to}
            onChange={handleToChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="lg:col-span-2 flex items-end">
          <button
            type="button"
            onClick={() =>
              onChange({
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0]
              })
            }
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Reset to Last 30 Days
          </button>
        </div>
      </div>
    </div>
  );
}
