import { render, type RenderResult } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { routes } from '@/app/routes';

/**
 * Monta la aplicacion completa sobre un enrutador en memoria. Permite verificar el shell, la
 * navegacion y cada modulo con las mismas rutas que usa produccion.
 */
export function renderRoute(initialPath = '/'): RenderResult {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });

  return render(<RouterProvider router={router} />);
}
