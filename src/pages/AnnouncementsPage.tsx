import { useCallback } from 'react';

import { AsyncSection } from '@/components/feedback/AsyncSection';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { getAnnouncements } from '@/adapters/announcementsAdapter';
import type { Announcement } from '@/types/domain';

const categoryLabels: Record<Announcement['category'], string> = {
  bienestar: 'Bienestar',
  operaciones: 'Operaciones',
  reconocimiento: 'Reconocimiento',
  tecnologia: 'Tecnologia',
};

export function AnnouncementsPage() {
  const loader = useCallback(() => getAnnouncements(), []);
  const { data, isLoading, error, reload } = useAsyncResource(loader);

  return (
    <>
      <PageHeader
        title="Noticias y anuncios"
        description="Comunicaciones internas publicadas para todos los colaboradores."
      />

      <AsyncSection
        isLoading={isLoading}
        error={error}
        data={data}
        loadingLabel="Cargando noticias y anuncios"
        onRetry={reload}
      >
        {(announcements) =>
          announcements.length === 0 ? (
            <EmptyState
              title="Sin publicaciones"
              description="No hay comunicaciones internas publicadas en este momento."
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {announcements.map((announcement) => (
                <li key={announcement.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="info">{categoryLabels[announcement.category]}</Badge>
                        {announcement.highlighted ? <Badge tone="warning">Destacado</Badge> : null}
                        <span className="text-xs text-slate-500">
                          {announcement.publishedAtLabel}
                        </span>
                      </div>
                      <CardTitle>{announcement.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">{announcement.summary}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )
        }
      </AsyncSection>
    </>
  );
}
