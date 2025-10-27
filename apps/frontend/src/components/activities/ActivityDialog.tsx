import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material';

export interface ActivityDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: ActivityFormData) => Promise<void>;
  readonly entityType: 'contact' | 'company' | 'lead' | 'deal';
  readonly entityId: string;
}

export interface ActivityFormData {
  type: string;
  subject?: string;
  body: string;
  dueAt?: string;
}

const ACTIVITY_TYPES = [
  { value: 'note', label: 'Note' },
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' }
] as const;

export function ActivityDialog({ open, onClose, onSave }: ActivityDialogProps) {
  const [type, setType] = useState('note');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setType('note');
      setSubject('');
      setBody('');
      setDueAt('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!body.trim()) return;

    try {
      setSubmitting(true);
      await onSave({
        type,
        subject: subject || undefined,
        body,
        dueAt: dueAt || undefined
      });
      onClose();
    } catch (err) {
      console.error('Failed to save activity:', err);
      // Error handling is done by parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Activity</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Type"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        >
          {ACTIVITY_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Subject (optional)"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ mb: 2 }}
          placeholder={`Quick summary of this ${type}`}
        />

        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyPress={handleKeyPress}
          required
          placeholder="Add details about this activity..."
          sx={{ mb: 2 }}
        />

        {type === 'task' && (
          <TextField
            label="Due Date"
            type="datetime-local"
            fullWidth
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            helperText="Optional: Set a due date for this task"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!body.trim() || submitting}>
          {submitting ? 'Saving...' : 'Add Activity'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
