import * as React from 'react';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import type { Message } from '../types';

export default function MessageItem({ m, isMine }: { m: Message; isMine: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', my: 0.5 }}>
      {!isMine && (
        <Avatar sx={{ width: 28, height: 28, mr: 1 }}>{m.sender.name.slice(0, 1)}</Avatar>
      )}
      <Card
        elevation={0}
        sx={{
          maxWidth: '75%',
          bgcolor: isMine ? 'primary.main' : 'background.paper',
          color: isMine ? 'primary.contrastText' : 'text.primary'
        }}
      >
        <CardContent sx={{ py: 1, px: 1.5 }}>
          {m.text && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {m.text}
            </Typography>
          )}
          {!!m.attachments?.length && (
            <Box sx={{ mt: 0.5 }}>
              {m.attachments.map((a) => (
                <Typography key={a.id} variant="caption" sx={{ display: 'block' }}>
                  📎{' '}
                  <a href={a.url} target="_blank" rel="noreferrer">
                    {a.name}
                  </a>
                </Typography>
              ))}
            </Box>
          )}
          {m.status === 'sending' && (
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              sending…
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
