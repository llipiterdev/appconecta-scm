/**
 * Caso de uso: registrar una incapacidad.
 *
 * Cierra TD-001, TD-002, TD-005 y TD-009 para esta rama del antiguo `processSubmission`.
 * Sin accesos a `window.localStorage`: depende de `MedicalLeavesRepositoryPort`.
 */

import moment from 'moment';

import { validateMedicalLeaveDraft } from '@/domain/validation';
import {
  MAX_LEAVE_DAYS,
  buildMedicalLeaveRecord,
  hasOverlap,
  hasReachedLeaveLimit,
} from '@/domain/medicalLeaveRules';
import type { MedicalLeavesRepositoryPort } from '@/domain/ports';
import type { MedicalLeaveDraft } from '@/types/domain';
import type { SubmissionOutcome } from '@/domain/submitRequest';

const INVALID_MESSAGE = 'La incapacidad tiene datos incompletos o invalidos.';

export function submitMedicalLeave(
  draft: MedicalLeaveDraft,
  repository: MedicalLeavesRepositoryPort
): SubmissionOutcome {
  const validation = validateMedicalLeaveDraft(draft);

  if (!validation.ok) {
    return { ok: false, errors: validation.errors, message: INVALID_MESSAGE };
  }

  const value = validation.value;
  const start = moment(value.startDate, 'YYYY-MM-DD', true);
  const end = moment(value.endDate, 'YYYY-MM-DD', true);

  if (!start.isValid()) {
    return {
      ok: false,
      errors: { startDate: 'La fecha de inicio no es valida.' },
      message: INVALID_MESSAGE,
    };
  }

  if (!end.isValid()) {
    return {
      ok: false,
      errors: { endDate: 'La fecha de finalizacion no es valida.' },
      message: INVALID_MESSAGE,
    };
  }

  if (end.isBefore(start)) {
    return {
      ok: false,
      errors: { endDate: 'La fecha de finalizacion no puede ser anterior a la de inicio.' },
      message: INVALID_MESSAGE,
    };
  }

  const days = end.diff(start, 'days') + 1;

  if (days > MAX_LEAVE_DAYS) {
    return {
      ok: false,
      errors: { endDate: 'Una incapacidad no puede superar los 180 dias.' },
      message: INVALID_MESSAGE,
    };
  }

  if (start.isAfter(moment().add(1, 'day'))) {
    return {
      ok: false,
      errors: { startDate: 'La fecha de inicio no puede ser futura.' },
      message: INVALID_MESSAGE,
    };
  }

  const existing = repository.list();

  if (hasReachedLeaveLimit(existing)) {
    return {
      ok: false,
      errors: { diagnosisCode: 'Ha alcanzado el maximo de incapacidades registradas.' },
      message: INVALID_MESSAGE,
    };
  }

  if (hasOverlap(existing, start, end)) {
    return {
      ok: false,
      errors: { startDate: 'Ya existe una incapacidad registrada que cruza estas fechas.' },
      message: INVALID_MESSAGE,
    };
  }

  const record = buildMedicalLeaveRecord(value, days, existing.length);
  repository.save(record, existing);

  return { ok: true, id: record.id, message: `Incapacidad ${record.id} registrada correctamente.` };
}
