/**
 * Carne virtual del colaborador (RFC-001).
 *
 * Este modulo es deliberadamente independiente de `legacyEmployeeService`. RFC-001 condiciona la
 * aprobacion del cambio a que no agrave TD-001 ni TD-005, y el control de no regresion verifica
 * que la complejidad del modulo legacy no aumente. Anadir aqui la logica del carne, en lugar de
 * dentro de `processSubmission`, es lo que hace que esa condicion se cumpla por construccion y no
 * por disciplina.
 *
 * Consume el perfil ya normalizado en vez de los contratos mock crudos, de modo que TD-008 no se
 * propaga a la funcionalidad nueva.
 */

import { getEmployeeProfile } from '@/adapters/employeeDirectoryAdapter';
import type { EmployeeProfile, VirtualCard, VirtualCardStatus } from '@/types/domain';

const CARD_PREFIX = 'APPCONECTA';

const STATUS_LABELS: Record<VirtualCardStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
};

const STATUS_CODES: Record<VirtualCardStatus, string> = {
  active: 'ACTIVO',
  inactive: 'INACTIVO',
};

/**
 * Compone el contenido del QR a partir del codigo de empleado y el estado del carne.
 *
 * La funcion se exporta para que una prueba pueda verificar directamente que el resultado no
 * contiene datos personales. RFC-001 lo exige como criterio de aceptacion: el riesgo de filtrar
 * un dato sensible por un QR no se mitiga con una revision, se mitiga con una verificacion.
 */
export function buildCardPayload(employeeCode: string, status: VirtualCardStatus): string {
  return `${CARD_PREFIX}|${employeeCode}|${STATUS_CODES[status]}`;
}

export function buildVirtualCard(profile: EmployeeProfile): VirtualCard {
  return {
    employeeCode: profile.id,
    fullName: profile.fullName,
    position: profile.position,
    department: profile.department,
    hireDate: profile.hireDate,
    status: profile.cardStatus,
    statusLabel: STATUS_LABELS[profile.cardStatus],
    qrPayload: buildCardPayload(profile.id, profile.cardStatus),
  };
}

export async function getVirtualCard(): Promise<VirtualCard> {
  return buildVirtualCard(await getEmployeeProfile());
}
