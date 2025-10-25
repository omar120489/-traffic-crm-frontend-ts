import { useState, useEffect } from 'react';
import { AppPage, DataTable, FilterBar, Column } from '@traffic-crm/ui-kit';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// Type definition matching Prisma schema
type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
    name: string;
  };
  status: string;
  createdAt: string;
};

type ContactsResponse = {
  items: Contact[];
  total: number;
  page: number;
  pageSize: number;
};

// Mock API service (replace with real SDK call)
async function fetchContacts(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}): Promise<ContactsResponse> {
  // TODO: Replace with actual SDK call
  // import { contactsApi } from '@traffic-crm/sdk-js';
  // return contactsApi.list(params);

  // Mock data for demonstration
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'Hannah Lee',
      email: 'hannah@globex.com',
      phone: '+1-555-0123',
      title: 'VP of Sales',
      company: { id: 'c1', name: 'Globex Corporation' },
      owner: { id: 'u1', name: 'Admin User' },
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@acme.com',
      phone: '+1-555-0456',
      title: 'CTO',
      company: { id: 'c2', name: 'Acme Inc.' },
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.io',
      title: 'Product Manager',
      status: 'archived',
      createdAt: new Date().toISOString(),
    },
  ];

  // Apply filters
  let filtered = mockContacts;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.company?.name.toLowerCase().includes(searchLower)
    );
  }
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((c) => c.status === params.status);
  }

  return {
    items: filtered,
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export default function ContactsPageExample() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    let mounted = true;

    const loadContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchContacts({
          page,
          pageSize,
          search: search || undefined,
          status: status !== 'all' ? status : undefined,
        });

        if (mounted) {
          setContacts(response.items);
          setTotal(response.total);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load contacts');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      mounted = false;
    };
  }, [page, search, status]);

  const handleEdit = (id: string) => {
    // console.log('Edit contact:', id);
    // TODO: Navigate to edit page or open modal
  };

  const handleEmail = (email?: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '20%',
      render: (row) => (
        <Box>
          <Box sx={{ fontWeight: 500 }}>{row.name}</Box>
          {row.title && (
            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{row.title}</Box>
          )}
        </Box>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      width: '25%',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {row.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Box sx={{ fontSize: '0.875rem' }}>{row.email}</Box>
            </Box>
          )}
          {row.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Box sx={{ fontSize: '0.875rem' }}>{row.phone}</Box>
            </Box>
          )}
        </Box>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      width: '20%',
      render: (row) => row.company?.name || '—',
    },
    {
      key: 'owner',
      header: 'Owner',
      width: '15%',
      render: (row) => row.owner?.name || '—',
    },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      render: (row) => (
        <Chip
          label={row.status}
          color={row.status === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      width: '10%',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => handleEdit(row.id)} title="Edit">
            <EditIcon fontSize="small" />
          </IconButton>
          {row.email && (
            <IconButton size="small" onClick={() => handleEmail(row.email)} title="Email">
              <EmailIcon fontSize="small" />
            </IconButton>
          )}
          {row.phone && (
            <IconButton size="small" onClick={() => handleCall(row.phone)} title="Call">
              <PhoneIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <AppPage
      title="Contacts"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contacts' }]}
      actions={
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {/* TODO: Add contact */}}>
          Add Contact
        </Button>
      }
      filters={
        <FilterBar>
          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, or company..."
            sx={{ minWidth: 250 }}
          />
          <Select
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
          {(search || status !== 'all') && (
            <Button
              size="small"
              onClick={() => {
                setSearch('');
                setStatus('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </FilterBar>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : contacts.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Box sx={{ fontSize: '1.25rem', mb: 1 }}>No contacts found</Box>
          <Box>Try adjusting your filters or add a new contact</Box>
        </Box>
      ) : (
        <DataTable
          rows={contacts}
          columns={columns}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      )}
    </AppPage>
  );
}

