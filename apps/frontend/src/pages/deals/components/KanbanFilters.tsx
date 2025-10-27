/**
 * Kanban Filters Component
 * Sprint 3: FE-KANBAN-03
 * Provides owner, tag, and search filters with debouncing
 */

import { useEffect, useState } from 'react';
import { TextField, Autocomplete, Chip, Button, Stack, Box } from '@mui/material';
import { Clear } from '@mui/icons-material';
import type { FilterOption } from '@/types/deals';

export interface KanbanFiltersValue {
  readonly ownerIds: readonly string[];
  readonly tagIds: readonly string[];
  readonly q: string;
}

export interface KanbanFiltersProps {
  readonly owners: readonly FilterOption[];
  readonly tags: readonly FilterOption[];
  readonly value: KanbanFiltersValue;
  readonly onChange: (next: KanbanFiltersValue) => void;
  readonly onClear: () => void;
  readonly loading?: boolean;
}

export function KanbanFilters({
  owners,
  tags,
  value,
  onChange,
  onClear,
  loading = false
}: Readonly<KanbanFiltersProps>) {
  const [searchQuery, setSearchQuery] = useState(value.q);

  // Debounce search query (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== value.q) {
        onChange({ ...value, q: searchQuery });
      }
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Sync search query when value changes externally (e.g., URL change)
  useEffect(() => {
    if (value.q !== searchQuery) {
      setSearchQuery(value.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.q]);

  const selectedOwners = owners.filter((o) => value.ownerIds.includes(o.id));
  const selectedTags = tags.filter((t) => value.tagIds.includes(t.id));

  const hasActiveFilters =
    value.ownerIds.length > 0 || value.tagIds.length > 0 || value.q.length > 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        {/* Owner Filter */}
        <Autocomplete
          multiple
          size="small"
          sx={{ minWidth: 240 }}
          options={owners}
          value={selectedOwners}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          onChange={(_, selected) => {
            onChange({
              ...value,
              ownerIds: selected.map((s) => s.id)
            });
          }}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.id} label={option.name} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Owners" placeholder="Filter by owner" />
          )}
          disabled={loading}
        />

        {/* Tag Filter */}
        <Autocomplete
          multiple
          size="small"
          sx={{ minWidth: 240 }}
          options={tags}
          value={selectedTags}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          onChange={(_, selected) => {
            onChange({
              ...value,
              tagIds: selected.map((s) => s.id)
            });
          }}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.id} label={option.name} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Tags" placeholder="Filter by tag" />
          )}
          disabled={loading}
        />

        {/* Search */}
        <TextField
          size="small"
          sx={{ minWidth: 240 }}
          label="Search"
          placeholder="Name, company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Clear />}
            onClick={onClear}
            disabled={loading}
          >
            Clear Filters
          </Button>
        )}
      </Stack>
    </Box>
  );
}
