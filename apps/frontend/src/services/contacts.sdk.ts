/**
 * Contacts Service using typed SDK
 *
 * This is a new SDK-based service that will eventually replace
 * the legacy services/contacts.ts implementation.
 *
 * To migrate:
 * 1. Test this service alongside the old one
 * 2. Update imports in components to use this file
 * 3. Remove old service once verified
 */

import { api } from '@/data/clients/sdk';
import type { ContactQuery } from '@traffic-crm/shared-types';
import type { ContactCreateDto, ContactUpdateDto } from '@traffic-crm/shared-types';

export async function fetchContacts(query?: ContactQuery) {
  return api.listContacts(query);
}

export async function fetchContact(id: string) {
  return api.getContact(id);
}

export async function createContact(body: ContactCreateDto) {
  return api.createContact(body);
}

export async function updateContact(id: string, body: ContactUpdateDto) {
  return api.updateContact(id, body);
}

export async function deleteContact(id: string) {
  return api.deleteContact(id);
}

// Named export for convenience (aliased to match old service interface)
export const contactsSdkApi = {
  listContacts: fetchContacts,
  getContact: fetchContact,
  createContact,
  updateContact,
  deleteContact
};
