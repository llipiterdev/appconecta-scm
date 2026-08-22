import { Building2 } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-brand-700 sticky top-0 z-20 text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 lg:px-6">
        <Building2 className="size-6 shrink-0" aria-hidden="true" />

        <div className="min-w-0">
          <p className="truncate text-base leading-tight font-semibold">AppConecta</p>
          <p className="text-brand-100 truncate text-xs leading-tight">Portal del colaborador</p>
        </div>
      </div>
    </header>
  );
}
