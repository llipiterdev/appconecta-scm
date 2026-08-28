import { describe, expect, it } from 'vitest';

import { validateMedicalLeaveDraft, validateRequestDraft } from '@/domain/validation';

const validRequest = {
  kind: 'vacaciones',
  detail: 'Solicito vacaciones para el ultimo trimestre del ano en curso.',
  contactEmail: 'laura.restrepo@appconecta-demo.co',
};

const validLeave = {
  diagnosisCode: 'J11',
  startDate: '2026-08-10',
  endDate: '2026-08-13',
  entity: 'IPS Ficticia del Norte',
  contactEmail: 'laura.restrepo@appconecta-demo.co',
};

describe('validateRequestDraft — casos limite', () => {
  it('rechaza un detalle demasiado extenso', () => {
    const result = validateRequestDraft({ ...validRequest, detail: 'x'.repeat(501) });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.detail).toContain('500 caracteres');
    }
  });

  it('rechaza un correo de contacto demasiado extenso', () => {
    const result = validateRequestDraft({
      ...validRequest,
      contactEmail: `${'x'.repeat(120)}@a.co`,
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.contactEmail).toContain('demasiado extenso');
    }
  });
});

describe('validateMedicalLeaveDraft — casos limite', () => {
  it('rechaza una entidad demasiado extensa', () => {
    const result = validateMedicalLeaveDraft({ ...validLeave, entity: 'x'.repeat(121) });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.entity).toContain('demasiado extenso');
    }
  });

  it('exige la fecha de inicio', () => {
    const result = validateMedicalLeaveDraft({ ...validLeave, startDate: '' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.startDate).toBe('Indique la fecha de inicio.');
    }
  });

  it('exige la fecha de finalizacion', () => {
    const result = validateMedicalLeaveDraft({ ...validLeave, endDate: '' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.endDate).toBe('Indique la fecha de finalizacion.');
    }
  });
});
