import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

describe('LoadingState', () => {
  it('anuncia la carga a los lectores de pantalla', () => {
    render(<LoadingState label="Cargando desprendibles" />);

    const status = screen.getByRole('status');

    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Cargando desprendibles')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('explica la ausencia de datos', () => {
    render(<EmptyState title="Sin documentos" description="Aun no hay documentos cargados." />);

    expect(screen.getByRole('heading', { level: 3, name: 'Sin documentos' })).toBeInTheDocument();
    expect(screen.getByText('Aun no hay documentos cargados.')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('se expone como alerta', () => {
    render(<ErrorState description="El servicio simulado no respondio." />);

    expect(screen.getByRole('alert')).toHaveTextContent('El servicio simulado no respondio.');
  });

  it('permite reintentar cuando se ofrece la accion', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorState description="Fallo la consulta." onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('omite la accion de reintento cuando no aplica', () => {
    render(<ErrorState description="Fallo la consulta." />);

    expect(screen.queryByRole('button', { name: /reintentar/i })).not.toBeInTheDocument();
  });
});
