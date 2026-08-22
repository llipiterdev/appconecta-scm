import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { restoreRedirectedRoute } from '@/app/spaRedirect';

import './index.css';

restoreRedirectedRoute();

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontro el elemento raiz #root en el documento.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
