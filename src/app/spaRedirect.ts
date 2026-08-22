/**
 * Contrapartida de `public/404.html`. GitHub Pages responde 404 ante la recarga directa de una
 * ruta del enrutador del cliente, por lo que ese documento reenvia la ruta original como el
 * parametro `redirect`. Aqui se restaura la direccion real antes de montar el enrutador.
 */
export function restoreRedirectedRoute(): void {
  const url = new URL(window.location.href);
  const redirected = url.searchParams.get('redirect');

  if (!redirected) {
    return;
  }

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  const target = redirected.startsWith('/') ? redirected.slice(1) : redirected;

  window.history.replaceState(null, '', `${base}${target}`);
}
