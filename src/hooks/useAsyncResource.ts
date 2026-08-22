import { useCallback, useEffect, useState } from 'react';

type AsyncResource<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: string | undefined;
  reload: () => void;
};

type Settled<T> = {
  loader: () => Promise<T>;
  attempt: number;
  data: T | undefined;
  error: string | undefined;
};

/**
 * Carga un recurso asincrono y expone los tres estados que la interfaz necesita representar:
 * carga, error y datos disponibles.
 *
 * El estado de carga se deriva de comparar la consulta vigente (loader y numero de intento)
 * con la ya resuelta, en lugar de escribirse dentro del efecto. Asi el efecto solo actualiza
 * estado en sus callbacks asincronos y no provoca renders en cascada.
 */
export function useAsyncResource<T>(loader: () => Promise<T>): AsyncResource<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | undefined>(undefined);

  const reload = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    loader()
      .then((result) => {
        if (active) {
          setSettled({ loader, attempt, data: result, error: undefined });
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setSettled({
            loader,
            attempt,
            data: undefined,
            error:
              cause instanceof Error ? cause.message : 'Ocurrio un error inesperado al consultar.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [loader, attempt]);

  const isSettled =
    settled !== undefined && settled.loader === loader && settled.attempt === attempt;

  return {
    data: isSettled ? settled.data : undefined,
    error: isSettled ? settled.error : undefined,
    isLoading: !isSettled,
    reload,
  };
}
