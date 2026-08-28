/**
 * Reglas de negocio de las incapacidades.
 *
 * Funciones puras, sin acceso a `localStorage` ni al DOM. Cierra parte de TD-005 y TD-004.
 */

import moment from '@/lib/momentEs';

import type { MedicalLeave, SubmissionStatus } from '@/types/domain';

export const MAX_MEDICAL_LEAVES = 20;
export const MAX_LEAVE_DAYS = 180;
export const LONG_LEAVE_THRESHOLD_DAYS = 30;

export const LEAVE_STATUS_LABELS: Record<SubmissionStatus, string> = {
  registrada: 'Registrada',
  'en-tramite': 'En tramite',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

export function hasReachedLeaveLimit(existing: MedicalLeave[]): boolean {
  return existing.length >= MAX_MEDICAL_LEAVES;
}

export function hasOverlap(
  existing: MedicalLeave[],
  start: moment.Moment,
  end: moment.Moment
): boolean {
  return existing.some((item) => {
    const itemStart = moment(item.startDate, 'YYYY-MM-DD', true);
    const itemEnd = moment(item.endDate, 'YYYY-MM-DD', true);

    return start.isSameOrBefore(itemEnd) && end.isSameOrAfter(itemStart);
  });
}

export function resolveLeaveStatus(days: number): SubmissionStatus {
  return days > LONG_LEAVE_THRESHOLD_DAYS ? 'en-tramite' : 'registrada';
}

export function buildMedicalLeaveRecord(
  value: { diagnosisCode: string; entity: string; startDate: string; endDate: string },
  days: number,
  existingCount: number
): MedicalLeave {
  const status = resolveLeaveStatus(days);

  return {
    id: `INC-${moment().format('YYYYMMDD')}-${existingCount + 1}`,
    diagnosisCode: value.diagnosisCode,
    startDate: value.startDate,
    endDate: value.endDate,
    days,
    entity: value.entity,
    status,
    statusLabel: LEAVE_STATUS_LABELS[status],
    createdAtLabel: moment().format('D [de] MMMM [de] YYYY, h:mm a'),
  };
}
