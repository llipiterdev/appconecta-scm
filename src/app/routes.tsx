import type { RouteObject } from 'react-router';

import { NotFoundPage } from '@/app/NotFoundPage';
import { AppShell } from '@/components/layout/AppShell';
import { AnnouncementsPage } from '@/pages/AnnouncementsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { MedicalLeavesPage } from '@/pages/MedicalLeavesPage';
import { PayrollPage } from '@/pages/PayrollPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RequestStatusPage } from '@/pages/RequestStatusPage';
import { RequestsPage } from '@/pages/RequestsPage';
import { VirtualCardPage } from '@/pages/VirtualCardPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'documentos', Component: DocumentsPage },
      { path: 'nomina', Component: PayrollPage },
      { path: 'solicitudes', Component: RequestsPage },
      { path: 'carne', Component: VirtualCardPage },
      { path: 'incapacidades', Component: MedicalLeavesPage },
      { path: 'estado-solicitudes', Component: RequestStatusPage },
      { path: 'noticias', Component: AnnouncementsPage },
      { path: 'perfil', Component: ProfilePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];
