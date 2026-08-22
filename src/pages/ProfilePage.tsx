import { useCallback } from 'react';

import { AsyncSection } from '@/components/feedback/AsyncSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { getEmployeeProfile } from '@/services/legacyEmployeeService';

export function ProfilePage() {
  const loader = useCallback(() => getEmployeeProfile(), []);
  const { data, isLoading, error, reload } = useAsyncResource(loader);

  return (
    <>
      <PageHeader
        title="Mi perfil"
        description="Informacion laboral registrada en el directorio corporativo simulado."
      />

      <AsyncSection
        isLoading={isLoading}
        error={error}
        data={data}
        loadingLabel="Cargando el perfil del colaborador"
        onRetry={reload}
      >
        {(profile) => (
          <Card>
            <CardHeader>
              <CardTitle>{profile.fullName}</CardTitle>
              <p className="text-sm text-slate-600">Codigo de colaborador {profile.id}</p>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <ProfileEntry label="Documento de identidad" value={profile.documentNumber} />
                <ProfileEntry label="Cargo" value={profile.position} />
                <ProfileEntry label="Area" value={profile.department} />
                <ProfileEntry label="Centro de costo" value={profile.costCenter} />
                <ProfileEntry label="Sede" value={profile.location} />
                <ProfileEntry label="Fecha de ingreso" value={profile.hireDate} />
                <ProfileEntry label="Tipo de contrato" value={profile.contractType} />
                <ProfileEntry label="Jefe inmediato" value={profile.supervisor} />
                <ProfileEntry label="Correo corporativo" value={profile.email} />
                <ProfileEntry label="Telefono movil" value={profile.phone} />
              </dl>
            </CardContent>
          </Card>
        )}
      </AsyncSection>
    </>
  );
}

function ProfileEntry({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm break-words text-slate-900">{value}</dd>
    </div>
  );
}
