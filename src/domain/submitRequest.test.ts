import { describe, expect, it } from 'vitest';

import { submitEmployeeRequest } from '@/domain/submitRequest';
import type { RequestsRepositoryPort } from '@/domain/ports';
import type { EmployeeRequest } from '@/types/domain';

function fakeRepository(seed: EmployeeRequest[] = []): RequestsRepositoryPort {
  let stored = seed;

  return {
    list: () => stored,
    save: (record, existing) => {
      stored = [record, ...existing];
    },
  };
}

const validRequest = {
  kind: 'vacaciones',
  detail: 'Solicito vacaciones para el ultimo trimestre del ano en curso.',
  contactEmail: 'laura.restrepo@appconecta-demo.co',
};

describe('submitEmployeeRequest', () => {
  it('rechaza una solicitud cuando se alcanzo el maximo de registros', () => {
    const seed = Array.from(
      { length: 20 },
      (_, index) =>
        ({ id: `SOL-${index}`, kind: 'permiso', detail: `Detalle ${index}` }) as EmployeeRequest
    );

    const outcome = submitEmployeeRequest(validRequest, fakeRepository(seed));

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.detail).toContain('maximo de solicitudes');
    }
  });
});
