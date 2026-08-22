import { useCallback } from 'react';

import { VirtualCardQr } from '@/components/VirtualCardQr';
import { AsyncSection } from '@/components/feedback/AsyncSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { getVirtualCard } from '@/services/virtualCardService';

export function VirtualCardPage() {
  const loader = useCallback(() => getVirtualCard(), []);
  const { data, isLoading, error, reload } = useAsyncResource(loader);

  return (
    <>
      <PageHeader
        title="Carne virtual"
        description="Acreditacion del colaborador para presentar desde el movil. Los datos son ficticios."
      />

      <AsyncSection
        isLoading={isLoading}
        error={error}
        data={data}
        loadingLabel="Cargando el carne del colaborador"
        onRetry={reload}
      >
        {(card) => (
          <div className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row sm:items-start">
                <VirtualCardQr
                  payload={card.qrPayload}
                  alt={`Codigo QR del carne de ${card.fullName}, colaborador ${card.employeeCode}, estado ${card.statusLabel.toLowerCase()}`}
                />

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  {/* El estado se comunica por texto ademas de por color: un indicador que solo
                      distingue mediante el color deja fuera a quien no lo percibe. */}
                  <Badge tone={card.status === 'active' ? 'success' : 'danger'}>
                    Carne {card.statusLabel.toLowerCase()}
                  </Badge>

                  <h2 className="mt-3 text-xl font-semibold text-slate-900">{card.fullName}</h2>
                  <p className="text-sm text-slate-600">{card.position}</p>

                  <dl className="mt-5 grid gap-x-8 gap-y-4 text-left sm:grid-cols-2">
                    <CardEntry label="Codigo de colaborador" value={card.employeeCode} />
                    <CardEntry label="Area" value={card.department} />
                    <CardEntry label="Fecha de vinculacion" value={card.hireDate} />
                    <CardEntry label="Estado del carne" value={card.statusLabel} />
                  </dl>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-slate-900">Contenido del codigo</h3>
                <p className="mt-1 text-sm text-slate-600">
                  El QR codifica unicamente el codigo de colaborador y el estado del carne. No
                  incluye documento de identidad, correo, telefono ni ningun dato que en un sistema
                  real seria personal.
                </p>
                <p className="mt-3 font-mono text-sm break-all text-slate-900">{card.qrPayload}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </AsyncSection>
    </>
  );
}

function CardEntry({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm break-words text-slate-900">{value}</dd>
    </div>
  );
}
