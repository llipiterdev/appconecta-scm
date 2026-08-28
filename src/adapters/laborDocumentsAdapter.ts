/**
 * Adaptador del contrato de gestión documental. Cierra TD-008 para este contrato.
 */

import moment from '@/lib/momentEs';

import { fetchLaborDocuments } from '@/services/mockIntegrations';
import { MOCK_DATE_FORMAT } from '@/adapters/constants';
import type { LaborDocument } from '@/types/domain';

function resolveCategory(tipoDocumento: string): LaborDocument['category'] {
  if (tipoDocumento === 'CONTRATO') {
    return 'contrato';
  }

  if (tipoDocumento === 'CERTIFICACION') {
    return 'certificacion';
  }

  if (tipoDocumento === 'POLITICA') {
    return 'politica';
  }

  return 'anexo';
}

function resolveSizeLabel(bytes: number): string {
  const kilobytes = bytes / 1024;

  return kilobytes >= 1024 ? `${(kilobytes / 1024).toFixed(1)} MB` : `${Math.round(kilobytes)} KB`;
}

export async function getLaborDocuments(): Promise<LaborDocument[]> {
  const response = await fetchLaborDocuments();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar la gestion documental.');
  }

  return response.documentos.map((raw) => ({
    id: raw.cod_documento,
    title: raw.nombre_documento,
    category: resolveCategory(raw.tipo_documento),
    issuedAt: moment(raw.fecha_emision, MOCK_DATE_FORMAT).format('YYYY-MM-DD'),
    issuedAtLabel: moment(raw.fecha_emision, MOCK_DATE_FORMAT).format('D [de] MMMM [de] YYYY'),
    sizeLabel: resolveSizeLabel(raw.tamano_bytes),
    format: raw.formato,
  }));
}
