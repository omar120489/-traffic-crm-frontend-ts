/**
 * Kanban Card Component
 * Sprint 3: FE-KANBAN-01
 * Displays a single deal card in the Kanban board
 */

import { Card, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import { AttachMoney, Person, Business } from '@mui/icons-material';
import type { Deal } from '@/types/deals';

export interface KanbanCardProps {
  readonly deal: Deal;
  readonly onClick?: (dealId: string) => void;
}

export function KanbanCard({ deal, onClick }: Readonly<KanbanCardProps>) {
  const handleClick = () => {
    if (onClick) {
      onClick(deal.id);
    }
  };

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
      variant="outlined"
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              boxShadow: 2,
              borderColor: 'primary.main',
            }
          : undefined,
        transition: 'all 0.2s',
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          {/* Deal Name */}
          <Typography variant="subtitle2" fontWeight={600} noWrap title={deal.name}>
            {deal.name}
          </Typography>

          {/* Amount */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography variant="body2" fontWeight={600} color="success.main">
              {formatCurrency(deal.amountCents)}
            </Typography>
          </Stack>

          {/* Company */}
          {deal.companyName && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {deal.companyName}
              </Typography>
            </Stack>
          )}

          {/* Owner */}
          {deal.ownerName && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {deal.ownerName}
              </Typography>
            </Stack>
          )}

          {/* Tags */}
          {deal.tags && deal.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {deal.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              ))}
              {deal.tags.length > 3 && (
                <Chip
                  label={`+${deal.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

