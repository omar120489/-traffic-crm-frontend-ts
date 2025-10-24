/**
 * Sprint 2 Routes
 * Centralized route definitions for new Sprint 2 features
 * 
 * Usage:
 *   import { sprint2Routes } from './routes/sprint2.routes';
 *   const routes = [...existingRoutes, ...sprint2Routes];
 */
import { lazy } from 'react';

// Lazy load pages for code splitting
const PipelinesPage = lazy(() => import('../pages/settings/PipelinesPage'));
const ContactsListPage = lazy(() => import('../pages/contacts/ContactsListPage'));
const ContactDetailPage = lazy(() => import('../pages/contacts/ContactDetailPage'));

export const sprint2Routes = [
  {
    path: '/settings/pipelines',
    element: <PipelinesPage />,
    meta: {
      title: 'Pipelines & Stages',
      requiresAuth: true,
      permission: 'settings:read',
    },
  },
  {
    path: '/contacts',
    element: <ContactsListPage />,
    meta: {
      title: 'Contacts',
      requiresAuth: true,
      permission: 'contacts:read',
    },
  },
  {
    path: '/contacts/:id',
    element: <ContactDetailPage />,
    meta: {
      title: 'Contact Detail',
      requiresAuth: true,
      permission: 'contacts:read',
    },
  },
];

// Export paths as constants for type-safe navigation
export const SPRINT2_PATHS = {
  PIPELINES: '/settings/pipelines',
  CONTACTS: '/contacts',
  CONTACT_DETAIL: (id: string) => `/contacts/${id}`,
  CONTACT_NEW: '/contacts/new',
  CONTACT_EDIT: (id: string) => `/contacts/${id}/edit`,
} as const;


