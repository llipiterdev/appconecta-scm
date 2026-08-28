/**
 * Fachada del portal del colaborador — raíz de composición.
 *
 * ============================================================================
 * REEMPLAZA a `legacyEmployeeService.ts` (Actividad 4 — intervención de mantenimiento)
 * ============================================================================
 *
 * Este módulo no contiene reglas de negocio, persistencia ni transformación de datos: solo
 * cablea la capa de dominio (`src/domain/*`) con la capa de adaptadores (`src/adapters/*`) y
 * expone la misma interfaz pública que usaban las páginas, para que el cambio de arquitectura
 * no se propague como una reescritura de toda la interfaz.
 *
 * Referencia de deuda cerrada por esta intervención: `docs/technical-debt-register.md`
 * (TD-001, TD-002, TD-003, TD-004, TD-005, TD-008, TD-009) y `docs/maintenance-baseline.md`.
 *
 * TD-007 (`moment` en maintenance mode) sigue fuera de alcance: su cierre está condicionado a
 * que el tratamiento de fechas quede concentrado en un solo punto, que es exactamente lo que
 * esta intervención produce (los únicos módulos que importan `moment` ahora son los cuatro
 * adaptadores de integración y las dos reglas de negocio con fechas).
 */

import { getAnnouncements as fetchAnnouncements } from '@/adapters/announcementsAdapter';
import { getEmployeeProfile as fetchEmployeeProfile } from '@/adapters/employeeDirectoryAdapter';
import { getLaborDocuments as fetchLaborDocuments } from '@/adapters/laborDocumentsAdapter';
import { getPayslips as fetchPayslips } from '@/adapters/payrollAdapter';
import { medicalLeavesRepository } from '@/adapters/medicalLeavesRepository';
import { requestsRepository } from '@/adapters/requestsRepository';
import { buildDashboardSummary, type DashboardSummary } from '@/domain/dashboard';
import { submitEmployeeRequest, type SubmissionOutcome } from '@/domain/submitRequest';
import { submitMedicalLeave } from '@/domain/submitMedicalLeave';
import { validateMedicalLeaveDraft, validateRequestDraft } from '@/domain/validation';
import type { MedicalLeaveDraft, RequestDraft } from '@/types/domain';

export type { DashboardSummary, SubmissionOutcome };
export { validateMedicalLeaveDraft, validateRequestDraft };

export const getEmployeeProfile = fetchEmployeeProfile;
export const getLaborDocuments = fetchLaborDocuments;
export const getPayslips = fetchPayslips;
export const getAnnouncements = fetchAnnouncements;

export function getEmployeeRequests() {
  return requestsRepository.list();
}

export function getMedicalLeaves() {
  return medicalLeavesRepository.list();
}

export function processSubmission(
  kind: 'request' | 'medical-leave',
  draft: RequestDraft | MedicalLeaveDraft
): SubmissionOutcome {
  if (kind === 'request') {
    return submitEmployeeRequest(draft as RequestDraft, requestsRepository);
  }

  return submitMedicalLeave(draft as MedicalLeaveDraft, medicalLeavesRepository);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [profile, documents, payslips, announcements] = await Promise.all([
    getEmployeeProfile(),
    getLaborDocuments(),
    getPayslips(),
    getAnnouncements(),
  ]);

  return buildDashboardSummary(
    profile,
    documents,
    payslips,
    announcements,
    getEmployeeRequests(),
    getMedicalLeaves()
  );
}
