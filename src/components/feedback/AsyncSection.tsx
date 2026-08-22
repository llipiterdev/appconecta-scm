import type { ReactNode } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

type AsyncSectionProps<T> = {
  isLoading: boolean;
  error: string | undefined;
  data: T | undefined;
  loadingLabel: string;
  onRetry: () => void;
  children: (data: T) => ReactNode;
};

export function AsyncSection<T>({
  isLoading,
  error,
  data,
  loadingLabel,
  onRetry,
  children,
}: AsyncSectionProps<T>) {
  if (isLoading) {
    return <LoadingState label={loadingLabel} />;
  }

  if (error !== undefined) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (data === undefined) {
    return <ErrorState description="La consulta no devolvio informacion." onRetry={onRetry} />;
  }

  return <>{children(data)}</>;
}
