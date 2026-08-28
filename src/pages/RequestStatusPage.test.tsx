import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { processSubmission } from '@/services/employeeService';
import { renderRoute } from '@/test/renderRoute';

describe('Estado de las solicitudes', () => {
  it('ofrece un estado vacio con una accion cuando no hay tramites', () => {
    renderRoute('/estado-solicitudes');

    expect(screen.getByText('Aun no ha registrado tramites')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /crear una solicitud/i })).toBeInTheDocument();
  });

  it('lista las solicitudes y las incapacidades registradas', () => {
    processSubmission('request', {
      kind: 'permiso',
      detail: 'Solicito permiso para una diligencia personal el viernes.',
      contactEmail: 'laura.restrepo@appconecta-demo.co',
    });

    processSubmission('medical-leave', {
      diagnosisCode: 'M545',
      startDate: '2026-08-03',
      endDate: '2026-08-05',
      entity: 'IPS Ficticia del Norte',
      contactEmail: 'laura.restrepo@appconecta-demo.co',
    });

    renderRoute('/estado-solicitudes');

    expect(screen.getByRole('heading', { name: 'Solicitudes a Recursos Humanos' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Incapacidades' })).toBeVisible();
    expect(screen.getByText('Permiso')).toBeInTheDocument();
    expect(screen.getByText('Diagnostico M545')).toBeInTheDocument();
    expect(screen.getAllByText('Registrada')).toHaveLength(2);
  });
});
