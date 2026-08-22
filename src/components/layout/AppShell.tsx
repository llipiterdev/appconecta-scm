import { Outlet } from 'react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { SecondaryNavigation } from '@/components/layout/SecondaryNavigation';
import { SimulationNotice } from '@/components/layout/SimulationNotice';

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <a
        href="#contenido-principal"
        className="focus:bg-brand-700 sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Saltar al contenido principal
      </a>

      <AppHeader />
      <SimulationNotice />

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-4 lg:px-6 lg:py-6">
        <DesktopSidebar />

        <main id="contenido-principal" className="min-w-0 flex-1 pb-20 lg:pb-0">
          <SecondaryNavigation />
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}
