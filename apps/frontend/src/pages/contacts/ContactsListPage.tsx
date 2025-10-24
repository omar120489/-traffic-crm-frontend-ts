import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add, Search, FilterList, Edit, Delete, Visibility } from '@mui/icons-material';
import { AppPage, DataTable, FilterBar, type Column } from '@traffic-crm/ui-kit';
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
}

export default function ContactsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters from URL
  const page = Number(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';
  const pageSize = 20;

  // Filter menu
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadContacts();
  }, [page, query]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const result = await api.listContacts({ page, size: pageSize, q: query || undefined });
      setContacts(result.items || []);
      setTotal(result.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q: string) => {
    const params = new URLSearchParams(searchParams);
    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await api.deleteContact(id);
      await loadContacts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
    }
  };

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row: Contact) => (
        <Box
          sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate(`/contacts/${row.id}`)}
        >
          {row.name}
        </Box>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'title', header: 'Title' },
    {
      key: 'Company',
      header: 'Company',
      render: (row: Contact) => (row.Company ? <Chip label={row.Company.name} size="small" /> : null),
    },
    {
      key: 'id',
      header: 'Actions',
      width: 120,
      render: (row: Contact) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(`/contacts/${row.id}`)}>
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/contacts/${row.id}/edit`)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AppPage
      title="Contacts"
      breadcrumbs={[{ label: 'CRM' }, { label: 'Contacts' }]}
      actions={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/contacts/new')}
        >
          New Contact
        </Button>
      }
      filters={
        <FilterBar>
          <TextField
            placeholder="Search contacts..."
            size="small"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
          >
            Filters
          </Button>
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={() => setFilterAnchor(null)}
          >
            <MenuItem onClick={() => setFilterAnchor(null)}>Has Company</MenuItem>
            <MenuItem onClick={() => setFilterAnchor(null)}>No Company</MenuItem>
            <MenuItem onClick={() => setFilterAnchor(null)}>Recent (7 days)</MenuItem>
          </Menu>
        </FilterBar>
      }
    >
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>Loading...</Box>
      ) : (
        <DataTable
          rows={contacts}
          columns={columns}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        />
      )}
    </AppPage>
  );
}


