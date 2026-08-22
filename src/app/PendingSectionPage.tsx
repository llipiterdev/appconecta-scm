import { useLocation } from 'react-router';

import { navigationItems } from '@/app/navigation';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';

/**
 * Marcador de posicion para las secciones cuya ruta ya existe en el shell pero cuyo modulo
 * funcional se incorpora en una baseline posterior. Evita rutas muertas y mantiene la
 * navegacion completa y verificable desde la primera version del shell.
 */
export function PendingSectionPage() {
  const { pathname } = useLocation();
  const item = navigationItems.find((candidate) => candidate.to === pathname);
  const title = item?.label ?? 'Seccion del portal';

  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title="Seccion aun no disponible en esta version"
        description="La ruta ya forma parte del shell de la aplicacion. El modulo funcional se incorpora en una baseline posterior de la simulacion."
      />
    </>
  );
}
