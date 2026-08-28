import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as employeeDirectoryAdapter from '@/adapters/employeeDirectoryAdapter';
import { mainContent, renderRoute } from '@/test/renderRoute';

const employeeName = 'Laura Catalina Restrepo Mejia';

async function waitForCard() {
  return screen.findByText(employeeName, undefined, { timeout: 3000 });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Carne virtual del colaborador', () => {
  // CP-004 de RFC-001
  it('presenta los campos de acreditacion', async () => {
    renderRoute('/carne');
    await waitForCard();

    const main = mainContent();

    expect(main.getByText('EMP-004821')).toBeVisible();
    expect(main.getByText('Analista de Operaciones Senior')).toBeVisible();
    expect(main.getByText('Operaciones Nacionales')).toBeVisible();
    expect(main.getByText('14 de marzo de 2019')).toBeVisible();
  });

  // CP-005 de RFC-001
  it('renderiza el codigo QR con texto alternativo', async () => {
    renderRoute('/carne');
    await waitForCard();

    const qr = await mainContent().findByRole('img', { name: /codigo qr del carne/i });

    expect(qr).toBeVisible();
    expect(qr.getAttribute('alt')).toContain('EMP-004821');
    expect(qr.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
  });

  // CP-006 de RFC-001. El estado no puede depender unicamente del color.
  it('comunica el estado del carne mediante texto', async () => {
    renderRoute('/carne');
    await waitForCard();

    expect(mainContent().getByText('Carne activo')).toBeVisible();
    expect(mainContent().getByText('Activo')).toBeVisible();
  });

  it('muestra el contenido exacto que codifica el QR', async () => {
    renderRoute('/carne');
    await waitForCard();

    const main = mainContent();

    expect(main.getByText('APPCONECTA|EMP-004821|ACTIVO')).toBeVisible();
    expect(main.getByText(/no incluye documento de identidad/i)).toBeVisible();
  });

  // CP-007 de RFC-001
  it('presenta el estado de carga mientras consulta la acreditacion', () => {
    renderRoute('/carne');

    expect(screen.getByText('Cargando el carne del colaborador')).toBeVisible();
  });

  it('presenta el estado de error y permite reintentar', async () => {
    vi.spyOn(employeeDirectoryAdapter, 'getEmployeeProfile').mockRejectedValue(
      new Error('El directorio de colaboradores no respondio.')
    );

    renderRoute('/carne');

    await waitFor(() => {
      expect(mainContent().getByText('El directorio de colaboradores no respondio.')).toBeVisible();
    });

    expect(mainContent().getByRole('button', { name: /reintentar/i })).toBeVisible();
  });
});
