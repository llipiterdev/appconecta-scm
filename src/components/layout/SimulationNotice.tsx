import { Info } from 'lucide-react';

export function SimulationNotice() {
  return (
    <aside
      aria-label="Aviso de alcance academico"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-900 lg:px-6"
    >
      <p className="mx-auto flex max-w-6xl items-start gap-2 text-xs leading-snug">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Simulacion academica.</strong> Todos los datos son
          ficticios y las integraciones con nomina, Recursos Humanos y gestion documental estan
          simuladas.
        </span>
      </p>
    </aside>
  );
}
