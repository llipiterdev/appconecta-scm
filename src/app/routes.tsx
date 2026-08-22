import type { RouteObject } from 'react-router';

import { NotFoundPage } from '@/app/NotFoundPage';
import { PendingSectionPage } from '@/app/PendingSectionPage';
import { navigationItems } from '@/app/navigation';
import { AppShell } from '@/components/layout/AppShell';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppShell,
    children: [
      ...navigationItems.map((item) => ({
        index: item.to === '/',
        path: item.to === '/' ? undefined : item.to.slice(1),
        Component: PendingSectionPage,
      })),
      { path: '*', Component: NotFoundPage },
    ],
  },
];
