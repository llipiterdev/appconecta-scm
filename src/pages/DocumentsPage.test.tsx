import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { mainContent, renderRoute } from '@/test/renderRoute';

const contractTitle = 'Contrato de trabajo a termino indefinido';
const certificateTitle = 'Certificacion laboral vigente';

async function waitForDocuments() {
  return screen.findByText(contractTitle, undefined, { timeout: 3000 });
}

describe('Consulta de documentos laborales', () => {
  it('anuncia la carga y luego lista los documentos disponibles', async () => {
    renderRoute('/documentos');

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    await waitForDocuments();

    expect(mainContent().getAllByRole('listitem')).toHaveLength(5);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('filtra los documentos por categoria', async () => {
    const user = userEvent.setup();
    renderRoute('/documentos');
    await waitForDocuments();

    await user.selectOptions(screen.getByLabelText('Filtrar por categoria'), 'certificacion');

    expect(mainContent().getByText(certificateTitle)).toBeInTheDocument();
    expect(mainContent().queryByText(contractTitle)).not.toBeInTheDocument();
    expect(mainContent().getAllByRole('listitem')).toHaveLength(1);
  });

  it('permite volver al listado completo', async () => {
    const user = userEvent.setup();
    renderRoute('/documentos');
    await waitForDocuments();

    await user.selectOptions(screen.getByLabelText('Filtrar por categoria'), 'contrato');

    expect(mainContent().getAllByRole('listitem')).toHaveLength(1);

    await user.selectOptions(screen.getByLabelText('Filtrar por categoria'), 'todas');

    expect(mainContent().getAllByRole('listitem')).toHaveLength(5);
  });

  it('advierte que la descarga esta simulada', async () => {
    renderRoute('/documentos');
    await waitForDocuments();

    expect(mainContent().getAllByText('Simulado')).toHaveLength(5);
  });
});
