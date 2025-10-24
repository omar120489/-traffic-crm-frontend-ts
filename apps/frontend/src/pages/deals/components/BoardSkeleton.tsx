/**
 * Board Skeleton Component
 * Sprint 3: FE-KANBAN-04
 * Loading skeleton for Kanban board
 */

import { Skeleton, Stack, Card, CardContent, Box } from '@mui/material';

export function BoardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
      }}
    >
      {Array.from({ length: 4 }).map((_, columnIndex) => (
        <Card
          key={columnIndex}
          sx={{
            width: 340,
            minHeight: 400,
            flexShrink: 0,
          }}
        >
          <CardContent>
            {/* Column header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="circular" width={32} height={32} />
            </Stack>
            
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />

            {/* Deal cards */}
            <Stack spacing={1.5}>
              {Array.from({ length: 3 }).map((__, cardIndex) => (
                <Card key={cardIndex} variant="outlined">
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
                    <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                      <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 1 }} />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

