import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, Select, Textarea, Input } from '@/components/ui/field';
import { processSubmission } from '@/services/legacyEmployeeService';

const kindOptions = [
  { value: '', label: 'Seleccione una opcion' },
  { value: 'certificacion-laboral', label: 'Certificacion laboral' },
  { value: 'vacaciones', label: 'Vacaciones' },
  { value: 'permiso', label: 'Permiso' },
  { value: 'actualizacion-datos', label: 'Actualizacion de datos' },
];

export function RequestsPage() {
  const [kind, setKind] = useState('');
  const [detail, setDetail] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<string | undefined>(undefined);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(undefined);

    const outcome = processSubmission('request', { kind, detail, contactEmail });

    if (!outcome.ok) {
      setErrors(outcome.errors);

      return;
    }

    setErrors({});
    setConfirmation(outcome.message);
    setKind('');
    setDetail('');
    setContactEmail('');
  }

  return (
    <>
      <PageHeader
        title="Solicitudes a Recursos Humanos"
        description="Registre una solicitud. El tramite se simula localmente en su dispositivo."
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

      <Card>
        <CardHeader>
          <CardTitle>Nueva solicitud</CardTitle>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field id="solicitud-tipo" label="Tipo de solicitud" required error={errors.kind}>
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  value={kind}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  onChange={(event) => setKind(event.target.value)}
                >
                  {kindOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field
              id="solicitud-detalle"
              label="Detalle de la solicitud"
              required
              hint="Entre 15 y 500 caracteres."
              error={errors.detail}
            >
              {({ id, describedBy, invalid }) => (
                <Textarea
                  id={id}
                  value={detail}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  onChange={(event) => setDetail(event.target.value)}
                />
              )}
            </Field>

            <Field
              id="solicitud-correo"
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
              Registrar solicitud
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
