import { ClipboardList, FileText, Receipt, Stethoscope } from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router';

import { AsyncSection } from '@/components/feedback/AsyncSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { getDashboardSummary } from '@/services/legacyEmployeeService';

export function DashboardPage() {
  const loader = useCallback(() => getDashboardSummary(), []);
  const { data, isLoading, error, reload } = useAsyncResource(loader);

  return (
    <>
      <PageHeader title="Inicio" description="Resumen de su informacion en el portal." />

      <AsyncSection
        isLoading={isLoading}
        error={error}
        data={data}
        loadingLabel="Cargando el resumen del colaborador"
        onRetry={reload}
      >
        {(summary) => (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Colaborador
                </p>
                <CardTitle className="text-lg">{summary.profile.fullName}</CardTitle>
                <p className="text-sm text-slate-600">
                  {summary.profile.position} · {summary.profile.department}
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge tone="info">{summary.profile.location}</Badge>
                <Badge tone="neutral">{summary.profile.contractType}</Badge>
                <Badge tone={summary.profile.cardStatus === 'active' ? 'success' : 'warning'}>
                  Carne {summary.profile.cardStatus === 'active' ? 'activo' : 'inactivo'}
                </Badge>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryTile
                to="/nomina"
                icon={Receipt}
                label="Ultimo desprendible"
                value={summary.latestPayslip?.netAmountLabel ?? 'Sin datos'}
                detail={summary.latestPayslip?.periodLabel ?? 'No hay periodos disponibles'}
              />
              <SummaryTile
                to="/documentos"
                icon={FileText}
                label="Documentos laborales"
                value={`${summary.documentCount}`}
                detail="Disponibles para consulta"
              />
              <SummaryTile
                to="/estado-solicitudes"
                icon={ClipboardList}
                label="Solicitudes abiertas"
                value={`${summary.openRequestCount}`}
                detail="Registradas o en tramite"
              />
              <SummaryTile
                to="/incapacidades"
                icon={Stethoscope}
                label="Incapacidades registradas"
                value={`${summary.registeredLeaveCount}`}
                detail="En el periodo actual"
              />
            </div>

            {summary.highlightedAnnouncement ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge tone="warning">Destacado</Badge>
                    <span className="text-xs text-slate-500">
                      {summary.highlightedAnnouncement.publishedAtLabel}
                    </span>
                  </div>
                  <CardTitle>{summary.highlightedAnnouncement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    {summary.highlightedAnnouncement.summary}
                  </p>
                  <Link
                    to="/noticias"
                    className="text-brand-700 mt-3 inline-block text-sm font-medium underline"
                  >
                    Ver todas las noticias
                  </Link>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </AsyncSection>
    </>
  );
}

type SummaryTileProps = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
};

function SummaryTile({ to, icon: Icon, label, value, detail }: SummaryTileProps) {
  return (
    <Link to={to} className="focus-visible:outline-brand-600 rounded-xl">
      <Card className="h-full transition-colors hover:border-brand-300">
        <CardContent className="flex items-start gap-3 pt-5">
          <span className="bg-brand-100 text-brand-700 rounded-lg p-2">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
            <p className="truncate text-lg font-semibold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{detail}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
