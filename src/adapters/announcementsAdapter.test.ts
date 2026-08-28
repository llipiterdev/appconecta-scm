import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAnnouncements } from '@/adapters/announcementsAdapter';
import * as mockIntegrations from '@/services/mockIntegrations';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('announcementsAdapter', () => {
  it('clasifica una publicacion con categoria desconocida como operaciones', async () => {
    vi.spyOn(mockIntegrations, 'fetchAnnouncements').mockResolvedValue({
      codigo_respuesta: 200,
      publicaciones: [
        {
          cod_publicacion: 'PUB-1',
          titulo: 'Titulo',
          resumen: 'Resumen',
          categoria: 'DESCONOCIDA',
          fecha_publicacion: '01/01/2026',
          destacado: 0,
        },
      ],
    });

    const [announcement] = await getAnnouncements();

    expect(announcement.category).toBe('operaciones');
  });

  it('propaga un error legible cuando el canal responde con un codigo distinto de 200', async () => {
    vi.spyOn(mockIntegrations, 'fetchAnnouncements').mockResolvedValue({
      codigo_respuesta: 500,
      publicaciones: [],
    });

    await expect(getAnnouncements()).rejects.toThrow('No fue posible consultar el canal');
  });
});
