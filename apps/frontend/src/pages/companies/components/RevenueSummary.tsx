import { Card, CardContent, Typography, Stack } from '@mui/material';
import type { CompanyStats } from '../../../types/company';

const fmt = (cents: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cents / 100);

export default function RevenueSummary({ stats }: Readonly<{ stats: CompanyStats }>) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Summary</Typography>
        <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
          <Stack>
            <Typography variant="caption">Contacts</Typography>
            <Typography variant="h6">{stats.contacts}</Typography>
          </Stack>
          <Stack>
            <Typography variant="caption">Active Deals</Typography>
            <Typography variant="h6">{stats.activeDeals}</Typography>
          </Stack>
          <Stack>
            <Typography variant="caption">Won Revenue</Typography>
            <Typography variant="h6">{fmt(stats.wonRevenue || 0)}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
