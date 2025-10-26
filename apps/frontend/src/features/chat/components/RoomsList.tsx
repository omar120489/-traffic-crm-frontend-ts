// React import not needed with new JSX transform
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRooms } from '../hooks/useRooms';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function RoomsList() {
  const { rooms, filters, setFilter, loading } = useRooms();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const currentRoom = params.get('room');

  return (
    <Box
      sx={{
        width: 360,
        borderRight: 1,
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations…"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start">🔎</InputAdornment> }}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Tooltip title="Only unread">
            <IconButton
              onClick={() => setFilter('onlyUnread', !filters.onlyUnread)}
              color={filters.onlyUnread ? 'primary' : 'default'}
              size="small"
            >
              🟣
            </IconButton>
          </Tooltip>
          <Tooltip title="DMs">
            <IconButton
              onClick={() => setFilter('type', filters.type === 'dm' ? '' : 'dm')}
              color={filters.type === 'dm' ? 'primary' : 'default'}
              size="small"
            >
              👤
            </IconButton>
          </Tooltip>
          <Tooltip title="Groups">
            <IconButton
              onClick={() => setFilter('type', filters.type === 'group' ? '' : 'group')}
              color={filters.type === 'group' ? 'primary' : 'default'}
              size="small"
            >
              👥
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List disablePadding>
          {rooms.map((r) => {
            const primary = r.name || r.participants.map((p) => p.name).join(', ');
            const selected = currentRoom === r.id;
            return (
              <ListItemButton
                key={r.id}
                selected={selected}
                onClick={() => nav(`/chat?room=${encodeURIComponent(r.id)}`, { replace: false })}
              >
                <Badge
                  color="primary"
                  badgeContent={r.unreadCount || 0}
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar sx={{ mr: 1 }}>{primary.slice(0, 1)}</Avatar>
                </Badge>
                <ListItemText
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" noWrap>
                        {primary}
                      </Typography>
                      {r.lastMessageAt && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.lastMessageAt).toLocaleTimeString()}
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondary={r.entityRef ? `${r.entityRef.type} • ${r.entityRef.id}` : undefined}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            );
          })}
          {!rooms.length && !loading && (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No conversations</Box>
          )}
        </List>
      </Box>
    </Box>
  );
}
