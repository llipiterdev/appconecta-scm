import { describe, expect, it } from 'vitest';

import {
  REQUEST_KIND_LABELS,
  buildRequestRecord,
  hasReachedRequestLimit,
  isDuplicateRequest,
} from '@/domain/requestRules';
import type { EmployeeRequest } from '@/types/domain';

describe('requestRules', () => {
  it('detecta el limite de solicitudes almacenadas', () => {
    const existing = Array.from(
      { length: 20 },
      (_, index) => ({ id: `SOL-${index}` }) as EmployeeRequest
    );

    expect(hasReachedRequestLimit(existing)).toBe(true);
    expect(hasReachedRequestLimit(existing.slice(0, 19))).toBe(false);
  });

  it('detecta solicitudes duplicadas por tipo y detalle', () => {
    const existing = [
      { kind: 'vacaciones', detail: 'Solicito vacaciones de fin de ano.' } as EmployeeRequest,
    ];

    expect(
      isDuplicateRequest(existing, {
        kind: 'vacaciones',
        detail: 'Solicito vacaciones de fin de ano.',
      })
    ).toBe(true);
    expect(
      isDuplicateRequest(existing, { kind: 'permiso', detail: 'Otro detalle distinto.' })
    ).toBe(false);
  });

  it('construye el registro con la etiqueta correcta del tipo de solicitud', () => {
    const record = buildRequestRecord({ kind: 'vacaciones', detail: 'Detalle de prueba.' }, 0);

    expect(record.kindLabel).toBe(REQUEST_KIND_LABELS.vacaciones);
    expect(record.status).toBe('registrada');
    expect(record.id).toMatch(/^SOL-\d{8}-1$/);
  });
});
