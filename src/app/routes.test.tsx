import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { navigationItems } from '@/app/navigation';
import { renderRoute } from '@/test/renderRoute';

describe('Enrutamiento del portal', () => {
  it('registra una ruta para cada seccion de la navegacion', () => {
    for (const item of navigationItems) {
      const { unmount } = renderRoute(item.to);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.queryByText(/esta seccion no existe/i)).not.toBeInTheDocument();

      unmount();
    }
  });

  it('muestra la pagina de error para una direccion desconocida', () => {
    renderRoute('/ruta-que-no-existe');

    expect(
      screen.getByRole('heading', { level: 1, name: /esta seccion no existe/i })
    ).toBeVisible();
    expect(screen.getByText('Error 404')).toBeInTheDocument();
  });

  it('permite volver al inicio desde la pagina de error', async () => {
    const user = userEvent.setup();
    renderRoute('/ruta-que-no-existe');

    await user.click(screen.getByRole('link', { name: /volver al inicio/i }));

    expect(screen.queryByText('Error 404')).not.toBeInTheDocument();
  });

  it('navega entre secciones desde la barra lateral', async () => {
    const user = userEvent.setup();
    renderRoute();

    const sidebar = within(screen.getByRole('navigation', { name: 'Navegacion principal' }));
    await user.click(sidebar.getByRole('link', { name: 'Desprendibles de nomina' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Desprendibles de nomina' })
    ).toBeInTheDocument();
  });
});
