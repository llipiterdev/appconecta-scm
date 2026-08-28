import { Download, FileText } from 'lucide-react';
import { useCallback, useState } from 'react';

import { AsyncSection } from '@/components/feedback/AsyncSection';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Field, Select } from '@/components/ui/field';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { getLaborDocuments } from '@/adapters/laborDocumentsAdapter';
import type { LaborDocument } from '@/types/domain';

const categoryOptions: Array<{ value: string; label: string }> = [
  { value: 'todas', label: 'Todas las categorias' },
  { value: 'contrato', label: 'Contratos' },
  { value: 'certificacion', label: 'Certificaciones' },
  { value: 'anexo', label: 'Anexos' },
  { value: 'politica', label: 'Politicas' },
];

const categoryLabels: Record<LaborDocument['category'], string> = {
  contrato: 'Contrato',
  certificacion: 'Certificacion',
  anexo: 'Anexo',
  politica: 'Politica',
};

export function DocumentsPage() {
  const loader = useCallback(() => getLaborDocuments(), []);
  const { data, isLoading, error, reload } = useAsyncResource(loader);
  const [category, setCategory] = useState('todas');

  return (
    <>
      <PageHeader
        title="Documentos laborales"
        description="Consulta simulada de la gestion documental corporativa."
      />

      <AsyncSection
        isLoading={isLoading}
        error={error}
        data={data}
        loadingLabel="Cargando documentos laborales"
        onRetry={reload}
      >
        {(documents) => {
          const filtered =
            category === 'todas'
              ? documents
              : documents.filter((document) => document.category === category);

          return (
            <div className="flex flex-col gap-4">
              <Field id="filtro-categoria" label="Filtrar por categoria">
                {({ id }) => (
                  <Select
                    id={id}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="sm:max-w-xs"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              {filtered.length === 0 ? (
                <EmptyState
                  title="Sin documentos en esta categoria"
                  description="Cambie el filtro para ver otros documentos disponibles."
                />
              ) : (
                <ul className="flex flex-col gap-3">
                  {filtered.map((document) => (
                    <li key={document.id}>
                      <Card>
                        <CardContent className="flex items-start gap-3 pt-5">
                          <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <FileText className="size-5" aria-hidden="true" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-900">{document.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Emitido el {document.issuedAtLabel} · {document.format} ·{' '}
                              {document.sizeLabel}
                            </p>
                            <div className="mt-2">
                              <Badge tone="neutral">{categoryLabels[document.category]}</Badge>
                            </div>
                          </div>

                          <span
                            className="flex items-center gap-1 text-xs text-slate-400"
                            title="La descarga no esta disponible en la simulacion academica"
                          >
                            <Download className="size-4" aria-hidden="true" />
                            Simulado
                          </span>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      </AsyncSection>
    </>
  );
}
