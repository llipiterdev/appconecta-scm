import { describe, expect, it } from 'vitest';

import { submitMedicalLeave } from '@/domain/submitMedicalLeave';
import type { MedicalLeavesRepositoryPort } from '@/domain/ports';
import type { MedicalLeave } from '@/types/domain';

function fakeRepository(seed: MedicalLeave[] = []): MedicalLeavesRepositoryPort {
  let stored = seed;

  return {
    list: () => stored,
    save: (record, existing) => {
      stored = [record, ...existing];
    },
  };
}

const validLeave = {
  diagnosisCode: 'J11',
  startDate: '2026-08-10',
  endDate: '2026-08-13',
  entity: 'IPS Ficticia del Norte',
  contactEmail: 'laura.restrepo@appconecta-demo.co',
};

describe('submitMedicalLeave — casos limite', () => {
  it('rechaza una fecha de inicio con formato invalido', () => {
    const outcome = submitMedicalLeave(
      { ...validLeave, startDate: '10-08-2026' },
      fakeRepository()
    );

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.startDate).toContain('no es valida');
    }
  });

  it('rechaza una fecha de finalizacion con formato invalido', () => {
    const outcome = submitMedicalLeave({ ...validLeave, endDate: '13-08-2026' }, fakeRepository());

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.endDate).toContain('no es valida');
    }
  });

  it('rechaza una incapacidad cuando se alcanzo el maximo de registros', () => {
    const seed = Array.from(
      { length: 20 },
      (_, index) =>
        ({
          id: `INC-${index}`,
          startDate: '2020-01-01',
          endDate: '2020-01-02',
        }) as MedicalLeave
    );

    const outcome = submitMedicalLeave(validLeave, fakeRepository(seed));

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.diagnosisCode).toContain('maximo de incapacidades');
    }
  });
});
