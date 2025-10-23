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

export async function fetchContacts() {
  return api.listContacts();
}

export async function fetchContact(id: string) {
  return api.getContact(id);
}

export async function createContact(body: any) {
  return api.createContact(body);
}

export async function updateContact(id: string, body: any) {
  return api.updateContact(id, body);
}

export async function deleteContact(id: string) {
  return api.deleteContact(id);
}

// Named export for convenience
export const contactsSdkApi = {
  fetchContacts,
  fetchContact,
  createContact,
  updateContact,
  deleteContact,
};

