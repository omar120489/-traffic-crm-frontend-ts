/**
 * Deals Kanban Board Page
 * Sprint 3: FE-KANBAN-02 (Drag & Drop)
 * 
 * Features:
 * - Pipeline selection
 * - Column rendering by stage
 * - Deal cards grouped by stage
 * - Drag & drop with optimistic updates
 * - Loading states
 * - Empty states
 * 
 * TODO (FE-KANBAN-03): Add filters (owner, tags, search)
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
} from '@dnd-kit/core';
// import { arrayMove } from '@dnd-kit/sortable'; // Not needed for simple cross-column moves
import { AppPage } from '@traffic-crm/ui-kit';
import { useAuth } from '@/contexts/AuthContext';
import { getPipelines, getDealsByPipeline, moveDeal } from '@/services/deals.service';
import type { Deal, Pipeline, Stage } from '@/types/deals';
import { KanbanColumn } from './components/KanbanColumn';
import { KanbanCard } from './components/KanbanCard';

type StageMap = Record<string, Deal[]>;

export default function DealsKanbanPage() {
  const { orgId } = useAuth();
  const navigate = useNavigate();

  // State
  const [pipelines, setPipelines] = useState<readonly Pipeline[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [deals, setDeals] = useState<readonly Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Computed: selected pipeline
  const selectedPipeline = useMemo(
    () => pipelines.find((p) => p.id === selectedPipelineId),
    [pipelines, selectedPipelineId]
  );

  // Computed: sorted stages
  const stages = useMemo<readonly Stage[]>(() => {
    if (!selectedPipeline) return [];
    return [...selectedPipeline.stages].sort((a, b) => a.order - b.order);
  }, [selectedPipeline]);

  // Computed: deals grouped by stage
  const dealsByStage = useMemo<StageMap>(() => {
    const grouped: StageMap = {};
    
    // Initialize all stages with empty arrays
    stages.forEach((stage) => {
      grouped[stage.id] = [];
    });

    // Group deals by stageId
    deals.forEach((deal) => {
      if (grouped[deal.stageId]) {
        grouped[deal.stageId].push(deal);
      }
    });

    // Sort deals within each stage by position
    Object.keys(grouped).forEach((stageId) => {
      grouped[stageId] = grouped[stageId].sort((a, b) => a.position - b.position);
    });

    return grouped;
  }, [deals, stages]);

  // Load pipelines on mount
  useEffect(() => {
    const loadPipelines = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPipelines(orgId);
        setPipelines(data);

        // Auto-select first pipeline
        if (data.length > 0) {
          setSelectedPipelineId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load pipelines:', err);
        setError('Failed to load pipelines. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadPipelines();
  }, [orgId]);

  // Load deals when pipeline changes
  useEffect(() => {
    if (!selectedPipelineId) return;

    const loadDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDealsByPipeline(selectedPipelineId);
        setDeals(data);
      } catch (err) {
        console.error('Failed to load deals:', err);
        setError('Failed to load deals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadDeals();
  }, [selectedPipelineId]);

  // Handlers
  const handlePipelineChange = (event: SelectChangeEvent<string>) => {
    setSelectedPipelineId(event.target.value);
  };

  const handleDealClick = (dealId: string) => {
    navigate(`/deals/${dealId}`);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d) => d.id === active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = String(active.id);
    const overId = String(over.id);

    // Find source stage
    const sourceStageId = Object.keys(dealsByStage).find((stageId) =>
      dealsByStage[stageId].some((d) => d.id === dealId)
    );

    if (!sourceStageId) return;

    // Determine target stage (could be a stage ID or another deal ID)
    let targetStageId = overId;
    const targetDeal = deals.find((d) => d.id === overId);
    if (targetDeal) {
      targetStageId = targetDeal.stageId;
    }

    // No change if dropped in same position
    if (sourceStageId === targetStageId) {
      const sourceDeals = dealsByStage[sourceStageId];
      const oldIndex = sourceDeals.findIndex((d) => d.id === dealId);
      const newIndex = targetDeal ? sourceDeals.findIndex((d) => d.id === overId) : oldIndex;
      
      if (oldIndex === newIndex) return;
    }

    // Snapshot for rollback
    const previousDeals = [...deals];

    // Optimistic update
    setDeals((currentDeals) => {
      const sourceDeals = dealsByStage[sourceStageId];
      const oldIndex = sourceDeals.findIndex((d) => d.id === dealId);
      const movingDeal = sourceDeals[oldIndex];

      if (!movingDeal) return currentDeals;

      // Rebuild full deals array with updated stageId
      const updatedDeals = currentDeals.map((deal) => {
        if (deal.id === dealId) {
          return { ...deal, stageId: targetStageId };
        }
        return deal;
      });

      return updatedDeals;
    });

    // Persist to backend
    try {
      const targetDeals = dealsByStage[targetStageId] || [];
      const newPosition = targetDeal 
        ? targetDeals.findIndex((d) => d.id === overId)
        : targetDeals.length;

      await moveDeal(dealId, {
        stageId: targetStageId,
        position: Math.max(0, newPosition),
      });

      setToast({
        open: true,
        message: 'Deal moved successfully',
        severity: 'success',
      });

      // Refresh deals to get accurate positions from backend
      const refreshedDeals = await getDealsByPipeline(selectedPipelineId);
      setDeals(refreshedDeals);
    } catch (err) {
      console.error('Failed to move deal:', err);
      
      // Rollback on error
      setDeals(previousDeals);
      
      setToast({
        open: true,
        message: 'Failed to move deal. Please try again.',
        severity: 'error',
      });
    }
  };

  // Render loading state
  if (loading && pipelines.length === 0) {
    return (
      <AppPage title="Deals Board" breadcrumbs={[{ label: 'Deals', href: '/deals' }]}>
        <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading pipelines...
          </Typography>
        </Stack>
      </AppPage>
    );
  }

  // Render error state
  if (error) {
    return (
      <AppPage title="Deals Board" breadcrumbs={[{ label: 'Deals', href: '/deals' }]}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </AppPage>
    );
  }

  // Render empty pipelines state
  if (pipelines.length === 0) {
    return (
      <AppPage title="Deals Board" breadcrumbs={[{ label: 'Deals', href: '/deals' }]}>
        <Alert severity="info" sx={{ mb: 2 }}>
          No pipelines found. Please create a pipeline first in{' '}
          <strong>Settings → Pipelines</strong>.
        </Alert>
      </AppPage>
    );
  }

  return (
    <AppPage
      title="Deals Board"
      breadcrumbs={[{ label: 'Deals', href: '/deals' }]}
      actions={
        <FormControl sx={{ minWidth: 240 }} size="small">
          <InputLabel id="pipeline-select-label">Pipeline</InputLabel>
          <Select
            labelId="pipeline-select-label"
            id="pipeline-select"
            value={selectedPipelineId}
            label="Pipeline"
            onChange={handlePipelineChange}
          >
            {pipelines.map((pipeline) => (
              <MenuItem key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      {/* Loading deals indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Kanban board with drag & drop */}
      {!loading && stages.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: 4,
              },
            }}
          >
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                deals={dealsByStage[stage.id] || []}
                onDealClick={handleDealClick}
              />
            ))}
          </Box>

          {/* Drag overlay for visual feedback */}
          <DragOverlay>
            {activeDeal ? (
              <Box sx={{ opacity: 0.8, transform: 'rotate(5deg)' }}>
                <KanbanCard deal={activeDeal} />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Empty stages state */}
      {!loading && stages.length === 0 && (
        <Alert severity="info">
          This pipeline has no stages. Please add stages in <strong>Settings → Pipelines</strong>.
        </Alert>
      )}

      {/* Toast notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AppPage>
  );
}
