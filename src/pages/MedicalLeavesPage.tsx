import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { getMedicalLeaves, processSubmission } from '@/services/legacyEmployeeService';
import type { MedicalLeave } from '@/types/domain';

export function MedicalLeavesPage() {
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entity, setEntity] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<string | undefined>(undefined);
  const [leaves, setLeaves] = useState<MedicalLeave[]>(() => getMedicalLeaves());

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(undefined);

    const outcome = processSubmission('medical-leave', {
      diagnosisCode,
      startDate,
      endDate,
      entity,
      contactEmail,
    });

    if (!outcome.ok) {
      setErrors(outcome.errors);

      return;
    }

    setErrors({});
    setConfirmation(outcome.message);
    setLeaves(getMedicalLeaves());
    setDiagnosisCode('');
    setStartDate('');
    setEndDate('');
    setEntity('');
    setContactEmail('');
  }

  return (
    <>
      <PageHeader
        title="Registro de incapacidades"
        description="Registro simulado de incapacidades medicas. No adjunte documentos reales."
      />

      {confirmation ? (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <span>{confirmation}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Nueva incapacidad</CardTitle>
          </CardHeader>
          <CardContent>
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field
                id="incapacidad-diagnostico"
                label="Codigo de diagnostico"
                required
                hint="Formato CIE-10 simplificado, por ejemplo J11 o M545."
                error={errors.diagnosisCode}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    value={diagnosisCode}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    onChange={(event) => setDiagnosisCode(event.target.value)}
                    className="sm:max-w-40"
                  />
                )}
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="incapacidad-inicio"
                  label="Fecha de inicio"
                  required
                  error={errors.startDate}
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      type="date"
                      value={startDate}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  )}
                </Field>

                <Field
                  id="incapacidad-fin"
                  label="Fecha de finalizacion"
                  required
                  error={errors.endDate}
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      type="date"
                      value={endDate}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  )}
                </Field>
              </div>

              <Field
                id="incapacidad-entidad"
                label="Entidad que expide"
                required
                error={errors.entity}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    value={entity}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    onChange={(event) => setEntity(event.target.value)}
                  />
                )}
              </Field>

              <Field
                id="incapacidad-correo"
                label="Correo de contacto"
                required
                error={errors.contactEmail}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    type="email"
                    value={contactEmail}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    onChange={(event) => setContactEmail(event.target.value)}
                  />
                )}
              </Field>

              <Button type="submit" className="sm:self-start">
                Registrar incapacidad
              </Button>
            </form>
          </CardContent>
        </Card>

        <section aria-labelledby="incapacidades-registradas">
          <h2
            id="incapacidades-registradas"
            className="mb-3 text-base font-semibold text-slate-900"
          >
            Incapacidades registradas
          </h2>

          {leaves.length === 0 ? (
            <EmptyState
              title="Sin incapacidades registradas"
              description="Las incapacidades que registre apareceran en esta lista."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {leaves.map((leave) => (
                <li key={leave.id}>
                  <Card>
                    <CardContent className="pt-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-slate-900">{leave.id}</p>
                        <Badge tone={leave.status === 'en-tramite' ? 'warning' : 'info'}>
                          {leave.statusLabel}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Diagnostico {leave.diagnosisCode} · {leave.days}{' '}
                        {leave.days === 1 ? 'dia' : 'dias'} · {leave.entity}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Registrada el {leave.createdAtLabel}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
