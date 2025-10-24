import { Box, Typography, Divider } from '@mui/material';

export type TimelineEvent = {
  id: string;
  at: string; // ISO date string
  type: string; // note, email, call, stage_change
  subject?: string;
  body?: string;
};

export interface EntityTimelineProps {
  events: TimelineEvent[];
}

export function EntityTimeline({ events }: EntityTimelineProps) {
  return (
    <Box sx={{ mt: 2 }}>
      {events.map((e, i) => (
        <Box key={e.id} sx={{ py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(e.at).toLocaleString()}
          </Typography>
          <Typography variant="subtitle2">
            {e.type}
            {e.subject ? ` — ${e.subject}` : ''}
          </Typography>
          {e.body && <Typography variant="body2">{e.body}</Typography>}
          {i < events.length - 1 && <Divider sx={{ mt: 1.5 }} />}
        </Box>
      ))}
    </Box>
  );
}

