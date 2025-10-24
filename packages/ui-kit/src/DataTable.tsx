import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box, Pagination } from '@mui/material';

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
  width?: number | string;
};

export interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: Column<T>[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  page,
  pageSize,
  total,
  onPageChange,
}: DataTableProps<T>) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={String(c.key)} sx={{ width: c.width }}>
                {c.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              {columns.map((c) => (
                <TableCell key={String(c.key)}>
                  {c.render ? c.render(r) : (r[c.key] as ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination page={page} count={pageCount} onChange={(_, p) => onPageChange?.(p)} />
      </Box>
    </Box>
  );
}

