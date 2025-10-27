/**
 * Kanban Card Component
 * Sprint 3: FE-KANBAN-02
 * Displays a single deal card in the Kanban board with drag & drop support
 */

import { Card, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import { AttachMoney, Person, Business } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Deal } from '@/types/deals';

export interface KanbanCardProps {
  readonly deal: Deal;
  readonly onClick?: (dealId: string) => void;
}

export function KanbanCard({ deal, onClick }: Readonly<KanbanCardProps>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { type: 'deal', deal }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1
  };

  const handleClick = () => {
    if (onClick && !isDragging) {
      onClick(deal.id);
    }
  };

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.main'
        },
        ...style
      }}
      onClick={handleClick}
      {...attributes}
      {...listeners}
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
