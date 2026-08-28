import { useCallback } from 'react';

import { AsyncSection } from '@/components/feedback/AsyncSection';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { getPayslips } from '@/adapters/payrollAdapter';

export function PayrollPage() {
  const loader = useCallback(() => getPayslips(), []);
  const { data, isLoading, error, reload } = useAsyncResource(loader);

  return (
    <>
      <PageHeader
        title="Desprendibles de nomina"
        description="Consulta simulada del sistema de nomina corporativo."
      />

      <AsyncSection
        isLoading={isLoading}
        error={error}
        data={data}
        loadingLabel="Cargando desprendibles de nomina"
        onRetry={reload}
      >
        {(payslips) =>
          payslips.length === 0 ? (
            <EmptyState
              title="Sin desprendibles disponibles"
              description="No hay periodos de nomina liquidados para consultar."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {payslips.map((payslip) => (
                <li key={payslip.id}>
                  <Card>
                    <CardHeader>
                      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                        Periodo {payslip.id}
                      </p>
                      <CardTitle className="text-base">{payslip.periodLabel}</CardTitle>
                      <p className="text-xs text-slate-500">Pagado el {payslip.paymentDateLabel}</p>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div>
                          <dt className="text-xs text-slate-500">Devengado</dt>
                          <dd className="text-sm font-medium text-slate-900">
                            {payslip.grossAmountLabel}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Deducciones</dt>
                          <dd className="text-sm font-medium text-slate-900">
                            {payslip.deductionsAmountLabel}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Neto a pagar</dt>
                          <dd className="text-brand-700 text-sm font-semibold">
                            {payslip.netAmountLabel}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )
        }
      </AsyncSection>
    </>
  );
}
