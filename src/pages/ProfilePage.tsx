import { useCallback } from 'react';

import { AsyncSection } from '@/components/feedback/AsyncSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DefinitionEntry } from '@/components/ui/definitionEntry';
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
                <DefinitionEntry label="Documento de identidad" value={profile.documentNumber} />
                <DefinitionEntry label="Cargo" value={profile.position} />
                <DefinitionEntry label="Area" value={profile.department} />
                <DefinitionEntry label="Centro de costo" value={profile.costCenter} />
                <DefinitionEntry label="Sede" value={profile.location} />
                <DefinitionEntry label="Fecha de ingreso" value={profile.hireDate} />
                <DefinitionEntry label="Tipo de contrato" value={profile.contractType} />
                <DefinitionEntry label="Jefe inmediato" value={profile.supervisor} />
                <DefinitionEntry label="Correo corporativo" value={profile.email} />
                <DefinitionEntry label="Telefono movil" value={profile.phone} />
              </dl>
            </CardContent>
          </Card>
        )}
      </AsyncSection>
    </>
  );
}
