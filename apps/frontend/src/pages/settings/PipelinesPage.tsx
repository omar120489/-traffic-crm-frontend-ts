import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, DragIndicator } from '@mui/icons-material';
import { AppPage, DataTable, type Column } from '@ui-kit/core';
import { createClient } from '@traffic-crm/sdk-js';

const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('token') ?? '',
});

interface Pipeline {
  id: string;
  name: string;
  isDefault: boolean;
  Stage?: Stage[];
}

interface Stage {
  id: string;
  name: string;
  order: number;
  probability: number;
}

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [pipelineDialog, setPipelineDialog] = useState(false);
  const [stageDialog, setStageDialog] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);

  const orgId = 'acme'; // TODO: Get from auth context

  useEffect(() => {
    loadPipelines();
  }, []);

  const loadPipelines = async () => {
    try {
      setLoading(true);
      const data = await api.listPipelines(orgId);
      setPipelines(data);
      if (data.length > 0 && !selectedPipeline) {
        setSelectedPipeline(data[0]);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load pipelines');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePipeline = async (name: string) => {
    try {
      await api.createPipeline({ orgId, name, isDefault: pipelines.length === 0 });
      await loadPipelines();
      setPipelineDialog(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create pipeline');
    }
  };

  const handleDeletePipeline = async (id: string) => {
    if (!confirm('Delete this pipeline? All stages will be removed.')) return;
    try {
      await api.deletePipeline(id);
      await loadPipelines();
      if (selectedPipeline?.id === id) {
        setSelectedPipeline(pipelines[0] || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete pipeline');
    }
  };

  const handleCreateStage = async (name: string, probability: number) => {
    if (!selectedPipeline) return;
    try {
      const maxOrder = Math.max(...(selectedPipeline.Stage?.map((s) => s.order) || [0]), 0);
      await api.createStage({
        orgId,
        pipelineId: selectedPipeline.id,
        name,
        order: maxOrder + 1,
        probability,
      });
      await loadPipelines();
      setStageDialog(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create stage');
    }
  };

  const handleUpdateStage = async (id: string, name: string, probability: number) => {
    try {
      await api.updateStage(id, { name, probability });
      await loadPipelines();
      setStageDialog(false);
      setEditingStage(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update stage');
    }
  };

  const handleDeleteStage = async (id: string) => {
    if (!confirm('Delete this stage?')) return;
    try {
      await api.deleteStage(id);
      await loadPipelines();
    } catch (err: any) {
      setError(err.message || 'Failed to delete stage');
    }
  };

  const handleReorderStages = async (stageIds: string[]) => {
    if (!selectedPipeline) return;
    try {
      await api.reorderStages(selectedPipeline.id, stageIds);
      await loadPipelines();
    } catch (err: any) {
      setError(err.message || 'Failed to reorder stages');
    }
  };

  const pipelineColumns: Column<Pipeline>[] = [
    { key: 'name', header: 'Pipeline Name' },
    {
      key: 'isDefault',
      header: 'Default',
      render: (row) => (row.isDefault ? <Chip label="Default" size="small" color="primary" /> : null),
    },
    {
      key: 'id',
      header: 'Stages',
      render: (row) => <Chip label={`${row.Stage?.length || 0} stages`} size="small" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => setSelectedPipeline(row)}>
            View Stages
          </Button>
          <IconButton size="small" onClick={() => handleDeletePipeline(row.id)} disabled={row.isDefault}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const stageColumns: Column<Stage>[] = [
    {
      key: 'order',
      header: '',
      width: 40,
      render: () => <DragIndicator sx={{ cursor: 'move', color: 'text.disabled' }} />,
    },
    { key: 'name', header: 'Stage Name' },
    {
      key: 'probability',
      header: 'Win Probability',
      render: (row) => `${row.probability}%`,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => {
              setEditingStage(row);
              setStageDialog(true);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteStage(row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AppPage
      title="Pipelines & Stages"
      breadcrumbs={[{ label: 'Settings' }, { label: 'Pipelines' }]}
      actions={
        <Button variant="contained" startIcon={<Add />} onClick={() => setPipelineDialog(true)}>
          New Pipeline
        </Button>
      }
    >
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <DataTable
          rows={pipelines}
          columns={pipelineColumns}
          page={1}
          pageSize={pipelines.length}
          total={pipelines.length}
        />
      </Box>

      {selectedPipeline && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Box sx={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedPipeline.name} — Stages</Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Drag to reorder stages (coming soon)
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<Add />} onClick={() => setStageDialog(true)}>
              Add Stage
            </Button>
          </Box>

          <DataTable
            rows={selectedPipeline.Stage || []}
            columns={stageColumns}
            page={1}
            pageSize={selectedPipeline.Stage?.length || 0}
            total={selectedPipeline.Stage?.length || 0}
          />
        </Box>
      )}

      {/* Create/Edit Pipeline Dialog */}
      <PipelineDialog
        open={pipelineDialog}
        onClose={() => {
          setPipelineDialog(false);
          setEditingPipeline(null);
        }}
        onSave={handleCreatePipeline}
        pipeline={editingPipeline}
      />

      {/* Create/Edit Stage Dialog */}
      <StageDialog
        open={stageDialog}
        onClose={() => {
          setStageDialog(false);
          setEditingStage(null);
        }}
        onSave={(name, probability) => {
          if (editingStage) {
            handleUpdateStage(editingStage.id, name, probability);
          } else {
            handleCreateStage(name, probability);
          }
        }}
        stage={editingStage}
      />
    </AppPage>
  );
}

// Pipeline Dialog Component
function PipelineDialog({
  open,
  onClose,
  onSave,
  pipeline,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  pipeline: Pipeline | null;
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (pipeline) {
      setName(pipeline.name);
    } else {
      setName('');
    }
  }, [pipeline, open]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{pipeline ? 'Edit Pipeline' : 'Create Pipeline'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Pipeline Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()}>
          {pipeline ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Stage Dialog Component
function StageDialog({
  open,
  onClose,
  onSave,
  stage,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, probability: number) => void;
  stage: Stage | null;
}) {
  const [name, setName] = useState('');
  const [probability, setProbability] = useState(50);

  useEffect(() => {
    if (stage) {
      setName(stage.name);
      setProbability(stage.probability);
    } else {
      setName('');
      setProbability(50);
    }
  }, [stage, open]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name, probability);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{stage ? 'Edit Stage' : 'Create Stage'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Stage Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <TextField
          label="Win Probability (%)"
          type="number"
          fullWidth
          value={probability}
          onChange={(e) => setProbability(Math.max(0, Math.min(100, Number(e.target.value))))}
          inputProps={{ min: 0, max: 100 }}
          helperText="Likelihood of winning deals in this stage (0-100%)"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()}>
          {stage ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


