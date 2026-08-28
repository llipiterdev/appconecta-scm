/**
 * Caso de uso: registrar una solicitud de Recursos Humanos.
 *
 * Cierra TD-001, TD-002, TD-005 y TD-009 para esta rama del antiguo `processSubmission`:
 * la función no accede a `window.localStorage` (depende del puerto `RequestsRepositoryPort`),
 * no transforma datos de presentación y su complejidad ciclomática es baja.
 */

import { validateRequestDraft } from '@/domain/validation';
import {
  buildRequestRecord,
  hasReachedRequestLimit,
  isDuplicateRequest,
} from '@/domain/requestRules';
import type { RequestsRepositoryPort } from '@/domain/ports';
import type { RequestDraft, RequestKind } from '@/types/domain';

export type SubmissionOutcome =
  | { ok: true; id: string; message: string }
  | { ok: false; errors: Record<string, string>; message: string };

const INVALID_MESSAGE = 'La solicitud tiene datos incompletos o invalidos.';

export function submitEmployeeRequest(
  draft: RequestDraft,
  repository: RequestsRepositoryPort
): SubmissionOutcome {
  const validation = validateRequestDraft(draft);

  if (!validation.ok) {
    return { ok: false, errors: validation.errors, message: INVALID_MESSAGE };
  }

  const value = validation.value;
  const existing = repository.list();

  if (hasReachedRequestLimit(existing)) {
    return {
      ok: false,
      errors: { detail: 'Ha alcanzado el maximo de solicitudes registradas.' },
      message: INVALID_MESSAGE,
    };
  }

  if (isDuplicateRequest(existing, value)) {
    return {
      ok: false,
      errors: { detail: 'Ya existe una solicitud identica registrada.' },
      message: INVALID_MESSAGE,
    };
  }

  const record = buildRequestRecord(
    { kind: value.kind as RequestKind, detail: value.detail },
    existing.length
  );
  repository.save(record, existing);

  return { ok: true, id: record.id, message: `Solicitud ${record.id} registrada correctamente.` };
}
