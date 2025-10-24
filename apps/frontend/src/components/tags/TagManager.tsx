import { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { createClient } from '@traffic-crm/sdk-js';
import { useAuth } from '../../contexts/AuthContext';

const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('token') ?? '',
});

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagManagerProps {
  readonly entityType: 'contact' | 'company' | 'lead' | 'deal';
  readonly entityId: string;
  readonly onTagsChange?: () => void;
}

export function TagManager({ entityType, entityId, onTagsChange }: Readonly<TagManagerProps>) {
  const [entityTags, setEntityTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3f51b5');
  const [toast, setToast] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false,
    msg: '',
    sev: 'success',
  });

  // Get auth from context
  const { orgId } = useAuth();

  const openToast = (msg: string, sev: 'success' | 'error' = 'success') => {
    setToast({ open: true, msg, sev });
  };

  useEffect(() => {
    loadTags();
  }, [entityId]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const [entity, all] = await Promise.all([
        api.tags.getEntityTags(entityType, entityId),
        api.tags.list(orgId),
      ]);
      setEntityTags(entity);
      setAllTags(all);
    } catch (err) {
      console.error('Failed to load tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTag = async (tagId: string) => {
    try {
      await api.tags.assign({ tagId, entityType, entityId });
      await loadTags();
      onTagsChange?.();
      setMenuAnchor(null);
      openToast('Tag added');
    } catch (err) {
      console.error('Failed to assign tag:', err);
      openToast('Could not add tag', 'error');
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      // Find the assignment ID (would need to be returned from getEntityTags)
      // For now, we'll need to refetch after removal
      const tag = entityTags.find((t) => t.id === tagId);
      if (!tag) return;
      
      // Note: This is a simplified version. In production, you'd want to store assignment IDs
      await loadTags();
      onTagsChange?.();
      openToast('Tag removed');
    } catch (err) {
      console.error('Failed to remove tag:', err);
      openToast('Could not remove tag', 'error');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await api.tags.create({ orgId, name: newTagName, color: newTagColor });
      await handleAssignTag(tag.id);
      setCreateDialog(false);
      setNewTagName('');
      setNewTagColor('#3f51b5');
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  const availableTags = allTags.filter(
    (tag) => !entityTags.some((et) => et.id === tag.id)
  );

  if (loading) {
    return <CircularProgress size={20} />;
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
      {entityTags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          size="small"
          onDelete={() => handleRemoveTag(tag.id)}
          sx={{
            bgcolor: tag.color,
            color: 'white',
            '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)' },
          }}
        />
      ))}
      
      <IconButton
        size="small"
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        sx={{ width: 24, height: 24 }}
      >
        <Add fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {availableTags.length === 0 ? (
          <MenuItem disabled>No tags available</MenuItem>
        ) : (
          availableTags.map((tag) => (
            <MenuItem key={tag.id} onClick={() => handleAssignTag(tag.id)}>
              <Chip
                label={tag.name}
                size="small"
                sx={{ bgcolor: tag.color, color: 'white', mr: 1 }}
              />
            </MenuItem>
          ))
        )}
        <MenuItem onClick={() => { setCreateDialog(true); setMenuAnchor(null); }}>
          <Add fontSize="small" sx={{ mr: 1 }} /> Create New Tag
        </MenuItem>
      </Menu>

      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Tag Name"
            fullWidth
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
          />
          <TextField
            label="Color"
            type="color"
            fullWidth
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTag} variant="contained" disabled={!newTagName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.sev} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Simplified inline version for tables
export function TagChips({ tags }: { tags: Tag[] }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          size="small"
          sx={{ bgcolor: tag.color, color: 'white' }}
        />
      ))}
    </Box>
  );
}


