import { Link } from 'react-router';

import { buttonVariants } from '@/components/ui/buttonVariants';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <p className="text-brand-700 text-sm font-semibold">Error 404</p>
      <h1 className="text-2xl font-bold text-slate-900">Esta seccion no existe</h1>
      <p className="max-w-md text-sm text-slate-600">
        La direccion solicitada no corresponde a ninguna seccion del portal del colaborador.
      </p>

      <Link to="/" className={buttonVariants({ className: 'mt-2' })}>
        Volver al inicio
      </Link>
    </div>
  );
}
