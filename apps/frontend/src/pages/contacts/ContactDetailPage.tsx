import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import { Edit, Delete, Add, Email, Phone, Business } from '@mui/icons-material';
import { AppPage, EntityTimeline, type TimelineEvent } from '@ui-kit/core';
import { createClient } from '@traffic-crm/sdk-js';

const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('token') ?? '',
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

  const orgId = 'acme'; // TODO: Get from auth context
  const userId = 'user-1'; // TODO: Get from auth context

  useEffect(() => {
    if (id) {
      loadContact();
      loadActivities();
    }
  }, [id]);

  const loadContact = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getContact(id);
      setContact(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load contact');
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    if (!id) return;
    try {
      const data = await api.listActivities('contact', id);
      setActivities(data);
    } catch (err: any) {
      console.error('Failed to load activities:', err);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this contact?')) return;
    try {
      await api.deleteContact(id);
      navigate('/contacts');
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
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
      User: { id: userId, name: 'You' },
    };
    setActivities([tempActivity, ...activities]);
    setActivityDialog(false);

    try {
      setSubmitting(true);
      await api.createActivity({
        orgId,
        type: activityType,
        entityType: 'contact',
        entityId: id,
        authorId: userId,
        subject: activitySubject || undefined,
        body: activityBody,
      });
      
      // Reload to get real data
      await loadActivities();
      
      // Reset form
      setActivitySubject('');
      setActivityBody('');
      setActivityType('note');
    } catch (err: any) {
      setError(err.message || 'Failed to create activity');
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
    body: a.body,
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
          <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/contacts/${id}/edit`)}>
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

      <Grid container spacing={3}>
        {/* Contact Info Card */}
        <Grid item xs={12} md={4}>
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
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
        </Grid>
      </Grid>

      {/* Add Activity Dialog */}
      <Dialog open={activityDialog} onClose={() => setActivityDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Activity</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Type"
            fullWidth
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            SelectProps={{ 
              native: true,
              inputProps: { 'aria-label': 'Activity type' }
            }}
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
          </TextField>
          
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
    </AppPage>
  );
}


