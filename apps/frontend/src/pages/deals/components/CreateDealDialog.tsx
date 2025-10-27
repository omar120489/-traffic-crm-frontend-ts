/**
 * Create Deal Dialog Component
 * Sprint 3: FE-KANBAN-04
 * Dialog for creating new deals
 */

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  InputAdornment
} from '@mui/material';
import type { Deal, Stage } from '@/types/deals';

export interface CreateDealInput {
  readonly name: string;
  readonly amountCents: number;
  readonly stageId: string;
  readonly companyId?: string;
  readonly ownerId?: string;
}

export interface CreateDealDialogProps {
  readonly open: boolean;
  readonly stages: readonly Stage[];
  readonly defaultStageId?: string;
  readonly onClose: () => void;
  readonly onCreate: (input: CreateDealInput) => Promise<Deal>;
}

export function CreateDealDialog({
  open,
  stages,
  defaultStageId,
  onClose,
  onCreate
}: Readonly<CreateDealDialogProps>) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [stageId, setStageId] = useState(defaultStageId ?? '');
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(
    () => name.trim().length > 0 && typeof amount === 'number' && amount >= 0 && stageId,
    [name, amount, stageId]
  );

  const reset = () => {
    setName('');
    setAmount('');
    setStageId(defaultStageId ?? '');
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleCreate = async () => {
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      await onCreate({
        name: name.trim(),
        amountCents: typeof amount === 'number' ? Math.round(amount * 100) : 0,
        stageId
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create deal:', error);
      // Error handling is done by parent component (toast)
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isValid && !submitting) {
      e.preventDefault();
      void handleCreate();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Deal</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Deal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Acme Corp - Q1 Contract"
            required
            fullWidth
          />

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              setAmount(v === '' ? '' : Number(v));
            }}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0, step: 100 }
            }}
            placeholder="0"
            required
            fullWidth
          />

          <TextField
            select
            label="Stage"
            value={stageId}
            onChange={(e) => setStageId(e.target.value)}
            required
            fullWidth
          >
            {stages.map((stage) => (
              <MenuItem key={stage.id} value={stage.id}>
                {stage.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" disabled={!isValid || submitting}>
          {submitting ? 'Creating...' : 'Create Deal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
