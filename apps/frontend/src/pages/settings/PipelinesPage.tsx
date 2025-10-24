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
  Card,
  CardContent,
} from '@mui/material';
import { Add, Edit, Delete, DragIndicator } from '@mui/icons-material';
import { AppPage, DataTable, type Column } from '@traffic-crm/ui-kit';
import { createClient } from '@traffic-crm/sdk-js';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [pipelineDialog, setPipelineDialog] = useState(false);
  const [stageDialog, setStageDialog] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const orgId = 'clx0d018d000008l701211234'; // From seed data

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !selectedPipeline || active.id === over.id) return;

    const stages = selectedPipeline.Stage || [];
    const oldIndex = stages.findIndex((s) => s.id === active.id);
    const newIndex = stages.findIndex((s) => s.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(stages, oldIndex, newIndex);
    
    // Optimistic update
    setSelectedPipeline({ ...selectedPipeline, Stage: reordered });
    setPipelines(
      pipelines.map((p) =>
        p.id === selectedPipeline.id ? { ...p, Stage: reordered } : p
      )
    );

    try {
      await api.reorderStages(selectedPipeline.id, reordered.map((s) => s.id));
    } catch (err: any) {
      setError(err.message || 'Failed to reorder stages');
      // Rollback on error
      await loadPipelines();
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

  // Sortable Stage Component
  function SortableStageRow({ stage }: { stage: Stage }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: stage.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Card
        ref={setNodeRef}
        style={style}
        sx={{
          mb: 1,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box {...attributes} {...listeners} sx={{ display: 'flex', alignItems: 'center' }}>
            <DragIndicator sx={{ color: 'text.disabled' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontWeight: 500 }}>{stage.name}</Box>
          </Box>
          <Chip label={`${stage.probability}% win`} size="small" />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => {
                setEditingStage(stage);
                setStageDialog(true);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleDeleteStage(stage.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

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
                Drag stages to reorder
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<Add />} onClick={() => setStageDialog(true)}>
              Add Stage
            </Button>
          </Box>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={(selectedPipeline.Stage || []).map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {(selectedPipeline.Stage || []).map((stage) => (
                <SortableStageRow key={stage.id} stage={stage} />
              ))}
            </SortableContext>
          </DndContext>

          {(selectedPipeline.Stage || []).length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              No stages yet. Add your first stage to get started.
            </Box>
          )}
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
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
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
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
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


