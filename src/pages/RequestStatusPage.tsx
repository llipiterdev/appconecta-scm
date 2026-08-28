import { Link } from 'react-router';
import { useState } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { medicalLeavesRepository } from '@/adapters/medicalLeavesRepository';
import { requestsRepository } from '@/adapters/requestsRepository';
import type { SubmissionStatus } from '@/types/domain';

const statusTones: Record<SubmissionStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  registrada: 'info',
  'en-tramite': 'warning',
  aprobada: 'success',
  rechazada: 'danger',
};

export function RequestStatusPage() {
  const [requests] = useState(() => requestsRepository.list());
  const [leaves] = useState(() => medicalLeavesRepository.list());

  const isEmpty = requests.length === 0 && leaves.length === 0;

  return (
    <>
      <PageHeader
        title="Estado de mis solicitudes"
        description="Seguimiento de las solicitudes e incapacidades que ha registrado."
      />

      {isEmpty ? (
        <EmptyState
          title="Aun no ha registrado tramites"
          description="Cuando registre una solicitud o una incapacidad podra consultar su estado en esta seccion."
          action={
            <Link to="/solicitudes" className={buttonVariants({ size: 'sm' })}>
              Crear una solicitud
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {requests.length > 0 ? (
            <section aria-labelledby="estado-solicitudes">
              <h2 id="estado-solicitudes" className="mb-3 text-base font-semibold text-slate-900">
                Solicitudes a Recursos Humanos
              </h2>

              <ul className="flex flex-col gap-3">
                {requests.map((request) => (
                  <li key={request.id}>
                    <Card>
                      <CardContent className="pt-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-slate-900">{request.kindLabel}</p>
                          <Badge tone={statusTones[request.status]}>{request.statusLabel}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{request.detail}</p>
                        <p className="mt-1.5 text-xs text-slate-500">
                          {request.id} · registrada el {request.createdAtLabel} · respuesta estimada
                          el {request.expectedResponseLabel}
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {leaves.length > 0 ? (
            <section aria-labelledby="estado-incapacidades">
              <h2 id="estado-incapacidades" className="mb-3 text-base font-semibold text-slate-900">
                Incapacidades
              </h2>

              <ul className="flex flex-col gap-3">
                {leaves.map((leave) => (
                  <li key={leave.id}>
                    <Card>
                      <CardContent className="pt-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-slate-900">
                            Diagnostico {leave.diagnosisCode}
                          </p>
                          <Badge tone={statusTones[leave.status]}>{leave.statusLabel}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {leave.days} {leave.days === 1 ? 'dia' : 'dias'} · {leave.entity}
                        </p>
                        <p className="mt-1.5 text-xs text-slate-500">
                          {leave.id} · registrada el {leave.createdAtLabel}
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </>
  );
}
