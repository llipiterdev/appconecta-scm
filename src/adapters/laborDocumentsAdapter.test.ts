import { afterEach, describe, expect, it, vi } from 'vitest';

import { getLaborDocuments } from '@/adapters/laborDocumentsAdapter';
import * as mockIntegrations from '@/services/mockIntegrations';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('laborDocumentsAdapter', () => {
  it('clasifica un tipo de documento desconocido como anexo', async () => {
    vi.spyOn(mockIntegrations, 'fetchLaborDocuments').mockResolvedValue({
      codigo_respuesta: 200,
      documentos: [
        {
          cod_documento: 'DOC-1',
          nombre_documento: 'Documento',
          tipo_documento: 'OTRO',
          fecha_emision: '01/01/2026',
          tamano_bytes: 1024,
          formato: 'PDF',
        },
      ],
    });

    const [document] = await getLaborDocuments();

    expect(document.category).toBe('anexo');
  });

  it('propaga un error legible cuando la gestion documental responde con un codigo distinto de 200', async () => {
    vi.spyOn(mockIntegrations, 'fetchLaborDocuments').mockResolvedValue({
      codigo_respuesta: 500,
      documentos: [],
    });

    await expect(getLaborDocuments()).rejects.toThrow(
      'No fue posible consultar la gestion documental'
    );
  });
});
