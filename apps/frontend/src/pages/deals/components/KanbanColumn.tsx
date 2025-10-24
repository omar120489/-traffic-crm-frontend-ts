/**
 * Kanban Column Component
 * Sprint 3: FE-KANBAN-01
 * Displays a pipeline stage column with deals
 */

import { Card, CardHeader, CardContent, Stack, Typography, Box, Chip } from '@mui/material';
import type { Deal, Stage } from '@/types/deals';
import { KanbanCard } from './KanbanCard';

export interface KanbanColumnProps {
  readonly stage: Stage;
  readonly deals: readonly Deal[];
  readonly onDealClick?: (dealId: string) => void;
}

export function KanbanColumn({ stage, deals, onDealClick }: Readonly<KanbanColumnProps>) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.amountCents, 0);

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <Card
      sx={{
        width: 340,
        minHeight: 400,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {stage.name}
            </Typography>
            <Chip
              label={deals.length}
              size="small"
              color="default"
              sx={{ fontWeight: 600, minWidth: 32 }}
            />
          </Stack>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(totalValue)}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0, flexGrow: 1, overflowY: 'auto' }}>
        {deals.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No deals in this stage
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {deals.map((deal) => (
              <KanbanCard key={deal.id} deal={deal} onClick={onDealClick} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

