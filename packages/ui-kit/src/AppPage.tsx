import { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';

export interface AppPageProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}

export function AppPage({ title, breadcrumbs, actions, filters, children }: AppPageProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        {breadcrumbs && (
          <Breadcrumbs sx={{ mb: 1 }}>
            {breadcrumbs.map((c, i) =>
              c.href ? (
                <Link key={i} href={c.href} underline="hover">
                  {c.label}
                </Link>
              ) : (
                <Typography key={i} color="text.primary">
                  {c.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{title}</Typography>
          {actions}
        </Box>
      </Box>
      {filters && <Box sx={{ mb: 2 }}>{filters}</Box>}
      <Box>{children}</Box>
    </Box>
  );
}

