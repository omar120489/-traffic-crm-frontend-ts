import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { AppPage } from '@traffic-crm/ui-kit';
import { createClient } from '@traffic-crm/sdk-js';
import { useAuth } from '../../contexts/AuthContext';

const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('access_token') ?? '',
});

interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  title?: string;
}

interface Deal {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  status: string;
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orgId: _orgId } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCompany();
      loadContacts();
      loadDeals();
    }
  }, [id]);

  const loadCompany = async () => {
    if (!id) return;
    try {
      const data = await api.getCompany(id);
      setCompany(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    if (!id) return;
    try {
      const data = await api.listContacts({ companyId: id });
      setContacts(data.items || []);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const loadDeals = async () => {
    if (!id) return;
    try {
      const data = await api.listDeals({ companyId: id });
      setDeals(data.items || []);
    } catch (err) {
      console.error('Failed to load deals:', err);
    }
  };

  const totalRevenue = deals
    .filter((d) => d.status === 'won')
    .reduce((sum, d) => sum + d.amountCents, 0);

  if (loading) return <AppPage title="Loading..."><Typography>Loading...</Typography></AppPage>;
  if (error) return <AppPage title="Error"><Alert severity="error">{error}</Alert></AppPage>;
  if (!company) return <AppPage title="Not Found"><Alert severity="warning">Company not found</Alert></AppPage>;

  return (
    <AppPage
      title={company.name}
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Edit />}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />}>
            Delete
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Company Info */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  Industry
                </Typography>
                <Typography variant="body1">{company.industry || '—'}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  Size
                </Typography>
                <Typography variant="body1">{company.size || '—'}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  Website
                </Typography>
                <Typography variant="body1">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  ) : (
                    '—'
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Revenue (Won)
              </Typography>
              <Typography variant="h5" sx={{ color: 'success.main', mt: 1 }}>
                ${(totalRevenue / 100).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Active Deals
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {deals.filter((d) => d.status === 'open').length}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Contacts
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {contacts.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Contacts */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contacts ({contacts.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {contacts.map((contact) => (
                <Box
                  key={contact.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <Typography variant="subtitle2">{contact.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contact.title || 'No title'} • {contact.email || 'No email'}
                  </Typography>
                </Box>
              ))}
              {contacts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No contacts yet
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Deals */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Deals ({deals.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {deals.map((deal) => (
                <Box
                  key={deal.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{deal.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {deal.status}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary.main">
                    ${(deal.amountCents / 100).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              {deals.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No deals yet
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AppPage>
  );
}

