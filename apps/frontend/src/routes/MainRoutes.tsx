import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import AuthGuard from '@/utils/route-guard/AuthGuard';

const SamplePage = Loadable(lazy(() => import('@/views/sample-page')));
const DealsListPage = Loadable(lazy(() => import('@/views/pages/deals/DealsListPage')));
const DealDetailPage = Loadable(lazy(() => import('@/views/deals/DealDetail')));
const DealEditPage = Loadable(lazy(() => import('@/views/pages/deals/DealEditPage')));
const LeadsListPage = Loadable(lazy(() => import('@/views/pages/leads/LeadsListPage')));
const LeadDetailPage = Loadable(lazy(() => import('@/views/leads/LeadDetail')));
const LeadEditPage = Loadable(lazy(() => import('@/views/pages/leads/LeadEditPage')));
const ContactsListPage = Loadable(lazy(() => import('@/views/pages/contacts/ContactsListPage')));
const CompaniesListPage = Loadable(lazy(() => import('@/views/pages/companies/CompaniesListPage')));
const AnalyticsDashboard = Loadable(lazy(() => import('@/views/pages/analytics/AnalyticsDashboard')));
const PnLAnalyticsPage = Loadable(lazy(() => import('@/views/analytics/PnLAnalytics')));
const NotificationsPage = Loadable(lazy(() => import('@/views/notifications/Notifications')));
const ChatPage = Loadable(lazy(() => import('@/views/apps/chat/ChatPage')));

// Sprint 2 pages
const ContactsListPageNew = Loadable(lazy(() => import('@/pages/contacts/ContactsListPage')));
const ContactDetailPage = Loadable(lazy(() => import('@/pages/contacts/ContactDetailPage')));
const PipelinesPage = Loadable(lazy(() => import('@/pages/settings/PipelinesPage')));

// Sprint 3 pages
const DealsKanbanPage = Loadable(lazy(() => import('@/pages/deals/DealsKanbanPage')));
const Company360Page = Loadable(lazy(() => import('@/pages/companies/Company360Page')));

const MainRoutes: RouteObject = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/sample-page',
      element: <SamplePage />,
    },
    {
      path: '/deals',
      element: <DealsListPage />,
    },
    {
      path: '/deals/board',
      element: <DealsKanbanPage />,
    },
    {
      path: '/deals/:id',
      element: <DealDetailPage />,
    },
    {
      path: '/deals/:id/edit',
      element: <DealEditPage />,
    },
    {
      path: '/leads',
      element: <LeadsListPage />,
    },
    {
      path: '/leads/:id',
      element: <LeadDetailPage />,
    },
    {
      path: '/leads/:id/edit',
      element: <LeadEditPage />,
    },
    {
      path: '/contacts',
      element: <ContactsListPageNew />,
    },
    {
      path: '/contacts/:id',
      element: <ContactDetailPage />,
    },
    {
      path: '/companies',
      element: <CompaniesListPage />,
    },
    {
      path: '/companies/:id',
      element: <Company360Page />,
    },
    {
      path: '/settings/pipelines',
      element: <PipelinesPage />,
    },
    {
      path: '/analytics',
      element: <AnalyticsDashboard />,
    },
    {
      path: '/analytics/pnl',
      element: <PnLAnalyticsPage />,
    },
    {
      path: '/notifications',
      element: <NotificationsPage />,
    },
    {
      path: '/chat',
      element: <ChatPage />,
    },
  ],
};

export default MainRoutes;
