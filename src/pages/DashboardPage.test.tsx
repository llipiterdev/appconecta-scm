import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { processSubmission } from '@/services/employeeService';
import { mainContent, renderRoute } from '@/test/renderRoute';

const employeeName = 'Laura Catalina Restrepo Mejia';

async function waitForDashboard() {
  return screen.findByText(employeeName, undefined, { timeout: 3000 });
}

describe('Dashboard del colaborador', () => {
  it('resume el perfil y el estado del carne', async () => {
    renderRoute('/');
    await waitForDashboard();

    const main = mainContent();

    expect(main.getByText('Analista de Operaciones Senior · Operaciones Nacionales')).toBeVisible();
    expect(main.getByText('Carne activo')).toBeVisible();
  });

  it('presenta los cuatro accesos de resumen', async () => {
    renderRoute('/');
    await waitForDashboard();

    const main = mainContent();

    expect(main.getByText('Ultimo desprendible')).toBeInTheDocument();
    expect(main.getByText('Documentos laborales')).toBeInTheDocument();
    expect(main.getByText('Solicitudes abiertas')).toBeInTheDocument();
    expect(main.getByText('Incapacidades registradas')).toBeInTheDocument();
  });

  it('refleja las solicitudes abiertas que el colaborador ha registrado', async () => {
    processSubmission('request', {
      kind: 'vacaciones',
      detail: 'Solicito vacaciones para la primera semana de septiembre.',
      contactEmail: 'laura.restrepo@appconecta-demo.co',
    });

    renderRoute('/');
    await waitForDashboard();

    const tile = mainContent().getByText('Solicitudes abiertas').parentElement;

    expect(tile).not.toBeNull();
    expect(tile).toHaveTextContent('1');
    expect(tile).toHaveTextContent('Registradas o en tramite');
  });

  it('destaca la publicacion principal del canal de comunicaciones', async () => {
    renderRoute('/');
    await waitForDashboard();

    const main = mainContent();

    expect(main.getByText('Destacado')).toBeInTheDocument();
    expect(main.getByText('Nueva jornada de bienestar en la sede norte')).toBeInTheDocument();
    expect(main.getByRole('link', { name: /ver todas las noticias/i })).toBeInTheDocument();
  });
});
