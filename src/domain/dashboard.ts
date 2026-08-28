/**
 * Caso de uso: construir el resumen del panel principal a partir de los datos ya adaptados.
 * Función pura, no realiza I/O por sí misma.
 */

import type {
  Announcement,
  EmployeeProfile,
  EmployeeRequest,
  LaborDocument,
  MedicalLeave,
  Payslip,
} from '@/types/domain';

export type DashboardSummary = {
  profile: EmployeeProfile;
  latestPayslip: Payslip | undefined;
  documentCount: number;
  highlightedAnnouncement: Announcement | undefined;
  openRequestCount: number;
  registeredLeaveCount: number;
};

export function buildDashboardSummary(
  profile: EmployeeProfile,
  documents: LaborDocument[],
  payslips: Payslip[],
  announcements: Announcement[],
  requests: EmployeeRequest[],
  leaves: MedicalLeave[]
): DashboardSummary {
  return {
    profile,
    latestPayslip: payslips[0],
    documentCount: documents.length,
    highlightedAnnouncement: announcements.find((item) => item.highlighted) ?? announcements[0],
    openRequestCount: requests.filter(
      (item) => item.status === 'registrada' || item.status === 'en-tramite'
    ).length,
    registeredLeaveCount: leaves.length,
  };
}
