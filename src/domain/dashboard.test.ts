import { describe, expect, it } from 'vitest';

import { buildDashboardSummary } from '@/domain/dashboard';
import type { Announcement, EmployeeProfile } from '@/types/domain';

const profile = {
  id: 'EMP-1',
  fullName: 'Prueba',
  documentNumber: '1',
  position: 'Analista',
  department: 'Operaciones',
  costCenter: 'CC-1',
  location: 'Bogota',
  hireDate: '1 de enero de 2020',
  contractType: 'Indefinido',
  email: 'prueba@appconecta-demo.co',
  phone: '+57 300 0000000',
  supervisor: 'Jefe',
  cardStatus: 'active',
} as EmployeeProfile;

describe('buildDashboardSummary', () => {
  it('usa la primera publicacion cuando ninguna esta destacada', () => {
    const announcements = [
      { id: 'a1', highlighted: false } as Announcement,
      { id: 'a2', highlighted: false } as Announcement,
    ];

    const summary = buildDashboardSummary(profile, [], [], announcements, [], []);

    expect(summary.highlightedAnnouncement?.id).toBe('a1');
  });
});
