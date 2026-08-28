/**
 * Adaptador del contrato de comunicaciones internas. Cierra TD-008 para este contrato.
 */

import moment from '@/lib/momentEs';

import { fetchAnnouncements } from '@/services/mockIntegrations';
import { MOCK_DATE_FORMAT } from '@/adapters/constants';
import type { Announcement } from '@/types/domain';

function resolveCategory(categoria: string): Announcement['category'] {
  if (categoria === 'BIENESTAR') {
    return 'bienestar';
  }

  if (categoria === 'RECONOCIMIENTO') {
    return 'reconocimiento';
  }

  if (categoria === 'TECNOLOGIA') {
    return 'tecnologia';
  }

  return 'operaciones';
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetchAnnouncements();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar el canal de comunicaciones internas.');
  }

  return response.publicaciones.map((raw) => {
    const published = moment(raw.fecha_publicacion, MOCK_DATE_FORMAT);

    return {
      id: raw.cod_publicacion,
      title: raw.titulo,
      summary: raw.resumen,
      category: resolveCategory(raw.categoria),
      publishedAtLabel: published.format('D [de] MMMM [de] YYYY'),
      relativeLabel: published.fromNow(),
      highlighted: raw.destacado === 1,
    };
  });
}
