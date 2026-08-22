import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'No fue posible cargar la informacion',
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center"
    >
      <AlertTriangle className="size-8 text-red-600" aria-hidden="true" />
      <h3 className="text-base font-semibold text-red-900">{title}</h3>
      <p className="max-w-sm text-sm text-red-800">{description}</p>

      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
