import { type ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

export interface PaginationToolbarProps {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  size: number;
  /** Current search query */
  search: string;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  loading?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onSizeChange: (size: number) => void;
  /** Callback when search changes */
  onSearchChange: (search: string) => void;
  /** Optional refresh callback */
  onRefresh?: () => void;
}

/**
 * Reusable pagination toolbar with search, page size selector, and pagination controls
 *
 * @example
 * ```tsx
 * <PaginationToolbar
 *   page={page}
 *   size={size}
 *   search={search}
 *   total={data.total}
 *   totalPages={data.totalPages}
 *   loading={loading}
 *   onPageChange={setPage}
 *   onSizeChange={setSize}
 *   onSearchChange={setSearch}
 *   onRefresh={refetch}
 * />
 * ```
 */
export default function PaginationToolbar({
  page,
  size,
  search,
  total,
  totalPages,
  loading = false,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onSizeChange,
  onSearchChange,
  onRefresh
}: PaginationToolbarProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
    // Reset to page 1 when search changes
    if (page !== 1) {
      onPageChange(1);
    }
  };

  const handleSizeChange = (event: any) => {
    const newSize = Number(event.target.value);
    onSizeChange(newSize);
    if (page !== 1) {
      onPageChange(1);
    }
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, newPage: number) => {
    onPageChange(newPage);
  };

  const startItem = total === 0 ? 0 : (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top Controls: Search + Refresh */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <TextField
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          disabled={loading}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        )}
      </Box>

      {/* Bottom Controls: Pagination + Info */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        {/* Left: Items info + Page size selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {total === 0 ? 'No items' : `Showing ${startItem}-${endItem} of ${total}`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Per page:
            </Typography>
            <Select
              value={size}
              onChange={handleSizeChange}
              size="small"
              disabled={loading}
              sx={{ minWidth: 70 }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Right: Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            disabled={loading}
            color="primary"
            showFirstButton
            showLastButton
          />
        )}
      </Box>
    </Box>
  );
}
