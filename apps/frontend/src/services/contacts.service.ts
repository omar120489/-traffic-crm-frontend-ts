/**
 * Contacts API Service
 * 
 * This service provides a clean interface for contact-related API calls.
 * Replace the mock implementation with real SDK calls when ready.
 */

// TODO: Import from SDK when available
// import { ApiClient, ContactsService } from '@traffic-crm/sdk-js';

export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  companyId?: string;
  company?: {
    id: string;
    name: string;
  };
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
  };
  source?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  ownerId?: string;
  companyId?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CreateContactInput = {
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  companyId?: string;
  ownerId?: string;
  source?: string;
  status?: string;
};

export type UpdateContactInput = Partial<CreateContactInput>;

/**
 * Contacts Service
 * 
 * Usage:
 * ```typescript
 * import { contactsService } from '@/services/contacts.service';
 * 
 * const contacts = await contactsService.list({ page: 1, pageSize: 20 });
 * const contact = await contactsService.getById('contact-id');
 * ```
 */
class ContactsService {
  // TODO: Initialize SDK client
  // private client: ApiClient;
  // constructor() {
  //   this.client = new ApiClient({
  //     BASE: import.meta.env.VITE_API_URL,
  //     TOKEN: () => localStorage.getItem('token') ?? '',
  //   });
  // }

  /**
   * List contacts with optional filters
   */
  async list(filters: ContactFilters = {}): Promise<PaginatedResponse<Contact>> {
    const { page = 1, pageSize = 20, search, status, ownerId, companyId } = filters;

    // TODO: Replace with real SDK call
    // return ContactsService.list(this.client, { page, pageSize, search, status, ownerId, companyId });

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'Hannah Lee',
        email: 'hannah@globex.com',
        phone: '+1-555-0123',
        title: 'VP of Sales',
        companyId: 'c1',
        company: { id: 'c1', name: 'Globex Corporation' },
        ownerId: 'u1',
        owner: { id: 'u1', name: 'Admin User' },
        source: 'web',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john@acme.com',
        phone: '+1-555-0456',
        title: 'CTO',
        companyId: 'c2',
        company: { id: 'c2', name: 'Acme Inc.' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.io',
        title: 'Product Manager',
        status: 'archived',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Apply filters
    let filtered = mockContacts;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.company?.name.toLowerCase().includes(searchLower)
      );
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((c) => c.status === status);
    }
    if (ownerId) {
      filtered = filtered.filter((c) => c.ownerId === ownerId);
    }
    if (companyId) {
      filtered = filtered.filter((c) => c.companyId === companyId);
    }

    const totalPages = Math.ceil(filtered.length / pageSize);

    return {
      items: filtered,
      total: filtered.length,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Get a single contact by ID
   */
  async getById(id: string): Promise<Contact> {
    // TODO: Replace with real SDK call
    // return ContactsService.getById(this.client, id);

    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      id,
      name: 'Hannah Lee',
      email: 'hannah@globex.com',
      phone: '+1-555-0123',
      title: 'VP of Sales',
      companyId: 'c1',
      company: { id: 'c1', name: 'Globex Corporation' },
      ownerId: 'u1',
      owner: { id: 'u1', name: 'Admin User' },
      source: 'web',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Create a new contact
   */
  async create(input: CreateContactInput): Promise<Contact> {
    // TODO: Replace with real SDK call
    // return ContactsService.create(this.client, input);

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      id: Math.random().toString(36).substring(7),
      ...input,
      status: input.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update an existing contact
   */
  async update(id: string, input: UpdateContactInput): Promise<Contact> {
    // TODO: Replace with real SDK call
    // return ContactsService.update(this.client, id, input);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const existing = await this.getById(id);
    return {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Delete a contact
   */
  async delete(id: string): Promise<void> {
    // TODO: Replace with real SDK call
    // return ContactsService.delete(this.client, id);

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  /**
   * Archive a contact (soft delete)
   */
  async archive(id: string): Promise<Contact> {
    return this.update(id, { status: 'archived' });
  }

  /**
   * Restore an archived contact
   */
  async restore(id: string): Promise<Contact> {
    return this.update(id, { status: 'active' });
  }
}

// Export singleton instance
export const contactsService = new ContactsService();

// Export class for testing
export { ContactsService };

