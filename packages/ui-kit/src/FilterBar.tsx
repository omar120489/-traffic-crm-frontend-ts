import { Box } from '@mui/material';
import { ReactNode } from 'react';

export interface FilterBarProps {
  readonly children?: ReactNode;
}

export function FilterBar({ children }: Readonly<FilterBarProps>) {
  return <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{children}</Box>;
}

