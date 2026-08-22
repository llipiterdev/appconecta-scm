/**
 * Par etiqueta/valor dentro de una lista de definiciones.
 *
 * Existe como componente compartido porque el perfil y el carne virtual presentan los mismos
 * datos con el mismo formato. Duplicarlo habria sido deuda nueva sin registrar, que es
 * precisamente lo que el control de no regresion pretende evitar.
 */
export function DefinitionEntry({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm break-words text-slate-900">{value}</dd>
    </div>
  );
}
