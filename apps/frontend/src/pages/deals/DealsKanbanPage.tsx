/**
 * Deals Kanban Board Page
 * Sprint 3: FE-KANBAN-01 (UI Skeleton)
 * 
 * Features:
 * - Pipeline selection
 * - Column rendering by stage
 * - Deal cards grouped by stage
 * - Loading states
 * - Empty states
 * 
 * TODO (FE-KANBAN-02): Add drag & drop functionality
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import { AppPage } from '@traffic-crm/ui-kit';
import { useAuth } from '@/contexts/AuthContext';
import { getPipelines, getDealsByPipeline } from '@/services/deals.service';
import type { Deal, Pipeline, Stage } from '@/types/deals';
import { KanbanColumn } from './components/KanbanColumn';

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

      {/* Kanban board */}
      {!loading && stages.length > 0 && (
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
      )}

      {/* Empty stages state */}
      {!loading && stages.length === 0 && (
        <Alert severity="info">
          This pipeline has no stages. Please add stages in <strong>Settings → Pipelines</strong>.
        </Alert>
      )}
    </AppPage>
  );
}
