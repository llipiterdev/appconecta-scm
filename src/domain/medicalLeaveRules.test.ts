import moment from 'moment';
import { describe, expect, it } from 'vitest';

import { hasOverlap, hasReachedLeaveLimit, resolveLeaveStatus } from '@/domain/medicalLeaveRules';
import type { MedicalLeave } from '@/types/domain';

describe('medicalLeaveRules', () => {
  it('detecta el limite de incapacidades almacenadas', () => {
    const existing = Array.from(
      { length: 20 },
      (_, index) => ({ id: `INC-${index}` }) as MedicalLeave
    );

    expect(hasReachedLeaveLimit(existing)).toBe(true);
    expect(hasReachedLeaveLimit(existing.slice(0, 19))).toBe(false);
  });

  it('resuelve el estado segun la duracion de la incapacidad', () => {
    expect(resolveLeaveStatus(10)).toBe('registrada');
    expect(resolveLeaveStatus(31)).toBe('en-tramite');
  });

  it('detecta cruce de fechas entre incapacidades registradas', () => {
    const existing = [{ startDate: '2026-08-10', endDate: '2026-08-13' } as MedicalLeave];

    const overlapping = hasOverlap(
      existing,
      moment('2026-08-12', 'YYYY-MM-DD'),
      moment('2026-08-16', 'YYYY-MM-DD')
    );
    const notOverlapping = hasOverlap(
      existing,
      moment('2026-09-01', 'YYYY-MM-DD'),
      moment('2026-09-05', 'YYYY-MM-DD')
    );

    expect(overlapping).toBe(true);
    expect(notOverlapping).toBe(false);
  });
});
