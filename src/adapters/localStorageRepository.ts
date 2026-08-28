/**
 * Repositorio genérico sobre `window.localStorage`.
 *
 * Es la única implementación de infraestructura que toca `localStorage` en todo el proyecto.
 * Cierra TD-002: las reglas de negocio (`src/domain/*`) ya no acceden a este mecanismo
 * directamente, dependen de los puertos definidos en `src/domain/ports.ts`.
 */

export function readCollection<T>(key: string): T[] {
  const stored = window.localStorage.getItem(key);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as T[];
  } catch {
    window.localStorage.removeItem(key);

    return [];
  }
}

export function writeCollection<T>(key: string, items: T[], limit: number): void {
  window.localStorage.setItem(key, JSON.stringify(items.slice(0, limit)));
}
