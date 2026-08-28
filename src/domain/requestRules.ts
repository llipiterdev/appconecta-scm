/**
 * Reglas de negocio de las solicitudes de Recursos Humanos.
 *
 * Funciones puras: no leen ni escriben `localStorage`, no dependen del DOM. Cierra parte de
 * TD-005 (cada función tiene una sola responsabilidad y complejidad baja) y de TD-004
 * (los catálogos de etiquetas y plazos se definen una sola vez).
 */

import moment from '@/lib/momentEs';

import type { EmployeeRequest, RequestKind } from '@/types/domain';

export const MAX_REQUESTS = 20;

export const REQUEST_KIND_LABELS: Record<RequestKind, string> = {
  'certificacion-laboral': 'Certificacion laboral',
  vacaciones: 'Vacaciones',
  permiso: 'Permiso',
  'actualizacion-datos': 'Actualizacion de datos',
};

export const REQUEST_BUSINESS_DAYS: Record<RequestKind, number> = {
  'certificacion-laboral': 1,
  vacaciones: 5,
  permiso: 2,
  'actualizacion-datos': 3,
};

export function hasReachedRequestLimit(existing: EmployeeRequest[]): boolean {
  return existing.length >= MAX_REQUESTS;
}

export function isDuplicateRequest(
  existing: EmployeeRequest[],
  value: { kind: string; detail: string }
): boolean {
  return existing.some((item) => item.kind === value.kind && item.detail === value.detail);
}

function nextBusinessDate(businessDays: number): moment.Moment {
  let expected = moment();
  let added = 0;

  while (added < businessDays) {
    expected = expected.add(1, 'day');

    if (expected.isoWeekday() !== 6 && expected.isoWeekday() !== 7) {
      added += 1;
    }
  }

  return expected;
}

export function buildRequestRecord(
  value: { kind: RequestKind; detail: string },
  existingCount: number
): EmployeeRequest {
  const businessDays = REQUEST_BUSINESS_DAYS[value.kind];
  const expected = nextBusinessDate(businessDays);

  return {
    id: `SOL-${moment().format('YYYYMMDD')}-${existingCount + 1}`,
    kind: value.kind,
    kindLabel: REQUEST_KIND_LABELS[value.kind],
    detail: value.detail,
    status: 'registrada',
    statusLabel: 'Registrada',
    createdAtLabel: moment().format('D [de] MMMM [de] YYYY, h:mm a'),
    expectedResponseLabel: expected.format('D [de] MMMM [de] YYYY'),
  };
}
