import { render, screen, within, type RenderResult } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { routes } from '@/app/routes';

/**
 * Acota las consultas al contenido de la pagina. El shell incluye tres barras de navegacion
 * que repiten los nombres de las secciones, por lo que las aserciones sobre el modulo deben
 * excluirlas para no depender de coincidencias del menu.
 */
export function mainContent() {
  return within(screen.getByRole('main'));
}

/**
 * Monta la aplicacion completa sobre un enrutador en memoria. Permite verificar el shell, la
 * navegacion y cada modulo con las mismas rutas que usa produccion.
 */
export function renderRoute(initialPath = '/'): RenderResult {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });

  return render(<RouterProvider router={router} />);
}
