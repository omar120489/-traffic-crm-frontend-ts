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
  Autocomplete,
} from '@mui/material';
import { Add, Search, FilterList, Edit, Delete, Visibility } from '@mui/icons-material';
import { AppPage, DataTable, FilterBar, type Column } from '@traffic-crm/ui-kit';
import { createClient } from '@traffic-crm/sdk-js';
import { useAuth } from '../../contexts/AuthContext';

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
  const { orgId } = useAuth();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters from URL
  const page = Number(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const companyFilter = searchParams.get('company') || '';
  const tags = searchParams.getAll('tag');
  const pageSize = 20;

  // Filter menu
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  
  // Tag options from API
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  const setFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  const handleTagsChange = (_: any, values: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.delete('tag');
    values.forEach((v) => params.append('tag', v));
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  // Load tag options once
  useEffect(() => {
    let alive = true;
    (async () => {
      setTagsLoading(true);
      try {
        const res = await api.tags.list(orgId);
        if (alive) setTagOptions(res.map((t: any) => t.name) ?? []);
      } catch {
        if (alive) setTagOptions([]);
      } finally {
        if (alive) setTagsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [orgId]);

  useEffect(() => {
    loadContacts();
  }, [page, query, status, companyFilter, tags.join(',')]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params: any = { page, size: pageSize };
      if (query) params.q = query;
      if (status) params.status = status;
      if (companyFilter) params.companyId = companyFilter;
      if (tags.length) params.tags = tags;
      
      const result = await api.listContacts(params);
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
            <MenuItem disabled sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
              STATUS
            </MenuItem>
            <MenuItem 
              onClick={() => { setFilter('status', 'active'); setFilterAnchor(null); }}
              selected={status === 'active'}
            >
              Active
            </MenuItem>
            <MenuItem 
              onClick={() => { setFilter('status', 'archived'); setFilterAnchor(null); }}
              selected={status === 'archived'}
            >
              Archived
            </MenuItem>
            <MenuItem disabled sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
              COMPANY
            </MenuItem>
            <MenuItem 
              onClick={() => { setFilter('company', 'has'); setFilterAnchor(null); }}
              selected={companyFilter === 'has'}
            >
              Has Company
            </MenuItem>
            <MenuItem 
              onClick={() => { setFilter('company', 'none'); setFilterAnchor(null); }}
              selected={companyFilter === 'none'}
            >
              No Company
            </MenuItem>
            <MenuItem disabled sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
              TAGS
            </MenuItem>
            <Box sx={{ px: 2, py: 1 }}>
              <Autocomplete
                multiple
                size="small"
                options={tagOptions}
                loading={tagsLoading}
                value={tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip key={option} variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Tags" placeholder="Select tags" />}
                sx={{ minWidth: 200 }}
              />
            </Box>
            {(status || companyFilter || tags.length > 0) && (
              <>
                <MenuItem divider />
                <MenuItem onClick={() => { clearFilters(); setFilterAnchor(null); }}>
                  Clear All Filters
                </MenuItem>
              </>
            )}
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


