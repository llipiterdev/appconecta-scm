import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { navigationItems, primaryNavigationItems } from '@/app/navigation';
import { renderRoute } from '@/test/renderRoute';

describe('AppShell', () => {
  it('identifica la aplicacion y su proposito', () => {
    renderRoute();

    expect(screen.getByText('AppConecta')).toBeInTheDocument();
    expect(screen.getByText('Portal del colaborador')).toBeInTheDocument();
  });

  it('declara de forma visible que se trata de una simulacion academica', () => {
    renderRoute();

    const notice = screen.getByRole('complementary', { name: /aviso de alcance academico/i });

    expect(notice).toHaveTextContent(/simulacion academica/i);
    expect(notice).toHaveTextContent(/datos son ficticios/i);
    expect(notice).toHaveTextContent(/integraciones/i);
  });

  it('ofrece un enlace para saltar al contenido principal', () => {
    renderRoute();

    const skipLink = screen.getByRole('link', { name: /saltar al contenido principal/i });

    expect(skipLink).toHaveAttribute('href', '#contenido-principal');
    expect(document.getElementById('contenido-principal')).not.toBeNull();
  });

  it('expone la navegacion de escritorio con todas las secciones', () => {
    renderRoute();

    const sidebar = within(screen.getByRole('navigation', { name: 'Navegacion principal' }));

    for (const item of navigationItems) {
      expect(sidebar.getByRole('link', { name: item.label })).toBeInTheDocument();
    }
  });

  it('expone la navegacion movil con los accesos primarios', () => {
    renderRoute();

    const mobileNav = within(
      screen.getByRole('navigation', { name: 'Navegacion principal movil' })
    );

    expect(mobileNav.getAllByRole('link')).toHaveLength(primaryNavigationItems.length);
  });

  it('expone las secciones adicionales fuera de la barra primaria', () => {
    renderRoute();

    const secondaryNav = within(screen.getByRole('navigation', { name: 'Secciones adicionales' }));
    const expected = navigationItems.filter((item) => !item.primary).length;

    expect(secondaryNav.getAllByRole('link')).toHaveLength(expected);
  });
});
