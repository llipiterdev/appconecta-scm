import { describe, expect, it } from 'vitest';

import { buildCardPayload, buildVirtualCard } from '@/services/virtualCardService';
import type { EmployeeProfile } from '@/types/domain';

function profileFixture(overrides: Partial<EmployeeProfile> = {}): EmployeeProfile {
  return {
    id: 'EMP-004821',
    fullName: 'Laura Catalina Restrepo Mejia',
    documentNumber: '1.024.887.331',
    position: 'Analista de Operaciones Senior',
    department: 'Operaciones Nacionales',
    costCenter: 'CC-2140',
    location: 'Bogota — Sede Norte',
    hireDate: '14 de marzo de 2019',
    contractType: 'Termino indefinido',
    email: 'laura.restrepo@appconecta-demo.co',
    phone: '+57 310 000 0000',
    supervisor: 'Andres Felipe Quintero',
    cardStatus: 'active',
    ...overrides,
  };
}

describe('buildVirtualCard', () => {
  // CP-001 de RFC-001
  it('expone los campos de acreditacion del colaborador', () => {
    const card = buildVirtualCard(profileFixture());

    expect(card).toMatchObject({
      employeeCode: 'EMP-004821',
      fullName: 'Laura Catalina Restrepo Mejia',
      position: 'Analista de Operaciones Senior',
      department: 'Operaciones Nacionales',
      hireDate: '14 de marzo de 2019',
      status: 'active',
      statusLabel: 'Activo',
    });
  });

  // CP-003 de RFC-001
  it('marca el carne como inactivo cuando la vinculacion no esta activa', () => {
    const card = buildVirtualCard(profileFixture({ cardStatus: 'inactive' }));

    expect(card.status).toBe('inactive');
    expect(card.statusLabel).toBe('Inactivo');
    expect(card.qrPayload).toContain('INACTIVO');
  });

  it('no expone en el carne datos que la acreditacion no necesita', () => {
    const card = buildVirtualCard(profileFixture());

    expect(card).not.toHaveProperty('documentNumber');
    expect(card).not.toHaveProperty('email');
    expect(card).not.toHaveProperty('phone');
  });
});

describe('buildCardPayload', () => {
  // CP-002 de RFC-001. El criterio de aceptacion 4 exige que el QR no transporte datos
  // personales. Un QR es legible por cualquiera con una camara, de modo que verificarlo con una
  // prueba y no con una revision manual es la unica forma de que la restriccion se sostenga.
  it('codifica unicamente el codigo de colaborador y el estado', () => {
    expect(buildCardPayload('EMP-004821', 'active')).toBe('APPCONECTA|EMP-004821|ACTIVO');
    expect(buildCardPayload('EMP-004821', 'inactive')).toBe('APPCONECTA|EMP-004821|INACTIVO');
  });

  it('no incluye ningun dato personal del colaborador', () => {
    const profile = profileFixture();
    const payload = buildCardPayload(profile.id, profile.cardStatus);

    const datosSensibles = [
      profile.documentNumber,
      profile.email,
      profile.phone,
      profile.fullName,
      profile.location,
      profile.supervisor,
    ];

    for (const dato of datosSensibles) {
      expect(payload).not.toContain(dato);
    }
  });

  it('produce un contenido acotado, sin campos libres donde colar informacion', () => {
    const payload = buildCardPayload('EMP-004821', 'active');

    expect(payload.split('|')).toHaveLength(3);
    expect(payload.length).toBeLessThan(40);
  });
});
