import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, FilterList, MoreVert } from '@mui/icons-material';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AppPage } from '@traffic-crm/ui-kit';
import { createClient } from '@traffic-crm/sdk-js';
import { useAuth } from '../../contexts/AuthContext';

const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('access_token') ?? '',
});

interface Deal {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  stageId: string;
  ownerId?: string;
  contactId?: string;
  companyId?: string;
  closeDate?: string;
  Contact?: { id: string; name: string };
  Company?: { id: string; name: string };
  User?: { id: string; name: string };
}

interface Stage {
  id: string;
  name: string;
  order: number;
  probability: number;
}

interface Pipeline {
  id: string;
  name: string;
  Stage: Stage[];
}

export default function DealsKanbanPage() {
  const { orgId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    loadPipelines();
  }, []);

  useEffect(() => {
    if (selectedPipeline) {
      loadDeals();
    }
  }, [selectedPipeline]);

  const loadPipelines = async () => {
    try {
      const data = await api.listPipelines(orgId);
      setPipelines(data);
      if (data.length > 0) {
        setSelectedPipeline(data[0]);
      }
    } catch (err) {
      console.error('Failed to load pipelines:', err);
    }
  };

  const loadDeals = async () => {
    if (!selectedPipeline) return;
    try {
      setLoading(true);
      const data = await api.listDeals({ orgId, pipelineId: selectedPipeline.id });
      setDeals(data.items || []);
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stageId: newStageId } : d))
    );

    try {
      await api.updateDeal(dealId, { stageId: newStageId });
    } catch (err) {
      console.error('Failed to move deal:', err);
      // Rollback
      await loadDeals();
    }
  };

  const dealsByStage = (stageId: string) =>
    deals.filter((d) => d.stageId === stageId);

  const activeDeal = deals.find((d) => d.id === activeId);

  return (
    <AppPage
      title="Deals Board"
      actions={
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Pipeline</InputLabel>
            <Select
              value={selectedPipeline?.id || ''}
              onChange={(e) => {
                const p = pipelines.find((x) => x.id === e.target.value);
                if (p) setSelectedPipeline(p);
              }}
              label="Pipeline"
            >
              {pipelines.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton size="small">
            <FilterList />
          </IconButton>
          <Button variant="contained" startIcon={<Add />}>
            New Deal
          </Button>
        </Box>
      }
    >
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {selectedPipeline?.Stage.sort((a, b) => a.order - b.order).map((stage) => (
              <Box
                key={stage.id}
                sx={{
                  minWidth: 320,
                  maxWidth: 320,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {stage.name}
                  </Typography>
                  <Chip label={dealsByStage(stage.id).length} size="small" />
                </Box>

                <SortableContext items={dealsByStage(stage.id).map((d) => d.id)} strategy={verticalListSortingStrategy}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {dealsByStage(stage.id).map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </Box>
                </SortableContext>
              </Box>
            ))}
          </Box>

          <DragOverlay>
            {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </AppPage>
  );
}

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

function DealCard({ deal, isDragging }: DealCardProps) {
  return (
    <Card
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        '&:hover': { boxShadow: 2 },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {deal.title}
          </Typography>
          <IconButton size="small">
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
          ${(deal.amountCents / 100).toLocaleString()}
        </Typography>

        {deal.Company && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {deal.Company.name}
          </Typography>
        )}

        {deal.Contact && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {deal.Contact.name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

