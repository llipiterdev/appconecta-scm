import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';

describe('App', () => {
  it('muestra el nombre del sistema', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'AppConecta' })).toBeInTheDocument();
  });

  it('declara explicitamente que se trata de una simulacion academica', () => {
    render(<App />);

    expect(screen.getByText('Simulacion academica')).toBeInTheDocument();
    expect(screen.getByText(/datos completamente ficticios/i)).toBeInTheDocument();
  });
});
