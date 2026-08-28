/**
 * Puertos del dominio del portal del colaborador.
 *
 * Un puerto es una interfaz que el dominio define y que la infraestructura implementa.
 * El dominio depende del puerto, nunca de `window.localStorage` ni de un contrato externo
 * concreto. Esto es lo que TD-002 y TD-009 identificaron como ausente.
 */

import type { EmployeeRequest, MedicalLeave } from '@/types/domain';

export type RequestsRepositoryPort = {
  list(): EmployeeRequest[];
  save(record: EmployeeRequest, existing: EmployeeRequest[]): void;
};

export type MedicalLeavesRepositoryPort = {
  list(): MedicalLeave[];
  save(record: MedicalLeave, existing: MedicalLeave[]): void;
};
