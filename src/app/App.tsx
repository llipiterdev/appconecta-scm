import { RouterProvider, createBrowserRouter } from 'react-router';

import { routes } from '@/app/routes';

const router = createBrowserRouter(routes, {
  // GitHub Pages sirve la aplicacion en un subdirectorio; Vite expone el base path
  // efectivo del build en BASE_URL.
  basename: import.meta.env.BASE_URL,
});

export function App() {
  return <RouterProvider router={router} />;
}
