import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Edit, Delete, Add, Email, Phone, Business } from '@mui/icons-material';
import { AppPage, EntityTimeline, type TimelineEvent } from '@traffic-crm/ui-kit';
import { createClient } from '@traffic-crm/sdk-js';
import { useAuth } from '../../contexts/AuthContext';

const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('token') ?? ''
});

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  Company?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  type: string;
  subject?: string;
  body?: string;
  createdAt: string;
  User?: { id: string; name: string };
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Activity dialog
  const [activityDialog, setActivityDialog] = useState(false);
  const [activityType, setActivityType] = useState('note');
  const [activitySubject, setActivitySubject] = useState('');
  const [activityBody, setActivityBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actToast, setActToast] = useState(false);

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    setActivityType(e.target.value);
  };

  // Get auth from context
  const { orgId, userId } = useAuth();

  const loadContact = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getContact(id);
      setContact(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load contact');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadActivities = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.activities.list('contact', id);
      setActivities(data);
    } catch (err: unknown) {
      console.error('Failed to load activities:', err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadContact();
      loadActivities();
    }
  }, [id, loadContact, loadActivities]);

  const handleDelete = async () => {
    if (!id || !confirm('Delete this contact?')) return;
    try {
      await api.deleteContact(id);
      navigate('/contacts');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
    }
  };

  const handleCreateActivity = async () => {
    if (!id || !activityBody.trim()) return;

    // Optimistic update
    const tempActivity: Activity = {
      id: `temp-${Date.now()}`,
      type: activityType,
      subject: activitySubject,
      body: activityBody,
      createdAt: new Date().toISOString(),
      User: { id: userId, name: 'You' }
    };
    setActivities([tempActivity, ...activities]);
    setActivityDialog(false);

    try {
      setSubmitting(true);
      await api.activities.create({
        orgId,
        type: activityType,
        entityType: 'contact',
        entityId: id,
        authorId: userId,
        subject: activitySubject || undefined,
        body: activityBody
      });

      // Reload to get real data
      await loadActivities();

      // Reset form
      setActivitySubject('');
      setActivityBody('');
      setActivityType('note');

      // Show success toast
      setActToast(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      // Rollback optimistic update
      setActivities(activities.filter((a) => a.id !== tempActivity.id));
    } finally {
      setSubmitting(false);
    }
  };

  const timelineEvents: TimelineEvent[] = activities.map((a) => ({
    id: a.id,
    at: a.createdAt,
    type: a.type,
    subject: a.subject,
    body: a.body
  }));

  if (loading) {
    return (
      <AppPage title="Loading..." breadcrumbs={[{ label: 'Contacts', href: '/contacts' }]}>
        <Box sx={{ textAlign: 'center', py: 4 }}>Loading contact...</Box>
      </AppPage>
    );
  }

  if (!contact) {
    return (
      <AppPage title="Not Found" breadcrumbs={[{ label: 'Contacts', href: '/contacts' }]}>
        <Alert severity="error">Contact not found</Alert>
      </AppPage>
    );
  }

  return (
    <AppPage
      title={contact.name}
      breadcrumbs={[{ label: 'Contacts', href: '/contacts' }, { label: contact.name }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/contacts/${id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      }
    >
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Contact Info Card */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 1 calc(33.333% - 16px)' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {contact.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{contact.email}</Typography>
                </Box>
              )}

              {contact.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{contact.phone}</Typography>
                </Box>
              )}

              {contact.title && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="body2">{contact.title}</Typography>
                </Box>
              )}

              {contact.Company && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Business fontSize="small" color="action" />
                  <Chip label={contact.Company.name} size="small" />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Activity Timeline */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Typography variant="h6">Activity Timeline</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setActivityDialog(true)}
                >
                  Add Note
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {activities.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No activities yet. Add a note to get started.
                </Box>
              ) : (
                <EntityTimeline events={timelineEvents} />
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Activity Dialog */}
      <Dialog
        open={activityDialog}
        onClose={() => setActivityDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Activity</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="activity-type-label">Activity type</InputLabel>
            <Select
              labelId="activity-type-label"
              id="activity-type"
              label="Activity type"
              value={activityType}
              onChange={handleTypeChange}
            >
              <MenuItem value="note">Note</MenuItem>
              <MenuItem value="call">Call</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="task">Task</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Subject (optional)"
            fullWidth
            value={activitySubject}
            onChange={(e) => setActivitySubject(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={activityBody}
            onChange={(e) => setActivityBody(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivityDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateActivity}
            variant="contained"
            disabled={!activityBody.trim() || submitting}
          >
            {submitting ? 'Saving...' : 'Add Activity'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activity Success Toast */}
      <Snackbar
        open={actToast}
        autoHideDuration={2000}
        onClose={() => setActToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setActToast(false)} severity="success" variant="filled">
          Activity created
        </Alert>
      </Snackbar>
    </AppPage>
  );
}
