// React import not needed with new JSX transform
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useRoomMessages } from '../hooks/useRoomMessages';
import MessageItem from './MessageItem';
import MessageComposer from './MessageComposer';

export default function RoomView() {
  const [params] = useSearchParams();
  const roomId = params.get('room');
  const { messages, hasMore, loading, error, loadMore, send } = useRoomMessages(roomId);

  if (!roomId) {
    return (
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', color: 'text.secondary' }}>
        Select a conversation
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="h6">Room: {roomId}</Typography>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
        {hasMore && (
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={loadMore}>
              {loading ? 'Loading…' : 'Load earlier messages'}
            </Typography>
          </Box>
        )}
        {messages.map((m) => (
          <MessageItem key={m.id} m={m} isMine={m.sender.id === 'me'} />
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}
      </Box>
      <Divider />
      <Box>
        <Stack direction="row" sx={{ width: '100%' }}>
          <MessageComposer onSend={send} />
        </Stack>
      </Box>
    </Box>
  );
}
