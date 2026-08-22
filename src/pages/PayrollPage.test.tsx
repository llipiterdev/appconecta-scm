import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mainContent, renderRoute } from '@/test/renderRoute';

describe('Consulta de desprendibles de nomina', () => {
  it('lista los periodos liquidados con su neto a pagar', async () => {
    renderRoute('/nomina');

    expect(await screen.findByText(/NOM-2026-08-Q1/, undefined, { timeout: 3000 })).toBeVisible();

    expect(mainContent().getAllByRole('listitem')).toHaveLength(6);
    expect(mainContent().getAllByText('Neto a pagar')).toHaveLength(6);
  });

  it('presenta devengado, deducciones y neto de cada periodo como moneda', async () => {
    renderRoute('/nomina');

    await screen.findByText(/NOM-2026-08-Q1/, undefined, { timeout: 3000 });

    // Tres importes por cada uno de los seis periodos liquidados.
    expect(mainContent().getAllByText(/^\$/)).toHaveLength(18);
  });
});
